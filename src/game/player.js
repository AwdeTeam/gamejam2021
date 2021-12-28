/* eslint-disable */
import * as ex from "excalibur"
import { Vector } from "excalibur"

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




        //this.game.input.keyboard.on("press", (evt) => {
        //    if (evt.key == ex.Input.Keys.W) {
        //        
        //    }
        //})
        

        this.game.input.pointers.primary.on("move", (evt) => { 
            this.mouseMove(evt)
        })
    }

    onPreUpdate(engine, delta) {
        //console.log("are we in preupdate")
        //this.rotation += .1
    }

    moveForward() {
        //this.vel.
    }

    // TODO: 
    mouseMove(evt) {
    	// first get position of mouse pointer
        //console.log("move")
        const { ev: { x, y }} = evt
        const mousePos = new Vector(x, y)
        const diffVector = mousePos.sub(this.pos)
        this.rotation = diffVector.toAngle()
    }

    //moveLeft(evt) {
    //    this.pos.x += 2
    //}
}
