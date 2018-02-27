import Sentence from './Sentence'
import Word from './Word'

export default class CONLLU {

    constructor(name = '', sentences = []) {
        this.name = name
        this.sentences = sentences
        this.multitokens = false
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
            } else if (line.match(/^\d+[-.]/)) { //Multitoken
                //Skip
                self.multitokens = true
            } else { //Word
                let word = self.parseWord(line)
                self.sentences[current].words.push(word)
            }
        })
        self.sentences.forEach( (sentence, index) => {
            //Orphan words should point to root descendent
            let rootDescendent = sentence.words.find(word => word.parent === 0) || null
            sentence.words.forEach(word => {
                if (word.parent === null
                    || (word.parent === 0 && word.index !== rootDescendent.index) //Only be one root descendent, any others with 0 are set to the first
                ) {
                    if (rootDescendent === null) { //If no root descendent, set as the first orphan
                        rootDescendent = word.index
                        word.parent = 0
                    } else { //descend from root descendent
                        word.parent = rootDescendent.index
                    }
                }
            })
            //Sentence needs metadata
            sentence.stringSentenceTogether()
            sentence.index = index
        })
    }

    parseWord(line) {
        let word = new Word()
        let data = line.split("\t")
        //Words must at least have an index
        if (data[0] === undefined || !data[0].match(/^\d/)) {
            throw new Error("some words are missing indices")
        }
        if (data[0] !== undefined && data[0] !== '_') word.index = Number(data[0])
        if (data[1] !== undefined && data[1] !== '_') word.inflection = String(data[1])
        if (data[2] !== undefined && data[2] !== '_') word.lemma = String(data[2])
        if (data[3] !== undefined && data[3] !== '_') word.uposTag = String(data[3]).toUpperCase()
        if (data[4] !== undefined && data[4] !== '_') word.xposTag = String(data[4]).toUpperCase()
        if (data[5] !== undefined && data[5] !== '_') word.features = this.parseList(data[5])
        if (data[6] !== undefined && data[6] !== '_') word.parent = Number(data[6])
        if (data[7] !== undefined && data[7] !== '_') word.relation = String(data[7]).toLowerCase()
        if (data[8] !== undefined && data[8] !== '_') word.dependencies = data[8]
        if (data[9] !== undefined && data[9] !== '_') word.misc = this.parseList(data[9])
        return word
    }

    //Parse key=value|key=value... property from CoNLL-U into object
    parseList(list) {
        let object = {}
        list = list.split("|")
        list.forEach(keyValue => {
            keyValue = keyValue.split("=")
            const key = keyValue[0].trim()
            const value = keyValue[1].trim()
            object[key] = value
        })
        return object
    }

    //Save state into CoNLL-U format
    export() {
        const wordToConll = word => {
            const stringifyList = object => {
                let pairs = []
                for (const key in object) {
                    pairs.push(`${key}=${object[key]}`)
                }
                let string = pairs.join("|")
                return string ? string : "_"
            }
            let data = [].fill("_", 0, 9)
            data[0] = word.index || "_"
            data[1] = word.inflection || "_"
            data[2] = word.lemma || "_"
            data[3] = word.uposTag || "_"
            data[4] = word.xposTag || "_"
            data[5] = stringifyList(word.features)
            data[6] = word.parent || "_"
            data[7] = word.relation || "_"
            data[8] = word.dependencies || "_"
            data[9] = stringifyList(word.misc)
            return data.join("\t")
        }

        let lines = []
        this.sentences.forEach(sentence => {
            sentence.comments.forEach(comment => lines.push(comment))
            sentence.words.forEach(word => lines.push(wordToConll(word)))
            lines[lines.length-1] += "\n" //sentence separator
        })

        return lines.join("\n")
    }

    //Get list of relation tags
    static relations() {
        return [ "acl", "advcl", "advmod", "amod", "appos", "aux", "auxpass", "case", "cc", "ccomp", "compound", "conj", "cop", "csubj", "csubjpass", "dep", "det", "discourse", "dislocated", "dobj", "expl", "foreign", "goeswith", "iobj", "list", "mark", "mwe", "name", "neg", "nmod", "nsubj", "nsubjpass", "nummod", "parataxis", "punct", "remnant", "reparandum", "root", "vocative", "xcomp" ]
        // return [
        //   {
        //     "value": "acl",
        //     "label": "Clausal Modifier Of Noun (Adjectival Clause)"
        //   },
        //   {
        //     "value": "advcl",
        //     "label": "Adverbial Clause Modifier"
        //   },
        //   {
        //     "value": "advmod",
        //     "label": "Adverbial Modifier"
        //   },
        //   {
        //     "value": "amod",
        //     "label": "Adjectival Modifier"
        //   },
        //   {
        //     "value": "appos",
        //     "label": "Appositional Modifier"
        //   },
        //   {
        //     "value": "aux",
        //     "label": "Auxiliary"
        //   },
        //   {
        //     "value": "auxpass",
        //     "label": "Passive Auxiliary"
        //   },
        //   {
        //     "value": "case",
        //     "label": "Case Marking"
        //   },
        //   {
        //     "value": "cc",
        //     "label": "Coordinating Conjunction"
        //   },
        //   {
        //     "value": "ccomp",
        //     "label": "Clausal Complement"
        //   },
        //   {
        //     "value": "compound",
        //     "label": "Compound"
        //   },
        //   {
        //     "value": "conj",
        //     "label": "Conjunct"
        //   },
        //   {
        //     "value": "cop",
        //     "label": "Copula"
        //   },
        //   {
        //     "value": "csubj",
        //     "label": "Clausal Subject"
        //   },
        //   {
        //     "value": "csubjpass",
        //     "label": "Clausal Passive Subject"
        //   },
        //   {
        //     "value": "dep",
        //     "label": "Unspecified Dependency"
        //   },
        //   {
        //     "value": "det",
        //     "label": "Determiner"
        //   },
        //   {
        //     "value": "discourse",
        //     "label": "Discourse Element"
        //   },
        //   {
        //     "value": "dislocated",
        //     "label": "Dislocated Elements"
        //   },
        //   {
        //     "value": "dobj",
        //     "label": "Direct Object"
        //   },
        //   {
        //     "value": "expl",
        //     "label": "Expletive"
        //   },
        //   {
        //     "value": "foreign",
        //     "label": "Foreign Words"
        //   },
        //   {
        //     "value": "goeswith",
        //     "label": "Goes With"
        //   },
        //   {
        //     "value": "iobj",
        //     "label": "Indirect Object"
        //   },
        //   {
        //     "value": "list",
        //     "label": "List"
        //   },
        //   {
        //     "value": "mark",
        //     "label": "Marker"
        //   },
        //   {
        //     "value": "mwe",
        //     "label": "Multi-Word Expression"
        //   },
        //   {
        //     "value": "name",
        //     "label": "Name"
        //   },
        //   {
        //     "value": "neg",
        //     "label": "Negation Modifier"
        //   },
        //   {
        //     "value": "nmod",
        //     "label": "Nominal Modifier"
        //   },
        //   {
        //     "value": "nsubj",
        //     "label": "Nominal Subject"
        //   },
        //   {
        //     "value": "nsubjpass",
        //     "label": "Passive Nominal Subject"
        //   },
        //   {
        //     "value": "nummod",
        //     "label": "Numeric Modifier"
        //   },
        //   {
        //     "value": "parataxis",
        //     "label": "Parataxis"
        //   },
        //   {
        //     "value": "punct",
        //     "label": "Punctuation"
        //   },
        //   {
        //     "value": "remnant",
        //     "label": "Remnant In Ellipsis"
        //   },
        //   {
        //     "value": "reparandum",
        //     "label": "Overridden Disfluency"
        //   },
        //   {
        //     "value": "root",
        //     "label": "Root"
        //   },
        //   {
        //     "value": "vocative",
        //     "label": "Vocative"
        //   },
        //   {
        //     "value": "xcomp",
        //     "label": "Open Clausal Complement"
        //   }
        // ]
    }

    //Get list of UPOS tags
    static uposTags() {
        // return [ "ADJ", "ADP", "ADV", "AUX", "CONJ", "DET", "INTJ", "NOUN", "NUM", "PART", "PRON", "PROPN", "PUNCT", "SCONJ", "SYM", "VERB", "X" ]
        return [
          {
            "value": "ADJ",
            "label": "Adjective"
          },
          {
            "value": "ADP",
            "label": "Adposition"
          },
          {
            "value": "ADV",
            "label": "Adverb"
          },
          {
            "value": "AUX",
            "label": "Auxiliary Verb"
          },
          {
            "value": "CONJ",
            "label": "Coordinating Conjunction"
          },
          {
            "value": "DET",
            "label": "Determiner"
          },
          {
            "value": "INTJ",
            "label": "Interjection"
          },
          {
            "value": "NOUN",
            "label": "Noun"
          },
          {
            "value": "NUM",
            "label": "Numeral"
          },
          {
            "value": "PART",
            "label": "Particle"
          },
          {
            "value": "PRON",
            "label": "Pronoun"
          },
          {
            "value": "PROPN",
            "label": "Proper Noun"
          },
          {
            "value": "PUNCT",
            "label": "Punctuation"
          },
          {
            "value": "SCONJ",
            "label": "Subordinating Conjunction"
          },
          {
            "value": "SYM",
            "label": "Symbol"
          },
          {
            "value": "VERB",
            "label": "Verb"
          },
          {
            "value": "X",
            "label": "Other"
          }
        ]
    }

}
