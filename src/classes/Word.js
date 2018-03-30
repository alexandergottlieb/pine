export default class Word {

    constructor(word = {}) {
        this.index = word.index || null
        this.inflection = word.inflection || ''
        this.lemma = word.lemma || ''
        this.uposTag = word.uposTag || ''
        this.xposTag = word.xposTag || ''
        this.features = word.features || {}
        this.parent = word.parent === 0 ? 0 : word.parent || null //0 = artificial root, null = unset
        this.relation = word.relation || ''
        this.dependencies = word.dependencies || ''
        this.misc = word.misc || {}
        this.id = word.id || ''
    }

    validate() {
        const { index, parent } = this
        if (!index) throw "Each word must have a position in the sentence."
        if (parent !== 0 && !parent) throw "Each word must have a parent."
        if (parent < 0) throw "Invalid word parent."
        if (parent == index) throw "A word cannot be related to itself."
    }

}
