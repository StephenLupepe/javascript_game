//To do:
//FIX: change back death animation method and fix sprites looping on death (only for win/loss after timeout)
//FIX: unable to turn off standard animation method (and hence use attack animation method) for the second part of a throw
//add a different animation method for attacks, throws, and special attacks that animates frame by frame with given delays
//add a slowdown on final attack/ death animation for extra pazzaz
//adjust special attack to have a pause/flash and show the chracter glowing when available
//add title screen and character select
//add (update) additional characters
//add 3 round system and round call voice/ messages
//add cpu opponent
//add multiple stages and scrolling background


//declaring game data
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const groundHeight = 115;
const gravity = 0.5;
const gameTime = 30;
const drawHitboxesOn = false;
const namePlayer1 = "player"
const namePlayer2 = "enemy"
const specialAttackThreshold = 0.8;
const characterStartOffset = 200;

//initializing the keys that will be used to control the characters

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    c: {
        pressed: false
    },
    v: {
        pressed: false
    },
    b: {
        pressed: false
    },
    i: {
        pressed: false
    },
    j: {
        pressed: false
    },
    k: {
        pressed: false
    },
    l: {
        pressed: false
    },
    left: {
        pressed: false
    },
    down: {
        pressed: false
    },
    right: {
        pressed: false
    }
}

//setting up canvas

c.fillRect(0, 0, canvas.width, canvas.height);

//setting up the game

//drawing the background 

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 155
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesTotal: 6
})

//deciding the characters for both players

const playerCharacter = knight;
const enemyCharacter = knight;


//determining the start location for both characters

const playerStart = {
    x: characterStartOffset - playerCharacter.data.width,
    y: 0
}
const enemyStart = {
    x: canvas.width - characterStartOffset,
    y: 0
}

//creating two instances of the fighter for the two players
const player = new Fighter({
    name: namePlayer1,
    position: playerStart,
    character : playerCharacter,
    imageSrc: playerCharacter.sprites.idle.imageSrc,
    scale: 2.5,
    framesTotal: playerCharacter.sprites.idle.framesTotal,
    offset: playerCharacter.data.hitboxOffset,
    sprites: playerCharacter.sprites,
    audio: playerCharacter.audio
})

const enemy = new Fighter({
    name: namePlayer2,
    position: enemyStart,
    character: enemyCharacter,
    imageSrc: enemyCharacter.sprites.idle.imageSrc,
    scale: 2.5,
    framesTotal: enemyCharacter.sprites.idle.framesTotal,
    offset: {
        x: 320,
        y: 200
    },
    sprites: enemyCharacter.sprites,
    audio: enemyCharacter.audio
})


//detects hits between characters and hitboxes when a character attacks
function hitDetection({attacker, defender}) {
    return (
    (attacker.attackBox.position.x + attacker.currentAttack.width >= defender.position.x) && 
    (attacker.attackBox.position.x < defender.position.x + defender.width) && 
    (attacker.attackBox.position.y + attacker.currentAttack.height > defender.position.y) && 
    (attacker.attackBox.position.y < defender.position.y + defender.height)
    )
}

//collision detection for players 
function collisionDetection({player, enemy}) {
     //checks for intersection vertically
     if (player.position.y < enemy.position.y + enemy.height && player.position.y + player.height > enemy.position.y){

        if ((player.onLeft && (player.position.x + player.width + player.velocity.x > enemy.position.x + enemy.velocity.x)) ||
        (enemy.onLeft && (enemy.position.x + enemy.width + enemy.velocity.x > player.position.x + player.velocity.x))) {
            return true
        } else {
            return false
        }

     } else {
         return false
     }
 }

