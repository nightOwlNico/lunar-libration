// HighPrecisionTIFFLoader.ts
import { fromUrl } from 'geotiff';
import * as THREE from 'three';

/* ------------------------------------------------------------------------- */
/*  Public result type                                                       */
/* ------------------------------------------------------------------------- */

export interface TIFFTextureResult {
  texture: THREE.DataTexture;
  stats?: { min: number; max: number }; // available only when we normalise
}

/* ------------------------------------------------------------------------- */
/*  Loader                                                                   */
/* ------------------------------------------------------------------------- */

export class HighPrecisionTIFFLoader extends THREE.Loader {
  /**
   * Standard loader interface method - delegates to loadTIFFAsync with default options
   */
  async loadAsync(
    url: string,
    _onProgress?: (event: ProgressEvent<EventTarget>) => void
  ): Promise<TIFFTextureResult> {
    return this.loadTIFFAsync(url);
  }

  /**
   * @param url        Absolute or relative URL to a TIFF/GeoTIFF file.
   * @param colour     true  = interpret as sRGB (albedo) map
   *                   false = interpret as height/gray map
   * @param normalise  If `colour===false` **and** the TIFF uses floating point
   *                   samples, re-maps the data to 0-1 and returns min/max.
   */
  async loadTIFFAsync(
    url: string,
    {
      colour = false,
      normalise = false,
    }: { colour?: boolean; normalise?: boolean } = {}
  ): Promise<TIFFTextureResult> {
    /* --------------------------------------------------------------------- */
    /*  1. Read the file                                                     */
    /* --------------------------------------------------------------------- */

    const tiff = await fromUrl(url);
    const img = await tiff.getImage();

    const width = img.getWidth();
    const height = img.getHeight();

    const fileDir = img.fileDirectory;
    const sampleFormat = fileDir.SampleFormat?.[0] ?? 1; // 1 = unsigned int, 3 = IEEE float
    const bitsPerSample = fileDir.BitsPerSample?.[0] ?? 8;
    const samplesPerPixel = fileDir.SamplesPerPixel ?? 1;

    const asFloat = sampleFormat === 3;
    const raster = await img.readRasters({ interleave: true });

    /* --------------------------------------------------------------------- */
    /*  2. Decide Three.js texture params & convert data if necessary        */
    /* --------------------------------------------------------------------- */

    type Typed =
      | Uint8Array
      | Uint16Array
      | Uint32Array
      | Float32Array
      | Float64Array;

    let data: Typed = raster as Typed;

    // Convert to float if needed
    if (
      asFloat &&
      !(data instanceof Float32Array || data instanceof Float64Array)
    ) {
      data = new Float32Array(data);
    }

    /* ---------- colour texture must be RGBA/UBYTE for sRGB --------------- */
    let format: THREE.PixelFormat;
    let type: THREE.TextureDataType;

    if (colour) {
      /* force RGBA + 8-bit */
      format = THREE.RGBAFormat;
      type = THREE.UnsignedByteType;

      if (samplesPerPixel === 3) {
        // RGB ➜ RGBA
        const src = data as Uint8Array;
        const dst = new Uint8Array((src.length / 3) * 4);
        for (let i = 0, j = 0; i < src.length; i += 3, j += 4) {
          dst[j] = src[i]; // R
          dst[j + 1] = src[i + 1]; // G
          dst[j + 2] = src[i + 2]; // B
          dst[j + 3] = 255; // A = 1
        }
        data = dst;
      } else if (samplesPerPixel === 4) {
        /* already RGBA – but make sure it's 8-bit */
        if (!(data instanceof Uint8Array)) {
          console.warn(
            '[HighPrecisionTIFFLoader] Colour texture has',
            bitsPerSample,
            'bits per sample. Down-converting to 8-bit to satisfy sRGB rule.'
          );
          const src = data as any as Uint16Array | Float32Array;
          const dst = new Uint8Array(src.length);
          /* simple linear scale to 0-255 */
          let max = 0;
          for (const v of src) if (v > max) max = v;
          const k = 255 / max;
          for (let i = 0; i < src.length; i++) dst[i] = src[i] * k;
          data = dst;
        }
      } else {
        throw new Error(
          `[HighPrecisionTIFFLoader] Unsupported colour TIFF with ${samplesPerPixel} channels.`
        );
      }
    } else {
      /* ---------- grayscale / DEM ------------------------------- */

      format = THREE.RedFormat;

      if (asFloat) type = THREE.FloatType;
      else if (bitsPerSample === 16) type = THREE.UnsignedShortType;
      else type = THREE.UnsignedByteType;

      /* optional 0-1 normalisation for DEMs */
      if (asFloat && normalise) {
        let min = Infinity,
          max = -Infinity;
        const f32 = data as Float32Array;
        for (const v of f32) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
        const range = max - min;
        const norm = new Float32Array(f32.length);
        for (let i = 0; i < f32.length; i++) norm[i] = (f32[i] - min) / range;
        data = norm;
        return {
          texture: this._makeTexture(data, width, height, format, type, colour),
          stats: { min, max },
        };
      }
    }

    /* --------------------------------------------------------------------- */
    /*  3. Build and return DataTexture                                      */
    /* --------------------------------------------------------------------- */

    return {
      texture: this._makeTexture(data, width, height, format, type, colour),
    };
  }

  /* Helper to create and configure the DataTexture ------------------------ */
  private _makeTexture(
    data: ArrayBufferView,
    width: number,
    height: number,
    format: THREE.PixelFormat,
    type: THREE.TextureDataType,
    colour: boolean
  ): THREE.DataTexture {
    const tex = new THREE.DataTexture(data, width, height, format, type);

    tex.flipY = true; // GeoTIFF origin is top-left
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = colour
      ? THREE.LinearMipmapLinearFilter
      : THREE.LinearFilter;
    tex.generateMipmaps = colour;

    tex.colorSpace = colour ? THREE.SRGBColorSpace : THREE.NoColorSpace;

    tex.needsUpdate = true;
    return tex;
  }
}
