//constuctor for background sprites and other cosmetics 

class Sprite {
    constructor( {position, imageSrc, scale = 1, framesTotal = 1, offset = {x: 0, y: 0}} ) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesTotal = framesTotal
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 7
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image, 
            this.frameCurrent * (this.image.width / this.framesTotal),
            0,
            this.image.width / this.framesTotal,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesTotal) * this.scale, 
            this.image.height * this.scale)
    }

    animateFrames() {
        this.framesElapsed++

            if (this.framesElapsed % this.framesHold === 0) {
                if (this.frameCurrent < this.framesTotal - 1){
                    this.frameCurrent++
                } else {
                    this.frameCurrent = 0
                }
            }

    }

    update() {
        this.draw()
        this.animateFrames()
    }
}


//constructor for the two main fighters
class Fighter extends Sprite{
    constructor({name, position, character, imageSrc, scale = 1, framesTotal = 1, offset = {x: 0, y: 0}, sprites, audio}) {
        super({
            position,
            imageSrc,
            scale,
            framesTotal,
            offset
        })

        this.name = name
        this.velocity = {
            x: 0,
            y: 0
        }
        this.color = character.data.color
        this.height = character.data.height
        this.width = character.data.width
        this.attacks = character.attacks
        this.currentHealth = character.data.health
        this.maxHealth = character.data.health
        this.rightEdge = this.position.x + this.width
        this.attackBox = {
            position : {
                x: this.rightEdge, 
                y: this.position.y}
            }
        this.isAttacking
        this.currentAttack = this.attacks.normal
        this.isBlocking
        this.isThrowing
        this.hasSpecial = true
        this.canMove = true
        this.isHit = false
        this.onLeft
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 12
        this.sprites = sprites
        this.audio = audio
        this.currentSprite
        this.isAttackSprite
        this.stopAnimating = false
        this.gameOver = false

        for (const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    //draws the fighter's hitboxes to the canvas (used for debugging and adjusting hitboxes)
    drawHitboxes() {
        
        c.save()
        c.globalAlpha = 0.5
        if (!this.canMove){
            c.fillStyle = 'white'
        } else if (this.isBlocking){
            c.fillStyle = "yellow"
        } else {
        c.fillStyle = this.color;
        }

        
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //draw attack box
        if (this.isAttacking){

            switch(this.currentAttack.name){
                case 'normal':
                c.fillStyle = 'red';
                c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attacks.normal.width, this.attacks.normal.height)
                break
                case 'throw':
                c.fillStyle = 'purple';
                c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attacks.throw.width, this.attacks.throw.height)
                break
                case 'special':
                c.fillStyle = 'yellow';
                c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attacks.special.width, this.attacks.special.height)
                break
            }     
        }

