export default class Word {

    constructor() {
        this.word = ''
        this.lemma = ''
        this.uposTag = ''
        this.xposTag = ''
        this.features = {}
        this.head = null //0 = artificial root, null = unset
        this.relation = ''
        this.dependencies = ''
        this.misc = {}
    }

}
