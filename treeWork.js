const groupsM = require('./Groups');
const groupsm = new groupsM();

const readline = require('readline');
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function Node(name) {
    this.data = groupsm.Group(name);
    //this.data = new Group(name);
    this.childrens = {};
    this.parent = null;
}

function Tree() {
    this.root = null;
}

Tree.prototype.addNode = function(name, toNodeData) {
    var node;
    var newNode = new Node(name);
    if(checkUnique(name,toNodeData)){
        console.log('ERROR! Group name on branch must be unique!');
        return 'ERROR! Group name on branch must be unique!'
    }
    if(typeof(toNodeData) === "string") {
        var arr = [];
        findNodes(arr, tree1.root, toNodeData);
        if(arr.length > 1) {
            arr.forEach(function (element, index) {
                console.log(index);
                printPath(element);
            });
            node = arr[0];
        }
        else {
            node = arr[0];
        }
    }
    else {
        node = toNodeData;
        if(node && node.data.users.length > 0){
            console.log("Group containing user. creating new group");
            newNode.parent = node;
            node.data.users.forEach(function(val){
                tree1.addUser(val,newNode);
            });
            newNode.data.users.forEach(function(val){
                tree1.removeUser(val,node);
            });
        }
    }
    if(node) {
        node.childrens[name] = newNode;
        newNode['parent'] = node;
    } else {
        if(!tree1.root) {
            tree1.root = newNode;
        } else {
            return 'Root node is already assigned';
        }
    }
};

Tree.prototype.checkForDuplicate = function(name) {
    if(!tree1.root){
        return null;
    }
    var obj = {};
    var nodes = [];
    var paths = [];
    findNodes(nodes, tree1.root, name);
    if (nodes.length /*> 1*/) {
        nodes.forEach(function (element, index) {
            paths.push(printPath(element));
        });
    }
    obj['nodes'] = nodes;
    obj['paths'] = paths;
    return obj;
};

Tree.prototype.removeNode = function (node) {
    if(node.parent){
        for(var i in node.parent.childrens) {
            if(node.parent.childrens[i]==node) {
                node.parent.data.count = node.parent.data.count - node.data.count;
                delete node.parent.childrens[i];
            }
        }
    }
};

Tree.prototype.addUser = function(user , node){
    if(Object.keys(node.childrens).length === 0){
        groupsm.addToGroup(user,node.data);
        addUserCount(node.parent);
    }
    else{
        console.log("Error! Group: " + node.data.name + " has nested group inside");
    }
};

Tree.prototype.removeFromGroups = function(user){
    var obj = tree1.userGroups(user);
    obj['nodes'].forEach(function(node){
        tree1.removeUser(user,node);
    });
};

Tree.prototype.removeUser = function(user , node){
    groupsm.removeFromGroup(user,node.data);
    removeUserCount(node.parent);
};

Tree.prototype.flattenGroup = function(node){
    var parent = node.parent;
    var users = [];
    if(parent && (Object.keys(parent.childrens).length===1)){
        node.data.users.forEach(function(user){
            users.push(user);
        });
        users.forEach(function(user){
            tree1.removeUser(user,node);
        });
        tree1.removeNode(node);
        users.forEach(function(user){
            tree1.addUser(user,parent);
        });
    }
    else{
        console.log("ERROR! can't Flatten group "+ node.data.name);
    }
};

Tree.prototype.userGroups = function(user){
    var queue = [tree1.root];
    var groups = [];
    var paths = [];
    var obj ={};
    while(queue.length){
        var node = queue.shift();
        if(Object.keys(node.childrens).length>0){
           for(var i in node.childrens){
               queue.unshift(node.childrens[i]);
           }
        }
        else{
            if(groupsm.findInGroup(user,node.data)){
                groups.push(node);
                paths.push(printPath(node));
            }
        }
    }
    if(groups.length){
        console.log(user.name +" is in "+ groups.length + " groups");
        groups.forEach(function(node,index){
            console.log(node.data.name + ". with the path: "+paths[index]);
        });
    }
    obj['nodes'] = groups;
    obj['paths'] = paths;
    return obj;
};

