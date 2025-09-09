const { swap } = require("./chooseSort.js");

// function bubbleSort(arr) {
//     for(let i = 0; i < arr.length - 1; i ++) {
//         for(let j = i + 1; j < arr.length; j ++) {
//             if(arr[j] > arr[j + 1]) {
//                 swap(arr, j, j + 1)
//             }
//         }
//     }
//     return arr;
// }

// function bubbleSort(arr) {
//     for(let i = 0; i < arr.length - 1; i ++) { // 外层的循环控制的轮数
//         for(let j = 0; j < arr.length - 1; j ++) { // 内层的循环控制的才是对比
//             if(arr[j] > arr[j + 1]) {
//                 swap(arr, j, j + 1)
//             }
//         }
//     }
//     return arr;
// }

function bubbleSort(arr) {
    for(let i = 0; i < arr.length - 1; i ++) {
        for(let j = 0; j < arr.length - 1 - i; j ++) { // 这里是arr.lenght - 1 - i，每一轮循环，前面都有i个已经被排序好了。没有必要再去对比一下。
            if(arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1)
            }
        }
    }
    return arr;
}


console.log(bubbleSort([5, 3, 6, 7, 0, 1]))