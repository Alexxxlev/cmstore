// Импорт пакетов
const gulp = require('gulp')
// const less = require('gulp-less')
// const stylus = require('gulp-stylus')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
// const ts = require('gulp-typescript')
//const coffee = require('gulp-coffee')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
//const gulppug = require('gulp-pug')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const del = require('del')
const order = require('gulp-order')
const gcmq = require('gulp-group-css-media-queries')
const plumber = require('gulp-plumber')
const svgstore = require('gulp-svgstore')
const svgmin = require('gulp-svgmin')
const include = require("gulp-include")
const pathFnc = require('path')
// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
  html: {
    src: ['src/*.html', 'src/*.pug'],
    dest: 'dist/'
  },
  htmlTemp: {
    src: ['src/*.html', 'src/**/*.html', 'src/*.pug'],
    dest: 'dist/'
  },
  htmlAjax: {
    src: ['src/ajax/*.html', 'src/ajax/*.pug'],
    dest: 'dist/'
  },
  styles: {
    src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.styl', 'src/styles/**/*.less', 'src/styles/**/*.css'],
    dest: 'dist/css/'
  },
  scripts: {
    // src: ['src/scripts/**/*.coffee', 'src/scripts/**/*.ts', 'src/scripts/**/*.js'],
    src: 'src/js/parts/*.js',
    src_vendor: 'src/js/vendors/*.js',
    src_back: 'src/js/back/*.js',
    src_libs: 'src/js/libs/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'dist/fonts/'
  },
  svgIcons: {
    src: 'src/img/sprite/**/*.*',
    dest: 'dist/img/sprite/'
  } 
}

// Очистить каталог dist, удалить все кроме изображений
function clean() {
  return del(['dist/*', '!dist/img'])
}

// Обработка html и pug
function html() {
  return gulp.src(paths.htmlTemp.src)
  //.pipe(gulppug())
  .pipe(include())
  .pipe(htmlmin({ collapseWhitespace: false }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browsersync.stream())
}

// Обработка препроцессоров стилей
function styles() {
  return gulp.src(paths.styles.src)
  
  .pipe(order([
      "vendors/**/*.scss",
      "mixin.scss",
      "settings.scss",
      "fonts.scss",
      "base.scss",
      "UI.scss",
      "layout/**/*.scss"
  ]))
  .pipe(sourcemaps.init())
  //.pipe(less())
  //.pipe(stylus())
  .pipe(concat("style.scss"))
  .pipe(sass({
      includePaths: ['src/style/style.scss'],
      outputStyle: 'expanded',
      sourceMap: false,
      errLogToConsole: true
  }))
  .pipe(gcmq())
  
  .pipe(autoprefixer({
    cascade: false
  }))

  
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(rename({
    basename: 'style',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browsersync.stream())
  .pipe(plumber())
}

// Обработка Java Script, Type Script и Coffee Script 
async function scripts() {
  gulp.src(paths.scripts.src)
    
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));

  gulp.src(paths.scripts.src_vendor)
    .pipe(concat("vendors.js"))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(rename('vendors.min.js'))
    .pipe(plumber())
    .pipe(gulp.dest(paths.scripts.dest));
		
  gulp.src(paths.scripts.src_back)
    .pipe(concat("back.js"))
    .pipe(plumber())
    .pipe(gulp.dest(paths.scripts.dest));

  gulp.src(paths.scripts.src_libs)
    .pipe(plumber())
    .pipe(gulp.dest(paths.scripts.dest));

  await Promise.resolve('script ok')
}

// Сжатие изображений
function img() {
  return gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.images.dest))
}

function svg() {
  return gulp.src(paths.svgIcons.src)
    .pipe(svgmin(function(file) {
      let prefix = pathFnc.basename(file.relative, pathFnc.extname(file.relative));
      return {
          plugins: [{
              cleanupIDs: {
                  prefix: prefix + '-',
                  minify: true
              }
          }]
      }
  }))
  .pipe(rename({
      prefix: 'icon-'
  }))
  .pipe(svgstore())
  .pipe(gulp.dest(paths.images.dest))

}

async function fonts() {
  gulp.src(paths.fonts.src)
      .pipe(gulp.dest(paths.fonts.dest))
  await Promise.resolve('fonts ok')
}

// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
  browsersync.init({
    server: {
        baseDir: "./dist"
    }
  })
  gulp.watch(paths.htmlTemp.dest).on('change', browsersync.reload)
  gulp.watch(paths.htmlTemp.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
  gulp.watch(paths.svgIcons.src, svg)
  gulp.watch(paths.fonts.src, fonts)
}


// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean

exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.svg = svg
exports.fonts = fonts
exports.watch = watch

// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, html, gulp.parallel(styles, scripts, img, svg, fonts), watch)

