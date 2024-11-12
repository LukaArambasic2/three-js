import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 15, -22);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false,
    })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.name = 'ground';

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
    })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5,0,0.5)
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
        if (intersect.object.name==='ground'){
            const highlightPosition = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
            highlightMesh.position.set(highlightPosition.x, 0, highlightPosition.z);
        }

        const objectExists = objects.find(object => {
            return object.position.x===highlightMesh.position.x && object.position.z===highlightMesh.position.z;
        })

        if (!objectExists) {
            highlightMesh.material.color.setHex(0xffffff);
        } else {
            highlightMesh.material.color.setHex(0xff0000);
        }
    })
})

const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xFFEA00,
    })
)

const objects = [];

window.addEventListener('mousedown', (e) => {
    const objectExists = objects.find(object => {
        return object.position.x===highlightMesh.position.x && object.position.z===highlightMesh.position.z;
    })

    if (!objectExists) {
        intersects.forEach(intersect => {
            if (intersect.object.name==='ground'){
                const sphereClone = sphereMesh.clone();
                sphereClone.position.copy(highlightMesh.position);
                scene.add(sphereClone);
                objects.push(sphereClone);
                highlightMesh.material.color.setHex(0xff0000);

            }
        })
    }

})
const animate = (time) => {
    highlightMesh.material.opacity = 1+Math.sin(time/120);
    objects.forEach(object => {
        object.rotation.x = time/1000;
        object.rotation.z = time/1000;
        object.position.y = 0.5 + 0.5*Math.abs(Math.sin(time/1000))

    })
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})