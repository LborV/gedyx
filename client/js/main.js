window.addEventListener('load', () => {
    class MyApp extends Application {
        onStartApp() {
            
        }

        onSocketConnected() {
            this.socket.on('complete', data => {
                this.getController('exampleController').setItems(data);
            });


            this.socket.on('delete', data => {
                this.getController('exampleController').setItems(data);
            });


            this.socket.on('create', data => {
                this.getController('exampleController').setItems(data);
            });


            this.socket.on('getAll', data => {
                this.getController('exampleController').setItems(data);
            });

            this.socket.on('usersOnline', data => {
                this.getController('exampleController').updateUsersOnline(data.users);
            });

            this.socket.emit('getAll', {});
            this.socket.emit('usersOnline', {});
        }
    }

    globalThis.app = new MyApp({
        useSockets: true,
        useLocalStorage: true,
        socketsURL: 'ws://localhost:3030',
        routing: {
            '/': 'exampleController',
        },
        controllers: [
            {
                name: 'exampleController', 
                url: '/js/controllers/exampleController.js', 
                settings: {
                    id: 'example',
                    url: '/views/example/index.json',
                    onError: '<div style="color: red">Error</div>',
                    showOnLoad: true
                }
            },
            // {
            //     name: 'Always Loaded Controller', 
            //     url: '/js/controllers/anyController.js', 
            //     settings: {
            //         id: 'Loaded_any_way',
            //         url: '/views/any/view.json',
            //         onError: '<div style="color: red">Error</div>',
            //         showOnLoad: true
            //     },
            //     load: true
            // },
        ]
    });
});