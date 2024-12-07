import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import * as YUKA from 'yuka';
import {Astro} from './astro.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight);

const entityManager = new YUKA.EntityManager();
const loader = new GLTFLoader();
loader.load('/Astro.gltf', gltf => {
    const model = gltf.scene;
    model.add(camera);
    const target = new THREE.Vector3();
    target.copy(model.position);
    target.y += 1;
    camera.lookAt(target);
    scene.add(model);
    model.animations = gltf.animations;
    const animations = new Map();
    const mixer = new THREE.AnimationMixer(model);
    const idleAction = mixer.clipAction('Idle');

    idleAction.play();
    idleAction.enabled = false;
    const walkAction = mixer.clipAction('Walk');

    walkAction.play();
    walkAction.enabled = false;
    const runAction = mixer.clipAction('Run');

    runAction.play();
    runAction.enabled = false;
    animations.set('IDLE', idleAction);

    animations.set('WALK', walkAction);
    animations.set('RUN', runAction);
    console.log("Gi")

    const astro = new Astro(mixer, animations);
    console.log(astro)
    entityManager.add(astro);

    window.addEventListener('mousedown', e => {
        astro.isRunning = true;
    })
    window.addEventListener('mouseup', e => {
        astro.isRunning = false;
    })
})

const time = new YUKA.Time();
const animate = () => {
    const delta = time.update().getDelta();
    entityManager.update(delta);
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})