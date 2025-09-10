function merge(arr1, arr2) {
    const arr = []
    let i = 0; j = 0;
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            arr.push(arr1[i])
            i++
        } else {
            arr.push(arr2[j])
            j++
        }
    }

    if(i < arr1.length) {
        arr.push(...arr1.slice(i))
    }

    if(j < arr2.length) {
        arr.push(...arr2.slice(j))
    }

    return arr;
}

function mergeSort(arr) {
    if(arr.length === 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right))
}

console.log(mergeSort([3,4,6,1,2,9,8,0]))