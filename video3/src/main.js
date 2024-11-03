import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x777777);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const url = new URL('/scene.gltf', import.meta.url)
const loader = new GLTFLoader();

let mixer;
loader.load(url.href, (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
    })
    // const clip1 = THREE.AnimationClip.findByName(clips, 'Armature|Idle_01')
    // const clip2 = THREE.AnimationClip.findByName(clips, 'Armature|Idle_02')
    // const clip3 = THREE.AnimationClip.findByName(clips, 'Armature|WalkCycle')
    // const action = mixer.clipAction(clip1);
    // action.play();
}, undefined, (error) => {
    console.error(error);
});

const clock = new THREE.Clock();
const animate = () => {
    if (mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene,camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
