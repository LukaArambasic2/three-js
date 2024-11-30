import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {BloomPass} from "three/addons";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(scene.position)

const renderScene = new RenderPass(scene,camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.6,
    0.1,
    .1
);
composer.addPass(bloomPass);

// bloomPass.strength = 0.5;
// bloomPass.radius = 5;
// bloomPass.threshold = 0.1

renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1.5

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const loader = new GLTFLoader();

let mixer;
loader.load('/ethereal_polynucleotide/scene.gltf', gltf => {
    const model = gltf.scene;
    scene.add(model);

    const clips = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    const clip = THREE.AnimationClip.findByName(clips, 'Animation');
    const action = mixer.clipAction(clip);
    action.play();
    console.log(clip);
})

const clock = new THREE.Clock();
const animate = () => {
    const clockDelta = clock.getDelta();
    if (mixer) {
        mixer.update(clockDelta);
    }
    composer.render(scene, camera);
    requestAnimationFrame(animate);

};
//renderer.setAnimationLoop(animate);
animate()
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})