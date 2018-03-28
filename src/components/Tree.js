import React, { Component } from "react";
import equal from "equals"
import TreeDrawer from "../classes/TreeDrawer"
import Word from "./Word"
import Relation from "./Relation"
import Line from "./Line"
import "../css/Tree.css"

class Tree extends Component {

    constructor(props) {
        super(props)

        const { scaling } = props

        this.state = {
            nodes: [],
            units: {
                x: 14*scaling.rem, y: 10*scaling.rem
            }
        }

        this.children = {
            lines: []
        }

        this.animations = []

        this.mouse = {x:0, y:0}

        this.element = null
    }

    componentWillReceiveProps(nextProps) {
        const { scaling, sentence } = nextProps
        if (!equal(sentence.words, this.props.sentence.words)) this.layout(nextProps)
        this.setState({
            units: {
                x: 14*scaling.rem, y: 10*scaling.rem
            }
        })
    }

    componentDidMount() {
        this.layout(this.props)
        this.captureMouse()
    }

    componentWillUnmount() {
        this.cancelAnimation()
        this.releaseMouse()
    }

    //Calculate co-ordinates
    layout(props) {
        const { sentence, actions } = props
        try {
            //Calculate node positions
            let tree = new TreeDrawer(sentence)
            tree.positionNodes()
            const nodes = tree.nodes

            this.setState({
                nodes: nodes
            })
        } catch (e) {
            actions.addError(`Error drawing tree: ${e.message}`)
            this.setState({
                nodes: []
            })
        }
    }

    //Active relation line should follow mouse
    animate() {
        const self = this
        const { scaling, zoom, relations } = this.props

        const container = this.element
        const rect = container.getBoundingClientRect()
        //Origin is element offset + simulated padding, accounting for zoom
        const origin = {
            x: rect.x + (scaling.margin.x * zoom),
            y: rect.y + (scaling.margin.y * zoom)
        }
        const lines = this.children.lines.filter((line, index) => relations.indexOf(index) !== -1)

        lines.forEach((line, index) => {
            //Define animation
            const frame = () => {
                const x = (self.mouse.x + container.scrollLeft - origin.x) / zoom
                const y = (self.mouse.y + container.scrollTop - origin.y) / zoom
                line.element.setAttribute('x1', x)
                line.element.setAttribute('y1', y)
                self.animations[index] = window.requestAnimationFrame(frame)
            }
            //Clear any existing animation
            window.cancelAnimationFrame(self.animations[index])
            //Start animation
            self.animations[index] = window.requestAnimationFrame(frame)
        })
    }

    cancelAnimation() {
        this.animations.forEach(id => window.cancelAnimationFrame(id))
        this.animations = []
    }

    captureMouse() {
        document.body.addEventListener('mousemove', this.trackMouse.bind(this))
    }

    trackMouse = event => {
        this.mouse.x = event.clientX
        this.mouse.y = event.clientY
    }

    releaseMouse() {
        document.body.removeEventListener('mousemove', this.trackMouse.bind(this))
    }

    registerLine(element, childIndex) {
        this.children.lines[childIndex] = element
    }

    clickRoot() {
        const { relations, actions, editWord } = this.props
        try {
            if (relations.length > 1) throw "Only one word descends from root."
            relations.forEach(childIndex => {
                editWord(childIndex, {
                    parent: 0
                })
            })
        } catch (errorMessage) {
            actions.addError(errorMessage)
        }
    }

    render() {
        const { actions, currentWord, treebank, editWord, deleteWord, zoom, scaling } = this.props
        const { nodes } = this.state

        //Generate words
        const words = nodes.map(node => {
            const editable = node.index == currentWord ? true : false
            const realX = node.x * this.state.units.x
            const realY = node.y * this.state.units.y
            return <Word {...node} x={realX} y={realY}
                scaling={scaling}
                editWord={editWord}
                deleteWord={deleteWord}
                actions={actions}
                relations={relations}
                editable={editable}
                key={node.word.id}
            />
        })

        //Generate lines & relations
        let lines = []
        let relations = []
        nodes.forEach(node => {
            //Draw lines from parent to child
            node.children.forEach(child => {
                //Active if user is moving relation line of current child
                const active = relations.indexOf(child.index) !== -1

                //Line
                let coords = {};
                //Line start co-ordinate
                coords.x1 = node.x * this.state.units.x + (scaling.wordWidth/2)
                coords.y1 = node.y * this.state.units.y + scaling.rem
                //Line end co-ordinate
                coords.x2 = child.x * this.state.units.x + (scaling.wordWidth/2)
                coords.y2 = child.y * this.state.units.y + scaling.rem
                lines.push(<Line {...coords} active={active} key={child.word.id} ref={element => this.registerLine(element, child.index)} />)

                //Relation
                relations.push(<Relation
                    coords={coords}
                    word={child.word}
                    editWord={editWord}
                    actions={actions}
                    active={active} key={child.word.id}
                    relations={treebank.settings.relations}
                />)
            })
        })

        const rootNode = nodes.find(node => node && node.parent === 0)
        const rootStyle = rootNode ? {
            top: rootNode.y * this.state.units.y + "px",
            left: rootNode.x * this.state.units.x + scaling.wordWidth/2 + "px"
        } : {top: "0px", left: "0px"};

        const treeClasses = ["tree"]

        if (relations && relations.length > 0) {
            this.animate()
            treeClasses.push("tree--with-relations")
        } else {
            this.cancelAnimation()
        }

        return (
            <div className={treeClasses.join(' ')} ref={element => this.element = element}>
                <div className="tree__magnifier" style={{transform: `scale(${zoom})`}}>
                    <svg className="lines">{lines}</svg>
                    <div className="relations">
                        {relations}
                        <div className="tree__root" onClick={this.clickRoot.bind(this)} style={rootStyle}>root</div>
                    </div>
                    {words}
                </div>
            </div>
        )
    }

}

export default Tree;
