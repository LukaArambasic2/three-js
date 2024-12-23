import * as THREE from 'three';
import * as YUKA from 'yuka';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 4);
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, );
scene.add(directionalLight);

const vehicleGeometry = new THREE.ConeGeometry(0.1,0.5,8);
vehicleGeometry.rotateX(Math.PI/2);
const vehicleMaterial = new THREE.MeshNormalMaterial();
const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
vehicleMesh.matrixAutoUpdate = false;
scene.add(vehicleMesh);

const vehicle = new YUKA.Vehicle();
const sync = (entity, renderComponent) => {
    renderComponent.matrix.copy(entity.worldMatrix);
}
vehicle.setRenderComponent(vehicleMesh, sync);


const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const targetGeometry = new THREE.SphereGeometry(0.1);
const targetMaterial = new THREE.MeshBasicMaterial({color: 0xffea00});
const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
scene.add(targetMesh);



const target = new YUKA.Vector3();
const fleeBehavior = new YUKA.FleeBehavior(target, 2);

vehicle.steering.add(fleeBehavior);
vehicle.position.set(-2, 0, -2);

vehicle.maxSpeed = 1.5;

const mousePosition = new THREE.Vector2();

const planeGeo = new THREE.PlaneGeometry(25, 25);
const planeMat = new THREE.MeshBasicMaterial({visible: false});
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
planeMesh.rotation.x = -0.5 * Math.PI;
planeMesh.name = 'plane';
scene.add(planeMesh);

const raycaster = new THREE.Raycaster();

window.addEventListener('click', e => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name ==='plane') {
            targetMesh.position.set(intersects[i].point.x, 0, intersects[i].point.z);
            target.set(intersects[i].point.x, 0, intersects[i].point.z);
        }
    }
})

// setInterval(() => {
//     const x = Math.random() * 3;
//     const y = Math.random() * 3;
//     const z = Math.random() * 3;
//
//     target.position.set(x, y, z);
// }, 2000)

const time = new YUKA.Time();

const animate = (t) => {
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