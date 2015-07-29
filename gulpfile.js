var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

gulp.task('minify', function() {
	return gulp.src("chronopic.js")
	.pipe(concat('chronopic.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('.'));
});

gulp.task('validate', [], function() {
	return gulp.src(["chronopic.js", "i18n/*.js"])
	.pipe(jshint({ expr: true }))
	.pipe(jshint.reporter('default'));
});

gulp.task('default', [
	'validate',
	'minify'
]);

gulp.task('watch', function() {
	gulp.watch(sources, ['default']);
});
