const autoprefixer = require('autoprefixer');
const psImport = require('postcss-import');
const cssnano = require('cssnano')

module.exports = {
  plugins: [
    psImport,
    autoprefixer({
      // browsers: ['>0%']
      browsers: ['Firefox > 30']
    }),
    cssnano // 压缩动作放在最后。
  ]
};
