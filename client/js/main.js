window.addEventListener('load', () => {
    class MyApp extends Application {
        onStartApp() {
            this.getController('welcomeController').show();
        }

        onSocketConnected() {
            this.socket.emit('test', {});

            this.socket.on('test', data => {
                console.info('TEST');
            });

            this.socket.on('test2', data => {
                if(confirm('New data?')) {
                    this.getController('welcomeController').newData(data);
                }
            });
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