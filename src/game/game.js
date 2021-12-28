import { Engine } from "excalibur"

import makeLoader from "./assets"

export function initialize(canvasElement) {
    return new Engine({ canvasElement })
}

export function start(gameEngine) {
    return gameEngine.start(makeLoader())
}
