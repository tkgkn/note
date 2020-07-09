const htmlTag = 'div|p|span|h1|h2|h3|h4|h5|h6';

let str = '<div id="main" data-x="hello">Hello<span id="sub" /></div>';

// 找完整的标签，找到其开始标签的开始和结束index，找到其结束标签的开始和结束index
function getFullTag(str) {
  let regConfig = {
    start: '<',
    end: '/>'
  };
  let startTagReg = new RegExp(`${regConfig.start}(${htmlTag}+)\\s?.*(\?\=">)`);

  const startTag = str.match(startTagReg);
  console.log(startTag);
  let startTagStartEnd, endTagStartEnd;
  if (startTag && startTag[1]) {
    startTagStartEnd = {
      sIdx: 0,
      eIdx: startTag[0].length + 2
    };
    const endTagReg = new RegExp(`(</${startTag[1]}>)$`);
    const endTag = str.match(endTagReg);
    console.log(endTag);
    if (endTag) {
      endTagStartEnd = {
        sIdx: endTag.index,
        eIdx: str.length
      };
    }
  }
  return {
    startTagStartEnd,
    endTagStartEnd
  };
}

// // 找纯文本元素
function getPureText(str) {
  const htmlTag = 'div|p|span|h1|h2|h3|h4|h5|h6';
  let txtTagStartEnd;
  const getPureTxtReg = new RegExp(`^([^<].*)(\?\=<[${htmlTag}])`);
  const txtTag = str.match(getPureTxtReg);
  console.log(txtTag);
  if (txtTag && txtTag[1]) {
    txtTagStartEnd = {
      sIdx: txtTag.index,
      eIdx: txtTag[1].length
    };
  }
  return txtTagStartEnd;
}

getPureText('Hello<span id="sub" /></div>');

// 找自闭合标签
function getSelfCloseTag(str) {
  let regConfig = {
    start: '<',
    end: '/>'
  };
  let selfCloseTagStartEnd;
  const getSelfCloseTagReg = new RegExp(
    `${regConfig.start}(${htmlTag}+)\\s?.*(\?\=/>)`
  );
  const selfCloseTag = str.match(getSelfCloseTagReg);
  if (selfCloseTag && selfCloseTag[0]) {
    selfCloseTagStartEnd = {
      sIdx: selfCloseTag.index,
      eIdx: selfCloseTag[0].length + 2
    };
  }
  return selfCloseTagStartEnd;
}

let domArr = [];

// function tokenize(str) {
//   // 字符串查找顺序：全标签，自闭和，文本
//   const fullTagIdx = getFullTag(str);
//   if (fullTagIdx.startTagStartEnd && fullTagIdx.endTagStartEnd) {
//     // 裁剪字符串
//     const strArr = str.split('');
//     const e = strArr.splice(
//       fullTagIdx.endTagStartEnd.sIdx,
//       fullTagIdx.endTagStartEnd.eIdx
//     );
//     const s = strArr.splice(
//       fullTagIdx.startTagStartEnd.sIdx,
//       fullTagIdx.startTagStartEnd.eIdx
//     );
//     domArr.push({
//       type: 'full',
//       tag: s.join('') + e.join('')
//     });
//     str = strArr.join('');
//   }

//   const pureTxtIdx = getPureText(str);
//   if (pureTxtIdx) {
//     const strArr = str.split('');
//     const t = strArr.splice(pureTxtIdx.sIdx, pureTxtIdx.eIdx);
//     domArr.push({
//       type: 'text',
//       tag: t.join('')
//     });
//     str = strArr.join('');
//   }

//   const selfCloseIdx = getSelfCloseTag(str);
//   if (selfCloseIdx) {
//     const strArr = str.split('');
//     const tag = strArr.splice(selfCloseIdx.sIdx, selfCloseIdx.eIdx);
//     domArr.push({
//       type: 'selfClose',
//       tag: tag.join('')
//     });
//     str = strArr.join('');
//   }
// }

// console.log(tokenize(str));
