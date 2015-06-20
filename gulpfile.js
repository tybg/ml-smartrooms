/// <reference path="typings/gulp/gulp.d.ts" />
/// <reference path="typings/gulp-autoprefixer/gulp-autoprefixer.d.ts" />
/// <reference path="typings/gulp-concat/gulp-concat.d.ts" />
/// <reference path="typings/gulp-minify-css/gulp-minify-css.d.ts" />
/// <reference path="typings/gulp-sourcemaps/gulp-sourcemaps.d.ts" />
/// <reference path="typings/gulp-typescript/gulp-typescript.d.ts" />
/// <reference path="typings/browserify/browserify.d.ts" />

var assets = __dirname + '/public/assets';
var distDir = __dirname + '/public/build';
var paths = {
	src: {
		sprites: assets + '/sprites/**/*.*',
        images: assets + '/img/**/*.*',
		less: assets + '/css/less/*.less',
        csslib: assets + '/css/lib/**/*.css',
        fonts: assets + '/fonts/**/*.*',
        scripts: {
            basedir: assets + '/scripts',
            //TypeScripts
            ts: assets + '/scripts/*.ts',
            //Uglify and concat these lib scripts into lib[.min].js
            lib: assets + '/scripts/lib/**/*.js',
            //Require.js and associated plugins/modules - to be copied to build/js!
            requires: assets + '/scripts/require/**/*.js',
            main: 'index.ts'
        }
	},
    cliententrypoint: 'app.js',
	dist: {
        basedir: distDir,
        scripts: distDir + '/scripts',
        styles: distDir + '/styles',
        fonts: distDir + '/fonts',
        images: distDir + '/images',
        sprites: distDir + '/sprites',
        files: distDir + '/**/*.*'
    }
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
    ignore = require('gulp-ignore'),
	imagemin = require('gulp-imagemin'),
	less = require('gulp-less'),
	minify = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    rimraf = require('gulp-rimraf'),
	rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
	pipe = require('multipipe'),
	spritesmith = require('gulp.spritesmith'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    pm2 = require('pm2'),
	runSequence = require('run-sequence');

gulp.plumbedSrc = function(){
  return gulp.src.apply(gulp, arguments)
    .pipe(plumber(gutil.log));
};

gulp.task('clean', function() {
  return gulp.src(paths.dist.files, { read: false })
    .pipe(rimraf());
});

gulp.task('ts', function() {
    var tsResult = gulp.plumbedSrc(paths.src.scripts.ts)
                    .pipe(ts({ typescript: require('typescript'), target: 'ES5', module: 'amd' }));
    tsResult.js.pipe(gulp.dest(paths.dist.scripts));
});

//Copy files from assets to dist as needed
gulp.task('copy', function(){
    return merge([
        gulp.plumbedSrc(paths.src.scripts.requires).pipe(gulp.dest(paths.dist.scripts)),
        gulp.plumbedSrc(paths.src.fonts).pipe(gulp.dest(paths.dist.fonts))        
    ]);
})

gulp.task('jslib', function(){
	return pipe(
		gulp.plumbedSrc(paths.src.scripts.lib),
		concat('lib.js'),
		gulp.dest(paths.dist.scripts),
		uglify(),
		rename('lib.min.js'),
		gulp.dest(paths.dist.scripts)
	);
});

gulp.task('csslib', function(){
	return pipe(
		gulp.plumbedSrc(paths.src.csslib),
		concat('lib.min.css'),
		gulp.dest(paths.dist.styles)
	);
});

gulp.task('less', function() {
    return pipe(
        gulp.plumbedSrc([paths.src.less, paths.dist.styles + '/sprite.css']),
        less(),
        sourcemaps.init(),
        prefixer(),        
        concat('main.css'),        
        gulp.dest(paths.dist.styles),
        minify(),
        rename('main.min.css'),
        sourcemaps.write('.'),
        gulp.dest(paths.dist.styles)
        //,livereload(server)
    );
});

gulp.task('images', function() {
    return pipe(
        gulp.plumbedSrc(paths.src.images),
        changed(paths.dist.images),
        imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }),
        gulp.dest(paths.dist.images)
    );
});

gulp.task('sprite', function() {
    var spriteData = gulp.plumbedSrc(paths.src.sprites).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return merge([
        spriteData.img.pipe(gulp.dest(paths.dist.styles)),
        spriteData.css.pipe(gulp.dest(paths.dist.styles))
    ]);    
});

gulp.task('watch', function() {
    gulp.watch(paths.src.scripts.ts, ['ts']);    
    gulp.watch(paths.src.images, ['images']);
    gulp.watch(paths.src.scripts.lib, ['jslib']);
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

//Compile TypeScripts and set up a basic development server using nodemon
gulp.task('default', function(cb){
    runSequence(['ts', 'watch', 'serve'], cb);
});

//Compile TypeScripts and set up PM2 to stage the app (not needed during development)
gulp.task('stage', function(cb){
    runSequence(['ts', 'watch', 'pm2']);
});

//Build the app only (no lib compilation or require file copying)
gulp.task('buildapp', function(cb){
   runSequence(['sprite', 'less', 'images', 'ts'], cb);
});

//Build ERRYTING
gulp.task('build', function(cb){
    runSequence('clean', ['copy', 'jslib', 'csslib'], 'buildapp', cb);
});