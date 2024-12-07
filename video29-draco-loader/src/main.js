import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

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

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;

const dLoader = new DRACOLoader();
dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
dLoader.setDecoderConfig({type: 'js'});
gltfLoader.setDRACOLoader(dLoader);

let mixer;
rgbeLoader.load('/MR_INT-005_WhiteNeons_NAD.hdr', texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    //gltfLoader.load('/lamborghini_centenario_roadster_sdc.glb', gltf => {
    gltfLoader.load('/lambo.glb', gltf => {
        const model = gltf.scene;
        scene.add(model);

        const clips =  gltf.animations;
        mixer = new THREE.AnimationMixer(model);

        const clip = THREE.AnimationClip.findByName(clips, 'Animation');
        const action = mixer.clipAction(clip);
        action.play();
    })
})

const clock = new THREE.Clock();
const animate = () => {
    if (mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})