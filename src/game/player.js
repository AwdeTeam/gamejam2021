/* player.js */
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
        this.speed = 0.1
        this.texture = null

        
        this.game = game

        this.body.collisionType = ex.CollisionType.Fixed




        this.game.input.keyboard.on("press", (evt) => {
            if (evt.key == ex.Input.Keys.W) {
                
            }
        })
        

        this.game.input.pointers.primary.on("move", (evt) => { 
            this.mouseMove(evt)
        })
    }

    onPreUpdate(engine, delta) {
        const moveVector = new Vector(
            engine.input.keyboard.isHeld(ex.Input.Keys.D) - engine.input.keyboard.isHeld(ex.Input.Keys.A),
            engine.input.keyboard.isHeld(ex.Input.Keys.S) - engine.input.keyboard.isHeld(ex.Input.Keys.W),
        )
        //console.log(moveVector)
        
        if (moveVector.x || moveVector.y) {
            this.pos = this.pos.add(moveVector.normalize().scale(delta * this.speed))
        }
    }

    moveForward(delta) {
    	// create vector with current player rotation and magnitude equal to speed*delta
    	let forwardVector = Vector.fromAngle(this.rotation)
        forwardVector.magnitude = this.speed * delta
      
      	this.pos = this.pos.add(forwardVector)
    }
  
  

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
