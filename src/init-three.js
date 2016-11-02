import * as THREE from 'three';
import loadOBJ from './load-obj';
const OrbitControls = require('three-orbit-controls')(THREE);
import {Noise} from 'noisejs';

export default function() {
    window.addEventListener('resize', onResize, false);

    const noise = new Noise(Math.random());

    const {innerWidth: width, innerHeight: height} = window;
    const aspectRatio = width / height;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x3d0ce8);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(renderer.domElement);

    new OrbitControls(camera);

    const floor = createFloor();
    floor.receiveShadow = true;
    scene.add(floor);

    const clock = new THREE.Clock();

    const helmetMaterial = new THREE.MeshLambertMaterial({color: 0x3077c9});
    let helmet;
    loadOBJ('/assets/helmet.obj')
        .then((object) => {
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = helmetMaterial;
                }
            });
            const scale = 0.1;
            object.scale.x = scale;
            object.scale.y = scale;
            object.scale.z = scale;
            helmet = object;
            helmet.receiveShadow = true;
            helmet.castShadow = true;
            scene.add(object)
        })
        .catch(console.error);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2);
    spotLight.position.set(0, 1500, 1000);
    spotLight.target.position.set(0, 0, 0);
    spotLight.castShadow = true;
    spotLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 1200, 2500));
    spotLight.shadow.bias = 0.0001;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);

    render();
    function render() {
        requestAnimationFrame(render);

        if (helmet) {
            helmet.rotation.y += Math.sin(clock.getElapsedTime()) * Math.random() * 0.1;
        }
        floor.material.color.setHSL(
            (Math.sin(clock.getElapsedTime() / 10) + 1) / 2,
            1,
            0.5
        );

        renderer.render(scene, camera);
    }

    function onResize() {
        const {innerWidth: width, innerHeight: height} = window;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(2000, 2000);
        const floorMaterial = new THREE.MeshPhongMaterial({color: 0xef58eb, side: THREE.DoubleSide});
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -3;
        floor.rotation.x = Math.PI / 2;
        floor.receiveShadow = true;
        floor.castShadow = false;
        return floor;
    }
}