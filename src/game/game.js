/* eslint-disable */

import { Engine, Logger, ImageSource, Color } from "excalibur"

import { MusicManager } from "./music"
import { Player } from "./player"
import makeLoader from "./assets"



// import textures
import texturePlayer from "../assets/images/Lizard.png" 


const config = {
    development: {
        debugActors: false,
        noPlayButton: true,
        silentMode: false,
        debugSprites: false,
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
    let texture = new ImageSource(textureImport)
    loader.addResource(texture)
    return texture
}

export class Game {
    constructor(engine, loader, config) {
        // engine: ex.Engine
        // loader: ex.Loader
        this.config = config
        this.loader = loader
        this.music = new MusicManager(this.loader)
        this.engine = engine

        this.textures = {}

        this.loadTextures()
        this.setupPlayer()
    }

    addActor(Cls, actorConfig) {
        const actor = new Cls(this, actorConfig)
        this.engine.add(actor)
        return actor
    }

    setupPlayer() {
        this.player = this.addActor(Player, config.player)
    }

    loadTextures() {
        this.textures["player"] = loadTexture(texturePlayer, this.loader)
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

    engine._logger.info = console.log // eslint-disable-line no-underscore-dangle

    if (config.development.debugActors) {
        engine.toggleDebug()
    }

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
