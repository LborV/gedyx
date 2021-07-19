window.addEventListener('load', () => {
    class MyApp extends Application {
        onStartApp() {
            // this.getController('welcomeController').show();
        }

        onSocketConnected() {
            this.socket.emit('test', {});

            this.socket.on('test', data => {
                console.info('TEST');
            });

            this.socket.on('test2', data => {
                if(confirm('New data?')) {
                    // this.getController('welcomeController').newData(data);
                }
            });
        }
    }

    globalThis.app = new MyApp({
        useSockets: true,
        socketsURL: 'ws://localhost:3030',
        routing: {
            '/': 'welcomeController, welcomeController2',
            '/test/{slug}': 'welcomeController2',
            '/test/{slug}/some/{slug2}/link': 'welcomeController, welcomeController2',
            '/test': 'welcomeController2'
        },
        controllers: [
            {
                name: 'welcomeController', 
                url: '/js/controllers/welcomeController.js', 
                settings: {
                    id: 'welcome',
                    url: '/views/welcome/index.json',
                    onError: '<div style="color: red">Error</div>',
                    showOnLoad: true
                }
            },
            {
                name: 'welcomeController2', 
                url: '/js/controllers/welcomeController.js', 
                settings: {
                    id: 'welcome2',
                    url: '/views/welcome/index.json',
                    onError: '<div style="color: red">Error</div>',
                    showOnLoad: true
                }
            },
            {
                name: 'controller3', 
                url: '/js/controllers/welcomeController.js', 
                settings: {
                    id: 'Loaded_any_way',
                    url: '/views/welcome/index.json',
                    onError: '<div style="color: red">Error</div>',
                    showOnLoad: true
                },
                load: true
            },
        ]
    });
});