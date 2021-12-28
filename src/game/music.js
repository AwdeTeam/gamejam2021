/* eslint-disable */
import * as ex from "excalibur"


export class MusicManager {
    constructor(loader) {
        // loader: ex.Loader
        this.theme = new ex.Sound("/assets/TheJunglesHeartbeat.mp3")
        loader.addResource(this.theme)
    }

    play() {
        this.theme.play()
    }
}

