let domArr = [];
const htmlTag = 'div|p|span|h1|h2|h3|h4|h5|h6';

const str = '<div id="main" data-x="hello">Hello<span id="sub" /></div>';

// 找完整的标签，找到其开始标签的开始和结束index，找到其结束标签的开始和结束index
function getFullTag(str) {
  let regConfig = {
    start: '<',
    end: '/>'
  };
  let startTagReg = new RegExp(`${regConfig.start}(${htmlTag}+)\\s?.*(\?\=">)`);

  const startTag = str.match(startTagReg);
  console.log('startTag', startTag);
  let startTagStartEnd, endTagStartEnd;
  if (startTag && startTag[1]) {
    startTagStartEnd = {
      sIdx: 0,
      eIdx: startTag[0].length + 2
    };
    const endTagReg = new RegExp(`(</${startTag[1]}>)$`);
    const endTag = str.match(endTagReg);
    if (endTag) {
      endTagStartEnd = {
        sIdx: endTag.index,
        eIdx: str.length
      };
    }
    console.log(startTagStartEnd, endTagStartEnd);
  }
}

// 找纯文本元素
function getPureText(str) {
  let txtTagStartEnd;
  const getPureTxtReg = new RegExp(`^([^<].*)(\?\=<[${htmlTag}])`);
  const txtTag = str.match(getPureTxtReg);
  if (txtTag && txtTag[1]) {
    txtTagStartEnd = {
      sIdx: txtTag.index,
      eIdx: txtTag[1].length
    };
  }
  return txtTagStartEnd;
}

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

function tokenSi