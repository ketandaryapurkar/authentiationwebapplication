/**
 * Created by 212612730 on 7/9/2017.
 */
var gulp = require('gulp');

var sass = require('gulp-sass');

gulp.task('hello', function() {
    console.log('Hello Zell');
});

gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass())
        .pipe(gulp.dest('CabServiceBeta1.0/css'))
});