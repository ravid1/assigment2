const usersM = require('./Users');
var groups = {};
var string = "";
var usersm = new usersM();

function Group(name){
    this.name = name;
    this.users = []; //new Users();
}

Group.prototype.Group = function(name){
    this.name = name;
    this.users = [];
    this.count = 0;
    return {'name': name , 'users': [] , 'count': 0};
};

Group.prototype.createGroup = function(name){
    string = "";
    if(findGroup(name)){
        string = "ERROR! Group name already exists\n"
        //console.log("ERROR! Group name already exists\n");
    }
    else{
        var group = new Group(name);
        groups[name] = group;
        string = "Group added";
    }
    return string;
};

function findGroup(name){
    var found = name in groups;
    return found;
}

Group.prototype.deleteGroup = function(name){
    string = "";
    if(findGroup(name)){
        delete groups[name];
        string = "Group",name,"deleted successfully\n";
        //console.log("Group",name,"deleted successfully\n");
    }
    else{
        string = "ERROR! Group dosen\'t exists\n";
        //console.log("ERROR! Group dosen\'t exists\n");
    }
    return string;
};

Group.prototype.addToGroup = function(user,group) {
    group['users'].push(user);
    group['count'] = group['count'] +1;
};

Group.prototype.findInGroup = function(user,group){
    var index = group['users'].indexOf(user);
    if(index>-1){
        return true;
    }
    else{
        return false;
    }
};

/*Group.prototype.printGroups = function() {
    string = "";
    if (groups.toString() === "") {
        string = "ERROR! No group in system\n";
        console.log("ERROR! No group in system\n");
    }
    else {
        for(var name in groups){
            console.log(name);
        }
    }
    return string;
};*/

Group.prototype.printGroup = function(group){
    var users = [];
    group.users.forEach(function(user){
        users.push(usersm.print(user));
    });
    return users;
};

Group.prototype.removeFromGroup = function(user,group){
    var index = group['users'].indexOf(user);
    if(index>-1){
        group['users'].splice(index,1);
        group['count'] = group['count'] - 1;
    }
};

/*Group.prototype.removeFromGroups = function(user){
    var userGroups=[];
    for(var group in groups){
        groups[group].users.find(function(elment){
            if(elment===user){
                userGroups.push(group);
            }
        });
    }

    if(userGroups.length>0){
        userGroups.forEach(function(usergroup) {
            var index=groups[usergroup].users.indexOf(user);
            groups[usergroup].users.splice(index,1);
        });
    }
};*/
/*
Group.prototype.printAllGroupsUsers = function(){
    var str;
    for(var group in groups) {
        console.log(group);
        groups[group].users.forEach(function (user) {
            user.print();
        }) ;
    }
};
*/

module.exports = Group;