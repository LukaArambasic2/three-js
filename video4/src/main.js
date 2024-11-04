import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x999999);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    0.5, window.innerWidth / window.innerHeight, 0.1, 1000
)
camera.position.set(10,10,10);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const uniforms = {
    u_time: {type: 'f', value: 0.0},
    u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio)},
    u_mouse: {type: 'v2', value: new THREE.Vector2(0.0,0.0)},
    image: {type: 't', value: new THREE.TextureLoader().load('nebula.jpg')}
}

window.addEventListener('mousemove', (e) => {
    uniforms.u_mouse.value.set(e.screenX / window.innerWidth, 1- e.screenY / window.innerHeight);
})

const geo = new THREE.PlaneGeometry(5,5,30,30);
const mat = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    wireframe: false,
    uniforms: uniforms,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const clock = new THREE.Clock();
const animate = () => {
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

