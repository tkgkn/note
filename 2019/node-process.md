# node 查询和关闭进程

手头的 electron 项目，需要查询并关闭另外的程序，程序本身虽然是通过子进程方式启动，但是启动的仅是个壳，壳本身又自己启动了另一个程序 Z，导致无法通过子进程启动后的句柄拿到真正启动的程序 Z。所以无法监控到程序 Z 目前是开启还是关闭的。

解决方法就是 node 子进程模块的 `spawn`  去执行 windows 的 cmd 命令。该项目只在 windows 电脑运行，所以要用 windows 的命令行而非 liunx 命令。

> 这里项目本身只在 windows 运行，所以执行的命令应该是 windows 下的，而不是 linux 命令。比如列出当前目录文件，windows 下用的是 `dir` ，而 linux 下用的是 `ls` 。两者是不同的，因为我的电脑安装了 `cmder` ，即可以调用 windows 命令也可以调用 linux 命令。win10 的话有 powershell，可能能支持 linux 命令

直接在 cmd 里面运行查找进程的命令的话，是这样的：

```javascript
tasklist | findstr /i chrome.exe
// tasklist 查找系统进程后，查找的内容通过管道符 | 传递给另一个命令 findstr ，这个命令接收参数，这里接受了忽略大小写，然后查找chrome.exe关键字，并返回结果。
```

这里的 `/i`  意味忽略大小写。

> 另外要注意的是，查找进程名字如果很长的话，通过上面的命令，查找出来的进程名字会被截取，限制了 25 个字符好像。所以可以加另一个参数给 tasklist， `/fo csv`  以该模式输出，避免查找出的结果被截取。这样查找后的结果，是自带""的，如： `"YoudaoDict.exe","5324","Console","1","37,028 K"`

开始说正题，node 的子进程模块提供了 `exec`  和 `spawn` 2 种方式来调用，其中 `exec`  会起一个 shell 来执行传入的参数，而 `spawn`  不会起 shell。所以两种方法调用是有区别的。

<a name="U2KVo"></a>

##### exec 方式

```javascript
exec(`tasklist /fo csv | findstr /i YouDaoDict.exe`, (err, stdout, stderr) => {
  if (err) {
    console.log(`tasklist error: ${err}`);
    return;
  }
  console.log(`stdout ${stdout}`);
  console.log(`stderr ${stderr}`);
});
```

<a name="GAj2U"></a>

##### spawn 方式

相比上面的写法，略麻烦，注意 tasklist 和 findstr 是 2 个命令，正如上面解释的那样，是 tasklist 运行获取的值给到 findstr 在做的筛选。因此通过 spawn 的方式，需要这么写：

这里涉及到了 `stdin stdout`  的使用，看起来像个流，简单理解下 `stdin`  就是函数的入参， `stdout`  就是函数的返回值。

```javascript
const { spawn } = require('child_process');

const tasklist = spawn('tasklist', ['/fo', 'csv']);
const findstr = spawn('findstr', ['/i', 'AsmanVR-Win64-Shipping']);

tasklist.stdout.on('data', (data) => {
  // 往findstr的输入中写入 tasklist的输出数据。
  findstr.stdin.write(data);
});

tasklist.stderr.on('data', (data) => {
  console.error(`tasklist stderr: ${data}`);
});

tasklist.on('close', (code) => {
  if (code !== 0) {
    console.log(`tasklist进程退出，退出码：${code}`);
  }
  findstr.stdin.end();
});

findstr.stdout.on('data', (data) => {
  // 监听findstr的输出（就是运行返回的结果）
  console.log(data.toString()); // 这里就是真正获取到查询结果的地方。
});

findstr.stderr.on('data', (data) => {
  console.log(`findstr stderr: ${data}`);
});

findstr.on('close', (code) => {
  if (code !== 0) {
    console.log(`findstr进程退出，退出码：${code}`);
  }
});
```
