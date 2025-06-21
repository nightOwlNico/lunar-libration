import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import './style.css';

// ==========Utility Functions==========
function showWebGLError() {
  const warning = WebGL.getWebGLErrorMessage();
  warning.setAttribute('role', 'alert');
  warning.innerHTML +=
    '<p>Please update your browser or enable WebGL2 to enjoy this content. Visit <a href="https://get.webgl.org/webgl2/">get.webgl.org/webgl2</a> for more information.</p>';
  const container = document.createElement('div');
  container.id = 'error-container';
  container.style =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); color: white; display: flex; justify-content: center; align-items: center; font-size: 20px; font-family: Arial, sans-serif;';
  document.body.appendChild(container);
  container.appendChild(warning);
  console.error('WebGL2 is not available:', WebGL.getWebGLErrorMessage());
}
// ^^^^^^^^^^Utility Functions^^^^^^^^^^

// ==========Initialization Functions==========
function initRenderer() {
  // A canvas where the renderer draws its output. If not passed in here, a new canvas element will be created.
  const canvas = document.querySelector('#c');
  // Whether to perform antialiasing. Default is false.
  const antialias = true;

  // const powerPreference: 'high-performance';
  // const precision: 'highp';
  // const logarithmicDepthBuffer: true;
  // const stencil: false;

  const renderer = new THREE.WebGLRenderer({ antialias, canvas });

  // renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // renderer.toneMappingExposure = 1.0;
  // renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
  // // renderer.physicallyCorrectLights = true;
  // // renderer.gammaFactor = 2.2;
  // // renderer.gammaOutput = true;

  // renderer.setClearColor(0x000000);
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(window.devicePixelRatio);
  // // renderer.setPixelRatio(
  // //   window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio
  // // );

  return renderer;
}

function initCamera() {
  // Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
  const fov = 75;
  // Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).
  const aspect = 1;
  // Camera frustum near plane. Default is 0.1.
  const near = 0.1;
  // Camera frustum far plane. Default is 2000. Must be greater than the current value of near plane.
  const far = 2000;

  // const fov = 45;
  // const aspect = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.z = 2;

  // camera.position.z = 34.748; // Double Sphere Radius
  // camera.position.set(0, 0, 50);

  // // Add camera controls for interactive viewing
  // const controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.05;
  // controls.screenSpacePanning = false;
  // controls.minDistance = 50;
  // controls.maxDistance = 200;
  // controls.maxPolarAngle = Math.PI;

  return camera;
  // return { camera, controls };
}

function initScene() {
  const scene = new THREE.Scene();

  // // Add a skybox for a realistic space background
  // const loader = new THREE.CubeTextureLoader();
  // const texture = loader.load([
  //   'px.jpg',
  //   'nx.jpg',
  //   'py.jpg',
  //   'ny.jpg',
  //   'pz.jpg',
  //   'nz.jpg',
  // ]);
  // scene.background = texture;

  // // Add subtle fog for depth
  // scene.fog = new THREE.FogExp2(0x000000, 0.00003);

  return scene;
}

function createStars(scene) {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    sizeAttenuation: true,
  });

  const starsVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}

function setupLighting(scene) {
  // Simulate starlight with very low intensity ambient light
  const starlight = new THREE.AmbientLight(0x111111, 0.1);
  scene.add(starlight);

  // Main directional light to simulate sunlight
  const sunlight = new THREE.DirectionalLight(0xffffff, 1.5);
  sunlight.position.set(50, 30, 50);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.width = 2048;
  sunlight.shadow.mapSize.height = 2048;
  sunlight.shadow.camera.near = 1;
  sunlight.shadow.camera.far = 200;
  sunlight.shadow.bias = -0.00005;
  scene.add(sunlight);

  // Simulate earthshine (light reflected from Earth)
  const earthshine = new THREE.HemisphereLight(0x063e7b, 0x000000, 0.1);
  earthshine.position.set(0, -1, 0);
  scene.add(earthshine);

  // Add a point light to create a subtle glow effect
  const moonGlow = new THREE.PointLight(0xffffff, 0.3, 100);
  moonGlow.position.set(0, 0, 0);
  scene.add(moonGlow);
}

function createMoon(scene) {
  const radius = 1; // sphere radius. Default is 1.
  const widthSegments = 32; // number of horizontal segments. Minimum value is 3, and the default is 32.
  const heightSegments = 16; // number of vertical segments. Minimum value is 2, and the default is 16.
  // const phiStart = 0; // specify horizontal starting angle. Default is 0.
  // const phiLength = Math.PI * 2; // specify horizontal sweep angle size. Default is Math.PI * 2.
  // const thetaStart = 0; // specify vertical starting angle. Default is 0.
  // const thetaLength = Math.PI; // specify vertical sweep angle size. Default is Math.PI.
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  const material = new THREE.MeshPhongMaterial({ color: 0x909090 });

  const sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);
  // moon.position.x = 0;

  return sphere;
}

// ^^^^^^^^^^Initialization Functions^^^^^^^^^^

// ==========Main Function==========
function main() {
  if (!WebGL.isWebGL2Available()) {
    showWebGLError();
    return;
  }

  try {
    const renderer = initRenderer();
    const camera = initCamera();
    const scene = initScene();

    createStars(scene);
    setupLighting(scene);

    const moon = createMoon(scene);

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }

      return needResize;
    }

    function render(time) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      const speed = 1 * 0.1;
      const rot = time * speed;
      moon.rotation.x = rot;
      moon.rotation.y = rot;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}
// ^^^^^^^^^^Main Function^^^^^^^^^^

// ==========Execution of Main Function==========
main();
// ^^^^^^^^^^Execution of Main Function^^^^^^^^^^
