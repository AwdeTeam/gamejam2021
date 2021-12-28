import { Engine } from "excalibur"

export function initialize(canvasElement) {
    return new Engine({ canvasElement })
}
