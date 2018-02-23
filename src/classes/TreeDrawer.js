import Node from './Node.js';

export default class TreeDrawer {

    constructor(sentence) {
        this.nodes = [];
        let self = this;

        sentence.words.forEach( (word, index) => {
            createNode(index);
        })

        function createNode(index) {
            //Check if node has been created already
            if (self.nodes[index]) return self.nodes[index];

            let node = new Node();
            node.index = Number(index);
            node.word = sentence.words[index]
            if (Number(node.word.parent) === 0) { //is root
                node.parent = 0;
                node.depth = 0;
                self.root = node;
            } else { //has parent
                node.parent = createNode(node.word.parent);
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
        this.postOrder(node => {
            //y co-ord
            node.y = node.depth;

            //position children
            if (node.children.length > 0) {
                //centre above children
                if (node.children.length === 1) {
                    //parent directly above child
                    if (node.isLeftmost()) {
                        node.x = node.children[0].x;
                    } else {
                        node.x = node.leftSibling().x + 1;
                        node.mod = node.x - node.children[0].x;
                    }
                } else {
                    //ensure subtrees do not overlap
                    //this is currently O(n^2) and can be improved if necessary
                    let rightContourAmongLeftSiblings = []
                    node.children.forEach(child => {
                        if (child.isLeftmost()) return;
                        //Update maximum contour among previous nodes
                        const leftSiblingsRightContour = this.rightContour(child.leftSibling());
                        leftSiblingsRightContour.forEach( (x, depth) => {
                            const currentMaxX = rightContourAmongLeftSiblings[depth] || 0
                            rightContourAmongLeftSiblings[depth] = Math.max(x, currentMaxX)
                        })
                        //Get left contour of current child
                        let currentLeftContour = this.leftContour(child);
                        //Shift is the minimum distance to prevent overlap
                        let shift = -1
                        currentLeftContour.forEach((minX, depth) => {
                            const prevMaxX = rightContourAmongLeftSiblings[depth] || 0
                            const shiftForThisDepth = prevMaxX - minX + 1
                            if (shiftForThisDepth > shift) shift = shiftForThisDepth
                        })
                        //Move parent and children
                        child.x += shift;
                        child.mod += shift;
                    });
                    //parent in midpoint between children
                    const midpoint = node.children[0].x + ( (node.children[node.children.length-1].x - node.children[0].x) / 2);
                    if (node.isLeftmost()) {
                        node.x = midpoint;
                    } else {
                        //save mod value to translate children later
                        node.x = node.leftSibling().x + 1;
                        node.mod = node.x - midpoint;
                    }
                }
            } else {
                //initial x co-ord
                let leftSibling = node.leftSibling();
                node.x = leftSibling !== null ? leftSibling.x + 1 : 0;
            }
        });

        //Generate final x values from accumulating ancestor's mods
        function finalXValues(node, modSum) {
            modSum = modSum || 0;
            node.x += modSum;
            modSum += node.mod;
            node.children.forEach(child => {finalXValues(child, modSum)});
        }

        finalXValues(this.root);
    }

    leftContour(node, modSum = 0, contour = []) {
        const x = node.x + modSum;
        //If current node is further left than the minimum for this level
        if (!contour[node.depth] || x < contour[node.depth]) {
            //Minimum = current node
            contour[node.depth] = x;
        }
        modSum += node.mod;
        node.children.forEach(child => {this.leftContour(child, modSum, contour)});
        return contour;
    }

    rightContour(node, modSum = 0, contour = []) {
        const x = node.x + modSum;
        //If current node is further right than the maximum for this level
        if (!contour[node.depth] || x > contour[node.depth]) {
            //Maximum = current node
            contour[node.depth] = x;
        }
        modSum += node.mod;
        node.children.forEach(child => {this.rightContour(child, modSum, contour)});
        return contour;
    }

    postOrder(callback, start) {
        start = start || this.root;
        let unvisited = [start];
        let order = [];
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

    breadthFirst(callback, start) {
        start = start || this.root;
        let unvisited = [start];
        let node;
        while(unvisited.length > 0) {
            node = unvisited.shift();
            callback(node);
            unvisited.push(...node.children);
        }
    }

}
