/// <reference path="typings/gulp/gulp.d.ts" />
/// <reference path="typings/gulp-autoprefixer/gulp-autoprefixer.d.ts" />
/// <reference path="typings/gulp-concat/gulp-concat.d.ts" />
/// <reference path="typings/gulp-minify-css/gulp-minify-css.d.ts" />
/// <reference path="typings/gulp-sourcemaps/gulp-sourcemaps.d.ts" />
/// <reference path="typings/gulp-typescript/gulp-typescript.d.ts" />
/// <reference path="typings/browserify/browserify.d.ts" />

var assets = __dirname + '/public/assets/';

var paths = {
	src: {
		sprites: assets + 'img/sprites/*.png',
        images: assets + 'img/*.png',
		less: assets + 'css/less/*.less',
        scripts: {
            basedir: assets + 'scripts',
            lib: assets + '/scripts/lib/**/*.js',
            main: 'index.ts'
        }
	},
    cliententrypoint: 'app.js',
	dist: 'public/build'
},
    browserify = require('browserify'),
    tsify = require('tsify'),
    watchify = require('watchify'),
    //debowerify = require('debowerify'),
    _ = require('lodash'),
	gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    prefixer = require('gulp-autoprefixer'),
	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
	imagemin = require('gulp-imagemin'),
	less = require('gulp-less'),
	minify = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
	pipe = require('multipipe'),
	spritesmith = require('gulp.spritesmith'),
    //ts = require('gulp-typescript'),
    merge = require('merge2'),
    pm2 = require('pm2'),
	runSequence = require('run-sequence');

gulp.plumbedSrc = function(){
  return gulp.src.apply(gulp, arguments)
    .pipe(plumber(gutil.log));
};

var browserifyOpts = {
  basedir: paths.src.scripts.basedir,
  debug: true
};
var opts = _.assign({}, watchify.args, browserifyOpts);
var bf = browserify({basedir: paths.src.scripts.basedir});
var wf = watchify(bf)
//Require from bower_components and expose as the package name used by BOTH TypeScript and Browserify
    .require(__dirname + '/bower_components/threejs/build/three.js', { expose: 'three' })
    .add(paths.src.scripts.basedir + '/' + paths.src.scripts.main)
    .plugin(tsify);
    //.transform(debowerify);
    
function bundle(){
    return wf.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(paths.cliententrypoint))
        .pipe(gulp.dest(paths.dist + '/js'));
}

gulp.task('js', bundle);
wf.on('update', bundle);
wf.on('log', gutil.log);

//Compile lib files which don't cooperate with CommonJS or Browserify, so should be compiled into a separate lib JS
gulp.task('jslib', function(){
	return pipe(
		gulp.plumbedSrc(paths.src.scripts.lib),
		concat('lib.js'),
		gulp.dest(paths.dist + '/js'),
		uglify(),
		rename('lib.min.js'),
		gulp.dest(paths.dist + '/js')
	);
});

gulp.task('less', function() {
    return pipe(
        gulp.plumbedSrc([paths.src.less, paths.dist + '/css/sprite.css']),
        sourcemaps.init(),
        less(),
        sourcemaps.write(),
        prefixer('last 2 versions', 'ie 8'),
        concat('main.css'),
        gulp.dest(paths.dist + '/css'),
        minify(),
        rename('main.min.css'),
        gulp.dest(paths.dist + '/css')
        //,livereload(server)
    );
});

gulp.task('images', function() {
    return pipe(
        gulp.plumbedSrc(paths.src.images),
        changed(paths.dist + '/img'),
        imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }),
        gulp.dest(paths.dist + '/img')
    );
});

gulp.task('sprite', function() {
    var spriteData = gulp.plumbedSrc(paths.src.sprites).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return merge([
        spriteData.img.pipe(gulp.dest(paths.dist + "/css")),
        spriteData.css.pipe(gulp.dest(paths.dist + "/css"))
    ]);    
});

gulp.task('watch', function() {
    gulp.watch(paths.src.images, ['images']);
    gulp.watch(paths.src.less, function() {
        runSequence('sprite', 'less');
    });
    gulp.watch(paths.src.sprites, function() {
        runSequence('sprite', 'less');
    });
    //gulp.watch(paths.src.fonts, ['fonts']);
});

gulp.task('pm2', function(){
    pm2.connect(function() {
        pm2.start({
            script    : 'bin/www',         // Script to be run 
            //exec_mode : 'cluster',        // Allow your app to be clustered 
            //instances : 2,                // Optional: Scale your app by 4 
            //max_memory_restart : '100M'   // Optional: Restart your app if it reaches 100Mo 
        }, function(err, apps) {
            pm2.disconnect();
        });
    });
});

gulp.task('serve', function () {
  nodemon({
    script: 'bin/www',
    ext: 'js html jade',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('default', ['jslib', 'js', 'watch', 'serve']);
gulp.task('stage', ['js', 'watch', 'pm2']);
gulp.task('build', ['sprite', 'less', 'images', 'jslib', 'js']);