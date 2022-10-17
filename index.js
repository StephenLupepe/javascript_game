//To do:
//FIX: unable to turn off standard animation method (and hence use attack animation method) for the second part of a throw

//add 3 round system and set win messages
//adjust special attack to show the chracter glowing when available
//make priestesses standard attack into a projectile
//add command guides

//Extras: 
//add more music tracks, stages and characters
//add cpu opponent

//declaring game data
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const groundHeight = 115;
const gravity = 0.5;
const gameTime = 30;
const drawHitboxesOn = true;
const namePlayer1 = "player"
const namePlayer2 = "enemy"
const specialAttackThreshold = 0.8;
const characterStartOffset = 200;
const defaultCharacterWidth = 80;
const defaultYLoc = 391;
let selecting_player = 1
let startingBattle = true
let roundOver = false
let roundCount = 1
let playerRounds = 0
let enemyRounds = 0

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
    },
    space: {
        pressed: false
    }
}

//setting up canvas

c.fillRect(0, 0, canvas.width, canvas.height);

//setting up the game
//setting up the title screen

const title_screen = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/title_screen.png'
})

const title_text = new Sprite({
    position: {
        x: 200,
        y: 100
    },
    scale: 1.4,
    imageSrc: './img/knight_fighter_title.png'
})

//drawing the character select screen 

const char_select = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    scale: 3,
    imageSrc: './img/background_wall.png'
})

const char_select2 = new Sprite({
    position: {
        x: 0,
        y: -canvas.height
    },
    scale: 3,
    imageSrc: './img/background_wall.png'
})

const knight_select = new Sprite({
    position: {
        x: 262,
        y: 100
    },
    scale: 2,
    imageSrc: './img/fire_knight.png'
})

const ninja_select = new Sprite({
    position: {
        x: 632,
        y: 100
    },
    scale: 2,
    imageSrc: './img/metal_bladekeeper.png'
})

const priestess_select = new Sprite({
    position: {
        x: 262,
        y: 300
    },
    scale: 2,
    imageSrc: './img/water_priestess.png'
})

const random_select = new Sprite({
    position: {
        x: 632,
        y: 300
    },
    scale: 2,
    imageSrc: './img/random.png'
})

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

//determing the default character and settings for both players

let playerCharacter = knight   
let enemyCharacter = ninja

//determining the default start location for both characters
const playerStart = {
    x: characterStartOffset - defaultCharacterWidth,
    y: defaultYLoc 
}
const enemyStart = {
    x: canvas.width - characterStartOffset,
    y: defaultYLoc
}

