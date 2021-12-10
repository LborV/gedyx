window.addEventListener('load', () => {
    class MyApp extends Application {
        onStartApp() {
            
        }

        onSocketConnected() {
            
        }

        onSocketConnectionError() {
            this.socket.io.opts.transports = ['polling'];
            this.socket.io.opts.path= '/polling/';
        }

        show404() {
            document.body.innerHTML = '<h1 id="notFound">404</h1>';
        }
    }

    globalThis.app = new MyApp({
        useSockets: true,
        useLocalStorage: false,
        socketConfigs: {
            transports: ['websocket'],
            path: '/socket/'
        },
        socketsURL: 'http://localhost:8000',
        useSession: true,
        routing: routes,
        controllers: controllers
    });
});