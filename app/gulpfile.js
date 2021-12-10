const minify = require('gulp-minify');
const { src, dest } = require('gulp');

function minifyClientCore() {
    return src([
            'public/kernel/Application.js',
            'public/kernel/Parser.js',
            'public/kernel/Controller.js',
        ])
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(dest('public/kernel/'));
}

function minifyClientConfiguration() {
    return src([
            'public/js/main.js',
            'public/js/routes.js',
            'public/js/controllers.js',
        ])
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(dest('public/js/'));
}

(async () => {
    minifyClientCore();
    minifyClientConfiguration();

    // Write Your own code here
})();