//creating two default instances of the fighter for the two players
let player = new Fighter({
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

let enemy = new Fighter({
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

//drawing and animating the title screen

let titleId
function animate_title() {
    const titleId = window.requestAnimationFrame(animate_title)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height);
    title_screen.update()
    title_text.update()
}

let charSelectId
function animate_charSelect() {
    const charSelectId = window.requestAnimationFrame(animate_charSelect)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height);
    char_select.position.y += 1
    if (char_select.position.y >= canvas.height){
        char_select.position.y = -canvas.height
    }
    char_select2.position.y += 1
    if (char_select2.position.y >= canvas.height){
        char_select2.position.y = -canvas.height
    }
    char_select.update()
    char_select2.update()
    knight_select.update()
    ninja_select.update()
    priestess_select.update()
    random_select.update()
}

function select_screen_reset() {
    document.getElementById("knightselect1").style.border = "none";
    document.getElementById("ninjaselect1").style.border = "none";
    document.getElementById("priestessselect1").style.border = "none";
    document.getElementById("randomselect1").style.border = "none";
    document.getElementById("p1knight").style.display = "none";
    document.getElementById("p1ninja").style.display = "none";
    document.getElementById("p1priestess").style.display = "none";
    document.getElementById("p1random").style.display = "none";
    document.getElementById("p2knight").style.display = "none";
    document.getElementById("p2ninja").style.display = "none";
    document.getElementById("p2priestess").style.display = "none";
    document.getElementById("p2random").style.display = "none";
}

function select_character() {
    if (playerCharacter == knight){
        document.getElementById("knightselect1").style.border = "yellow solid 5px";
        document.getElementById("p1knight").style.display = "flex";
        player = new Fighter({
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
        
    } else if (playerCharacter == ninja){
        document.getElementById("ninjaselect1").style.border = "yellow solid 5px";
        document.getElementById("p1ninja").style.display = "flex";
        player = new Fighter({
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
    } else if (playerCharacter == priestess){
        document.getElementById("priestessselect1").style.border = "yellow solid 5px";
        document.getElementById("p1priestess").style.display = "flex";
        player = new Fighter({
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

    } 
    if (enemyCharacter == knight){
        document.getElementById("knightselect1").style.border = "blue solid 5px";
        document.getElementById("p2knight").style.display = "flex";
        enemy = new Fighter({
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
    } else if (enemyCharacter == ninja){
        document.getElementById("ninjaselect1").style.border = "blue solid 5px";
        document.getElementById("p2ninja").style.display = "flex";
        enemy = new Fighter({
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
    } else if (enemyCharacter == priestess){
        document.getElementById("priestessselect1").style.border = "blue solid 5px";
        document.getElementById("p2priestess").style.display = "flex";
        enemy = new Fighter({
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
    } 
    if (selecting_player == 1){
        selecting_player = 2
        document.getElementById("p1border").style.display = "none";
        document.getElementById("p2border").style.display = "flex";
    } else if (selecting_player == 2) {
        selecting_player = 3
        document.getElementById("p2border").style.display = "none";
        document.getElementById("startbattle").style.color = "yellow";
    }
}

function battleStart(){
    if (startingBattle == true){
        roundOver = false

        player = new Fighter({
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
        player.position.x = characterStartOffset - defaultCharacterWidth
        
        enemy = new Fighter({
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
        enemy.position.x = canvas.width - characterStartOffset

        startingBattle = false
        
        player.canMove = false
        enemy.canMove = false
        document.querySelector('#centerText').style.display = 'flex'
        document.querySelector('#centerText').innerHTML = 'Ready?'

        setTimeout(()=>{
            document.querySelector('#centerText').innerHTML = 'Fight!'
            player.canMove = true
            enemy.canMove = true
            //sets gamer timer and determines winner at timeout
            timer = gameTime;
            decreaseTimer()
            setTimeout(() => {
            document.querySelector('#centerText').style.display = 'none'
            }, 500);
        }, 1000)
    }
}

//drawing and animating the battle screen
function animate_battle() {
    const battleId = window.requestAnimationFrame(animate_battle);
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    battleStart();
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
    } else if (enemy.velocity.y >=0){
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
    if (roundOver == false){
        roundOver = true
        clearTimeout(timerId)
        document.querySelector("#centerText").style.display = 'flex'
        player.velocity.x = 0
        player.canMove = false
        player.gameOver = true
        enemy.velocity.x = 0
        enemy.canMove = false
        enemy.gameOver = true

        if (player.currentHealth < enemy.currentHealth){
            document.querySelector("#centerText").innerHTML = 'Player 2 Wins!'
            enemyRounds += 1
            player.switchSprite('death')
            setTimeout(()=>{enemy.switchSprite('victory')}, 2000)
        } else if (enemy.currentHealth < player.currentHealth){
            document.querySelector("#centerText").innerHTML = 'Player 1 Wins!'
            playerRounds += 1
            enemy.switchSprite('death')
            setTimeout(()=>{player.switchSprite('victory')}, 2000)
        } else if (player.currentHealth === enemy.currentHealth) {
            document.querySelector("#centerText").innerHTML = 'Draw'
            player.switchSprite('idle')
            enemy.switchSprite('idle')
        }
        if (playerRounds == 2 || enemyRounds == 2){
            if (playerRounds == 2){
                document.querySelector("#p1win2").style.display = 'none';
                document.querySelector("#p1win2winner").style.display = 'flex';
            } else if (enemyRounds == 2){
                document.querySelector("#p2win2").style.display = 'none';
                document.querySelector("#p2win2winner").style.display = 'flex';
            }


            setTimeout(()=>{
                music.battle.stop()
                music.victory.play()
            }, 8000)
        } else if (playerRounds == 1){
            document.querySelector("#p1win1").style.display = 'none';
            document.querySelector("#p1win1winner").style.display = 'flex';
        } else if (enemyRounds == 1){
            document.querySelector("#p2win1").style.display = 'none';
            document.querySelector("#p2win1winner").style.display = 'flex';
        }

        setTimeout(()=>{
            if (playerRounds < 2 && enemyRounds < 2){
                console.log("next round")
                    startingBattle = true
            
            } else if (playerRounds == 2){
                document.querySelector('#winscreenoverlay').style.display = 'flex'
                if (playerCharacter == knight){
                    document.querySelector('#knightwinquote').style.display = 'flex'
                    document.querySelector('#knightwinpic').style.display = 'flex'
                } else if (playerCharacter == ninja){
                    document.querySelector('#ninjawinquote').style.display = 'flex'
                    document.querySelector('#ninjawinpic').style.display = 'flex'
                } else if (playerCharacter == priestess){
                    document.querySelector('#priestesswinquote').style.display = 'flex'
                    document.querySelector('#priestesswinpic').style.display = 'flex'
                }

            } else if (enemyRounds == 2){
                document.querySelector('#winscreenoverlay').style.display = 'flex'
                if (enemyCharacter == knight){
                    document.querySelector('#knightwinquote').style.display = 'flex'
                    document.querySelector('#knightwinpic').style.display = 'flex'
                } else if (enemyCharacter == ninja){
                    document.querySelector('#ninjawinquote').style.display = 'flex'
                    document.querySelector('#ninjawinpic').style.display = 'flex'
                } else if (enemyCharacter == priestess){
                    document.querySelector('#priestesswinquote').style.display = 'flex'
                    document.querySelector('#priestesswinpic').style.display = 'flex'
                }
            }  
        }, 13000)      
    }
}

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

//Setup ends here. Game starts from below:

//sets gamer timer and determines winner at timeout
let timer = gameTime;
let timerId;

animate_title()

document.querySelectorAll('button').forEach(button =>
    {
        button.addEventListener('click', () => {
            if (button.id == '1p2p') {
            window.cancelAnimationFrame(titleId)
            document.getElementById("1p2p").style.display = "none";
            document.getElementById("1pcom").style.display = "none";
            document.getElementById("com2p").style.display = "none";
            document.getElementById("startbattle").style.display = "flex";
            document.getElementById("changecharacters").style.display = "flex";
            document.getElementById("charselecttitle").style.display = "flex";
            document.getElementById("p1title").style.display = "flex";
            document.getElementById("p2title").style.display = "flex";
            document.getElementById("knightselect1").style.display = "flex";
            document.getElementById("ninjaselect1").style.display = "flex";
            document.getElementById("priestessselect1").style.display = "flex";
            document.getElementById("randomselect1").style.display = "flex";
            document.getElementById("p1border").style.display = "flex";
            document.getElementById("p1knight").style.display = "flex";
            document.getElementById("p2ninja").style.display = "flex";


            music.title.stop()
            animate_charSelect()
            music.character_select.play()
        }

        if (button.id == 'knightselect1') {
            select_screen_reset()
            if (selecting_player == 1){
                playerCharacter = knight
            } else if (selecting_player == 2){
                enemyCharacter = knight
            }            
            select_character()
        }

        if (button.id == 'ninjaselect1') {
            select_screen_reset()
            if (selecting_player == 1){
                playerCharacter = ninja
            } else if (selecting_player == 2){
                enemyCharacter = ninja
            }            
            select_character()
        }

        if (button.id == 'priestessselect1') {
            select_screen_reset()
            if (selecting_player == 1){
                playerCharacter = priestess
            } else if (selecting_player == 2){
                enemyCharacter = priestess
            }
            select_character()
        }

        if (button.id == 'randomselect1') {
            random_character = Math.floor((Math.random() * 3))
            select_screen_reset()
            if (selecting_player == 1){
                if (random_character == 0){
                    playerCharacter = knight
                } else if (random_character == 1){
                    playerCharacter = ninja
                } else if (random_character == 2){
                    playerCharacter = priestess
                }
            } else if (selecting_player == 2){
                if (random_character == 0){
                    enemyCharacter = knight
                } else if (random_character == 1){
                    enemyCharacter = ninja
                } else if (random_character == 2){
                    enemyCharacter = priestess
                }
            }
            select_character()
        }

        if (button.id == 'changecharacters') {
            select_screen_reset()
            selecting_player = 1
            document.getElementById("p1border").style.display = "flex";
            document.getElementById("p1knight").style.display = "flex";
            document.getElementById("p2ninja").style.display = "flex";
        }

        if (button.id == 'startbattle') {
            if (selecting_player == 3){
                window.cancelAnimationFrame(charSelectId)
                document.getElementById("startbattle").style.display = "none";
                document.getElementById("charselecttitle").style.display = "none";
                document.getElementById("changecharacters").style.display = "none";
                document.getElementById("p1title").style.display = "none";
                document.getElementById("p1knight").style.display = "none";
                document.getElementById("p1ninja").style.display = "none";
                document.getElementById("p1priestess").style.display = "none";
                document.getElementById("p1random").style.display = "none";
                document.getElementById("knightselect1").style.display = "none";
                document.getElementById("ninjaselect1").style.display = "none";
                document.getElementById("priestessselect1").style.display = "none";
                document.getElementById("randomselect1").style.display = "none";
                document.getElementById("p2title").style.display = "none";
                document.getElementById("p2knight").style.display = "none";
                document.getElementById("p2ninja").style.display = "none";
                document.getElementById("p2priestess").style.display = "none";
                document.getElementById("p2random").style.display = "none";
                document.getElementById("healthbars").style.display = "flex";
                document.getElementById("p1win1").style.display = "flex";
                document.getElementById("p1win2").style.display = "flex";
                document.getElementById("p2win1").style.display = "flex";
                document.getElementById("p2win2").style.display = "flex";
                document.getElementById("p1buttons").style.display = "flex";
                document.getElementById("p2buttons").style.display = "flex";
    
                music.character_select.stop()
                animate_battle()
                music.battle.play()
            }
        }
    })
    })

let clicked = false
addEventListener('click', (event) =>{
    if (!clicked){
        music.title.play()
        document.getElementById("clickstart").style.display = "none";
        document.getElementById("1p2p").style.display = "flex";
        document.getElementById("1pcom").style.display = "flex";
        document.getElementById("com2p").style.display = "flex";
        clicked = true
    }
})

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
        case ' ':
        keys.space.pressed = true;
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
                case 'LeftClick':
                keys.left_click.pressed = false;
                break
                case ' ':
                keys.space.pressed = false;
                break
            }
})