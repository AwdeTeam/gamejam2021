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

        this.body.collisionType = CollisionType.Passive

        const { lifetime, velocity } = config
        this.lifetime = lifetime
        this.velocity = new Vector(velocity.x, velocity.y)

        this.on("collisionstart", ({ other }) => {
            console.log(other)
            try {
                other.hit(1)
                this.removeSelf()
            } catch (err) { console.log(err) }
        })
    }

    onPreUpdate(engine, delta) {
        if (this.lifetime <= 0) {
            this.removeSelf()
        }
        this.pos = this.pos.add(this.velocity.scale(delta))
        this.lifetime -= delta
    }
}

class LivingActor extends BaseActor {
    constructor(game, config) {
        super(game, config)

        const { health } = config
        this.health = health

        this.body.collisionType = CollisionType.Active
    }

    hit(damage) {
        this.health -= damage
    }

    removeIfDead() {
        if (this.health <= 0) {
            this.onPreDeath()
            this.removeSelf()
            this.onPostDeath()
        }
    }

    onPreDeath() {}

    onPostDeath() {}

    lifeUpdate(delta) {
        this.removeIfDead()
    }

    onPreUpdate(engine, delta) {
        this.lifeUpdate(delta)
    }
}

export class Enemy extends LivingActor {
    constructor(game, config) {
        super(game, {
            name: "enemy",

            width: 50,
            height: 30,

            color: Color.Orange,

            health: 10,
            ...config,
        })
    }
    
    
    onInitialize(engine) {
        let sprite = this.game.textures.enemy.toSprite()
        sprite.showDebug = this.game.config.development.debugSprites  // TODO: this doesn't actually do anything??
        sprite.scale = new Vector(2, 2)

        this.graphics.use(sprite)
    }
}

export class Player extends LivingActor {
    constructor(game, config) {
        super(game, {
            name: "player",

            x: 500,
            y: 250,
            width: 60, // these are apparently backwards from what one would expect
            height: 30,
            health: 10,
        })

        this.size = config.size
        this.speed = config.speed

        const { input: { pointers: { primary } } } = this.engine

        primary.on("move", ({ ev: { x, y } }) => {
            const mousePos = new Vector(x, y)
            const diffVector = this.pos.sub(mousePos)
            this.rotation = diffVector.toAngle()
        })

        primary.on("down", ({ ev: { button } }) => {
            if (button === 0) {
                this.game.addActor(Projectile, {
                    x: this.pos.x,
                    y: this.pos.y,
                    width: 5,
                    height: 5,

                    velocity: { x: Math.cos(this.rotation), y: Math.sin(this.rotation) },
                    lifetime: 100,

                     color: Color.Red,
                })
            }
        })
    }

    onInitialize(engine) {
        let sprite = this.game.textures.player.toSprite()
        sprite.showDebug = this.game.config.development.debugSprites // TODO: this doesn't actually do anything??

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
