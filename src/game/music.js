import { Sound } from "excalibur"

import song from "../assets/music/TheJunglesHeartbeat.mp3"

export class MusicManager {
    constructor(loader) {
        // loader: ex.Loader
        this.theme = new Sound(song)
        loader.addResource(this.theme)
    }

    play() {
        this.theme.play(0.1)
    }
}
