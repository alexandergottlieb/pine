export default class Node {

    constructor() {
        this.index = null;
        this.parent = null;
        this.children = [];
        this.depth = null;
        this.x = 0;
        this.y = 0;
        this.word = null;
    }

    indexAmongSiblings() {
        if (this.parent !== 0) {
            return this.parent.children.findIndex(child => {return child.index === this.index});
        } else {
            return 0;
        }
    }

}
