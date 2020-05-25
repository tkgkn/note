/*
 * @Description:
 * @Author: 小明
 * @Date: 2019-09-02 17:03:22
 * @LastEditors: 小明
 * @LastEditTime: 2019-09-02 17:05:24
 */
function createArr(length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArr(3, 'abc');
