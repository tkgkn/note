const sidebar = require('./sidebar.json');

module.exports = {
  title: 'tkgkn',
  evergreen: true,
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/nprogress',
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-167546821-1',
      },
    ],
    '@vuepress/medium-zoom',
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'GitHub', link: '' },
    ],
    sidebar,
  },
  extraWatchFiles: [
    '.vuepress/styles/home-page-styl', // 使用相对路径
    '.vuepress/sidebar.json', // 目录结构，由脚本生成
  ],
};
