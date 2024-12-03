import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from 'cannon-es'

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
scene.add(directionalLight);


const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81, 0),
});

const dist = 0.2;
const mass = 0.5;
const cols = 15;
const rows = 15;

const particleGeo = new THREE.SphereGeometry(0.1);
const particleMat = new THREE.MeshPhongMaterial({color:0xFFEA00})

const meshesArray = [];
const bodiesArray = [];

const shape = new CANNON.Particle();
const particles = {};

for(let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
        const particleBody = new CANNON.Body({
            mass,
            shape,
            position: new CANNON.Vec3(-(i-cols*0.5) * dist, 4, (j - rows * 0.5) * dist)
        });
        particles[`${i} ${j}`] = particleBody;
        world.addBody(particleBody);
        bodiesArray.push(particleBody);

        const particleMesh = new THREE.Mesh(particleGeo, particleMat);
        scene.add(particleMesh);
        meshesArray.push(particleMesh);
    }
}

const sphereBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Sphere(1.5)
});
world.addBody(sphereBody);
bodiesArray.push(sphereBody);

const sphereGeo = new THREE.SphereGeometry(1.5);
const sphereMat = new THREE.MeshPhongMaterial({color: 0x555555});
const sphere = new THREE.Mesh(
    sphereGeo,
    sphereMat
)
scene.add(sphere);
meshesArray.push(sphere);

const connect = (i1, j1, i2, j2) => {
    const distanceConstraint = new CANNON.DistanceConstraint(
        particles[`${i1} ${j1}`],
        particles[`${i2} ${j2}`],
        dist
    );
    world.addConstraint(distanceConstraint);
}

for(let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
        if (i < cols - 1)
            connect(i,j, i + 1, j);
        if (j < rows - 1)
            connect(i,j, i, j + 1);
    }
}



const timeStep = 1/60;
const animate = () => {
    world.step(timeStep);

    for(let i = 0; i < bodiesArray.length; i++) {
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