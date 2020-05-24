const path = require('path');
const fs = require('fs');

// promise化err first风格函数
function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...results) {
        if (err) {
          reject(err);
        } else {
          resolve(manyArgs ? results : results[0]);
        }
      }
      args.push(callback);
      f.apply(this, args);
    });
  };
}

const stat = promisify(fs.stat);
const readDir = promisify(fs.readdir);

// 递归生成目录配置
async function createSiderBar(
  project,
  excludeDir = [
    '.vuepress',
    'node_modules',
    'guide',
    '.git',
    // '2018',
    // 'ES6-Learn',
    "You-Don't-Know笔记",
  ]
) {
  const paths = [];
  async function traverse(dirs, parentChildRef) {
    // 获取当前目录文件和文件名
    const curFilesAndDirs = await readDir(dirs);
    for (let i = 0; i < curFilesAndDirs.length; i++) {
      const childRef = [];
      const item = curFilesAndDirs[i];
      if (excludeDir.includes(item)) {
        continue;
      }
      const checkFileOrDirPath = path.resolve(__dirname, dirs, `${item}`);
      const stats = await stat(checkFileOrDirPath);
      if (stats.isDirectory()) {
        // 往子目录还是第一级目录里插入
        let pushTarget = parentChildRef || paths;
        pushTarget.push({
          title: item,
          collapsable: true,
          sidebarDepth: 1,
          children: childRef,
        });
        await traverse(checkFileOrDirPath, childRef);
      } else {
        const ext = path.extname(checkFileOrDirPath).toLocaleLowerCase();
        if (ext === '.md') {
          parentChildRef &&
            parentChildRef.push({
              title: item.replace(/\.md$/, ''),
              path: checkFileOrDirPath.replace(
                path.resolve(__dirname, '..'),
                ''
              ),
            });
        }
      }
    }
  }
  await traverse(project);
  return paths;
}

function handleZeroArr(data) {
  for (let i = data.length - 1; i >= 0; i--) {
    const item = data[i];
    if (!item.children) {
      continue;
    }
    if (item.children.length === 0) {
      data.splice(i, 1);
    } else {
      handleZeroArr(item.children);
    }
  }
}

createSiderBar('../')
  .then((res) => {
    // 遍历res，处理children = []时，置为null
    handleZeroArr(res);

    fs.writeFileSync(
      path.resolve(__dirname, './sidebar.json'),
      JSON.stringify(res)
    );
  })
  .catch((err) => {
    console.log(err);
  });
