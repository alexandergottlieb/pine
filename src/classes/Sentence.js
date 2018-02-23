export default class Sentence {

    constructor(sentence = null) {
        this.sentence = ""
        this.words = []
        this.comments = []
        if (sentence !== null) {
            this.sentence = sentence.sentence
            this.words = sentence.words.slice(0)
            this.comments = sentence.comments.slice(0)
        }
    }

    stringSentenceTogether() {
        this.sentence = ""
        this.words.forEach(word => {
            let glue = word.uposTag === 'PUNCT' ? '' : ' ' //Add space between words but not punctuation
            this.sentence = this.sentence + glue + word.inflection
        })
    }

    //Throw if sentence violates dependency grammar rules
    validate() {
        let words = this.words.slice(0)
        words.map(word => Object.assign(word, {children: []}))
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
