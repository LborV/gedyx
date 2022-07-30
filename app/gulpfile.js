const minify = require('gulp-minify');
const { src, dest } = require('gulp');
const run = require('gulp-run'); 
const gulp = require('gulp');

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
        .pipe(dest('public/build/kernel/'));
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
        .pipe(dest('public/build/js/'));
}

function minifyControllers() {
    return src([
        'public/js/controllers/*.js',
    ])
    .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        }
    }))
    .pipe(dest('public/build/js/controllers/'));
}

gulp.task('compileKernel', () => {
    return minifyClientCore();
});

gulp.task('compileViews', () => {
    return run('npm run compile:views').exec();
});

gulp.task('compileControllers', () => {
    return minifyControllers();
});

gulp.task('compileConfiguration', () => {
    return minifyClientConfiguration();
});

gulp.task('watch', function() {
    // Kernel
    gulp.watch(['public/kernel/*.js',], {delay: 500}, gulp.series(['compileKernel']));

    // Configuration
    gulp.watch(['public/js/*.js'], {delay: 500}, gulp.series(['compileConfiguration']));

    // Controllers
    gulp.watch(['public/js/controllers/**/*.js'], {delay: 500}, gulp.series(['compileControllers']));

    // Views
    gulp.watch(['public/views/**/*.html'], {delay: 500}, gulp.series(['compileViews']));
});