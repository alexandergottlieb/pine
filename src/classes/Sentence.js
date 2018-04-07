import Word from "./Word"

export default class Sentence {

    constructor(sentence = {sentence: ""}) {
        Object.assign(this, sentence)
        this.words = []
        if (Array.isArray(sentence.words)) this.words = sentence.words.map(word => new Word(word))
        this.comments = []
        if (Array.isArray(sentence.comments)) this.comments = sentence.comments.map(comment => comment)
        this.emptyNodes = []
        if (Array.isArray(sentence.emptyNodes)) this.emptyNodes = sentence.emptyNodes.map(word => new Word(word))
        if (!this.sentence) this.stringSentenceTogether()
        this.lastEdited = sentence.lastEdited || null
    }

    stringSentenceTogether() {
        //Glue words to form sentence
        this.sentence = ""
        this.words.forEach(word => {
            let glue = (word.uposTag === 'PUNCT' || this.sentence === "") ? '' : ' ' //Add space between words but not punctuation
            this.sentence = this.sentence + glue + word.inflection
        })
    }

    wordByIndex(index) {
        const word = this.words.find(word => word && word.index === index)
        if (word === undefined) throw new Error(`Could not find word at index ${index}`)
        return word
    }

    rootWord() {
        return this.words.find(word => word && word.parent === 0)
    }

    wordCount() {
        let count = 0
        this.words.forEach(word => {
            if (word) count++
        })
        return count
    }

    validate() {
        //Validate word data
        this.words.forEach(word => word.validate())

        //Dependency grammar validation
        let words = []
        this.words.forEach(word => words[word.index] = Object.assign({}, word))
        //Set children array on parents
        words = words.map(word => { return {...word, children: []} })
        words.forEach(word => {
            const { parent, index } = word
            if (parent != 0) words[parent].children.push(index) //Execpt artificial root
        })

        //check every node is reachable from root => no cycles
        let unvisited = [words.find(word => word && word.parent == 0)]
        let visited = []
        let current = null
        while (unvisited.length > 0) {
            current = unvisited.pop()
            visited.push(current)
            current.children.forEach(childIndex => unvisited.push(words[childIndex]))
        }
        if (visited.length !== words.filter(word => word !== undefined).length) throw "A word cannot be related to one of its descendents"
    }

}
