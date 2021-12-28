/* eslint-disable */
import * as ex from "excalibur"

import { MusicManager } from "./music"
import { Player } from "./player"

export class Game {
    constructor(game) {
        // game: ex.Engine
        this.assets = new ex.Loader()

        this.music = new MusicManager(this.assets)
        this.music.play()

        this.game = game

        this.player = Player(this.game)
    }
}
