/* player.js */

import { Actor, Vector, Input, Color, CollisionType } from "excalibur"
import { randomNumber } from "./util"

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
        // originator is necessary so that we don't collide with ourselves?
        super(game, config)

        this.originator = config.originator

        this.body.collisionType = CollisionType.Passive

        const { lifetime, velocity } = config
        this.lifetime = lifetime
        this.velocity = new Vector(velocity.x, velocity.y)

        this.on("collisionstart", ({ other }) => {
            // eslint-disable-next-line no-underscore-dangle
            if (other._name === this.originator._name) { return }
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

        this.fireCooldown = 0
        this.cooldownMax = 300
    }

    hit(damage) {
        this.health -= damage
        console.log("Hit! health now")
        console.log(this.health)
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

    lifeUpdate() {
        this.removeIfDead()
    }

    onPreUpdate(engine, delta) {
        this.lifeUpdate()
        this.fireCooldown -= delta
    }

    FIRE() {
        if (this.fireCooldown > 0) { return }
        this.fireCooldown = this.cooldownMax

        // TODO: add bullet types
        this.game.addActor(Projectile, {
            x: this.pos.x,
            y: this.pos.y,
            width: 5,
            height: 5,

            velocity: { x: -Math.cos(this.rotation), y: -Math.sin(this.rotation) },
            lifetime: 100,

            color: Color.Red,
            originator: this
        })
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

        this.speed = 0.1
        this.targetLoc = this.pos
        this.targetAcquired = false
        this.timeInStrategy = 50000000 // amount of time we've spent moving to targetLoc
    }


    onPreUpdate(engine, delta) {
        LivingActor.prototype.onPreUpdate.call(this, engine, delta)
        // enemy moving logic

        this.timeInStrategy += delta

        // enemy rotation logic
        const diffVector = this.pos.sub(this.game.player.pos)
        this.rotation = diffVector.toAngle()

        // determine distance to player
        if (diffVector.magnitude() < 300) {
            this.targetLoc = this.game.player.pos
            this.targetAcquired = true
            this.timeInStrategy = 0
        }
        else {
            this.targetAcquired = false
        }

        if (diffVector.magnitude() < 200) {
            this.FIRE()
        }


        if (this.timeInStrategy > 5000 && !this.targetAcquired) {
            console.log("Re-evaluating")

            // pick a random location
            const x = randomNumber(0, 1200)
            const y = randomNumber(0, 850)

            this.targetLoc = new Vector(x, y)
            this.timeInStrategy = 0
        }

        if (this.targetLoc === undefined) { return }


        const diffPosVector = this.targetLoc.sub(this.pos)
        const posAdjustmentVector = Vector.fromAngle(diffPosVector.toAngle())

        if (posAdjustmentVector.x || posAdjustmentVector.y) {
            this.pos = this.pos.add(posAdjustmentVector.scale(delta * this.speed))
        }
    }


    onInitialize(engine) {
        const sprite = this.game.textures.enemy.toSprite()

        // TODO: this doesn't actually do anything??
        sprite.showDebug = this.game.config.development.debugSprites
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

        this.cooldownMax = 50

        this.size = config.size
        this.speed = config.speed

        const { input: { pointers: { primary } } } = this.engine

        // TODO: need to make this pointing logic apply when we move the player
        // too (cache the mouse pos)
        primary.on("move", ({ ev: { x, y } }) => {
            const mousePos = new Vector(x, y)
            const diffVector = this.pos.sub(mousePos.add(this.game.cameraCenter))
            this.rotation = diffVector.toAngle()
        })

        primary.on("down", ({ ev: { button } }) => {
            if (button === 0) {
                console.log(this.fireCooldown)
                this.FIRE()
                // this.game.addActor(Projectile, {
                //     x: this.pos.x,
                //     y: this.pos.y,
                //     width: 5,
                //     height: 5,

                //     velocity: { x: -Math.cos(this.rotation), y: -Math.sin(this.rotation) },
                //     lifetime: 100,

                //     color: Color.Red,
                //     originator: this
                // })
            }
        })
    }

    onInitialize(engine) {
        const sprite = this.game.textures.player.toSprite()
        // TODO: this doesn't actually do anything??
        sprite.showDebug = this.game.config.development.debugSprites

        sprite.scale = new Vector(2, 2)

        this.graphics.use(sprite)
    }

    onPreUpdate(engine, delta) {
        LivingActor.prototype.onPreUpdate.call(this, engine, delta)

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
