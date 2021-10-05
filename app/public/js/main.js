window.addEventListener('load', () => {
    class MyApp extends Application {
        onStartApp() {
            
        }

        onSocketConnected() {
            
        }

        show404() {
            document.body.innerHTML = '<h1 id="notFound">404</h1>';
        }
    }

    globalThis.app = new MyApp({
        useSockets: true,
        useLocalStorage: false,
        socketsURL: 'http://localhost:8000',
        useSession: true,
        routing: {
        },
        controllers: [
            
        ]
    });
});