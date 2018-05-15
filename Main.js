const usersM = require('./Users');
const groupsM = require('./Groups');
const treeM = require('./treeWork');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var usersm = new usersM();
var groupsm = new groupsM();
var tree = new treeM();
//tree.initllaize();
//var groups = new groupsM();
var users = [];
//var groups = {};
//var users=[];
var msg ="";

main();
function main() {
    rl.question("\nChoose a option:\n1.User\n2.Groups\n3.Users to Group association\n4.Update user profile",menu);
}

function menu(input) {
    console.log(input);
    switch (input) {
        case '1':
            userMenu();
            break;

        case '2':
            groupMenu();
            break;

        case '3':
            usersToGroupMenu();
            break;
        case '4':
            updateUser();
            break;

        default:
            console.log("Not an option! Try again\n");
            main();
            break;
    }
}

function userMenu(){
    rl.question("Choose:\n1.Create/delete users\n2.Get a list of users in the system\n",function(input){
        if(input==='1'){
            rl.question("Choose:\n1.Create user\n2.Delete user",function(input2){
                if(input2==='1') {
                    rl.question("Enter the user name: ", function (name) {
                        rl.question("Enter password: ", function (password) {
                            rl.question("Enter age: ", function (age) {
                                msg = usersm.createUser(name, password, age);
                                printMessage(msg);
                                main();
                            });
                        });
                    });
                }
                else{
                    rl.question("Enter the name you want to delete: ",function(name){
                        var user = usersm.findUser(name);
                        if(user) {
                            //groupsm.removeFromGroups(user);
                            //msg = usersm.deleteUser(user);
                            //printMessage(msg);
                            tree.removeFromGroups(user);
                            msg = usersm.deleteUser(user);
                        }
                        main();
                    });
                }
            });
        }
        else if(input==='2'){
            usersm.printUsers();
            main();
        }
    });
}

function groupMenu(){
    rl.question("Choose:\n1.Create/Delete groups\n2.Search for group\n3.Flatten group\n4.Print full tree",function(input) {
        if(input==='1') {
            rl.question("Choose:\n1.Create group\n2.Delete group\n", function (input2) {
                if (input2 === '1') {
                    rl.question("Enter group name and a group to be nested on",function (args) {
                        var myvar = args.split(' ');
                        var obj = tree.checkForDuplicate(myvar[1]);
                        if(!obj){
                            tree.addNode(myvar[0]);
                            main();
                            return;
                        }
                        var length = obj['nodes'].length;
                        if(length>0){
                            console.log('You have ' + length + ' groups with the name '+ myvar[1] );
                            obj['paths'].forEach(function(element,index){
                                console.log(index+": "+element);
                            });
                            rl.question('Choose a path: ',function(input){
                                //console.log(obj['nodes'][input]);
                                tree.addNode(myvar[0],obj['nodes'][input]);
                                main();
                            });
                        }
                        else{
                            console.log("ERROR! arguments were wrong!");
                            main();
                        }
                    });
                }
                else if (input2 === '2') {
                    rl.question("Enter group name you want to delete",function (name) {
                        var obj = tree.checkForDuplicate(name);
                        var length = obj['nodes'].length;
                        if(length>0){
                            console.log('You have ' + length + ' groups with the name '+ name );
                            obj['paths'].forEach(function(element,index){
                                console.log(index+": "+element);
                            });
                            rl.question('Choose a path: ',function(input){
                                tree.removeNode(obj['nodes'][input]);
                                main();
                            });
                        }
                        else{
                            console.log('ERROR! group: '+name+' dosent exist!');
                            main();
                        }
                    });
                }
            });
        }
        else if(input ==='2'){
            rl.question('Enter group name: ',function (name) {
                var obj = tree.checkForDuplicate(name);
                if(obj['paths'].length){
                    obj['paths'].forEach(function(path){
                        console.log(path);
                    });
                    main();
                }
                else{
                    console.log("ERROR! Group dosen't exist");
                    main();
                }
            });
        }
        else if(input === '3'){
            rl.question("Enter group name you want to Flatten",function(name){
                var obj = tree.checkForDuplicate(name);
                var length = obj['nodes'].length;
                if(length>0){
                    console.log('You have ' + length + ' groups with the name '+ name );
                    obj['paths'].forEach(function(element,index){
                        console.log(index+": "+element);
                    });
                    rl.question('Choose a path: ',function(input){
                        tree.flattenGroup(obj['nodes'][input]);
                        main();
                    });
                }
                else{
                    console.log("ERROR! group dosen't exist");
                    main();
                }
            });
        }
        else if(input === '4'){
            tree.print();
            main();
        }
    });
}

function usersToGroupMenu() {
    rl.question("1.Add/remove users to/from group\n2.Get a list of groups for a user ",function(input){
        if(input==='1'){
            rl.question("Choose:\n1.Add user to group\n2.Remove user from group",function(input2){
                if(input2==='1'){
                    rl.question("Enter user name and group name",function(args){
                        var myvar = args.split(" ");
                        var user = usersm.findUser(myvar[0]);
                        var group = myvar[1];
                        var obj = tree.checkForDuplicate(group);
                        var length = obj['nodes'].length;
                        if(length>0 && user){
                            console.log('You have ' + length + ' groups with the name '+ group );
                            obj['paths'].forEach(function(element,index){
                                console.log(index+": "+element);
                            });
                            rl.question('Choose a path: ',function(input){
                                //console.log(obj['nodes'][input]);
                                tree.addUser(user,obj['nodes'][input]);
                                main();
                            });
                        }
                        else{
                            console.log("ERROR! Arguments are wrong");
                            main();
                        }
                        //tree.addUser(user,myvar[1]);
                        //msg = groupsm.addToGroup(user,myvar[1]);
                        //printMessage(msg);
                    });
                }
                else if(input2=='2'){
                    rl.question("Enter user name and group name",function (args) {
                        var myvar = args.split(" ");
                        var user = usersm.findUser(myvar[0]);
                        var group = myvar[1];
                        var obj = tree.checkForDuplicate(group);
                        var length = obj['nodes'].length;
                        if(length>0 && user){
                            console.log('You have ' + length + ' groups with the name '+ myvar[0] );
                            obj['paths'].forEach(function(element,index){
                                console.log(index+": "+element);
                            });
                            rl.question('Choose a path: ',function(input){
                                //console.log(obj['nodes'][input]);
                                tree.removeUser(user,obj['nodes'][input]);
                                main();
                            });
                        }
                        else{
                            console.log('ERROR! one or two arguments were wrong!');
                            main();
                        }
                        //var myvar = args.split(" ");
                        //var user = usersm.findUser(myvar[0]);
                        //msg = groupsm.removeFromGroup(user,myvar[1]);
                        //printMessage(msg);
                        //main();
                    });
                }
            });
        }
        if(input==='2'){
            rl.question("Enter a user name: ",function (name) {
                var user = usersm.findUser(name);
                tree.userGroups(user);
                main();
            });
        }
    });
}

function printMessage(msg){
    if(!(msg.toString()==="")){
        console.log(msg);
    }
}

function updateUser() {
    rl.question("Enter username",function (name) {
        var user = usersm.findUser(name);
        if(user){
            rl.question("Enter new name and age",function(args){
                var myvar = args.split(" ");
                var index = users.indexOf(user);
                msg = usersm.update(user,myvar[0],myvar[1]);
                printMessage(msg);
                main();
            });
        }
        else{
            console.log("ERROR!User dosen't exists\n");
            main();
        }
    });
}

module.exports = main;
