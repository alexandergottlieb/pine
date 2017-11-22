import Node from './Node.js';

export default class Tree {

    constructor(sentence) {
        this.nodes = [];
        let self = this;

        for (let index in sentence) {
            createNode(index);
        }

        function createNode(index, child) {
            //Check if node has been created already
            if (self.nodes[index] != null) return self.nodes[index];

            let word = sentence[index];
            let node = new Node();
            node.index = Number(index);
            node.word = word.word;
            if (word.parent === 0) { //is root
                node.parent = 0;
                node.depth = 0;
                self.root = node;
            } else { //has parent
                node.parent = createNode(word.parent);
                //Add current node to parent as child
                if (node.parent.children.filter(child => {return child.index === index}).length === 0) {
                    node.parent.children.push(node);
                }
                node.depth = node.parent.depth+1;
            }
            self.nodes[index] = node;
            return node;
        }
    }

    positionNodes() {
        this.postOrder(function(node) {
            //y co-ord
            node.y = node.depth;

            //initial x co-ord
            if (node.children.length > 0) {
                //centre above children
                if (node.children.length === 1) {
                    //parent directly above child
                    node.x = node.children[0].x;
                } else {
                    //parent in midpoint between children
                    let midpoint = node.children.reduce((x, child) => {return x + (child.x / node.children.length)}, 0);
                    if (node.leftSibling() === null) { //is leftmost sibling
                        node.x = midpoint;
                    } else {
                        //save mod value to translate children later
                        node.x = node.leftSibling().x + 1;
                        node.mod = node.x - midpoint;
                    }
                }
            } else {
                let leftSibling = node.leftSibling();
                if (leftSibling === null) { //is leftmost node
                    node.x = 0;
                } else {
                    //ensure current subtree does not overlap with left siblings
                    // node.x = leftSibling.x + 1;
                    let subtreeExhausted = false;
                    while (!subtreeExhausted) {
                        let currentRightContour = left.children[left.children.length-1];
                        let currentLeftContour = right.children[0];
                    }
                }
            }
        });
    }

    contour(left, right, max, )

    postOrder(callback) {
        let unvisited = [];
        let order = [];
        unvisited.push(this.root);
        let node;
        while (unvisited.length > 0) {
          node = unvisited.pop();
          order.push(node);
          unvisited.push(...node.children);
        }
        while(order.length > 0) {
            callback(order.pop());
        }
    }

    breadthFirst(callback) {
        let unvisited =[this.root];
        let node;
        while(unvisited.length > 0) {
            node = unvisited.shift();
            callback(node);
            unvisited.push(...node.children);
        }
    }

}
