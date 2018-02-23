export default class Sentence {

    constructor(sentence = {sentence: "", words: [], comments: []}) {
        this.sentence = sentence.sentence
        this.words = []
        sentence.words.forEach(word => this.words[word.index] = Object.assign({}, word))
        this.comments = []
        sentence.comments.forEach(comment => this.comments[comment.index] = Object.assign({}, comment))
    }

    stringSentenceTogether() {
        this.sentence = ""
        this.words.forEach(word => {
            let glue = (word.uposTag === 'PUNCT' || this.sentence === "") ? '' : ' ' //Add space between words but not punctuation
            this.sentence = this.sentence + glue + word.inflection
        })
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
