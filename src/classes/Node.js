export default class Node {

    constructor() {
        this.index = null;
        this.parent = null;
        this.children = [];
        this.depth = null;
        this.x = 0;
        this.y = 0;
        this.mod = 0;
        this.word = null;
    }

    leftSibling() {
        if (this.parent !== 0) {
            let index = this.parent.children.findIndex(child => {return child.index === this.index});
            return index === 0 ? null : this.parent.children[index-1];
        } else {
            return null;
        }
    }

    rightSibling() {
        if (this.parent !== 0) {
            let index = this.parent.children.findIndex(child => {return child.index === this.index});
            return this.parent.children[index+1] ? this.parent.children[index+1] : null;
        } else {
            return null;
        }
    }

    isLeftmost() {
        return this.leftSibling() === null;
    }

    isRightmost() {
        return this.rightSibling() === null;
    }

}
