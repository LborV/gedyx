window.addEventListener('load', () => {
    class MyApp extends Application {
        onStartApp() {
            this.getController('welcomeController').show();
        }
    }

    let app = new MyApp({
        useSockets: true,
        socketsURL: 'ws://localhost:3030',
        routing: {
            '/': 'welcome'
        },
        controllers: [
            {
                name: 'welcomeController', 
                url: '/js/controllers/welcomeController.js', 
                settings: {
                    id: 'welcome',
                    url: '/views/welcome/index.json',
                    onError: '<div style="color: red">HI</div>'
                }
            },
        ]
    });
});