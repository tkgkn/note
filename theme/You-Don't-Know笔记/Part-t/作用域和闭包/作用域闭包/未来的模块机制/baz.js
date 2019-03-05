// 导入完整的"foo"和"bar"模块
// module 会将整个模块的API导入并绑定到一个变量上
module foo from "foo";
module bar from "bar";

console.log(
	bar.hello("rhino")
);

foo.awesome();