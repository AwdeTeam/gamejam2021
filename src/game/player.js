/* player.js */
/* eslint-disable */

import { Actor, Vector, Input, Color, CollisionType } from "excalibur"

export class BaseActor extends Actor {
    constructor(game, config) {
        super(config)

        this.game = game
        this.engine = game.engine
    }

    removeSelf() {
        this.engine.remove(this)
    }
}

class Projectile extends BaseActor {
    constructor(game, config) {
        super(game, config)

        const { lifetime, velocity } = config
        this.lifetime = lifetime
        this.velocity = new Vector(velocity.x, velocity.y)
    }

    onPreUpdate(engine, delta) {
        if (this.lifetime <= 0) {
            this.removeSelf()
        }
        this.pos = this.pos.add(this.velocity.scale(delta))
        this.lifetime -= delta
    }
}

export class Player extends BaseActor {
    constructor(game, config) {
        super(game, {
            name: "player",

            x: 500,
            y: 250,
            width: 40,
            height: 40,
        })

        this.size = config.size
        this.speed = config.speed

        this.body.collisionType = CollisionType.Fixed

        const { input: { pointers: { primary } } } = this.engine

        primary.on("move", ({ ev: { x, y } }) => {
            const mousePos = new Vector(x, y)
            const diffVector = this.pos.sub(mousePos)
            this.rotation = diffVector.toAngle()
        })

        primary.on("down", () => {
            try {
                this.game.addActor(Projectile, {
                    x: this.pos.x,
                    y: this.pos.y,
                    width: 5,
                    height: 5,

                    velocity: { x: Math.cos(this.rotation), y: Math.sin(this.rotation) },
                    lifetime: 100,

                     color: Color.Red,
                })
            } catch (ex) {
                console.log(ex)
            }
        })
    }

    onInitialize(engine) {
        let sprite = this.game.textures.player.toSprite()
        sprite.showDebug = this.game.config.development.debugSprites 
        sprite.scale = new Vector(2, 2)

        this.graphics.use(sprite)
    }

    onPreUpdate(engine, delta) {
        const { input: { keyboard } } = engine
        const moveVector = new Vector(
            keyboard.isHeld(Input.Keys.D) - keyboard.isHeld(Input.Keys.A),
            keyboard.isHeld(Input.Keys.S) - keyboard.isHeld(Input.Keys.W),
        )

        if (moveVector.x || moveVector.y) {
            this.pos = this.pos.add(moveVector.normalize().scale(delta * this.speed))
        }
    }
}
