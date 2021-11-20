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

(async () => {
    minifyClientCore();

    // Write Your own code here
})();