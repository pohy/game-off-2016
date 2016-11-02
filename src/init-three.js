import * as THREE from 'three';

export default function() {
    window.addEventListener('resize', onResize, false);

    const {innerWidth: width, innerHeight: height} = window;
    const aspectRatio = width / height;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const floorGeometry = new THREE.PlaneGeometry(2000, 2000);
    const floorMaterial = new THREE.MeshBasicMaterial({color: 0xef58eb, side: THREE.DoubleSide});
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = 90;
    floor.position.y = -3;
    floor.position.z = -1000;
    scene.add(floor);

    camera.position.z = 5;
    const rows = 9;
    const levels = 3;
    const cubes = Array
        .apply(null, Array(85 * levels))
        .map(() => {
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            return new THREE.Mesh(boxGeometry, material);
        });
    cubes.forEach((cube, i) => {
        cube.position.x = (i - cubes.length / 2) * 0.3;
        cube.position.y = (i % rows - rows / 2) * 1.5;
        cube.position.z = i % levels;
        scene.add(cube);
    });

    const clock = new THREE.Clock();

    render();
    function render() {
        requestAnimationFrame(render);

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

        renderer.render(scene, camera);
    }

    function onResize() {
        const {innerWidth: width, innerHeight: height} = window;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function randomRange(max, min) {
        return Math.random() * (max - min) + min;
    }
}