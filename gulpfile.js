var gulp = require("gulp");
var util = require('gulp-util');

var less = require('gulp-less');
var path = require('path');

// Standard handler
function standardHandler(err){
    // Notification
    var notifier = Notification();
    notifier.notify({ message: 'Error: ' + err.message });
    // Log to console
    util.log(util.colors.red('Error'), err.message);
}

// Less task
gulp.task('less', function () {
    gulp.src('./less/app.less')
        .pipe(less())
        .on('error', standardHandler)
        .pipe(gulp.dest('./app/css'));
// Just import into the app
//    gulp.src('./node_modules/bootstrap/less/bootstrap.less')
//        .pipe(less())
//        .on('error', standardHandler )
//        .pipe(gulp.dest('./app/css'));

});

// Watch tasks
gulp.task('watch-less', function () {
    gulp.watch(['./less/*.less'], ['less']);
});


//{
//    paths: [ path.join(__dirname, 'less', 'includes') ]
//}
