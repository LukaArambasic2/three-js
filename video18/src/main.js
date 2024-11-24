import * as THREE from 'three';
import * as YUKA from 'yuka';

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 0);
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

const vehicleGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
vehicleGeometry.computeBoundingSphere();
vehicleGeometry.rotateX(Math.PI / 2);
const vehicleMesh = new THREE.Mesh(
    vehicleGeometry,
    new THREE.MeshNormalMaterial(),
)
vehicleMesh.matrixAutoUpdate = false;
scene.add(vehicleMesh)

const vehicle = new YUKA.Vehicle();
const sync = (entity, renderComponent) => {
    renderComponent.matrix.copy(entity.worldMatrix);
}
vehicle.boundingRadius = vehicleGeometry.boundingSphere.radius;
vehicle.setRenderComponent(vehicleMesh, sync);

const path = new YUKA.Path();
path.add(new YUKA.Vector3(-12,0,0));
path.add(new YUKA.Vector3(12,0,0));
path.loop = true;
vehicle.position.copy(path.current());

const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.1);
const onPathBehavior = new YUKA.OnPathBehavior(path,0.1);

vehicle.steering.add(followPathBehavior);
vehicle.steering.add(onPathBehavior);

vehicle.maxSpeed = 3;
vehicle.smoother = new YUKA.Smoother(30);

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const obstacleGeometry = new THREE.BoxGeometry();
obstacleGeometry.computeBoundingSphere();
const obstacleMaterial = new THREE.MeshPhongMaterial({color: 0xee0808});

const obstacleMesh1 = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
scene.add(obstacleMesh1);
obstacleMesh1.position.set(6,0,0);

const obstacleMesh2 = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
scene.add(obstacleMesh2);
obstacleMesh2.position.set(-6,0,0);

const obstacleMesh3 = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
scene.add(obstacleMesh3);
obstacleMesh3.position.set(0,0,0);

const obstacle1 = new YUKA.GameEntity();
obstacle1.boundingRadius = obstacleGeometry.boundingSphere.radius;
obstacle1.position.copy(obstacleMesh1.position);

const obstacle2 = new YUKA.GameEntity();
obstacle2.boundingRadius = obstacleGeometry.boundingSphere.radius;
obstacle2.position.copy(obstacleMesh2.position);

const obstacle3 = new YUKA.GameEntity();
obstacle3.position.copy(obstacleMesh3.position);
obstacle3.boundingRadius = obstacleGeometry.boundingSphere.radius;

const obstacles = [obstacle1, obstacle2, obstacle3];
const obstaclesAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obstacles);

vehicle.steering.add(obstaclesAvoidanceBehavior);

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