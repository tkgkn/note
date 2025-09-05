// function insertSort(arr) {
//     for (let i = 1; i < arr.length; i++) {
//         const current = arr[i];
//         let lastIdx = i - 1; // 已经排序的部分的最后一个index
//         while (current < arr[lastIdx] && lastIdx >= 0) {
//             arr[lastIdx + 1] = arr[lastIdx]
//             arr[lastIdx] = current;
//             lastIdx--
//         }
//     }
//     return arr
// }

// 上面实现细节上还可以再优化
function insertSort(arr) {
    if (!arr || !arr.length) {
        return []
    }
    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        let lastIdx = i - 1;
        while (lastIdx >= 0 && current < arr[lastIdx]) { // 需要lastIdx >= 0，防止越界，保证边界安全
            arr[lastIdx + 1] = arr[lastIdx]
            // arr[lastIdx] = current;
            lastIdx--
        }
        // 跳出while循环，说明current已经不能再往前插了，最终确认了当前值能插在已排序的哪个位置再插入。
        // 这里插入的是lastIdx + 1，而不是lastIdx，因为上面while循环跳出时lastIdx就是不能插的位置，因此应该插在其后面1位。
        arr[lastIdx + 1] = current;
    }
    return arr
}

console.log(insertSort([5, 3, 6, 7, 0, 1]))