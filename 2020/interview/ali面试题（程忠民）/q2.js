class MergeReqAndCache {
  constructor() {
    this.timer = null; // 多个并发函数合并为一个，只执行最后一个，之前的定时器任务清理
    this.mergeParamsFn = {}; // 存放配对的合并处理函数
    this.cacheParams = {}; // 缓存多个并发函数的参数，传递给合并处理函数使用（注意清空）
    this.cacheRes = {};
  }

  /**
   * @description:
   * @param {number} t 时长
   * @return
   */
  delay(t) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, t);
    });
  }

  /**
   * @description: 合并处理的函数。 并发执行时，只执行最后一次。
   * @param {string} mergeFnName 合并处理函数名
   * @param {string} wrappedFnName 缓存函数名
   * @return: promise
   */
  mergeFn(mergeFnName, wrappedFnName) {
    return new Promise((resolve, reject) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        // 合并多个函数后，真正执行的最后一个函数。
        // 收集的参数深复制
        const copyParams = JSON.parse(
          JSON.stringify(this.cacheParams[wrappedFnName])
        );

        // 重置收集参数
        this.cacheParams[wrappedFnName] = [];

        // 如果合并处理函数也有缓存，直接返回缓存值
        const key = copyParams.toString();
        if (this.cacheRes[key]) {
          console.log(`从缓存读取key为 [${key}] 的值`);
          resolve(this.cacheRes[key]);
          return;
        }

        try {
          // 参数由多个arguments组成，如[arg1, arg2, ...]
          // 扁平化数组
          // 之前的key即参数构成的唯一key字符串
          const flatParams = key.split(',');
          const r = await this.mergeParamsFn[mergeFnName](flatParams);
          // 如果返回值为null，则不缓存
          if (r) {
            this.cacheRes[key] = r;
          }
          resolve(r);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }

  /**
   * @description: 返回一个具备缓存的函数。
   * @param {Function} fn 缓存函数
   * @param {Function} mergeFn 跟fn配对的合并处理函数，多个fn同步调用时收集参数走mergeFn调用
   * @return: promise
   */
  wrapFn(fn, mergeFn) {
    const _this = this;
    // 不同函数注册自己的缓存参数数组
    const wrappedFnName = fn.name;
    _this.cacheParams[wrappedFnName] = [];

    // 注册fn函数配对的合并处理函数
    let name = '';
    if (mergeFn && mergeFn.fn) {
      name = mergeFn.name || fn.name;
      this.mergeParamsFn[name] = mergeFn.fn;
    }

    return async function wrappedFn() {
      const args = [].slice.call(arguments);
      // 收集参数
      _this.cacheParams[wrappedFnName].push(args);

      // 下一个事件循环开始，确保可以收集多个同步函数的请求参数
      await _this.delay(0);

      // 多个任务的参数收集，走合并处理函数
      if (_this.cacheParams[wrappedFnName].length > 1 && name) {
        if (!name) {
          console.log('缺少配对的合并处理函数');
          return;
        }
        const mergeRes = await _this.mergeFn(name, wrappedFnName);
        return mergeRes;
      } else {
        // 单一调用，重置收集的参数
        _this.cacheParams[wrappedFnName] = [];
        const key = args.toString();
        // 有缓存值，直接返回
        if (_this.cacheRes[key] !== undefined) {
          console.log(`从缓存读取key为 [${key}] 的值`);
          return await Promise.resolve(_this.cacheRes[key]);
        } else {
          try {
            const r = await fn.apply(this, args);
            // 如果返回值为null，则不缓存
            if (r) {
              _this.cacheRes[key] = r;
            }
            return r;
          } catch (error) {
            throw error;
          }
        }
      }
    };
  }
}

const cacheIns = new MergeReqAndCache();

const mockFetch = api => {
  const datajson = data => ({
    json() {
      return this.data;
    },
    data: `结果值: ${data}`
  });
  return new Promise((resolve, reject) => {
    // 测试接口请求失败
    if (api === '/api/user/4') {
      reject(new Error('this is error when userId was 4'));
    } else {
      resolve(datajson(api));
    }
  });
};

function getUserById(userId) {
  console.log('getUserById的参数', userId);
  return mockFetch(`/api/user/${userId}`).then(resp => resp.json());
}
function getUserByIds(ids) {
  console.log('getUserByIds的参数', ids);
  return mockFetch(`/api/users/${ids.join(',')}`).then(resp => resp.json());
}

const newGetUserByIds = cacheIns.wrapFn(getUserByIds);
const newGetUserById = cacheIns.wrapFn(getUserById, {
  name: 'newGetUserByIds',
  fn: newGetUserByIds
});

newGetUserById(1);
newGetUserById(2);
newGetUserById(3).then(res => {
  console.log(res);
});

setTimeout(() => {
  newGetUserById(1);
  newGetUserById(2);
  newGetUserById(3).then(res => {
    console.log(res);
  });
}, 1000);

setTimeout(() => {
  newGetUserById(4)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
}, 2000);

/* 自己的测试代码 start */
// // get函数：获取单一结果
// function get() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(arguments[0]);
//     }, 1000);
//   });
// }

// // gets函数：获取多个结果
// function gets() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const paramsArr = [].slice.call(arguments);
//       const res = paramsArr.map(item => {
//         return item.toString();
//       });
//       resolve(res);
//     }, 1000);
//   });
// }

// // 包装成缓存函数gets
// const newGets = cacheIns.wrapFn(gets);

// // 包装成缓存函数get，并配置一个合并处理函数，当缓存函数get同时调用多次，走配对的合并处理函数
// const newGet = cacheIns.wrapFn(get, {
//   name: 'gets',
//   fn: gets
// });

// // 新任务，多个函数，参数分别是a1,a2,a3,a4，走合并函数gets，缓存结果
// newGet('a1').then(r => {
//   console.log('a1', r);
// });

// newGet('a2').then(r => {
//   console.log('a2', r);
// });

// newGet('a3').then(r => {
//   console.log('a3', r);
// });

// newGet('a4').then(r => {
//   console.log('a4', r);
// });

// // 新任务，单个函数调用走get，参数是b1, 缓存结果
// setTimeout(() => {
//   newGet('b1').then(r => {
//     console.log('b1', r);
//   });
// }, 2000);

// // 新任务，多个函数，参数分别是c1,b2，走合并函数gets，缓存结果
// setTimeout(() => {
//   newGet('c1').then(r => {
//     console.log('c1', r);
//   });
//   newGet('b2').then(r => {
//     console.log('b2', r);
//   });
// }, 3000);

// // 新任务，单个函数调用走get，参数b1，有缓存结果，直接读取
// setTimeout(() => {
//   newGet('b1').then(r => {
//     console.log('b1', r);
//   });
// }, 4000);

// // 新任务，多个函数，参数分别是a1,a2,a3,a4，走合并函数gets，有缓存结果，直接读取
// setTimeout(() => {
//   newGet('a1').then(r => {
//     console.log('a1', r);
//   });

//   newGet('a2').then(r => {
//     console.log('a2', r);
//   });

//   newGet('a3').then(r => {
//     console.log('a3', r);
//   });

//   newGet('a4').then(r => {
//     console.log('a4', r);
//   });
// }, 5000);

/* 测试代码 end */
