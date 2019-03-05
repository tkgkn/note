// 仅从"bar" 模块导入hello()，别的不要
// import 会将一个模块中的一个或多个API导入到当前作用域中
import hello from "bar";
var hungry = "hippo";
function awesome(){
	console.log(
		hello(hungry).toUpperCase()
	);
}
// export将当前模块的一个标识符导出为公共API
export awesome;