const csv = `
  name,age,parent
  Bob,30,David
  David,60,
  Anna,10,Bob
`;

interface Person {
  name: string;
  age: number;
  parent: Person[];
  children: Person[];
}

function handleCsv(csv: string) {
  const csvArr = csv
    .split('\n')
    .map(item => {
      return item.trim();
    })
    .filter(item => item.length)
    .slice(1);
  const family = Object.create(null);
  // 先生成每个Person，关系另外处理
  csvArr.forEach(person => {
    const [name, age] = person.split(',');
    family[name] = {
      name,
      age,
      parent: [],
      children: []
    };
  });

  // 处理Person的父子关系
  csvArr.forEach(person => {
    const [name, age, parent] = person.split(',');
    if (parent) {
      family[name].parent.push(family[parent]);
      family[parent].children.push(family[name]);
    }
  });

  console.log('Q1的结果', family);
}

handleCsv(csv);
