import * as THREE from 'three';
import './style.css';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const radius = 1; // sphere radius. Default is 1.
  const widthSegments = 128; // number of horizontal segments. Minimum value is 3, and the default is 32.
  const heightSegments = 64; // number of vertical segments. Minimum value is 2, and the default is 16.
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

main();
