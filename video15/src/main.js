import * as THREE from 'three';
import * as YUKA from 'yuka';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {CSS2DRenderer, CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 20, 20);
camera.lookAt(scene.position);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);



const carP = document.createElement('p');
const carLabel = new CSS2DObject(carP);
carLabel.position.set(0,3,0);


const gltfLoader = new GLTFLoader();
gltfLoader.load('/SUV.glb', gltf => {
    const model = gltf.scene;
    //model.scale.set(0.5,0.5,0.5);
    scene.add(model);
    model.matrixAutoUpdate = false;
    vehicle.scale = new YUKA.Vector3(0.5,0.5,0.5);
    vehicle.setRenderComponent(model, sync);
    model.add(carLabel);

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

function createCpointMesh(name, x, y, z) {
    const geometry = new THREE.SphereGeometry(0.1);
    const material = new THREE.MeshBasicMaterial({color: 0xff0000});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.name = name;
    return mesh;
}

const group = new THREE.Group();

const sphereMesh1 = createCpointMesh('sphere1', -6, 0, 4);
group.add(sphereMesh1);

const sphereMesh2 = createCpointMesh('sphere2', -12, 0, 0);
group.add(sphereMesh2);

const sphereMesh3 = createCpointMesh('sphere3', -6, 0, -12);
group.add(sphereMesh3);

const sphereMesh4 = createCpointMesh('sphere4', 0, 0, 0);
group.add(sphereMesh4);

const sphereMesh5 = createCpointMesh('sphere5', 8, 0, -8);
group.add(sphereMesh5);

const sphereMesh6 = createCpointMesh('sphere6', 10, 0, 0);
group.add(sphereMesh6);

const sphereMesh7 = createCpointMesh('sphere7', 4, 0, 4);
group.add(sphereMesh7);

const sphereMesh8 = createCpointMesh('sphere8', 0, 0, 6);
group.add(sphereMesh8);
scene.add(group);

const p = document.createElement('p');
p.className = 'tooltip';
const pContainer = document.createElement('div');
pContainer.appendChild(p);
const cPointLabel = new CSS2DObject(pContainer);
scene.add(cPointLabel);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', e => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        switch (intersects[0].object.name) {
            case 'sphere1':
                p.className = 'tooltip show';
                cPointLabel.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                p.textContent = 'Checkpoint 1 (-6, 0, 4)';
                break;
            case 'sphere2':
                p.className = 'tooltip show';
                cPointLabel.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                p.textContent = 'Checkpoint 2 (-12, 0, 0)';
                break;
            case 'sphere3':
                p.className = 'tooltip show';
                cPointLabel.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                p.textContent = 'Checkpoint 3 (-6, 0, -12)';
                break;
            case 'sphere4':
                p.className = 'tooltip show';
                cPointLabel.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                p.textContent = 'Checkpoint 4 (0, 0, 0)';
                break;
            case 'sphere5':
                p.className = 'tooltip show';
                cPointLabel.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                p.textContent = 'Checkpoint 5 (8, 0, -8)';
                break;
            case 'sphere6':
                p.className = 'tooltip show';
                cPointLabel.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                p.textContent = 'Checkpoint 6 (10, 0, 0)';
                break;
            case 'sphere7':
                p.className = 'tooltip show';
                cPointLabel.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                p.textContent = 'Checkpoint 7 (4, 0, 4)';
                break;
            case 'sphere8':
                p.className = 'tooltip show';
                cPointLabel.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                p.textContent = 'Checkpoint 8 (0, 0, 6)';
                break;
            default:
                break;
        }
    } else {
        p.className = 'tooltip hide';
    }
})

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

    labelRenderer.render(scene, camera);
    carP.textContent = 'Current speed: ' + vehicle.getSpeed().toFixed(2) + ' km/h';

    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
})