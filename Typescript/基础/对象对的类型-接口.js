"use strict";
exports.__esModule = true;
var filename = '对象的类型';
var tom = {
    name: 'tom',
    age: 25
};
// 不能缺少接口定义的属性
var tom2 = {
    name: 'tom'
};
// 也不能多
var tom3 = {
    name: 'tom3',
    sex: 'boy'
};
var dog = {
    name: '旺财',
    sex: 'boy'
};
var dog2 = {
    name: '走运'
};
var car = {
    price: 10000,
    color: 'blue'
};
var car2 = {
    price: 20000,
    type: '货车',
    color: 'red'
};
var box = {
    shape: '正方形',
    size: '大',
    use: 1 // 不能将number类型赋给string
};
exports["default"] = filename;
