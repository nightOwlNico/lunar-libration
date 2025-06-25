# 🌙 Lunar Libration Visualization

A 3D visualization of the Moon featuring high-quality NASA data. Built with Three.js and TypeScript for an immersive web experience.

## ✨ Features

- **High-Resolution Moon Model**: Renders the Moon using NASA's LROC (Lunar Reconnaissance Orbiter Camera) color maps and LDEM (Lunar Digital Elevation Model) data
- **Realistic Lighting**: Simulates sunlight, earthshine, and starlight for authentic lunar appearance
- **Smooth Animation**: Demonstrates lunar rotation with a gentle rotating animation
- **WebGL2 Optimized**: Built with modern WebGL2 for optimal performance
- **Loading States**: Smooth loading experience with spinner during texture loading

## 🚀 Live Demo

**Experience the visualization:** [lunar-libration.vercel.app](https://lunar-libration.vercel.app)

## 🛠️ Technology Stack

- **Three.js** - 3D graphics library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **GeoTIFF** - High-precision TIFF data loading
- **WebGL2** - Modern graphics API

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nightOwlNico/lunar-libration.git
   cd lunar-libration
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the visualization

## 📊 Data Sources

This project uses high-quality lunar data from NASA:

- **Color Maps**: LROC (Lunar Reconnaissance Orbiter Camera) color data
- **Elevation Data**: LDEM (Lunar Digital Elevation Model) height information

**Original data and detailed descriptions available at:** [svs.gsfc.nasa.gov/4720/](https://svs.gsfc.nasa.gov/4720/)

The data is processed and optimized for web delivery while maintaining scientific accuracy.

## 🌐 Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile browsers**: Supported with WebGL2

**Note**: WebGL2 is required. The app will display an error message if WebGL2 is not available.

## 🙏 Acknowledgments

- **NASA** for providing the high-quality lunar data
- **Three.js** community for the excellent 3D graphics library
- **LROC Science Team** for the detailed lunar imagery
- **LDEM Team** for the elevation data
