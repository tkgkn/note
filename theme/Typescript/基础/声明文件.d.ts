// 第三方，或者自己编写的一些声明文件，这样我们就可以获取到第三方或者自己编写的库一些功能，如提示，代码跳转等

// 通过declare声明

// 声明全局，
// 变量声明有const let var
declare const jQuery: (selector: string) => any


// 函数声明，支持函数重载
declare function jQuery2(selector: string): any
declare function jQuery2(selector: number): any

// 类声明
declare class Animal {
  name: string
  constructor(name: string);
  sayHi(): string;
}