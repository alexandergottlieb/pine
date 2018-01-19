export default class Sentence {

    constructor() {
        this.sentence = ""
        this.words = []
        this.comments = []
    }

    stringSentenceTogether() {
        this.words.forEach(word => {
            let glue = word.uposTag === 'PUNCT' ? '' : ' ' //Add space between words but not punctuation
            this.sentence = this.sentence + glue + word.inflection
        })
    }

}
