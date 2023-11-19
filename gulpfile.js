const gulp = require('gulp')
const clean = require('gulp-clean')
const pump = require('pump')
const htmlmin = require('gulp-htmlmin')
const cleanCss = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel'),
    uglify = require('gulp-uglify')

const buildPathName = 'build';
const path = {
    images: {
        src: 'src/images/**/*',
        dest: `${buildPathName}/images`
    },
    html: {
        src: 'src/**/*.html',
        dest: `${buildPathName}/`
    },
    css: {
        src: 'src/**/*.css',
        dest: `${buildPathName}`
    },
    js: {
        src: 'src/**/*.js',
        dest: `${buildPathName}`
    },
    json: {
        src: 'src/**/*.json',
        dest: `${buildPathName}`
    },
    locales: {
        src: 'src/_locales/**/*',
        dest: `${buildPathName}/_locales`
    }
}

const moveImages = () => {
    return gulp.src(path.images.src)
        .pipe(gulp.dest(path.images.dest))
}

const moveJson = () => {
    return gulp.src(path.json.src)
        .pipe(gulp.dest(path.json.dest))
}

const moveLocales = () => {
    return gulp.src(path.locales.src)
        .pipe(gulp.dest(path.locales.dest))
}

const css = () => {
    return gulp.src(path.css.src)
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(gulp.dest(path.css.dest))
}
const js = () => {
    return gulp.src(path.js.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.js.dest))
}

const html = () => {
    return gulp.src(path.html.src)
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: false,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest(path.html.dest))
}

const cleanBuild = () => {
    return pump([
        gulp.src(`./${buildPathName}`),
        clean()
    ])
}
const watch = () => {
    gulp.watch(path.images.src, moveImages)
    gulp.watch(path.images.src, moveJson)
    gulp.watch(path.images.src, moveLocales)
    gulp.watch(path.html.src, html)
    gulp.watch(path.css.src, css)
    gulp.watch(path.js.src, js)
}

// module.exports = {
//     html,
//     js,
//     css,
//     watch
// }

module.exports.default = gulp.series(cleanBuild, gulp.parallel(moveImages, html, js, css, moveJson, moveLocales, watch))
module.exports.build = gulp.series(cleanBuild, gulp.parallel(moveImages, html, js, css, moveJson, moveLocales))