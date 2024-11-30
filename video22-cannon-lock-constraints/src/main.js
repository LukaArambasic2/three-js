import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 20);
camera.lookAt(0,0,0);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff,0.9,0,Math.PI / 8, 1);
spotLight.position.set(-30, 40, 30);
spotLight.target.position.set(0,0,0);
scene.add(spotLight);

const directionalLight = new THREE.DirectionalLight(0xffffff,1);
directionalLight.position.set(-30, 40, 30);
directionalLight.target.position.set(0,0,0);
scene.add(directionalLight);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
});

const size = 0.5;
const space = size * 0.1;
const mass = 1;
const N = 10;
const shape = new CANNON.Box(new CANNON.Vec3(size, size, size));

const geo = new THREE.BoxGeometry();
const mat = new THREE.MeshPhongMaterial({color: 0xFFEA00});

const meshesArray = [];
const bodiesArray = [];

let previous;
for (let i = 0; i < N; i++) {
    const boxBody = new CANNON.Body({
        shape,
        mass,
        position: new CANNON.Vec3((N/2 - i) * 2 * (size + space), 3, 0)
    });
    world.addBody(boxBody);
    bodiesArray.push(boxBody);

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    console.log(i, mesh.position)
    meshesArray.push(mesh);

    if (previous) {
        const lockConstraint = new CANNON.LockConstraint(boxBody, previous);
        world.addConstraint(lockConstraint);
    }

    previous = boxBody;
}

const leftBody = new CANNON.Body({
    shape: shape,
    mass: 0,
    position: new CANNON.Vec3((N/2 - (N-1)) * 2 * (size + space),0,0)
})
world.addBody(leftBody);

const leftMesh = new THREE.Mesh(geo, mat);
scene.add(leftMesh);
leftMesh.position.set((N/2 - (N-1))* 2 * (size + space),0,0);

const rightBody = new CANNON.Body({
    shape: shape,
    mass: 0,
    position: new CANNON.Vec3((N/2)* 2 * (size + space),0,0)
})
world.addBody(rightBody);

const rightMesh = new THREE.Mesh(geo, mat);
scene.add(rightMesh);
rightMesh.position.set((N/2)* 2 * (size + space),0,0);

const timeStep = 1 / 60;
const animate = () => {
    world.step(timeStep);

    for(let i = 0; i < meshesArray.length; i++) {
        console.log(i);
        meshesArray[i].position.copy(bodiesArray[i].position);
        meshesArray[i].quaternion.copy(bodiesArray[i].quaternion);
    }

    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})