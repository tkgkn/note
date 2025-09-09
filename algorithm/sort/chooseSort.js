const swap = (arr, i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]]
}

// function chooseSort(arr) {
//     for(let i = 0; i < arr.length - 1; i ++) {
//         let idx = i;
//         for(let j = i; j < arr.length; j ++) {
//             if(arr[i] > arr[j]) {
//                 idx = j
//             }
//         }
//         swap(arr, i, idx)
//     }
//     return arr
// }

function chooseSort(arr) {
    for(let i = 0; i < arr.length - 1; i ++) {
        let idx = i;
        for(let j = i; j < arr.length; j ++) {
            if(arr[idx] > arr[j]) { // 这里纠正为arr[idx] 而不是 arr[i]，每次对比都要和最小的比。
                idx = j
            }
        }
        swap(arr, i, idx)
    }
    return arr
}

module.exports = {
    swap
}