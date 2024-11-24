import * as THREE from 'three';
import * as YUKA from "yuka";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1000, 0);
camera.lookAt(scene.position)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

const vehicleGeometry = new THREE.ConeGeometry(0.1,0.5,8);
vehicleGeometry.rotateX(Math.PI * 0.5);
const vehicleMaterial = new THREE.MeshPhongMaterial({color: 0xeea300});

const entityManager = new YUKA.EntityManager();

const sync = (entity, renderComponent) => {
    renderComponent.matrix.copy(entity.worldMatrix);
}

const loader = new GLTFLoader();
let mixer;
loader.load('/clown_fish.glb', glb => {
    const model = glb.scene;
    const clips = glb.animations;
    const fishes = new THREE.AnimationObjectGroup();
    mixer = new THREE.AnimationMixer(fishes);
    const clip = THREE.AnimationClip.findByName(clips, 'Fish_001_animate_preview');
    const action = mixer.clipAction(clip);
    action.play()
    for(let i = 0; i<50; i++) {
        const fishClone = SkeletonUtils.clone(model);
        //const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
        fishClone.matrixAutoUpdate = false;
        //fishClone.scale.set(0.5,0.5,0.5)
        scene.add(fishClone);
        fishes.add(fishClone);

        const vehicle = new YUKA.Vehicle();
        vehicle.setRenderComponent(fishClone, sync);

        const wanderBehavior = new YUKA.WanderBehavior();
        vehicle.steering.add(wanderBehavior);

        entityManager.add(vehicle);

        vehicle.maxSpeed = 5;
        vehicle.position.x = 250 - Math.random() * 500;
        vehicle.position.z = 250 - Math.random() * 500;
        vehicle.rotation.fromEuler(0, 2*Math.PI * Math.random(), 0);
    }

})

const time = new YUKA.Time();
const clock = new THREE.Clock()
const animate = () => {
    const clockDelta = clock.getDelta();
    if (mixer) {
        mixer.update(clockDelta);
    }
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