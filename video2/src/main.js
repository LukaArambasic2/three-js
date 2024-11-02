import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(-90, 140, 140);
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('stars.jpg');

const createPlanet = (size, texture, position, ring)  => {
    const parent = new THREE.Object3D();
    scene.add(parent);

    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
    });
    const mesh = new THREE.Mesh(geo, mat);
    parent.add(mesh);
    if (ring) {
        const ringGeo = new THREE.RingGeometry(size+1, size*1.5, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load('saturnRing.jpg'),
            side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        parent.add(ring);
        ring.position.set(position, 0, 0);
        ring.rotation.x = -Math.PI/2;
    }
    mesh.position.x = position;

    return {mesh: mesh, obj: parent}
}


const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load('sun.jpg'),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
sun.rotation.set(0,0,0);

const pointLight = new THREE.PointLight(0xffffff,10000, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const mercury = createPlanet(3.2, 'mercury.jpg', 28)
const venus = createPlanet(5.8, 'venus.jpg', 44)
const earth = createPlanet(6, 'earth.jpg', 62);
const mars = createPlanet(4, 'mars.jpg', 78);
const jupiter = createPlanet(12, 'jupiter.jpg', 100);
const saturn = createPlanet(10, 'saturn.jpg', 138, true)
const uranus = createPlanet(7, 'uranus.jpg', 176, true)
const neptune = createPlanet(7, 'neptune.jpg', 200);


const animate = () => {
    renderer.render(scene, camera);
    sun.rotation.y += 0.001* Math.PI;
    mercury.mesh.rotation.y += 0.004* Math.PI;
    mercury.obj.rotation.y += 0.005* Math.PI;
    venus.mesh.rotation.y += 0.004* Math.PI;
    venus.obj.rotation.y += 0.003* Math.PI;
    earth.mesh.rotation.y += 0.005* Math.PI;
    earth.obj.rotation.y += 0.001* Math.PI;
    mars.mesh.rotation.y += 0.004* Math.PI;
    mars.obj.rotation.y += 0.0005* Math.PI;
    jupiter.mesh.rotation.y += 0.004* Math.PI;
    jupiter.obj.rotation.y += 0.00005* Math.PI;
    saturn.obj.rotation.y += 0.00009 * Math.PI;
    saturn.mesh.rotation.y += 0.0038 * Math.PI;
    uranus.obj.rotation.y += 0.00018 * Math.PI;
    uranus.mesh.rotation.y += 0.0038 * Math.PI;
    neptune.obj.rotation.y += 0.0009 * Math.PI;
    neptune.mesh.rotation.y += 0.0018 * Math.PI;

}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})