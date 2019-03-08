var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastNmae) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastNmae = lastNmae;
        this.fullName = firstName + ' ' + middleInitial + ' ' + lastNmae;
    }
    return Student;
}());
function greeter(person) {
    return 'hello ' + person.firstName + person.lastName;
}
var user = new Student('Jan', 'm', 'dick');
document.body.innerHTML = greeter(user);
