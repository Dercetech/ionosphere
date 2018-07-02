const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const watch = require('gulp-watch');
const through = require('through2');

const searchPatternFolder = 'src/app/**/*.i18n.json';
const outputFolder = path.join('src', 'assets', 'i18n');

gulp.task('default', () => {
  console.log('Ionosphere Gulp tasks');
  console.log(' > gulp i18n         builds the i18n file.');
  console.log(' > gulp i18n:watch   watches i18n file and trigger build.');
});

gulp.task('i18n:watch', () => watch(searchPatternFolder, { ignoreInitial: false }, () => gulp.start('i18n')));
gulp.task('i18n', done => processAll18nFiles(done));

function processAll18nFiles(done) {
  const dictionary = {};
  console.log('[i18n] Rebuilding...');
  gulp
    .src(searchPatternFolder)
    .pipe(
      through.obj((file, enc, next) => {
        const i18n = JSON.parse(file.contents.toString('utf8'));
        composeDictionary(dictionary, i18n.data, i18n.path.split('.'));
        next(null, file);
      })
    )
    .on('finish', () => {
      const writes = [];
      Object.keys(dictionary).forEach(langKey => {
        writes.push(writeDictionary(langKey, dictionary[langKey]));
      });
      Promise.all(writes)
        .then(data => done())
        .catch(err => console.log('ERROR ', err));
    });
}

function composeDictionary(dictionary, data, path) {
  Object.keys(data)
    .map(key => ({ key, data: data[key] }))
    .forEach(({ key, data }) => {
      if (isString(data)) {
        setDictionaryEntry(dictionary, key, path, data);
      } else {
        composeDictionary(dictionary, data, [...path, key]);
      }
    });
}

function isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

function initDictionaryEntry(key, dictionary) {
  if (!dictionary[key]) {
    dictionary[key] = {};
  }
  return dictionary[key];
}

function setDictionaryEntry(dictionary, langKey, path, data) {
  initDictionaryEntry(langKey, dictionary);
  let subDict = dictionary[langKey];
  path.forEach(subKey => {
    isLastToken = path[path.length - 1] === subKey;
    if (isLastToken) {
      subDict[subKey] = data;
    } else {
      subDict = initDictionaryEntry(subKey, subDict);
    }
  });
}

function writeDictionary(lang, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(outputFolder, lang + '.json'),
      JSON.stringify(data),
      'utf8',
      err => (err ? reject(err) : resolve())
    );
  });
}
