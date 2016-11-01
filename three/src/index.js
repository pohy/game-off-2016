import initThree from './init-three';
import initServiceWorker from './init-service-worker';

window.onload = () => {
    initThree();
    initServiceWorker();
};
