// 题目1
// let testString = 'adsfasdfasdfasdfvxcfasdfzxvqwersafa';

// const findObj = {};
// testString.split('').forEach(i => {
//   if (findObj[i]) {
//     findObj[i].push(i);
//   } else {
//     findObj[i] = [i];
//   }
// });
// const keys = Object.keys(findObj);
// let max = [];
// let k = [];
// for (let i = 0; i < keys.length; i++) {
//   if (findObj[keys[i]].length > max.length) {
//     max = findObj[keys[i]];
//     k.push(keys[i]);
//   } else if (findObj[keys[i]].length === max.length) {
//     k.push(keys[i]);
//   }
// }

// return k;

// 题目3
// function fetch() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const flag = rand(1, 100) > 50;
//       if (flag) {
//         resolve(true);
//       } else {
//         reject('error');
//       }
//     }, 3000);
//   });
// }

// // 0 101
// function rand(min, max) {
//   // [0,1) [min + 0, 100]
//   const int = min + Math.floor(Math.random() * (max + 1 - min));
//   return int;
// }

// 题目4
function testImg(number, img) {
  const arr = number.toString().split('');
  const parent = document.createElement('div');
  for (let i = 0; i < arr.length; i++) {
    const oSpan = document.createElement('span');
    oSpan.style.display = 'inbline-block';
    oSpan.style.width = '2px';
    oSpan.style.height = '2px';
    oSpan.style.backgroundImage = img;
    oSpan.style.backgroundPosition = `${2 * arr[i]}px 0px`;
    parent.appendChild(oSpan);
  }
  return parent;
}

console.log(testImg(123, 'www.badi.com'));

// 题目
