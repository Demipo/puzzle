import React, {Component} from "react";
import originalImage from "./image/original.jpg";
import "./Puzzle.css";

class Puzzle extends Component {

    constructor() {
        super();
        this.state = {
            pieces: [],
            shuffled: [],
            solved: [],
            reply: ""
        };

        this.shuffledPieces = this.shuffledPieces.bind(this);
        this.renderPieceContainer = this.renderPieceContainer.bind(this);

    }

    componentDidMount() {
        const pieces = [...Array(48)].map((_, i) => ({
            img: `image_part_${("00" + (i + 1)).substr(-3)}.jpg`,
            order: i,
            board: "shuffled"
        }));
        this.setState({
            pieces,
            shuffled: this.shuffledPieces(pieces),
            solved: [...Array(48)]
        });
    }

    shuffledPieces(pieces) {
        const shuffled = [...pieces];
        for (let i = shuffled.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    renderPieceContainer(piece, index, boardName) {
        return (
            <li key = {index} onDragOver = {e => e.preventDefault()}
                onDrop = {e => this.onDrop(e, index, boardName)}>
                {
                    piece && (
                    <img draggable 
                        onDragStart = {e =>this.onDragStart(e, piece.order)}
                        src = {require(`./image/${piece.img}`)}
                    />
                    )
                }
        </li>
        );
    }

    onDragStart(e, order) {
        e.dataTransfer.setData("text/plain", order);
    }

    onDrop(e, index, targetName) {
        let target = this.state[targetName];
        if (target[index]) return;

        const pieceOrder = e.dataTransfer.getData("text");
        const pieceData = this.state.pieces.find(p => p.order === +pieceOrder);
        const origin = this.state[pieceData.board];

        if (targetName === pieceData.board) target = origin;
        origin[origin.indexOf(pieceData)] = undefined;
        target[index] = pieceData;
        pieceData.board = targetName;
        this.setState({[pieceData.board]: origin, [targetName]: target});
    }

    onClickHandler() {
        this.state.solved.map((jigsaw, index) => {
            console.log(this.state.solved.order);
            if (this.state.solved !== undefined && this.state.solved.order === index) {
                this.setState({
                    reply: "Good job!!"
                })
            } else {
                this.setState({
                    reply: "Keep trying!!"
                })
            }
        })
    }

    render() {
        return (
            <div className = "jigsaw" >
                <ul className = "jigsaw__shuffled-board" >
                    {
                        this.state.shuffled.map((piece, i) => this.renderPieceContainer(piece, i, "shuffled"))
                    }
                </ul>
                <ol className = "jigsaw__solved-board" style = {{ backgroundImage: `url(${originalImage})`}}>
                    {
                        this.state.solved.map((piece, i) => this.renderPieceContainer(piece, i, "solved"))
                    }
                </ol>
                <div>
                    <input type = "submit" onClick = {this.onClickHandler.bind(this)}/>
                        <div style = {{color: "white"}}>
                            {
                                this.state.reply
                            }
                        </div>
                </div>
            </div>
        );
    }
}

export default Puzzle;
