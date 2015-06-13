/// <reference path="typings/gulp/gulp.d.ts" />
/// <reference path="typings/gulp-autoprefixer/gulp-autoprefixer.d.ts" />
/// <reference path="typings/gulp-concat/gulp-concat.d.ts" />
/// <reference path="typings/gulp-minify-css/gulp-minify-css.d.ts" />
/// <reference path="typings/gulp-sourcemaps/gulp-sourcemaps.d.ts" />
/// <reference path="typings/gulp-typescript/gulp-typescript.d.ts" />

var paths = {
	src: {
		sprites: 'public/assets/img/sprites/*.png',
        images: 'public/assets/img/*.png',
		less: 'public/assets/css/less/*.less',
        scripts: {
            lib: 'public/assets/js/lib/*.js'
        },
        typescripts: 'public/assets/ts/*.ts'
	},
	dist: './public/build'
},
	gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
	imagemin = require('gulp-imagemin'),
	less = require('gulp-less'),
	//livereload = require('gulp-livereload'),
	//lr = require('tiny-lr'),
	minify = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
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
	//,server = lr();

gulp.plumbedSrc = function( ){
  return gulp.src.apply(gulp, arguments)
    .pipe(plumber(gutil.log));
};

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

gulp.task('jslib', function(){
	return pipe(
		gulp.plumbedSrc(paths.src.scripts.lib),
		concat('lib.js'),
		gulp.dest(paths.dist + '/js'),
		uglify(),
		rename('lib.min.js'),
		gulp.dest(paths.dist + '/js')
		//,livereload(server)
	);
});

gulp.task('ts', function() {
    var tsResult = gulp.plumbedSrc(paths.src.typescripts)
                    .pipe(ts({ typescript: require('typescript'), target: 'ES5', module: 'commonjs' }));
    tsResult.js.pipe(gulp.dest(paths.dist + '/ts'))
        .pipe(concat('pubts.js'))
        .pipe(gulp.dest(paths.dist + '/ts'))
        .pipe(uglify())
        .pipe(rename('pubts.min.js'))
        .pipe(gulp.dest(paths.dist + '/ts'));
    /*return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe(gulp.dest(paths.dist + '/js/typings')),
        tsResult.js.pipe(gulp.dest(paths.dist + '/js'))
    ]);*/
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

gulp.task('livereload', function() {
    /*server.listen(35729, function(err) {
        if (err) {
            return console.log(err);
        }
    });*/
});

gulp.task('watchlib', function(){
    gulp.watch(paths.src.scripts.lib, ['jslib']);    
});

gulp.task('watch', function() {
    gulp.watch(paths.src.typescripts, ['ts']);
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

//'livereload'
gulp.task('default', ['watch', 'serve']);
gulp.task('watchall', ['watch', 'watchlib', 'serve']);
gulp.task('stage', ['watch', 'pm2']);
gulp.task('build', runSequence('sprite', 'less', ['images', 'jslib']));
//'fonts'