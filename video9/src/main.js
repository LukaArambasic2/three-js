import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
const fileURL = new URL('/Stag.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 6, 10);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
scene.add(directionalLight);
directionalLight.position.set(3, 3, 3);

const loader = new GLTFLoader();
//let mixer;
let donkey;
let clips;
loader.load(fileURL.href, gltf => {
    const model = gltf.scene;
    model.scale.set(0.3,0.3,0.3)
    //scene.add(model);
    donkey = model;
    clips = gltf.animations;

}, undefined, error => {
    console.log(error);
})

const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(30,30),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false,
    })
)
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.name = 'ground';

const grid = new THREE.GridHelper(30,30);
scene.add(grid);

const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
    })
)
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const mousePosition = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach(intersect => {
        if (intersect.object.name === 'ground') {
            const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
        }

        const objectExists = objects.find(object => {
            return object.position.x === highlightMesh.position.x && object.position.z === highlightMesh.position.z;
        })
        if (!objectExists) {
            highlightMesh.material.color.setHex(0xffffff);
        } else {
            highlightMesh.material.color.setHex(0xff0000);
        }
    })
});

const objects = [];
const mixers = [];
window.addEventListener('mousedown', () => {
    const objectExist = objects.find(object => {
        return object.position.x === highlightMesh.position.x && object.position.z === highlightMesh.position.z;
    })

    if (!objectExist) {
        intersects.forEach(intersect => {
            if (intersect.object.name === 'ground') {
                const donkeyClone = SkeletonUtils.clone(donkey);
                donkeyClone.position.set(highlightMesh.position.x, 0, highlightMesh.position.z);
                scene.add(donkeyClone);
                objects.push(donkeyClone);
                highlightMesh.material.color.setHex(0xff0000);

                const mixer = new THREE.AnimationMixer(donkeyClone);
                const clip = THREE.AnimationClip.findByName(clips,'Idle_2');
                const action = mixer.clipAction(clip);
                action.play();
                mixers.push(mixer);
            }
        })
    }
})

const clock = new THREE.Clock();
const animate = (time) => {
    highlightMesh.material.opacity = 1 + Math.sin(time / 120);
    // objects.forEach(object => {
    //     object.rotation.x = time / 1000;
    //     object.rotation.z = time / 1000;
    //     object.position.y = 0.5 + 0.5 * Math.sin(time / 1000);
    // })

    const delta = clock.getDelta();
    mixers.forEach(mixer => {
        mixer.update(delta);
    })
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})