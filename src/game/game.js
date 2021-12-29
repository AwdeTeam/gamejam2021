import { Engine, Vector, ImageSource, Color } from "excalibur"

import { MusicManager } from "./music"
import { Player, Enemy } from "./player"
import makeLoader from "./assets"
import { randomNumber } from "./util"

// import textures
import texturePlayer from "../assets/images/Lizard.png"
import textureEnemy from "../assets/images/Lizard3.png"

const config = {
    development: {
        debugActors: false,
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
        this.engine.currentScene.camera.strategy.radiusAroundActor(this.player, 250)
    }

    setupEnemies() {
        for (let i = 0; i < 10; i += 1) {
            this.addActor(Enemy, { x: randomNumber(0, 1200), y: randomNumber(0, 800) })
        }
    }

    get screenCenter() {
        return new Vector(config.display.width / 2, config.display.height / 2)
    }

    get cameraCenter() {
        return this.engine.currentScene.camera.pos.sub(this.screenCenter)
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
