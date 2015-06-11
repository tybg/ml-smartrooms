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
		scripts: 'public/assets/js/*.js',
        typescripts: 'public/assets/ts/*.ts'
	},
	dist: './public/build'
},
	gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	less = require('gulp-less'),
	//livereload = require('gulp-livereload'),
	//lr = require('tiny-lr'),
	minify = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
	rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	pipe = require('multipipe'),
	spritesmith = require('gulp.spritesmith'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    pm2 = require('pm2'),
	runSequence = require('run-sequence');
	//,server = lr();

gulp.task('less', function() {
    return pipe(
        gulp.src([paths.src.less, paths.dist + '/css/sprite.css']),
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

gulp.task('js', function(){
	return pipe(
		gulp.src(paths.src.scripts),
		concat('pub.js'),
		gulp.dest(paths.dist + '/js'),
		uglify(),
		rename('pub.min.js'),
		gulp.dest(paths.dist + '/js')
		//,livereload(server)
	);
});

gulp.task('ts', function() {
    var tsResult = gulp.src(paths.src.typescripts)
                    .pipe(ts({ typescript: require('typescript') }));
    tsResult.js.pipe(gulp.dest(paths.dist + '/js'));
    /*return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe(gulp.dest(paths.dist + '/js/typings')),
        tsResult.js.pipe(gulp.dest(paths.dist + '/js'))
    ]);*/
});

gulp.task('images', function() {
    return pipe(
        gulp.src(paths.src.images),
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
    var spriteData = gulp.src(paths.src.sprites).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    spriteData.img.pipe(gulp.dest(paths.dist + "/css"));
    spriteData.css.pipe(gulp.dest(paths.dist + "/css"));
});

gulp.task('livereload', function() {
    /*server.listen(35729, function(err) {
        if (err) {
            return console.log(err);
        }
    });*/
});

gulp.task('watch', function() {
    gulp.watch(paths.src.scripts, ['js']);
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
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  });
});

//'livereload'
gulp.task('default', ['watch', 'serve']);
gulp.task('stage', ['watch', 'pm2']);
gulp.task('build', runSequence('sprite', 'less', ['images', 'js']));
//'fonts'