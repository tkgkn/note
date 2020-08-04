import React, { useEffect, useState } from 'react';

// mock一个封装好的接口函数
function mockFetch(api) {
  console.log('调用mockFetch');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'Jack',
        age: '26',
        api
      });
    }, 2000);
  });
}

// 一个简单的发布订阅
class PubSub {
  subArr: { [key: string]: Function[] } = {};

  sub(type, callback) {
    if (this.subArr[type]) {
      this.subArr[type].push(callback);
    } else {
      this.subArr[type] = [callback];
    }
  }

  cancelSub(type, callback) {
    if (this.subArr[type]) {
      const findIndex = this.subArr[type].findIndex(fn => fn === callback);
      if (findIndex !== -1) {
        this.subArr[type].splice(findIndex, 1);
      }
    }
  }

  pub(type) {
    if (this.subArr[type]) {
      this.subArr[type].forEach(fn => {
        fn();
      });
    }
  }
}

const pubSub = new PubSub();

// 1. 实现缓存同名同参函数的结果值
// 2. 同时调用多个同名同参函数，只调用第一个，后面的调用使用缓存结果值
class CacheRequest {
  // 这里只考虑具名函数，匿名函数先不管啦！

  // 当前正在执行的函数，以及对应的参数
  curFnCall: { [fnName: string]: string[] } = {};
  // 对应函数，以及参数的缓存值
  cacheRes: { [fnName: string]: { [paramsStr: string]: any } } = {};

  delay(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  cacheFn(fn: Function) {
    const _this = this;
    const wrappedFnName = fn.name;
    // 注册调用函数
    if (!this.curFnCall[wrappedFnName]) {
      this.curFnCall[wrappedFnName] = [];
    }
    // 注册缓存
    if (!this.cacheRes[wrappedFnName]) {
      this.cacheRes[wrappedFnName] = [];
    }

    return async function wrappedFn(...args) {
      // 收集调用方参数
      // @ts-ignore
      // const args = [].slice.call(arguments);
      // 参数序列化掉
      const argsKey = JSON.stringify(args);
      // 订阅的地址
      const subUrl = wrappedFnName + argsKey;

      // 下一个事件循环才开始执行，确保可以收集到到其他同步函数，如果是同名同参的函数则有机会处理它
      await _this.delay(0);

      // 检查是否已经有同名同参的函数在进行中
      const isFoundSameNameSameParamsIndex = _this.curFnCall[
        wrappedFnName
      ].findIndex(paramsStr => paramsStr === argsKey);
      // 如果有，则返回一个新函数，该函数，订阅对应函数名和参数构成的地址
      if (isFoundSameNameSameParamsIndex !== -1) {
        return new Promise(resolve => {
          pubSub.sub(subUrl, () => {
            resolve({
              type: 'hold完获取缓存值',
              data: _this.cacheRes[wrappedFnName][argsKey]
            });
          });
        });
      } else {
        // 如果没有
        // 插入到curFnCall的同名同参数组中
        _this.curFnCall[wrappedFnName].push(argsKey);

        // 是否已存在缓存值
        const isRes = _this.cacheRes[wrappedFnName][argsKey];
        if (isRes) {
          return Promise.resolve({
            type: '缓存值',
            data: isRes
          });
        } else {
          try {
            const r = await fn.apply(this, args);
            if (r) {
              _this.cacheRes[wrappedFnName][argsKey] = r;
            }
            // 从curFnCall中删除同名中的同参元素
            _this.curFnCall[wrappedFnName].splice(
              isFoundSameNameSameParamsIndex,
              1
            );
            // 通知订阅者
            pubSub.pub(subUrl);
            return {
              type: '新鲜值',
              data: r
            };
          } catch (error) {
            throw error;
          }
        }
      }
    };
  }
}

const cacheRequest = new CacheRequest();

const cacheMockFetch: (key: any) => Promise<any> = cacheRequest.cacheFn(
  mockFetch
);

function Paper() {
  const [data, setData] = useState<{
    name: string;
    age: number;
  }>({ name: '', age: 0 });

  useEffect(() => {
    cacheMockFetch('/hello/world').then(r => {
      console.log(r);
      setData(r.data);
    });

    cacheMockFetch('/hello/world').then(r => {
      console.log(r);
    });
  }, []);

  return (
    <div>
      <p>The name is {data.name}</p>
      <p>The age is {data.age}</p>
    </div>
  );
}

export default Paper;
