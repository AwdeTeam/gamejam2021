/* eslint-disable */
import { Engine, Loader } from "excalibur"

import { MusicManager } from "./music"
import { Player } from "./player"
import makeLoader from "./assets"

export class Game {
    constructor(game, loader) {
        // game: ex.Engine
        // loader: ex.Loader
        this.loader = loader
        this.music = new MusicManager(this.loader)

        this.game = game

        // this.player = new Player(this.game)
    }

    startMusic() {
        this.music.play()
    }
}

export function initialize(canvasElement) {
    const engine = new Engine({ canvasElement })
    return engine
}

export function start(gameEngine) {
    const loader = makeLoader()
    const game = new Game(gameEngine, loader)

    return gameEngine.start(loader).then(function() { game.startMusic() })
}
