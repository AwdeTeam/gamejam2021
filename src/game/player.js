/* eslint-disable */
import * as ex from "excalibur"

export class Player {
    constructor(game) {
        this.size = 10
        this.texture = null





        
        this.game = game
        this.actor = new ex.Actor({
            x: 150,
            y: 20,
            width: 20,
            height: 20,
            color: ex.Color.Red
        })

        this.actor.body.collisionType = ex.CollisionType.Fixed
        this.game.add(this.actor)

        this.game.input.pointers.primary.on("move", this.mouseMove)
    }

    // TODO: 
    mouseMove(evt) {
        this.actor.pos.x += 2
    }

}
