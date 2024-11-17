import * as THREE from 'three';
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import gsap from "gsap";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.lookSpeed = 0.08;
// controls.movementSpeed = 8;

const loadingManager = new THREE.LoadingManager();
const progressBar = document.getElementById('progress-bar');
loadingManager.onProgress = (url, loaded, total) => {progressBar.value = (loaded/total) * 100;}
const progressBarContainer = document.querySelector('.progress-bar-container');
loadingManager.onLoad = ()=>{
    progressBarContainer.style.display = 'none';
}

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

let position = 0;

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load('/the_king_s_hall/scene.gltf', gltf => {
    const model = gltf.scene;
    scene.add(model);

    window.addEventListener('mouseup', (e) => {
        switch(position) {
            case 0:
                changePosition(-1.8,1.6,5);
                changeRotation(0,0.1,0);
                position = 1;
                break;
            case 1:
                changePosition(2.8,0,3.6);
                changeRotation(0,-2,0);
                position = 2;
                break;
            case 2:
                changePosition(2.5,-0.9,12.2);
                changeRotation(0.9,0.6,-0.6);
                position = 3;
                break;
            case 3:
                changePosition(-2.7,0.6,3.7);
                changeRotation(0.6,1.9,-0.6);
                position = 4;
                break;
            case 4:
                changePosition(-1.7,0,8.7);
                changeRotation(0,4.7,0);
                position = 5;
                break;
            case 5:
                changePosition(0.5,0.8,10);
                changeRotation(0.3,1.65,-0.3);
                position = 0;
                break;
        }

    })
});

const changePosition = (x,y,z) => {
    gsap.to(camera.position,{
        x,
        y,
        z,
        duration:3
    })
}
const changeRotation = (x,y,z) => {
    gsap.to(camera.rotation,{
        x,
        y,
        z,
        duration:3.2
    })
}

//const clock = new THREE.Clock();
const animate = () => {
//    const delta = clock.getDelta();
//    controls.update(delta);

    renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})