Tree.prototype.findNodeData = function (name) {
    var queue = [this.root];
    while (queue.length) {
        var checkNode = queue.shift();
        if (checkNode.data.name === name) {
            return checkNode;
        }
        for (var i in checkNode.childrens) {
            queue.push(checkNode.childrens[i]);
        }
    }
    return null;
};


Tree.prototype.print = function(){
    walk(tree1.root);
};

var level = 1;
function walk(node) {
    console.log('--'+ Array(level).join('--') + node.data.name +'(' + node.data.count + ')');
    //){
        //level++;
        for(var i in node.childrens){
            level++;
            /*if((Object.keys(node.childrens).length)===0){
                console.log("LEAF");
            }*/
            walk(node.childrens[i]);
            level--;
        }
        if(!Object.keys(node.childrens).length){
            var arr = groupsm.printGroup(node.data);
            level++;
            arr.forEach(function (val) {
                console.log('--'+ Array(level).join('--') + val);
            });
            level--;
        }
};

function addUserCount(node){
    if(node){
        node.data.count = node.data.count + 1;
        addUserCount(node.parent);
    }
}

function removeUserCount(node){
    if(node){
        node.data.count = node.data.count -1 ;
        removeUserCount(node.parent);
    }
}

function findNodes(arr, tree, findData) {
    if ( tree.data.name === findData) {
        arr.push(tree);
    }
    for (var i in tree.childrens) {
        findNodes(arr, tree.childrens[i], findData);
    }
};

/*function findPathToAdd(root, data, toNode, str) {
    var arr = [];
    findNodes(arr, root, toNode);
    if( arr.length === 1) {
        root.addNode(data, toNode);
    }
    else {
        var tmpTree = new Tree();
        tmpTree.root = root;
        var arr2 = str.split("->");
        var index = arr2[1].trim();
        tmpTree.print();
        delete tmpTree.root.childrens[index];
        tmpTree.print();
        //console.log(tmpTree.root.childrens[index]);
    }
}*/

function hasPath(root, arr, x) {
    if (!root)
        return false;
    arr.push(root.data.name);
    if (root === x)
        return true;
    for (var i in root.childrens) {
        var flag = hasPath(root.childrens[i], arr, x);
        if (flag) {
            return true;
        }
    }
    arr.pop();
    return false;
}

function printPath(node) {
    var tree = tree1.root;
    var arr = [];
    var str = "";
    if (hasPath(tree, arr, node)) {
        for (var i = 0; i < arr.length - 1; i++) {
            str += arr[i] + " -> ";
            //console.log(arr[arr.length - 1]);
        }
    }
    str += arr[arr.length - 1];
    //console.log(str);
    return str;
}

function checkUnique(name,node){
    if(node){
        /* node.childrens.forEach(function(val){
             queue.unshift(val);
         });*/
        for(var i in node.childrens){
            if(i===name){
                return true;
            }
        }
    }
    return false;
}

var tree1 = new Tree();

//var user1 = {name: "ravid", password: "123", age: 28};
//var user2 = {name: "orel", password: "123", age: 28};
/*tree1.addNode('group1');
tree1.addNode('group2', 'group1');
tree1.addNode('group3', 'group1');
tree1.addNode('group4', 'group3');
tree1.addNode('group5', 'group3');
tree1.addNode('group6', 'group2');
tree1.addNode('group10', 'group6');
tree1.addNode('group8', 'group2');
tree1.addNode('group6', 'group1');
tree1.addNode('group9', 'group8');
//tree1.checkForDuplicate('group6');
tree1.print2();
*/
//tree1.addNode('group26','group6');
//tree1.removeNode('group6');
//tree1.addUser(user,'group1');

/*setTimeout(function () {
    tree1.print();
}, 8000);// tree1.print();*/

//tree1.run();
//tree1.print();

module.exports = Tree;
//exports.runAdd = runAdd;