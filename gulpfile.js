var gulp = require('gulp');

var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var csso = require('gulp-csso');

gulp.task('minify-js', function() {
	return gulp.src("chronopic.js")
	.pipe(uglify())
	.pipe(gulp.dest('./dist'));
});

gulp.task('minify-i18n', function() {
	return gulp.src('src/i18n/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('./dist/i18n'));
});

gulp.task('minify-css', function() {
	return gulp.src('src/css/*.css')
	.pipe(csso())
	.pipe(gulp.dest('./dist/css'));
});

gulp.task('minify', [
	'minify-js',
	'minify-i18n',
	'minify-css'
]);

gulp.task('validate', function() {
	return gulp.src(["src/*.js", "src/**/*.js"])
	.pipe(jshint({ expr: true }))
	.pipe(jshint.reporter('default'));
});

gulp.task('default', [
	'validate',
	'minify'
]);

gulp.task('watch', function() {
	gulp.watch("src/*", "src/**/*", ['default']);
});