//drawing and animating the canvas
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();


    //player 1 movement
    if((player.canMove) && (!player.isHit)) {


        //Ground Movement:
        //if a is pressed, move left
        //if d is pressed, move right
        //if both a and d are pressed, don't move
        if (player.position.y + player.height >= canvas.height - groundHeight){

            if (keys.a.pressed && keys.d.pressed){
                player.switchSprite('idle')
                player.velocity.x = 0;
            } else if (keys.d.pressed) {
                if (player.onLeft) {
                    player.switchSprite('moveForward')
                    player.velocity.x = playerCharacter.data.forwardSpeed
                } else {
                    player.switchSprite('moveBackward')                    
                    player.velocity.x = playerCharacter.data.backSpeed
                }
            } else if (keys.a.pressed) {
                if (player.onLeft) {
                    player.switchSprite('moveBackward')
                    player.velocity.x = -(playerCharacter.data.backSpeed)

                } else {
                    player.switchSprite('moveForward')
                    player.velocity.x = -(playerCharacter.data.forwardSpeed)
                }
            } else {
                player.switchSprite('idle')
                player.velocity.x = 0
                }

            //if w is pressed, jump
            if (keys.w.pressed) {
                player.switchSprite('jump')
                player.velocity.y = -(playerCharacter.data.jumpSpeed);
            }
    } else if (player.velocity.y >=0 ){
        player.switchSprite('fall')
    }

    } else if ((!player.canMove) && (!player.isHit)) {                  //locks player in place during attacks (but not hits!)
        player.velocity.x = 0;
    }
    
    //player 2 movement

    if((enemy.canMove) && (!enemy.isHit)) {
        //Ground Movement:
        //if j is pressed, move left
        //if l is pressed, move right
        //if both a and d are pressed, don't move
        if (enemy.position.y + enemy.height >= canvas.height - groundHeight){

            if (keys.j.pressed && keys.l.pressed){
                enemy.switchSprite('idle')
                enemy.velocity.x = 0;
            } else if (keys.l.pressed) {
                if (enemy.onLeft) {
                    enemy.switchSprite('moveForward')
                    enemy.velocity.x = enemyCharacter.data.forwardSpeed
                } else {
                    enemy.switchSprite('moveBackward')                    
                    enemy.velocity.x = enemyCharacter.data.backSpeed
                }
            } else if (keys.j.pressed) {
                if (enemy.onLeft) {
                    enemy.switchSprite('moveBackward')
                    enemy.velocity.x = -(enemyCharacter.data.backSpeed)

                } else {
                    enemy.switchSprite('moveForward')
                    enemy.velocity.x = -(enemyCharacter.data.forwardSpeed)
                }
            } else {
                enemy.switchSprite('idle')
                enemy.velocity.x = 0
                }

            //if i is pressed, jump
            if (keys.i.pressed) {
                enemy.switchSprite('jump')
                enemy.velocity.y = -(enemyCharacter.data.jumpSpeed);
            }
    } else if (enemy.velocity.y >=0 ){
        enemy.switchSprite('fall')
    }

    } else if ((!enemy.canMove) && (!enemy.isHit)) {                  //locks player in place during attacks (but not hits!)
        enemy.velocity.x = 0;
    }


    if (player.currentHealth <= 0 || enemy.currentHealth <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

//is called upon 0 health or timeout to determine the winner of the game
function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector("#winLossDisplay").style.display = 'flex'
    player.velocity.x = 0
    player.canMove = false
    player.gameOver = true
    enemy.velocity.x = 0
    enemy.canMove = false
    enemy.gameOver = true

    if (player.currentHealth < enemy.currentHealth){
        document.querySelector("#winLossDisplay").innerHTML = 'Player 2 Wins!'
        player.switchSprite('death')
        setTimeout(()=>{enemy.switchSprite('victory')}, 2500)
    } else if (enemy.currentHealth < player.currentHealth){
        document.querySelector("#winLossDisplay").innerHTML = 'Player 1 Wins!'
        enemy.switchSprite('death')
        enemy.animateAttacks()
        setTimeout(()=>{
            player.switchSprite('victory')
            player.animateAttacks()}, 2500)
    } else if (player.currentHealth === enemy.currentHealth) {
        document.querySelector("#winLossDisplay").innerHTML = 'Draw'
        player.switchSprite('idle')
        enemy.switchSprite('idle')
    }
}

