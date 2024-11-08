import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import * as CANNON from 'cannon-es'

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const boxGeo = new THREE.BoxGeometry(2,2,2);
const boxMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
})
const box = new THREE.Mesh(boxGeo, boxMat);
scene.add(box);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

const groundGeo = new THREE.PlaneGeometry(30,30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
})
const ground = new THREE.Mesh(groundGeo, groundMat);
scene.add(ground);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81, 0),
});

const groundPhysMaterial = new CANNON.Material();

const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMaterial,
})
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI/2,0,0);

const boxPhysMaterial = new CANNON.Material();

const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
    mass: 1,
    position: new CANNON.Vec3(1,20,0),
    material: boxPhysMaterial
})
world.addBody(boxBody);

boxBody.angularVelocity.set(0,10,0);
boxBody.angularDamping = 0.5;

const groundBoxContactMat = new CANNON.ContactMaterial(groundPhysMaterial, boxPhysMaterial, {friction:0.05});
world.addContactMaterial(groundBoxContactMat);

const sphereMaterial = new CANNON.Material()
const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(2),
    mass: 1,
    position: new CANNON.Vec3(0,10,2),
    material: sphereMaterial,
})
world.addBody(sphereBody);
sphereBody.linearDamping = 0.31

const groundSphereContactMat = new CANNON.ContactMaterial(groundPhysMaterial, sphereMaterial, {restitution:0.9});
world.addContactMaterial(groundSphereContactMat);

const timeStep = 1/60;

const animate = () => {
    world.step(timeStep);

    ground.position.copy(groundBody.position);
    ground.quaternion.copy(groundBody.quaternion);

    box.position.copy(boxBody.position);
    box.quaternion.copy(boxBody.quaternion);

    sphere.position.copy(sphereBody.position);
    sphere.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})