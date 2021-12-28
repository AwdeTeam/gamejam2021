/* eslint-disable */
import { Engine, Loader } from "excalibur"

import { MusicManager } from "./music"
import { Player } from "./player"
import makeLoader from "./assets"

const config = {
    display: {
        width: 1200,
        height: 850
    },
    player: {
        speed: 0.4,
        size: 10,
    }
}

export class Game {
    constructor(engine, loader) {
        // engine: ex.Engine
        // loader: ex.Loader
        this.loader = loader
        this.music = new MusicManager(this.loader)
        this.engine = engine

        this.setupPlayer()
    }

    addActor(cls, actorConfig) {
        const actor = new cls(this.engine, actorConfig)
        this.engine.add(actor)
        return actor
    }

    setupPlayer() {
        this.player = this.addActor(Player, config.player)
    }

    startMusic() {
        this.music.play()
    }
}

export function initialize(canvasElement) {
    const engine = new Engine({ 
        canvasElement,
        suppressPlayButton: true,

        ...config.display,

    })
    return engine
}

export function start(gameEngine) {
    const loader = makeLoader()
    const game = new Game(gameEngine, loader)

    return gameEngine.start(loader).then(function() { game.startMusic() })
}
