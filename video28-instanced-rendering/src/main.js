import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;

rgbeLoader.load('/MR_INT-005_WhiteNeons_NAD.hdr', texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    gltfLoader.load('/scene.gltf', gltf => {
        const mesh = gltf.scene.getObjectByName('Star_Star_0');
        const geometry = mesh.geometry.clone();
        const material = mesh.material;
        const starMesh = new THREE.InstancedMesh(geometry, material, 100000);
        scene.add(starMesh);

        const dummy = new THREE.Object3D();
        for(let i = 0; i < starMesh.count; i++){
            dummy.position.x = Math.random() * 200 - 100;
            dummy.position.y = Math.random() * 200 - 100;
            dummy.position.z = Math.random() * 200 - 100;

            dummy.rotation.x = Math.random() * 2 * Math.PI;
            dummy.rotation.y = Math.random() * 2 * Math.PI;
            dummy.rotation.z = Math.random() * 2 * Math.PI;

            const scale = Math.random() * 0.04;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            starMesh.setMatrixAt(i, dummy.matrix);
            starMesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
        }
    }, undefined, error => {
        console.log(error);
    }
    )
});

// const geometry = new THREE.IcosahedronGeometry();
// const material = new THREE.MeshPhongMaterial();
// const mesh = new THREE.InstancedMesh(geometry, material, 100000);
// scene.add(mesh);
//
// const dummy = new THREE.Object3D();
// for(let i = 0; i < mesh.count; i++){
//     dummy.position.x = Math.random() * 200 - 100;
//     dummy.position.y = Math.random() * 200 - 100;
//     dummy.position.z = Math.random() * 200 - 100;
//
//     dummy.rotation.x = Math.random() * 2 * Math.PI;
//     dummy.rotation.y = Math.random() * 2 * Math.PI;
//     dummy.rotation.z = Math.random() * 2 * Math.PI;
//
//     const scale = Math.random();
//     dummy.scale.set(scale, scale, scale);
//     dummy.updateMatrix();
//     mesh.setMatrixAt(i, dummy.matrix);
//     mesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
// }

//const matrix = new THREE.Matrix4();
const animate = (time) => {
    // for(let i = 0; i < mesh.count; i++){
    //     mesh.getMatrixAt(i, matrix);
    //     matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
    //
    //     dummy.rotation.x = i/100000 * time / 1000;
    //     dummy.rotation.y = i/100000 * time / 500;
    //     dummy.rotation.z = i/100000 * time / 1200;
    //
    //     dummy.updateMatrix();
    //     mesh.setMatrixAt(i, dummy.matrix);
    //     mesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
    // }
    // mesh.instanceMatrix.needsUpdate = true;
    // mesh.rotation.y = time / 10000;
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})