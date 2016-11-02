import * as THREE from 'three';
import loadOBJ from './load-obj';

export default function() {
    window.addEventListener('resize', onResize, false);

    const {innerWidth: width, innerHeight: height} = window;
    const aspectRatio = width / height;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const floor = createFloor();
    scene.add(floor);

    const cubes = createCubes();
    // cubes.forEach((cube) => scene.add(cube));

    const clock = new THREE.Clock();

    const helmetMaterial = new THREE.MeshBasicMaterial({color: 0x3077c9});
    let helmet;
    loadOBJ('/assets/helmet.obj')
        .then((object) => {
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = helmetMaterial;
                }
            });
            object.position.z = -5;
            const scale = 0.1;
            object.scale.x = scale;
            object.scale.y = scale;
            object.scale.z = scale;
            helmet = object;
            scene.add(object)
        })
        .catch(console.error);

    render();
    function render() {
        requestAnimationFrame(render);

        animateCubes(cubes, clock);
        helmet.rotation.y += Math.sin(clock.getElapsedTime()) * Math.random() * 0.1;

        renderer.render(scene, camera);
    }

    function animateCubes(cubes, clock) {
        cubes.forEach((cube, i) => {
            cube.rotation.z += Math.sin(clock.getElapsedTime()) * Math.random() * 0.1;
            cube.rotation.y += Math.cos(clock.getElapsedTime()) * Math.random() * 0.2;

            cube.position.z = Math.sin(clock.getElapsedTime() + i) * 3;
            cube.position.z = Math.sin(clock.getElapsedTime() + i) * 3;

            cube.material.color.setHSL(
                (Math.sin(clock.getElapsedTime() + i) + 1) / 2,
                1,
                0.5
            );
        });
    }

    function onResize() {
        const {innerWidth: width, innerHeight: height} = window;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(2000, 2000);
        const floorMaterial = new THREE.MeshBasicMaterial({color: 0xef58eb, side: THREE.DoubleSide});
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = 90;
        floor.position.y = -3;
        floor.position.z = -1000;
        return floor;
    }

    function createCubes() {
        const rows = 9;
        const levels = 3;
        const cubeCount = 85;
        const cubes = Array
            .apply(null, Array(cubeCount * levels))
            .map((arr, i) => {
                const material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00
                });
                const cube = new THREE.Mesh(boxGeometry, material);
                cube.position.x = (i - cubeCount / 2) * 0.3;
                cube.position.y = (i % rows - rows / 2) * 1.5;
                cube.position.z = i % levels;
                return cube;
            });
        return cubes;
    }
}