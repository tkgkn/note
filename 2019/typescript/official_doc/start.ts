class Student {
  fullName: string;
  constructor(public firstName, public middleInitial, public lastNmae) {
    this.fullName = firstName + ' ' + middleInitial + ' ' + lastNmae
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person){
  return 'hello ' + person.firstName + person.lastName
}

let user = new Student('Jan', 'm', 'dick')

document.body.innerHTML = greeter(user)
