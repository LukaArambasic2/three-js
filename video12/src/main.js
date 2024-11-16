import * as THREE from 'three';
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 8, 30);

const firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
firstPersonControls.movementSpeed = 8;
firstPersonControls.lookSpeed = 0.08;
//firstPersonControls.update()

const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = (url, item, total) => {
//     console.log(url, item, total);
// }
const progressBar = document.getElementById("progress-bar");

loadingManager.onProgress = (url, loaded, total) => {
    progressBar.value = (loaded/total) * 100;
}

const progressBarContainer = document.querySelector('.progress-bar-container');

loadingManager.onLoad = () => {
    progressBarContainer.style.display = "none";
}
// loadingManager.onError = (url) => {
//     console.log(url);
// }

const gltfLoader = new GLTFLoader(loadingManager);
const rgbeLoader = new RGBELoader(loadingManager);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

rgbeLoader.load('/environment.hdr', texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    gltfLoader.load('/mars/scene.gltf', gltf => {
        const model = gltf.scene;
        scene.add(model);
    })
})

const clock = new THREE.Clock();
const animate = () => {
    renderer.render(scene, camera);
    firstPersonControls.update(clock.getDelta());
};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})