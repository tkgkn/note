const data = [
  { userId: 8, title: 'title1' },
  { userId: 11, title: 'other' },
  { userId: 15, title: null },
  { userId: 19, title: 'title2' }
];
// const find = function(origin) {
//   // your code are here...
// };
// 查找 data 中，符合条件的数据，并进行排序
// const result = find(data).where({
//   'title': /\d$/}).orderBy('userId', 'desc');
// console.log(result);// [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];

type dataItem = {
  userId: number;
  title: string | null;
};

// 链式写法，需要有个done，明确知道调用链结束，才能返回结果而不是this
function find(originData: dataItem[]) {
  let handledData = originData;

  const where = function(condition: { [key: string]: RegExp }) {
    const conditionArr = Object.keys(condition);
    handledData = handledData
      .map(dataItem => {
        const flag = conditionArr.every(conditionItem => {
          const filterDataField = dataItem[conditionItem];
          if (filterDataField === undefined) {
            return false;
          }
          return condition[conditionItem].test(filterDataField);
        });
        return flag ? dataItem : null;
      })
      .filter(Boolean);
    return this;
  };

  const orderBy = function(key: string, type: 'desc' | 'asc' = 'desc') {
    for (let i = 0; i < handledData.length - 1; i++) {
      for (let j = 0; j < handledData.length - 1 - i; j++) {
        const preData = handledData[j][key];
        const nextData = handledData[j + 1][key];
        if (type === 'desc') {
          if (nextData > preData) {
            const tmp = handledData[j];
            handledData[j] = handledData[j + 1];
            handledData[j + 1] = tmp;
          }
        }
        if (type === 'asc') {
          if (preData > nextData) {
            const tmp = handledData[j];
            handledData[j] = handledData[j + 1];
            handledData[j + 1] = tmp;
          }
        }
      }
    }
    return this;
  };

  const done = function() {
    return handledData;
  };

  return {
    where,
    orderBy,
    done
  };
}

const res = find(data)
  .where({
    title: /\d$/
  })
  .orderBy('userId', 'desc')
  .done();
console.log('Q2的结果', res);
