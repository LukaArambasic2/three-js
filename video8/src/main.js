import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import GUI from 'lil-gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const fileURL = new URL('/Donkey.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update()

const grid = new THREE.GridHelper(30,30);
scene.add(grid);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

const gui = new GUI();

const options = {
    'Main light': 0x7c7c7c,
}

const loader = new GLTFLoader();
loader.load(fileURL.href, gltf => {
    const model = gltf.scene;
    scene.add(model);
    console.log(model.getObjectByName('Cube_1'))
    gui.addColor(options, 'Main light').onChange(e => {
        model.getObjectByName('Cube_1').material.color.setHex(e)
    })


}, undefined, error => {
    console.log(error);
})

const animate = () => {
    renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})