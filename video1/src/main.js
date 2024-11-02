import * as THREE from 'three';
import * as GUI from 'lil-gui';
import {OrbitControls} from "three/addons";

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);

const orbit = new OrbitControls(camera, renderer.domElement);


const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

camera.position.set(-10,30,30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00f0f0});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xa0a0a0,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5*Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 100, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x523465,
    side: THREE.DoubleSide,
    wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;
sphere.position.set(-10, 10, 0);

let step = 0;

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;
//
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);
//
// const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff, 100000);
scene.add(spotLight);
spotLight.position.set(-100,100,0);
spotLight.castShadow = true;
spotLight.angle = 0.2

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//scene.fog = new THREE.Fog(0xffffff, 0, 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

renderer.setClearColor(0xffea00)

const loader = new THREE.TextureLoader();

const box2Geometry = new THREE.BoxGeometry(4,4,4);
const box2Material = new THREE.MeshBasicMaterial({
    //map: loader.load('nebulako.jpg')
});
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: loader.load('nebulako.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('starrock.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('a1.png')}),
    new THREE.MeshBasicMaterial({map: loader.load('a2.png')}),
    new THREE.MeshBasicMaterial({map: loader.load('a3.png')}),
    new THREE.MeshBasicMaterial({map: loader.load('a4.png')}),
]
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
box2.position.set(5,1,1);
scene.add(box2);

const gui = new GUI.GUI();
const options = {
    sphereColor: '0xff00aa',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 100000,
};
gui.addColor(options, 'sphereColor').onChange((e) => {sphere.material.color.set(e)});
gui.add(options, 'wireframe').onChange((e)=>{sphere.material.wireframe=e});
gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 100000);

const mousePosition =  new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();


const animate = () => {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;

    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);