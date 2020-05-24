const sidebar = require('./sidebar.json');

module.exports = {
  title: 'tkgkn',
  evergreen: true,
  plugins: ['@vuepress/back-to-top', '@vuepress/nprogress'],
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
    '.vuepress/sidebar.json', // 配置文件改变
  ],
};
