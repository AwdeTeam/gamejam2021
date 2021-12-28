/* eslint-disable */
import * as ex from "excalibur"

import song from "../assets/TheJunglesHeartbeat.mp3"


export class MusicManager {
    constructor(loader) {
        // loader: ex.Loader
        //this.theme = new ex.Sound("../assets/TheJunglesHeartbeat.mp3")
        this.theme = new ex.Sound(song)
        loader.addResource(this.theme)
    }

    play() {
        this.theme.play(0.5)
    }
}

