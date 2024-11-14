import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(6, 6, 6);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const grid = new THREE.GridHelper(30,30);
scene.add(grid);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);
//
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(10, 11, 7);
// scene.add(directionalLight);

const gltfLoader = new GLTFLoader();

const rgbeLoader = new RGBELoader();

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

let car;
rgbeLoader.load('/environment.hdr', texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    gltfLoader.load('/porsche.glb', gltf => {
        const model = gltf.scene;
        scene.add(model);

        car = model;
    }, undefined, error => {
        console.log(error);
    });


});



const animate = (time) => {
    renderer.render(scene, camera);
    if (car) {
        car.rotation.y = -time / 3000;
    }
};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})