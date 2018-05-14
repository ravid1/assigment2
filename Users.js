//const mainModule = require('./Main');

/*const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});*/

var users = [{name:'ravid', password: '123', age: 28},{name:'orel', password: '123', age: 28}];
var string = "";

function User(name,password,age){
    this.name = name;
    this.password = password;
    this.age = age;
}

User.prototype.createUser = function(name,password,age){
    //var newUser={};
    string = "";
    var found = users.find(function (obj) {
        return name === obj.name;
    });
    if(found){
        string = 'ERROR!! The Name ' + name + 'already exist. please try again\n';
        //console.log(string);
    }
    else {
        var newUser = new User(name, password, age);
        users.push(newUser);
        string = name + ' added successfully\n';
    }
    return string;
};

User.prototype.deleteUser = function(user){
    string = "";
    if(user){
        users.splice(users.indexOf(user),1);
        string = "User deleted!\n";
    }
    else{
        string = 'ERROR! User dosent exist!\n';
        //console.log('ERROR! User dosent exist!\n');
    }
    //removeFromGroups(user);
    return string;
};

User.prototype.printUsers = function(){
    string = "";
    if(users.length){
        users.forEach( function(user) {
            console.log(user.name,'('+user.age+')');
        });
    }
    else {
        string = "No users in system!\n";
        console.log("No users in system!\n");
    }
};

User.prototype.findUser = function(name){
    var user = users.find(function(obj){
        return obj.name===name;
    });
    return user;
};

User.prototype.update = function(user,name,age){
    string = "";
    if(user){
        var index = users.indexOf(user);
        users[index].name = name;
        users[index].age = age;
        string = "user updated\n";
    }
    else{
        string = "ERROR!User dosen't exists\n";
    }
    return string;
};

User.prototype.print = function(user){
    return (user.name);
};

module.exports = User;