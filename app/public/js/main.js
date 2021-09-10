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
            '/': {
                template: '/views/example/template.html',
                controllers: [
                    'exampleController'
                ]
            },
            '/{test}': {
                template: '/views/example/template.html',
                controllers: [
                    'exampleController',
                    'exampleController2'
                ],
                title: 'aloha',
                metaData: [
                    {
                        name: 'keywords',
                        content: 'aloha test'
                    },
                    {
                        name: 'description',
                        content: 'test meta tags'
                    }
                ]
            },

            '/{test}/test': {
                template: '/views/example/template.html',
                controllers: [
                    'exampleController',
                    'exampleController2'
                ],
                title: 'test'
            },
        },
        controllers: [
            {
                name: 'exampleController', 
                url: '/js/controllers/exampleController.js', 
                settings: {
                    id: 'example',
                    url: '/views_compiled/example/index.json',
                    onError: '<div style="color: red">Error</div>',
                    showOnLoad: true,
                    parent: 'first'
                }
            },
            {
                name: 'exampleController2', 
                url: '/js/controllers/exampleController.js', 
                settings: {
                    id: 'example2',
                    url: '/views_compiled/example/index.json',
                    onError: '<div style="color: red">Error</div>',
                    showOnLoad: true,
                    parent: 'second'
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