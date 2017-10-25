// TODO 3 - include gulp
const gulp = require('gulp')
// TODO 4.1 - include gulp-uglify
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer')
// TODO 6.3a - include browserSync
const browserSync = require('browser-sync')
// TODO 4.2 - uglify / minify JavaScript
gulp.task('minify', () => {
  gulp
    .src('js/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('build'))
})

gulp.task('processCSS', () => {
  gulp
    .src('styles/main.css')
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe(gulp.dest('build'))
})
// TODO 6.1 - add default tasks
gulp.task('default', ['serve'])
// TODO 6.2 - watch files
gulp.task('watch', () => {
  gulp.watch('styles/*.css', ['processCSS'])
  gulp.watch('js/*.js', ['minify'])
})
// TODO 6.3b - run a local server
gulp.task('serve', ['processCSS'], function() {
  browserSync.init({
    server: '.',
    port: 3000,
  })
  gulp.watch('styles/*.css', ['processCSS']).on('change', browserSync.reload)
  gulp.watch('*.html').on('change', browserSync.reload)
  gulp.watch('js/*.js', ['minify']).on('change', browserSync.reload)
})
