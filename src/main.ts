import * as THREE from 'three';
import './style.css';

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

// ^^^^^^^^^^Initialization Functions^^^^^^^^^^

// ==========Main Function==========
function main() {
  const renderer = initRenderer();

  const camera = initCamera();

  const scene = initScene();

  {
    const color = 0xffffff; // hexadecimal color of the light. Default is 0xffffff (white).
    const intensity = 1; // numeric value of the light's strength/intensity. Default is 1.
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const radius = 1; // sphere radius. Default is 1.
  const widthSegments = 64; // number of horizontal segments. Minimum value is 3, and the default is 32.
  const heightSegments = 32; // number of vertical segments. Minimum value is 2, and the default is 16.
  // const phiStart = 0; // specify horizontal starting angle. Default is 0.
  // const phiLength = Math.PI * 2; // specify horizontal sweep angle size. Default is Math.PI * 2.
  // const thetaStart = 0; // specify vertical starting angle. Default is 0.
  // const thetaLength = Math.PI; // specify vertical sweep angle size. Default is Math.PI.
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  function createSphere(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    sphere.position.x = x;

    return sphere;
  }

  const sphere = createSphere(geometry, 0x909090, 0);

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
    sphere.rotation.x = rot;
    sphere.rotation.y = rot;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
// ^^^^^^^^^^Main Function^^^^^^^^^^

// ==========Execution of Main Function==========
main();
// ^^^^^^^^^^Execution of Main Function^^^^^^^^^^
