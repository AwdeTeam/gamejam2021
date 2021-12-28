import React, { useState, useEffect, useRef } from "react"

import "./styles/App.css"

function App() {
    const [game, setGame] = useState(null)
    const [started, setStarted] = useState(false)

    const canvasRef = useRef()

    const startGame = () => {
        import("./game/game").then(({ start }) => {
            start(game)
            setStarted(true)
        })
    }

    console.log(game)
    useEffect(() => {
        import("./game/game").then(({ initialize }) => {
            // Runs once, only after the component is mounted
            setGame(initialize(canvasRef.current))
        })
    }, [])

    return (
        <div className="App">
            <br />
            { started || <button type="button" onClick={startGame}>Start</button> }
            <div style={{
                border: "solid black 1 px",
            }}
            >
                <canvas ref={canvasRef} />
            </div>
        </div>
    )
}

export default App
