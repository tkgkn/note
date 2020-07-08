// 辅助方法：判断鸭子类型
function duckPromise(obj) {
  if (obj && obj.then && typeof obj.then === 'function') {
    return true;
  }
  return false;
}

// 辅助方法：判断真实类型
function isType(target, type) {
  const targetType = Object.prototype.toString.call(target);
  return type.toLowerCase() === targetType.slice(7, -1).toLowerCase();
}
/**
 * @description: 竟态race
 * @param {array} arr
 * @return: promise
 */
function race(arr) {
  return new Promise((resolve, reject) => {
    for (let v of arr) {
      if (duckPromise(v) || isType(v, 'promise')) {
        v.then(r => {
          resolve(r);
        }).catch(e => {
          reject(e);
        });
      }
    }
  });
}

// 测试race函数;
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
    // reject(new Error('hello'));
  }, 1000);
});

var p2 = new Promise(resolve => {
  setTimeout(() => {
    resolve(2);
  }, 2000);
});

race([p1, p2])
  .then(r => {
    console.log(r);
  })
  .catch(e => {
    console.log(e);
  });
