import Sentence from './Sentence'
import Word from './Word'

export default class CONLLU {

    constructor() {
        this.name = ''
        this.sentences = []
    }

    //Parse CoNLL-U text
    parseFile(text) {
        let self = this
        let lines = text.split("\n")
        self.sentences = [new Sentence()]
        let current = 0

        //Remove trailing empty lines
        let trailingLine = lines[lines.length-1]
        while (trailingLine.length === 0) {
            lines.pop()
            trailingLine = lines[lines.length-1]
        }

        //Parse sentences
        lines.forEach(line => {
            if (line.indexOf('#') === 0) { //Comment
                self.sentences[current].comments.push(line)
            } else if (line.length === 0) { //New sentence
                self.sentences.push(new Sentence())
                current++
            } else {
                let index = line.match(/^\d+/)[0]
                let word = self.parseWord(line)
                self.sentences[current].words[index] = word
            }
        })
        self.sentences.forEach(sentence => {
            sentence.stringSentenceTogether()
        })
    }

    parseWord(line) {
        let word = new Word()
        let data = line.split("\t")
        if (data[0] !== '_') word.index = data[0]
        if (data[1] !== '_') word.inflection = data[1]
        if (data[2] !== '_') word.lemma = data[2]
        if (data[3] !== '_') word.uposTag = data[3]
        if (data[4] !== '_') word.xposTag = data[4]
        if (data[5] !== '_') word.features = this.parseList(data[5])
        if (data[6] !== '_') word.parent = data[6]
        if (data[7] !== '_') word.relation = data[7]
        if (data[8] !== '_') word.dependencies = data[8]
        if (data[9] !== '_') word.misc = this.parseList(data[9])
        //Check word has required properties
        if (!word.inflection) throw new Error('Invalid word')
        return word
    }

    //Parse key=value|key=value... property from CoNLL-U into object
    parseList(list) {
        let object = {}
        list = list.split("|")
        list.forEach(keyValue => {
            keyValue = keyValue.split("=")
            const key = keyValue[0]
            const value = keyValue[1]
            object[key] = value
        })
        return object
    }

    //Save state into CoNLL-U format
    generateFile() {

    }

}
