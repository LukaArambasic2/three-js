import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 4, 5);
camera.lookAt(scene.position);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const grid = new THREE.GridHelper(30,30);
scene.add(grid);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const spotLight = new THREE.DirectionalLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(0,8,4);
spotLight.intensity = 1.2;
spotLight.angle = 0.45;
spotLight.penumbra = 0.3;

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 5;
spotLight.shadow.camera.far = 10;
spotLight.shadow.focus = 1;

const planeGeo = new THREE.PlaneGeometry(100, 100, 10000);
const planeMat = new THREE.MeshPhongMaterial({color: 0xffffff, dithering: true})
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

let mixer;
const loader = new GLTFLoader();
loader.load('/Fox.gltf', gltf => {
    const model = gltf.scene;
    scene.add(model);
    model.scale.set(0.5,0.5,0.5);

    model.traverse(node => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    })

    const clips = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    const clip = THREE.AnimationClip.findByName(clips, 'Idle');
    const action = mixer.clipAction(clip);
    action.play();


})

const clock = new THREE.Clock();
const animate = () => {
    const clockDelta = clock.getDelta();
    if (mixer) {
        mixer.update(clockDelta);
    }
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})