import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader';

const hdrTextureURL = new URL('/MR_INT-003_Kitchen_Pierre.hdr', import.meta.url);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const loader = new RGBELoader();
loader.load(hdrTextureURL, texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 50, 50),
        new THREE.MeshPhysicalMaterial({
            roughness: 0,
            metalness: 0,
            color: 0xffEA00,
            transmission: 1,
            ior: 2.33,
        })
    )
    sphere.position.set(-1, 0, -1);
    scene.add(sphere);


    // const sphere2 = new THREE.Mesh(
    //     new THREE.SphereGeometry(1, 50, 50),
    //     new THREE.MeshStandardMaterial({
    //         roughness: 0,
    //         metalness: 0.5,
    //         color: 0x00FF00,
    //         //envMap: texture,
    //     })
    // )
    // sphere2.position.set(1, 0, 1);
    // scene.add(sphere2);

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