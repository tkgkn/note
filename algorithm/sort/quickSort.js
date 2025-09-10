function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const middle = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i])
        } else if (arr[i] > pivot) {
            right.push(arr[i])
        } else {
            middle.push(arr[i])
        }
    }

    return [...quickSort(left), ...middle, ...quickSort(right)]
}

console.log(quickSort([3,4,6,1,2,9,8,0]))