        c.restore()
        
    }

    drawHealthbars() {
        //draw updated healthbars
        if (player.currentHealth >= 0){
            gsap.to('#playerHealth', {
                width: (player.currentHealth/player.maxHealth)*100 + "%"})
            } else {
                gsap.to('#playerHealth', {
                    width: "0%"})        
                }

        if (enemy.currentHealth >= 0){
            gsap.to('#enemyHealth', {
                width: (enemy.currentHealth/enemy.maxHealth)*100 + "%"})        
            } else {
                gsap.to('#enemyHealth', {
                    width: "0%"})        }

    }

    draw() {
        //mirror the image if on the right
        if (this.onLeft){
            c.drawImage(
                this.image, 
                this.frameCurrent * (this.image.width / this.framesTotal),
                0,
                this.image.width / this.framesTotal,
                this.image.height,
                this.position.x - this.offset.x, 
                this.position.y - this.offset.y, 
                (this.image.width / this.framesTotal) * this.scale, 
                this.image.height * this.scale)
    
        } else {

            c.save()
            c.translate(725, 0)
            c.scale(-1,1)

            c.drawImage(
                this.image, 
                this.frameCurrent * (this.image.width / this.framesTotal),
                0,
                this.image.width / this.framesTotal,
                this.image.height,
                -(this.position.x - this.offset.x), 
                this.position.y - this.offset.y, 
                (this.image.width / this.framesTotal) * this.scale, 
                this.image.height * this.scale
            )

            c.restore()

        }


    }

    animateFrames() {
        this.framesElapsed++
        console.log('standard animate')

        if (!this.isAttackSprite){
            if (this.framesElapsed % this.framesHold === 0) {
                if (this.frameCurrent < this.framesTotal - 1){
                    this.frameCurrent++
                } else {
                    this.frameCurrent = 0
                }
            }
        } 
    }

    animateAttacks() {

        if (this.frameCurrent < this.animationDelays.length){
            setTimeout(()=>{
                console.log("current frame delay " + this.animationDelays[this.frameCurrent])
                this.frameCurrent++
                this.animateAttacks()
            }, this.animationDelays[this.frameCurrent])
        } else {
            this.switchSprite('idle')
            return
        }

    }


    //updates fighter properties
    update() {
        this.rightEdge = this.position.x + this.width
        this.position.y += this.velocity.y

        //checks that the character would not end up outside of the canvas to the right or left
        if (!(this.rightEdge + this.velocity.x >= canvas.width) && !(this.position.x + this.velocity.x <= 0)) {
            if(collisionDetection({
                player: player,
                enemy: enemy
            })) {
                if (player.position.y + player.height < canvas.height - groundHeight){
                    if (player.onLeft){
                        player.position.x = enemy.position.x - player.width
                    } else {
                        player.position.x = enemy.position.x + enemy.width
                    }
                } else {
                    if (enemy.onLeft){
                        enemy.position.x = player.position.x - enemy.width
                    } else {
                        enemy.position.x = player.position.x + player.width
                    }
                }
            } else {
                this.position.x += this.velocity.x}
        }

        //updates for gravity
        if (this.position.y + this.height >= canvas.height - groundHeight){
            this.velocity.y = 0;
            this.position.y = canvas.height - groundHeight - this.height
        } else {
            this.velocity.y += gravity;
        }

        //updates whether the fighter is on the left or right side
        if (this.name === namePlayer1){
            if (player.position.x <= enemy.position.x){
                this.onLeft = true;
            } else {
                this.onLeft = false;
            }
        }

        if (this.name === namePlayer2){
            if (enemy.position.x <= player.position.x){
                this.onLeft = true;
            } else {
                this.onLeft = false;
            }
        }

        //updates attack boxes
        if (this.onLeft) {
            this.attackBox.position = {
                x: this.rightEdge,
                y: this.position.y}
    
            } else {
            this.attackBox.position = {
                x: this.rightEdge - (this.width + this.currentAttack.width),
                y: this.position.y
            }
        }

        //resolves active attacks if the is attacking flag is triggered
        if(this.isAttacking) {
            if (this.name === namePlayer1){
                this.attackResolve(player, enemy, player, enemy)
            } else {
                this.attackResolve(enemy, player, player, enemy)
            }
        }

        //draws the new state to the canvas now that the properties have been updated
        this.draw()
        this.drawHealthbars()
        
        if (!this.stopAnimating){
            if (!this.isAttackSprite){
                this.animateFrames()
            } 
        }

        if(drawHitboxesOn){
            this.drawHitboxes()
        }
    }

    //declares an attack, creating a hit box that will remain active for a set duration by triggering the is attacking flag
    
    attackDeclare(attacker, attackData) {
        
        if (attacker.canMove) {
            attacker.canMove = false
            attacker.audio.miss.play()
            setTimeout(() => {
                if (!attacker.isHit){
                    attacker.isAttacking = true //checks whether the attackbox intersects with an enemy every update for a duration
                    attacker.currentAttack = attackData  //prepares the data for the current attack
                    setTimeout(() => {
                        attacker.isAttacking = false //turns off the attackbox and forces the player to recover for a moment before they can move
                        setTimeout(() => {
                            if (!attacker.isThrowing && !attacker.gameOver){
                                attacker.canMove = true
                            }}, 
                        attackData.recovery)}, 
                    attackData.active)}},
            attackData.startUp)
        }
    }

    //checks whether the hitbox collides with an enemy on any given update cycle
    
    attackResolve(attacker, defender) {
        //if a hit is detected...
        if (hitDetection({
            attacker: attacker,
            defender: defender
        })) {
            //...turn off the attack box, register that the defender has been hit and stop them from moving for a duration
            attacker.isAttacking = false
            defender.isHit = true
            defender.canMove = false

            //...then check if the defender is blocking and deal damage and stun accordingly
            //...also make sure to push back the defender in the correct direction according to if they are on the right or left

            if (attacker.currentAttack.type === "hit") {
            //deals with normal "hit" type attacks

                if (!defender.isBlocking){
                    defender.currentHealth -= attacker.currentAttack.damageHit
                    //plays animations for if the defender dies
                    if(defender.currentHealth <= 0){
                        attacker.audio.deathblow.play()
                    } else {
                        defender.switchSprite('takeHit')
                        attacker.audio.hit.play()
                        if (defender.onLeft){
                            defender.velocity.x = -attacker.currentAttack.hitPushBack
                        } else if (!defender.onLeft){
                            defender.velocity.x = attacker.currentAttack.hitPushBack
                        }
                        setTimeout(()=> {
                            defender.canMove = true
                            defender.velocity.x = 0
                            defender.isHit = false
                        }, attacker.currentAttack.hitStun) 
                    }
                    
                } else if (defender.isBlocking) {
                    defender.currentHealth -= attacker.currentAttack.damageBlock
                    //plays animations for if the defender dies
                    if (defender.currentHealth <= 0){
                        attacker.audio.deathblow.play()
                    } else {
                        defender.switchSprite('blockHit')
                        attacker.audio.blocked.play()
                    }
                    if (defender.onLeft){
                        defender.velocity.x = -attacker.currentAttack.blockPushBack
                    } else if (!defender.onLeft){
                        defender.velocity.x = attacker.currentAttack.blockPushBack
                    }
                    setTimeout(()=> {
                        defender.canMove = true
                        defender.velocity.x = 0
                        defender.isHit = false
                    }, attacker.currentAttack.blockStun) 
                }
            } else if (attacker.currentAttack.type === "throw") {
            //deals with "throw" types attacks. throw attacks behave differently and ignore blocking
                attacker.isThrowing = true
                
                if (attacker.onLeft){
                    defender.position.x = attacker.position.x + attacker.width
                } else{
                    defender.position.x = attacker.position.x - defender.width
                }

                player.switchSprite('throw')
                //player.animateAttacks()

                setTimeout(() => {
                    attacker.isThrowing = false
                    attacker.canMove = true
                    defender.currentHealth -= attacker.currentAttack.damageHit
                    if (defender.onLeft){
                        defender.velocity.x = -this.currentAttack.hitPushBack
                    } else if (!defender.onLeft){
                        defender.velocity.x = this.currentAttack.hitPushBack
                    }
                    setTimeout(()=> {
                        defender.canMove = true
                        defender.velocity.x = 0
                        defender.isHit = false
                    }, attacker.currentAttack.hitStun) 
                }, attacker.currentAttack.throwHold)
            }   
        }
    }

    switchSprite(sprite){
        if (this.image === this.sprites.death.image || this.image === this.sprites.victory.image) {
            if((this.image === this.sprites.death.image && this.frameCurrent === this.sprites.death.framesTotal - 1) ||
                (this.image === this.sprites.victory.image && this.frameCurrent === this.sprites.victory.framesTotal - 1)){
                this.stopAnimating = true
            }
            return}
            
        switch (sprite){
            case 'idle':
                if(this.image != this.sprites.idle.image){
                    this.currentSprite = this.sprites.idle.name
                    this.image = this.sprites.idle.image
                    this.framesTotal = this.sprites.idle.framesTotal
                    this.isAttackSprite = this.sprites.idle.attackSprite
                    this.frameCurrent = 0
                }
                break
            case 'moveForward':
                if(this.image != this.sprites.moveForward.image){
                    this.currentSprite = this.sprites.moveForward.name
                    this.image = this.sprites.moveForward.image
                    this.framesTotal = this.sprites.moveForward.framesTotal
                    this.isAttackSprite = this.sprites.moveForward.attackSprite
                    this.frameCurrent = 0
                }
                break
            case 'moveBackward':
                if(this.image != this.sprites.moveBackward.image){
                    this.currentSprite = this.sprites.moveBackward.name
                    this.image = this.sprites.moveBackward.image
                    this.framesTotal = this.sprites.moveBackward.framesTotal
                    this.isAttackSprite = this.sprites.moveBackward.attackSprite
                    this.frameCurrent = 0
                }
            break
            case 'jump':
                if(this.image != this.sprites.jumpUp.image){
                    this.currentSprite = this.sprites.jumpUp.name
                    this.image = this.sprites.jumpUp.image
                    this.framesTotal = this.sprites.jumpUp.framesTotal
                    this.isAttackSprite = this.sprites.jumpUp.attackSprite
                    this.frameCurrent = 0
                }
            break
            case 'fall':
                if(this.image != this.sprites.jumpDown.image){
                    this.currentSprite = this.sprites.jumpDown.name
                    this.image = this.sprites.jumpDown.image
                    this.framesTotal = this.sprites.jumpDown.framesTotal
                    this.isAttackSprite = this.sprites.jumpDown.attackSprite
                    this.frameCurrent = 0
                }
            break
            case 'attack':
                if(this.image != this.sprites.attack.image){
                    this.currentSprite = this.sprites.attack.name
                    this.image = this.sprites.attack.image
                    this.framesTotal = this.sprites.attack.framesTotal
                    this.isAttackSprite = this.sprites.attack.attackSprite
                    this.frameCurrent = 0
                    this.animationDelays = this.sprites.attack.animationDelays
                    console.log(this.animationDelays)
                }
            break
            case 'throw_start':
                if(this.image != this.sprites.throw_start.image){
                    this.currentSprite = this.sprites.throw_start.name
                    this.image = this.sprites.throw_start.image
                    this.framesTotal = this.sprites.throw_start.framesTotal
                    this.isAttackSprite = this.sprites.throw_start.attackSprite
                    this.frameCurrent = 0
                    this.animationDelays = this.sprites.throw_start.animationDelays
                    console.log(this.animationDelays)
                }
            break
            case 'throw':
                if(this.image != this.sprites.throw.image){
                    this.currentSprite = this.sprites.throw.name
                    this.image = this.sprites.throw.image
                    this.framesTotal = this.sprites.throw.framesTotal
                    this.isAttackSprite = this.sprites.throw.attackSprite
                    this.frameCurrent = 0
                    this.animationDelays = this.sprites.throw.animationDelays
                    console.log(this.animationDelays)
                }
            break
            case 'takeHit':
                if(this.image != this.sprites.takeHit.image){
                    this.currentSprite = this.sprites.takeHit.name
                    this.image = this.sprites.takeHit.image
                    this.framesTotal = this.sprites.takeHit.framesTotal
                    this.isAttackSprite = this.sprites.takeHit.attackSprite
                    this.frameCurrent = 0
                }
            break
            case 'blockHit':
                if(this.image != this.sprites.blockHit.image){
                    this.currentSprite = this.sprites.blockHit.name
                    this.image = this.sprites.blockHit.image
                    this.framesTotal = this.sprites.blockHit.framesTotal
                    this.isAttackSprite = this.sprites.blockHit.attackSprite
                    this.frameCurrent = 0
                }
            break
            case 'death':
                if(this.image != this.sprites.death.image){
                    this.currentSprite = this.sprites.death.name
                    this.image = this.sprites.death.image
                    this.framesTotal = this.sprites.death.framesTotal
                    this.isAttackSprite = this.sprites.death.attackSprite
                    this.frameCurrent = 0
                }
            break
            case 'victory':
                if(this.image != this.sprites.victory.image){
                    this.currentSprite = this.sprites.victory.name
                    this.image = this.sprites.victory.image
                    this.framesTotal = this.sprites.victory.framesTotal
                    this.isAttackSprite = this.sprites.victory.attackSprite
                    this.frameCurrent = 0
                }
            break
            }
    }
}
