import { Engine, Logger, ImageSource, Color } from "excalibur"

import { MusicManager } from "./music"
import { Player, Enemy } from "./player"
import makeLoader from "./assets"

// import textures
import texturePlayer from "../assets/images/Lizard.png"
import textureEnemy from "../assets/images/Lizard3.png"

const config = {
    development: {
        debugActors: true,
        noPlayButton: true,
        silentMode: false,
    },
    display: {
        width: 1200,
        height: 850,
        backgroundColor: new Color(20, 30, 5)
    },
    player: {
        speed: 0.4,
        size: 10,
    },
}

function loadTexture(textureImport, loader) {
    const texture = new ImageSource(textureImport)
    loader.addResource(texture)
    return texture
}

export class Game {
    constructor(engine, loader) {
        // engine: ex.Engine
        // loader: ex.Loader
        this.config = config
        this.loader = loader
        this.music = new MusicManager(this.loader)
        this.engine = engine

        this.textures = {}

        this.loadTextures()
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

    loadTextures() {
        this.textures.player = loadTexture(texturePlayer, this.loader)
        this.textures.enemy = loadTexture(textureEnemy, this.loader)
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
    const game = new Game(gameEngine, loader, config)

    gameEngine.start(loader).then(() => game.startMusic()).then(
        () => {
            console.log("Started!")
        },
        (err) => {
            console.log(err)
        }
    )
}
