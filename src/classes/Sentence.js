export default class Sentence {

    constructor(sentence = {sentence: "", index: null}) {
        Object.assign(this, sentence)
        this.words = []
        if (Array.isArray(sentence.words)) sentence.words.forEach( word => this.words.push({...word}) )
        this.comments = []
        if (Array.isArray(sentence.comments)) sentence.comments.forEach( comment => this.comments.push({...comment}) )
    }

    stringSentenceTogether() {
        this.sentence = ""
        this.words.forEach(word => {
            let glue = (word.uposTag === 'PUNCT' || this.sentence === "") ? '' : ' ' //Add space between words but not punctuation
            this.sentence = this.sentence + glue + word.inflection
        })
    }

    wordByIndex(index) {
        return this.words.find(word => word && word.index === index)
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

    //Throw if sentence violates dependency grammar rules
    validate() {
        let words = []
        this.words.forEach(word => words[word.index] = Object.assign({}, word))
        words = words.map(word => { return {...word, children: []} })

        //Basic validation
        words.forEach(word => {
            const { parent, index } = word
            if (parent < 0) throw "Something is very wrong."
            if (parent == word.index) throw "A word cannot be related to itself."
            if (parent != 0) words[parent].children.push(index)
        })

        //Check every node is reachable from root => no cycles
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
