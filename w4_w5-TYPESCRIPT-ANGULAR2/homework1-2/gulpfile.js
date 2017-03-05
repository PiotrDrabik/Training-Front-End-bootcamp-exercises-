var gulp = require('gulp');
var less = require('gulp-less');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var sourceMaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var tap = require("gulp-tap");
var browserify = require('browserify');
var tsify = require('tsify');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var gutil = require('gulp-util');

var config = {
	applicationDir: __dirname + '/app',
	stylesDir: __dirname + '/styles',
	publicDir: __dirname + '/public'
};

// ====== APPLICATION

gulp.task('compile-js', function () {
	gulp.src(config.applicationDir + '/application.ts', { read: false })
		.pipe(plumber())
		.pipe(tap(function (file) {
			var d = require('domain').create();

			d.on("error", function (err) {
				gutil.log(
					gutil.colors.red("Browserify compile error:"),
					err.message,
					"\n\t",
					gutil.colors.cyan("in file"),
					file.path
				);
			});

			d.run(function () {
				file.contents = browserify({
					basedir: config.applicationDir,
					debug: true
				})
					.add(file.path)
					.plugin(tsify)
					.bundle();
			});
		}))
				.pipe(rename('application.js'))
				.pipe(gulp.dest(config.publicDir))
				.pipe(connect.reload());
});


// ====== STYLES

gulp.task('compile-css', function () {
	return gulp.src(config.stylesDir + '/index.less')
		.pipe(plumber({
			errorHandler: function (err) {
            gutil.log(
							gutil.colors.red("Less compile error:"),
							err.message,
							"\n\t",
							gutil.colors.cyan("in file"),
							err.fileName
						);
            this.emit('end');
        }
    }))
		.pipe(sourceMaps.init())
		.pipe(less({ paths: [config.stylesDir] }))
		.pipe(rename('style.css'))
		.pipe(sourceMaps.write('.'))
		.pipe(gulp.dest(config.publicDir))
		.pipe(connect.reload());
});

gulp.task('watch', ['build'], function () {
	gulp.watch(config.stylesDir + '/*', ['compile-css']);
	gulp.watch(config.applicationDir + '/*', ['compile-js']);
	watch(config.publicDir + '/index.html').pipe(connect.reload());
});

gulp.task('webserver', function () {
  connect.server({
		root: config.publicDir,
    livereload: true
  });
});


gulp.task('build', ['compile-js', 'compile-css']);
gulp.task('serve', ['webserver']);

gulp.task('default', ['build', 'webserver', 'watch']);