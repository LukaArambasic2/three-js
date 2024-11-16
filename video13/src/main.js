import * as THREE from 'three';
import gsap from 'gsap';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

// const cubeMesh = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({
//         color: 0x00ff00,
//     })
// );
// cubeMesh.position.set(0,0.5, 0)
// scene.add(cubeMesh);
//
// const t1 = gsap.timeline();
// window.addEventListener('mousedown', () => {
//     t1.to(camera.position, {
//         z: 14,
//         duration: 1.5,
//         onUpdate: () => {
//             camera.lookAt(0,0,0);
//         }
//     }).to(camera.position, {
//         y: 10,
//         duration: 2,
//         onUpdate: () => {
//             camera.lookAt(0,0,0);
//         }
//     }).to(camera.position, {
//         y: -2,
//         x: 22,
//         z: 5,
//         duration: 4,
//         onUpdate: () => {
//             camera.lookAt(0,0,0);
//         }
//     });
// })

let mixer;
let mixer2;
let mixer3;

const loader = new GLTFLoader();
loader.load('/phoenix_bird/scene.gltf', gltf => {
    const model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01);
    const model2 = SkeletonUtils.clone(model);
    const model3 = SkeletonUtils.clone(model);

    scene.add(model);
    scene.add(model2);
    scene.add(model3);

    model2.position.set(7, -4, -6);
    model3.position.set(-7, 4, -2);

    mixer = new THREE.AnimationMixer(model);
    mixer2 = new THREE.AnimationMixer(model2);
    mixer3 = new THREE.AnimationMixer(model3);

    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Take 001');

    const action = mixer.clipAction(clip);
    const action2 = mixer2.clipAction(clip);
    const action3 = mixer3.clipAction(clip);

    action.play();
    action.timeScale = 0.5;
    action2.play();
    action2.timeScale = 0.5;
    action2.startAt(0.2);
    action3.play();
    action3.timeScale = 0.5;
    action3.startAt(0.35);


    window.addEventListener('mousedown', cameraAnimation);

}, undefined, error => {
    console.log(error);
})

const t1 = gsap.timeline();
const duration = 8;
const ease = 'none';
let animationIsFinished = false;

const cameraAnimation = () => {
    if (!animationIsFinished) {
        animationIsFinished = true;

        t1.to(camera.position, {
            x: 0,
            duration,
            ease,
        }).to(camera.position, {
            y: 40,
            z: 30,
            duration,
            ease,
            onUpdate: () => {camera.lookAt(0,0,0);}

        }, 8)
        .to(camera.position, {
            x: -10,
            y: 15,
            z: 10,
            duration,
            ease,
            onUpdate: () => {camera.lookAt(0,0,0);}

        }, 8)
        .to(camera.position, {
            x: -30,
            y: 30,
            z: 20,
            duration,
            ease,
            onUpdate: () => {camera.lookAt(0,0,0);}

        }, 8)

        .to(camera.position, {
            x: -40,
            y: 30,
            z: -20,
            duration,
            ease,
            onUpdate: () => {camera.lookAt(0,0,0);}

        }, 14)
        .to(camera.position, {
            x: 5,
            y: 5,
            z: -10,
            duration,
            ease,
            onUpdate: () => {camera.lookAt(0,0,0);}

        })
        .to(camera.position, {
            x: 5,
            y: 20,
            z: 30,
            duration,
            ease,
            onUpdate: () => {camera.lookAt(0,0,0);}

        }, '>-0.2')
        .to(camera.position, {
            x: -26,
            duration:12,
            ease,
            delay: 2,

        })
    }

}

const clock = new THREE.Clock();
const animate = () => {
    const delta = clock.getDelta();
    if (mixer && mixer2 && mixer3) {
        mixer.update(delta);
        mixer2.update(delta);
        mixer3.update(delta);
    }
    renderer.render(scene, camera);

};
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})