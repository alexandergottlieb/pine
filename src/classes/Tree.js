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
        //y co-ord
        this.breadthFirst(function(node, depth) {
            node.y = node.depth;
        });

        //initial x co-ord
        this.postOrder(function(node) {
            node.x = node.indexAmongSiblings();
        });
    }

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