//sets gamer timer and determines winner at timeout
let timer = gameTime;
let timerId;

function decreaseTimer() {
    if (timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer;
    }

    if (timer === 0){
        determineWinner({player, enemy, timerId})
        }
}

decreaseTimer()

animate()

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case 'w':
        keys.w.pressed = true;
        break
        case 'a':
        keys.a.pressed = true;
        if (player.onLeft) {player.isBlocking = true;}
        break
        case 's':
        keys.s.pressed = true;
        break
        case 'd':
        keys.d.pressed = true;
        if (!player.onLeft) {player.isBlocking = true;}
        break
        case 'c':
        keys.c.pressed = true;
        if (player.canMove){
            player.switchSprite('attack')
            player.animateAttacks()}
            player.attackDeclare(player, player.attacks.normal)
        break
        case 'v':
        keys.v.pressed = true;
        if (player.canMove){
            player.switchSprite('throw_start')
            player.animateAttacks()}
            player.attackDeclare(player, player.attacks.throw)        
        break
        case 'b':
        keys.b.pressed = true;
        if ((player.currentHealth / player.maxHealth) <= specialAttackThreshold && 
            player.hasSpecial === true){
        
                player.hasSpecial = false
                player.attackDeclare(player, player.attacks.special)}
        break
        case 'i':
        keys.i.pressed = true;
        break
        case 'j':
        keys.j.pressed = true;
        if (enemy.onLeft) {enemy.isBlocking = true;}
        break
        case 'k':
        keys.k.pressed = true;
        break
        case 'l':
        keys.l.pressed = true;
        if (!enemy.onLeft) {enemy.isBlocking = true;}        
        break
        case 'ArrowLeft':
        if(enemy.canMove){
            keys.left.pressed = true;
            enemy.switchSprite('attack')}
            enemy.animateAttacks()
            enemy.attackDeclare(enemy, enemy.attacks.normal)
        break
        case 'ArrowDown':
        keys.down.pressed = true;
        enemy.attackDeclare(enemy, enemy.attacks.throw)
        break
        case 'ArrowRight':
        keys.right.pressed = true;
        if ((enemy.currentHealth / enemy.maxHealth) <= specialAttackThreshold && 
            enemy.hasSpecial === true){
        
                enemy.hasSpecial = false
                enemy.attackDeclare(enemy, enemy.attacks.special)}
        break
        
    }

})
    
window.addEventListener("keyup", (event) => {
        switch (event.key) {
                case 'w':
                keys.w.pressed = false;
                break
                case 'a':
                keys.a.pressed = false;
                if (player.onLeft) {player.isBlocking = false;}
                break
                case 's':
                keys.s.pressed = false;
                break
                case 'd':
                keys.d.pressed = false;
                if (!player.onLeft) {player.isBlocking = false;}
                break
                case 'c':
                keys.c.pressed = false;
                break
                case 'v':
                keys.v.pressed = false;
                break
                case 'b':
                keys.b.pressed = false;
                break
                case 'i':
                keys.i.pressed = false;
                break
                case 'j':
                keys.j.pressed = false;
                if (enemy.onLeft) {enemy.isBlocking = false;}
                break
                case 'k':
                keys.k.pressed = false;
                break
                case 'l':
                keys.l.pressed = false;
                if (!enemy.onLeft) {enemy.isBlocking = false;}
                break
                case 'ArrowDown':
                keys.down.pressed = false;
                break
                case 'ArrowLeft':
                keys.left.pressed = false;
                break
                case 'ArrowRight':
                keys.right.pressed = false;
                break
            }

        

})

let clicked = false

addEventListener("click", (event) =>{
    if (!clicked){
        music.battle.play()
        clicked = true
    }

})