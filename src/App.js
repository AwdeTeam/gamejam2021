import React, { useState } from "react"

import * as ex from "excalibur"

import "./styles/App.css"

function App() {
    const [game, setGame] = useState(null)
    const [started, setStarted] = useState(false)

    const startGame = () => {
        game.start()
        setStarted(true)
    }

    if (game === null) {
        setGame(new ex.Engine({}))
    }

    return (
        <div className="App">
            <div style={{
                border: "solid black 1 px",
            }}
            >
                {(started) ? game : startGame()}
            </div>
        </div>
    )
}

export default App
