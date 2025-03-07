const {series, parallel, src, dest} = require('gulp'); // npm install --global gulp-cli
const gulp = require('gulp'); // npm install --save-dev gulp
const less = require('gulp-less'); // npm install gulp-less --save-dev
const browserSync = require('browser-sync').create(); // npm install browser-sync --save-dev
const svgstore = require('gulp-svgstore'); // npm install gulp-svgstore --save-dev
const svgmin = require('gulp-svgmin'); // npm install gulp-svgmin --save-dev
const inject = require('gulp-inject'); // npm install gulp-inject --save-dev
const path = require('path'); // installed with npm install gulp -g
const autoprefixer = require('gulp-autoprefixer'); // npm install --save-dev gulp-autoprefixer

// function addHtml (source, folder) {
//     return gulp
//         .src(source)
//         .pipe(gulp.dest(folder));
// }
//
// gulp.task('html', addHtml('./index.html', 'dist'));
//
// gulp.task('ya-html', addHtml('./yandex/index.html', 'dist/yandex/'));
//
// gulp.task('m-html', addHtml('./mail/index.html', 'dist/mail/'));

gulp.task('prebuild', async function () {
    const yandexAssets = gulp
        .src('./yandex/assets/**/*')
        .pipe(gulp.dest('dist/yandex/assets'))

    const mailAssets = gulp
        .src('./mail/assets/**/*')
        .pipe(gulp.dest('dist/mail/assets'))

    const cssTricksAssets = gulp
        .src('./css-tricks/assets/**/*')
        .pipe(gulp.dest('dist/css-tricks/assets'));
});

gulp.task("html", function () {
    return gulp
        .src('./index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task("css", function () {
    return gulp
        .src('./main.css')
        .pipe(gulp.dest('dist'));
});

gulp.task("ya-html", function () {
    return gulp
        .src('./yandex/index.html')
        .pipe(gulp.dest('dist/yandex/'));
});

gulp.task("m-html", function () {
    return gulp
        .src('./mail/index.html')
        .pipe(gulp.dest('dist/mail/'));
});

gulp.task("ct-html", function () {
    return gulp
        .src('./css-tricks/index.html')
        .pipe(gulp.dest('dist/css-tricks/'));
});

gulp.task('ya-svgstore', function () {
    const svgs = gulp
        .src('./yandex/assets/icons/**/*.svg')
        .pipe(svgmin(function (file) {
            const prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    {
                        removeTitle: true
                    },
                    {
                        removeAttrs: {
                            attrs: "(stroke)"
                        }
                    },
                    {
                        removeStyleElement: true
                    },
                    {
                        cleanupIDs: {
                            prefix: prefix,
                            minify: true
                        }
                    }
                ]
            }
        }))
        .pipe(svgstore({inlineSvg: true}));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('./yandex/index.html')
        .pipe(inject(svgs, {transform: fileContents}))
        .pipe(gulp.dest('yandex'));
});

gulp.task('m-svgstore', function () {
    const svgs = gulp
        .src('./mail/assets/icons/**/*.svg')
        .pipe(svgmin(function (file) {
            const prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    {
                        removeTitle: true
                    },
                    {
                        removeStyleElement: true
                    },
                    {
                        cleanupIDs: {
                            prefix: prefix,
                            minify: true
                        }
                    }
                ]
            }
        }))
        .pipe(svgstore({inlineSvg: true}));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('./mail/index.html')
        .pipe(inject(svgs, {transform: fileContents}))
        .pipe(gulp.dest('mail'));
});

gulp.task('ct-svgstore', function () {
    const svgs = gulp
        .src('./css-tricks/assets/icons/**/*.svg')
        .pipe(svgmin(function (file) {
            const prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    {
                        removeTitle: true
                    },
                    {
                        removeStyleElement: true
                    },
                    {
                        cleanupIDs: {
                            prefix: prefix,
                            minify: true
                        }
                    }
                ]
            }
        }))
        .pipe(svgstore({inlineSvg: true}));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('./css-tricks/index.html')
        .pipe(inject(svgs, {transform: fileContents}))
        .pipe(gulp.dest('css-tricks'));
});

gulp.task('ya-less', function () {
    return src('./yandex/assets/styles/main.less')
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest('dist/yandex/'));
});

gulp.task('m-less', function () {
    return src('./mail/assets/styles/main.less')
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest('dist/mail/'));
});

gulp.task('ct-less', function () {
    return src('./css-tricks/assets/styles/main.less')
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest('dist/css-tricks/'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("./yandex/assets/styles/**/*.less").on("change", series("ya-less"));
    gulp.watch("./mail/assets/styles/**/*.less").on("change", series("m-less"));
    gulp.watch("./css-tricks/assets/styles/**/*.less").on("change", series("ct-less"));
    gulp.watch("./yandex/assets/styles/**/*.less").on("change", browserSync.reload);
    gulp.watch("./mail/assets/styles/**/*.less").on("change", browserSync.reload);
    gulp.watch("./css-tricks/assets/styles/**/*.less").on("change", browserSync.reload);
    gulp.watch("./yandex/index.html").on("change", series("ya-html"));
    gulp.watch("./mail/index.html").on("change", series("m-html"));
    gulp.watch("./css-tricks/index.html").on("change", series("ct-html"));
    gulp.watch("./yandex/index.html").on("change", browserSync.reload);
    gulp.watch("./mail/index.html").on("change", browserSync.reload);
    gulp.watch("./css-tricks/index.html").on("change", browserSync.reload);
});

gulp.task('default', series(parallel('html', 'css', 'ya-html', 'm-html', 'ct-html', 'ya-less', 'm-less', 'ct-less',
    'ya-svgstore', 'm-svgstore', 'ct-svgstore', 'prebuild'), 'serve'));