export default class Word {

    constructor() {
        this.inflection = ''
        this.lemma = ''
        this.uposTag = ''
        this.xposTag = ''
        this.features = {}
        this.parent = null //0 = artificial root, null = unset
        this.relation = ''
        this.dependencies = ''
        this.misc = {}
    }

}
