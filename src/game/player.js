/* eslint-disable */
import * as ex from "excalibur"

export class Player extends ex.Actor {
    constructor(game) {
        super({
            x: 150,
            y: 20,
            width: 20,
            height: 20,
            color: ex.Color.Red
        })
        this.size = 10
        this.texture = null

        
        this.game = game

        this.body.collisionType = ex.CollisionType.Fixed

        // this.game.input.pointers.primary.on("move", this.mouseMove)
    }

    // TODO: 
    // mouseMove(evt) {
    //     this.pos.x += 2
    // }

}
