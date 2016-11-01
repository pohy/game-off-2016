export default function () {
    if (navigator.serviceWorker) {
        navigator.serviceWorker
            .register('/offline-sw.js', {scope: '/'})
            .then(() => console.log('Service worker registered'));

        navigator.serviceWorker.ready
            .then(() => console.log('Service worker ready'));
    }
}