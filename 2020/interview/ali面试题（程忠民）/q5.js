class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// 有序二叉树数组 转 二叉树对象

function array2Tree(arr) {
  if (!arr || !arr.length) {
    return null;
  }
  // 队列，用于管理节点之间的父子关系。
  // 知道某个节点的Index，其父节点是 Math.floor(i / 2)。左节点是i，右节点是i+1
  let queue = [];
  // 创建根节点
  let root = new TreeNode(arr[0]);
  // 插入队列第一个
  queue.push(root);
  for (let i = 1; i < arr.length; i++) {
    // 查找父节点的index值
    const parentIndex = Math.floor(i / 2);
    // 往父节点左侧挂载
    queue[parentIndex].left = new TreeNode(arr[i]);
    // 将节点推入queue
    queue.push(queue[parentIndex].left);
    // 往父节点右侧挂载
    queue[parentIndex].right = new TreeNode(arr[i + 1]);
    // 将节点推入queue
    queue.push(queue[parentIndex].right);
  }
  // 队列释放
  queue = null;
  // 返回根节点
  return root;
}

// const aArr = [1, 2, 3];
// const bArr = [1, 2, 3];

// const aArr = [1, 2];
// const bArr = [1, null, 2];

const aArr = [1, 2, 1];
const bArr = [1, 1, 2];

const aTree = array2Tree(aArr);
const bTree = array2Tree(bArr);

console.log('aTree', aTree);
console.log('bTree', bTree);

/**
 * @description: 递归比对两个二叉树
 * @param {TreeNode} a
 * @param {TreeNode} b
 * @return: boolean
 */
function compareTree(a, b) {
  // 两个树不存在时
  if (a === null && b === null) {
    return true;
  }
  // 两棵树有一个不存在
  if (a === null || b === null) {
    return false;
  }
  // 两个数的同一个节点值不同
  if (a.val !== b.val) {
    return false;
  }
  // 比较该节点的子节点
  return compareTree(a.left, b.left) && compareTree(a.right, b.right);
}

const res = compareTree(aTree, bTree);
console.log(`比对结果 ${res}`);
