import * as THREE from 'three';
import * as YUKA from 'yuka';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 20, 20);
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

const gltfLoader = new GLTFLoader();
gltfLoader.load('/SUV.glb', gltf => {
    const model = gltf.scene;
    //model.scale.set(0.5,0.5,0.5);
    scene.add(model);
    model.matrixAutoUpdate = false;
    vehicle.scale = new YUKA.Vector3(0.5,0.5,0.5);
    vehicle.setRenderComponent(model, sync);

})

// const vehicleGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
// vehicleGeometry.rotateX(Math.PI / 2);
// const vehicleMesh = new THREE.Mesh(
//     vehicleGeometry,
//     new THREE.MeshNormalMaterial(),
// )
// vehicleMesh.matrixAutoUpdate = false;
// scene.add(vehicleMesh)

const vehicle = new YUKA.Vehicle();
const sync = (entity, renderComponent) => {
    renderComponent.matrix.copy(entity.worldMatrix);
}


const path = new YUKA.Path();
path.add(new YUKA.Vector3(-6, 0, 4));
path.add(new YUKA.Vector3(-12, 0, 0));
path.add(new YUKA.Vector3(-6, 0, -12));
path.add(new YUKA.Vector3(0, 0, 0));
path.add(new YUKA.Vector3(8, 0, -8));
path.add(new YUKA.Vector3(10, 0, 0));
path.add(new YUKA.Vector3(4, 0, 4));
path.add(new YUKA.Vector3(0, 0, 6));

path.loop = true;

vehicle.position.copy(path.current());

const followPathBehavior = new YUKA.FollowPathBehavior(path, 3);
const onPathBehavior = new YUKA.OnPathBehavior(path,0.1);

vehicle.steering.add(followPathBehavior);
vehicle.steering.add(onPathBehavior);

vehicle.maxSpeed = 3;

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const position = []
for(let i=0;i<path._waypoints.length;i++){
    const waypoint = path._waypoints[i];
    position.push(waypoint.x, waypoint.y, waypoint.z);
}

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position,3))

const lineMaterial = new THREE.LineBasicMaterial({});
const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
scene.add(lines);

const time = new YUKA.Time();
const animate = () => {
    const delta = time.update().getDelta();
    entityManager.update(delta);
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})