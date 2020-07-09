const arr = [7, 1, 5, 3, 6, 4];

// o(n)
function getMax() {
  let dis = 0; // 默认利润0
  let minPrice = arr[0]; // 默认第最低价为第一个
  for (let i = 0; i < arr.length; i++) {
    if (minPrice > arr[i]) {
      // 重置最低价格
      minPrice = arr[i];
    } else {
      // 当天股票价 高于 最低价，计算利润
      const curDist = arr[i] - minPrice;
      // 当天利润大于存储的利润，则替换
      dis = dis - curDist > 0 ? dis : curDist;
    }
  }
  return dis;
}

const r = getMax(arr);
console.log(r);

// o(n²)
function getMax2(arr) {
  let dis = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const v = arr[j] - arr[i];
      if (v > dis) {
        dis = v;
      }
    }
  }
  return dis;
}

const r2 = getMax2(arr);
console.log(r2);
