import { Engine, Logger } from "excalibur"

import { MusicManager } from "./music"
import { Player, Enemy } from "./player"
import makeLoader from "./assets"

const config = {
    development: {
        debugActors: false,
        noPlayButton: true,
        silentMode: true,
    },
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
        this.setupEnemies()
    }

    addActor(Cls, actorConfig) {
        const actor = new Cls(this, actorConfig)
        this.engine.add(actor)
        return actor
    }

    setupPlayer() {
        this.player = this.addActor(Player, config.player)
    }

    setupEnemies() {
        this.addActor(Enemy, { x: 100, y: 100 })
    }

    startMusic() {
        if (!config.development.silentMode) {
            this.music.play()
        }
    }
}

export function initialize(canvasElement) {
    const engine = new Engine({
        canvasElement,
        suppressPlayButton: config.development.noPlayButton,

        ...config.display,

    })

    if (config.development.debugActors) {
        engine.toggleDebug()
    }

    window.engine = engine

    return engine
}

export function start(gameEngine) {
    const loader = makeLoader()
    const game = new Game(gameEngine, loader)

    gameEngine.start(loader).then(() => game.startMusic()).then(
        () => {
            console.log("Started!")
        },
        (err) => {
            console.log(err)
        }
    )
}
