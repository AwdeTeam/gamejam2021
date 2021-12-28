import React, { useState, useEffect, useLayoutEffect, useRef } from "react"

import "./styles/App.css"

function App() {
    const [game, setGame] = useState(null)

    const canvasRef = useRef()

    console.log(game)
    useEffect(() => {
        import("./game/game").then(({ initialize }) => {
            // Runs once, only after the component is mounted
            setGame(initialize(canvasRef.current))
        })
    }, [])

    useLayoutEffect(() => {
        import("./game/game").then(({ start }) => {
            start(game)
        })
    }, [game])

    import.meta.webpackHot.accept("./game/game", ({ initialize }) => {
        setGame(initialize(canvasRef.current, true))
    })

    return (
        <div className="App">
            <br />
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
