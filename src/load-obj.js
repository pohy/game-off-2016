import 'three/examples/js/loaders/OBJLoader';
import * as THREE from 'three';

const loader = new THREE.OBJLoader();

/**
 * Attempts to load an OBJ from URL
 *
 * @param {string} url URL
 * @returns {Promise}
 */
export default function (url) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
}