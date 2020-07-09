// 时间问题，只考虑支持如下html标签支持，不考虑注释的文本。另外还有些情况没有考虑，需要时间优化，如<div>hello<span/>world</span></div>
const htmlTag = 'div|p|span|h1|h2|h3|h4|h5|h6|image';

// 普通标签的开始，如<div>
const startTagReg = new RegExp(`<(${htmlTag}+)\\s?.*?">`);
// 普通标签的结束标签</div>
const endTagReg = new RegExp(`</(${htmlTag})>`);
// 自闭和标签，如<image />
const selfClosingStartTagReg = new RegExp(`<(${htmlTag}+)\\s?.*?"(\\s?\/?)>`);
// 匹配标签之间的字符串内容
const pureTxtReg = new RegExp(`^([^<].*?)(\?\=<)`);

// 测试的HTML字符串文本
// 题目的输入测试：
let str = '<div id="main" data-x="hello">Hello<span id="sub" /></div>';
// 自己的输入测试：
// let str = '<div id="parent"><div id="son1">hello</div></div>';
// let str =
//   '<div id="parent"><div id="son1">hello</div><div id="son2">hello2</div></div>';

// 考虑一些特殊问题没有考虑到，导致浏览器爆栈，这里限制下先。
let stackoverflow = 1000;

// 定义节点的类型。
class NodeType {
  constructor(config) {
    const { tag, selfClose, attributes, text, children = [] } = config;
    this.tag = tag;
    this.selfClose = selfClose;
    this.attributes = attributes;
    this.text = text;
    this.children = children;
  }
}

function parse(str) {
  // 栈，维护节点的层级关系
  let relationStack = [];
  let parent = null;
  while (str.length && stackoverflow > 0) {
    console.log(str);
    stackoverflow--;
    // 是否是开始标签
    if (str.startsWith('<') && str[1] !== '/') {
      const normalMatch = str.match(startTagReg);
      let selfCloseMatch = null;
      if (!normalMatch) {
        selfCloseMatch = str.match(selfClosingStartTagReg);
      }
      // 最近的一次匹配
      const theMatch = RegExp.lastMatch.startsWith('<')
        ? RegExp.lastMatch
        : null;
      // 匹配值的右侧
      const theMatchRight = RegExp.rightContext;
      // 匹配的标签
      const tag = RegExp.$1;
      const selfClose = false;
      const attributes = getAttributes(theMatch);
      let node = null;

      node = new NodeType({
        tag,
        selfClose,
        text: '',
        attributes,
        children: []
      });

      // 如果是普通开始标签
      if (normalMatch) {
        // 如果该节点不是自闭合标签，则入栈
        relationStack.push(node);
      } else if (selfCloseMatch) {
        // 如果是自闭和开始标签
        node.selfClose = true;
      }

      if (parent) {
        parent.children.push(node);
      }

      // 父节点指向栈结构的最上层，按照数组结构，也就是最后一个元素
      let parentIdx = relationStack.length - 1;
      parentIdx = parentIdx < 0 ? 0 : parentIdx;
      parent = relationStack[parentIdx];

      // 裁剪掉已经匹配过的字符串部分
      str = theMatchRight;
      continue;
    } else if (str.startsWith('</') && str.match(endTagReg)) {
      const theMatch = RegExp.lastMatch;
      const theMatchRight = RegExp.rightContext;
      const tag = RegExp.$1;
      // 如果是闭合标签，执行出栈操作，先判断是否是同一个标签节点
      if (parent && parent.tag && parent.tag === tag) {
        // 推出栈最顶层的节点，它可能是栈里的最后一个，也就是根节点
        const maybeLast = relationStack.pop();
        // 父节点元素变更为最新的栈顶层的节点
        parent = relationStack[relationStack.length - 1];

        // 如果栈已经空了，根节点暴露出来就可以
        if (relationStack.length === 0) {
          parent = maybeLast;
        }
        // 裁剪掉匹配过的字符串部分
        str = theMatchRight;
      } else {
        console.error('HTML字符串语法错误，停止解析');
        throw new Error('大侠你的HTML有问题');
      }
    }

    // 开始处理纯文本
    if (!str.startsWith('<') && str.match(pureTxtReg)) {
      const theMatch = RegExp.lastMatch;
      const theMatchRight = RegExp.rightContext;
      if (parent) {
        parent.text = theMatch;
      }
      str = theMatchRight;
      continue;
    }
  }
  console.log(parent);
  return parent;
}

function getAttributes(str) {
  if (!str) {
    return {};
  }
  // 去除左右两边的<xx 或 /> 或 >
  const startReg = new RegExp(`^<(${htmlTag})\\s`);
  str = str.replace(startReg, '');
  const endReg = new RegExp(`\/?>$`);
  str = str.replace(endReg, '');
  const valReg = /^"(.*)"$/;

  const attributesArr = str.split(' ');
  const obj = {};
  attributesArr.forEach(item => {
    if (item) {
      const kv = item.split('=');
      if (kv[0]) {
        obj[kv[0]] = kv[1].match(valReg)[1];
      }
    }
  });
  return obj;
}

parse(str);
