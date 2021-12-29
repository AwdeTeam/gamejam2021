import { Engine, Vector, ImageSource, Color } from "excalibur"

import { MusicManager } from "./music"
import { Player, Enemy, Bush } from "./player"
import makeLoader from "./assets"
import { randomNumber, randomFloat } from "./util"

// import textures
import texturePlayer from "../assets/images/Lizard.png"
import textureEnemy from "../assets/images/Lizard3.png"
import textureBush from "../assets/images/Bush.png"
import textureBush2 from "../assets/images/Bush2.png"

const config = {
    development: {
        debugActors: false,
        noPlayButton: true,
        silentMode: false,
        updateInterval: 250, // How many milliseconds (at minimum) between infobar updates?
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
    constructor(engine, loader, setTracked) {
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
        this.setupBushes()

        this.updateCooldown = config.development.updateInterval
        this.engine.onPostUpdate = (eng, delta) => {
            Engine.prototype.onPostUpdate.call(this.engine, eng, delta)
            if (this.updateCooldown <= 0) {
                setTracked({
                    x: this.player.pos.x.toFixed(3),
                    y: this.player.pos.y.toFixed(3),
                    hp: this.player.health,
                    thirst: this.player.thirst.toFixed(2),
                })
                this.updateCooldown = config.development.updateInterval
            }
            else {
                this.updateCooldown -= delta
            }
        }
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
        for (let i = 0; i < 20; i += 1) {
            this.addActor(Enemy, { x: randomNumber(-100, 1300), y: randomNumber(-100, 900) })
        }
    }

    setupBushes() {
        for (let i = 0; i < 1000; i += 1) {
            this.addActor(Bush, {
                x: randomNumber(-5000, 5000),
                y: randomNumber(-5000, 5000),
                width: 50,
                height: 50,
                scaling: randomFloat(1, 5),
                rotation: randomFloat(0, 7),
            })
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
        this.textures.bush = loadTexture(textureBush, this.loader)
        this.textures.bush2 = loadTexture(textureBush2, this.loader)
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

export function start(gameEngine, setTracked) {
    const loader = makeLoader()
    const game = new Game(gameEngine, loader, setTracked)

    gameEngine.start(loader).then(() => game.startMusic()).then(
        () => {
            console.log("Started!")
        },
        (err) => {
            console.log(err)
        }
    )
}
