import { Engine, Loader } from "excalibur"

import { MusicManager } from "./music"
import { Player } from "./player"

export class Game {
    constructor(game) {
        // game: ex.Engine
        this.assets = new Loader()

        this.music = new MusicManager(this.assets)
        this.music.play()

        this.game = game

        this.player = Player(this.game)
    }
}

import makeLoader from "./assets"

export function initialize(canvasElement) {
    const engine = new Engine({ canvasElement })
    const game = new Game(engine)
    return engine
}

export function start(gameEngine) {
    return gameEngine.start(makeLoader())
}
