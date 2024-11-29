import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const orbit = new OrbitControls(camera, renderer.domElement);


// orbit.panSpeed = 2;
// orbit.rotateSpeed = 2;
// orbit.maxDistance = 10;
// orbit.enablePan = false;
// orbit.enableDamping = true;
// orbit.dampingFactor = 0.2;
// orbit.autoRotate = true;
// orbit.autoRotateSpeed = 2;
// orbit.target = new THREE.Vector3(2, 2, 2);

// orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
// orbit.mouseButtons.LEFT = THREE.MOUSE.PAN;
//
// orbit.keys = {
//     LEFT: 'ArrowLeft',
//     RIGHT: 'ArrowRight',
//     UP: 'KeyW',
//     DOWN: 'KeyS'
// }
// orbit.listenToKeyEvents(window);
// orbit.keyPanSpeed = 20;
//
// Adds
// window.addEventListener('keydown', e => {
//     if (e.code === 'KeyS') {
//         orbit.saveState();
//     }
//     if (e.code === 'KeyL') {
//         orbit.reset();
//     }
// })

// Restrict camera movement to a direction
//orbit.minAzimuthAngle = Math.PI / 4;
//orbit.maxAzimuthAngle = Math.PI / 2;
//orbit.minPolarAngle = Math.PI / 4;
//orbit.maxPolarAngle = Math.PI / 2;

const animate = () => {
    orbit.update();
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})