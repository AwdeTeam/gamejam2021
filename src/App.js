import React, { useState, useEffect, useLayoutEffect, useRef } from "react"

import "./styles/App.css"

function App() {
    const [game, setGame] = useState(null)
    const [tracked, setTracked] = useState({})

    const canvasRef = useRef()

    // console.log(game)
    useEffect(() => {
        import("./game/game").then(({ initialize }) => {
            // Runs once, only after the component is mounted
            setGame(initialize(canvasRef.current))
        })
    }, [])

    useLayoutEffect(() => {
        import("./game/game").then(({ start }) => {
            start(game, setTracked)
        })
    }, [game])

    import.meta.webpackHot.accept("./game/game", ({ initialize }) => {
        setGame(initialize(canvasRef.current))
    })

    return (
        <div className="App">
            <InfoBar tracked={tracked} />
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

function InfoBar({ tracked }) {
    return (
        <div>
            <table>
                <tr>
                    { Object.entries(tracked).map(([name, value]) => (
                        <td key={name}><b>{name}:</b> {value}</td>
                    ))}
                </tr>
            </table>
        </div>
    )
}

export default App
