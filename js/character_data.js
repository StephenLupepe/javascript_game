//character data: knight
const knight = {
    data : {
        color: 'red',
        height: 70,
        width: 80,
        health: 200,
        forwardSpeed: 8,
        backSpeed: 5,
        jumpSpeed: 15,
        movementFrameHold: 7,
        attackFramehold: 12,
        hitboxOffset: {
            x: 320,
            y: 200
        }
    },
    attacks : {
        normal: {                //normal attack data
            name: "normal",
            type: "hit",
            width: 150, 
            height: 120,
            startUp: 100,
            active: 100,
            recovery: 100,
            damageHit: 80,
            hitPushBack: 8,
            hitStun: 400,
            damageBlock: 5,
            blockPushBack: 4,
            blockStun: 200
        },
        throw: {
            name:"throw",
            type: "throw",
            width: 50, 
            height: 60,
            startUp: 50,
            active: 50,
            recovery: 200,
            damageHit: 40,
            throwHold: 1000,
            hitPushBack: 30,
            hitStun: 300,
        },
        special: {
            name:"special",
            type: "hit",
            width: 200, 
            height: 80,
            startUp:100,
            active: 200,
            recovery: 100,
            damageHit: 50,
            hitPushBack: 8,
            hitStun: 400,
            damageBlock: 10,
            blockPushBack: 4,
            blockStun: 200
        }
    },
    sprites: {
        idle: {
            name: 'idle',
            imageSrc: 'img/fire_knight/knight_idle.png',
            framesTotal: 8,
            attackSprite: false
        },
        moveForward: {
            name: 'moveForward',
            imageSrc: 'img/fire_knight/knight_run.png',
            framesTotal: 8,
            attackSprite: false
        },
        moveBackward: {
            name: 'moveBackward',
            imageSrc: 'img/fire_knight/knight_back.png',
            framesTotal: 3,
            attackSprite: false
        },
        jumpUp: {
            name: 'jumpUp',
            imageSrc: 'img/fire_knight/knight_up.png',
            framesTotal: 7,
            attackSprite: false
        },
        jumpDown: {
            name: 'jumpDown',
            imageSrc: 'img/fire_knight/knight_down.png',
            framesTotal: 13,
            attackSprite: false
        },
        attack: {
            name: 'attack',
            imageSrc: 'img/fire_knight/knight_attack.png',
            framesTotal: 5,
            attackSprite: true,
            animationDelays: [50, 50, 100, 50, 50]
        },
        throw_start: {
            name: 'throwStart',
            imageSrc: 'img/fire_knight/knight_throwstart.png',
            framesTotal: 4,
            attackSprite: true,
            animationDelays: [50, 25, 50, 175]
        },
        throw: {
            name: 'throw',
            imageSrc: 'img/fire_knight/knight_throw.png',
            framesTotal: 9,
            attackSprite: true,
            animationDelays: [850, 50, 50, 50, 50, 12, 12, 12, 12]
        },
        special: {
            name: 'special',
            imageSrc: 'img/fire_knight/knight_special.png',
            framesTotal: 18,
            attackSprite: true
        },
        takeHit: {
            name: 'takeHit',
            imageSrc: 'img/fire_knight/knight_takehit.png',
            framesTotal: 6,
            attackSprite: false
        },
        blockHit: {
            name: 'blockHit',
            imageSrc: 'img/fire_knight/knight_blockhit.png',
            framesTotal: 8,
            attackSprite: false
        },
        death: {
            name: 'death',
            imageSrc: 'img/fire_knight/knight_death.png',
            framesTotal: 13,
            attackSprite: false,
            animationDelays: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
        },
        victory: {
            name: 'victory',
            imageSrc: 'img/fire_knight/knight_victory.png',
            framesTotal: 28,
            attackSprite: false,
            animationDelays: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]

        }

    },
    audio: {
        hit: new Howl({
            src: './audio/knight_hit.mp3',
            html5: true,
            volume: 0.3
        }),
        blocked: new Howl({
            src: './audio/knight_blocked.mp3',
            html5: true,
            volume: 0.3
        }),
        miss: new Howl({
            src: './audio/knight_miss.mp3',
            html5: true,
            volume: 0.3
        }),
        deathblow: new Howl({
            src: './audio/killing_blow.mp3',
            html5: true,
            volume: 1.0
        })
    }
}

//character data: ninja
const ninja = {
    data : {
        color: 'brown',
        height: 200,
        width: 100,
        health: 150,
        forwardSpeed: 12,
        backSpeed: 8,
        jumpSpeed: 15,
        hitboxOffset: {
            x: 320,
            y: 200
        }
    },
    attacks : {
        normal: {                //normal attack data
            name: "normal",
            type: "hit",
            width: 100, 
            height: 60,
            startUp: 50,
            active: 300,
            recovery: 100,
            damageHit: 10,
            hitPushBack: 8,
            hitStun: 200,
            damageBlock: 3,
            blockPushBack: 4,
            blockStun: 100
        },
        throw: {
            name:"throw",
            type: "throw",
            width: 50, 
            height: 60,
            startUp: 50,
            active: 50,
            recovery: 200,
            damageHit: 40,
            throwHold: 1000,
            hitPushBack: 30,
            hitStun: 300,
        },
        special: {
            name:"special",
            type: "hit",
            width: 140, 
            height: 80,
            startUp:0,
            active: 300,
            recovery: 200,
            damageHit: 50,
            hitPushBack: 8,
            hitStun: 400,
            damageBlock: 10,
            blockPushBack: 4,
            blockStun: 200
        }
    },
    sprites: {
        idle: {
            imageSrc: 'img/metal_ninja/ninja_idle.png',
            framesTotal: 8
        },
        moveForward: {
            imageSrc: 'img/metal_ninja/ninja_run.png',
            framesTotal: 8
        },
        moveBackward: {
            imageSrc: 'img/metal_ninja/ninja_back.png',
            framesTotal: 6
        },
        jumpUp: {
            imageSrc: 'img/metal_ninja/ninja_up.png',
            framesTotal: 7
        },
        jumpDown: {
            imageSrc: 'img/metal_ninja/ninja_down.png',
            framesTotal: 13
        },
        attack: {
            imageSrc: 'img/metal_ninja/ninja_attack.png',
            framesTotal: 6
        }
    }
}
