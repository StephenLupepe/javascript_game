# Javascript Fighting Game: "Knight Fighter"

## Introduction

This is a project that I started in May 2022 and was one of the first projects that I made after starting to learn to code.
This basic functionality of this game was built using a Youtube tutorial from the channel Chriscourses (video link: 
https://www.youtube.com/watch?v=vyqbNFMDRGQ). However I felt that this tutorial lacked much of the functions that people 
expect from even a basic fighting game. Therefore, I added the extra functionality myself.

## Added Functinality

### Startup and Recovery Frames on Attacks:
In the tutorial, attacks were activated immediately whenever the attack command was input. This however makes it difficult to react
to attacks, and also nearly impossible to punish an opponent who misses an attack. Therefore, startup frames were added before the attack
hitbox becomes active in order to make attacks easier to react to, and recovery frames were added to stop the attacker moving for a short
time after the attack hitbox has disappeared, to allow the other player to punish careless attacks. This involved rewriting the entire 
way that the game handles timing for attacks using timeout functions. I imagine that there is likely an addon or package that makes this
easier to implement, however at the time of making, I am currently unaware of whether such an addon exists.

### "Hitstun":
In fighting games, hitstun refers to when a character is unable to move after having been attacked. If the character is still 
able to move and act immediately after being attacked, then the attacking player will quickly lose any advantage gained from 
landing a successful attack. This hitstun was implemented using time out functions to stop the player from moving during a set time.
The player receiving the attack will also be knocked back a set distance to prevent them from being repeatedly attacked without being 
able to retaliate.

### Blocking: 
In most fighting games, characters can hold the key opposite the direction that they are facing to block attacks. Blocking
attacks reduces damage and allows the blocking pllayer to act more quickly after the attack lands. This functionality required
me to added states for blocking and also add different amounts of hitstun based on whether the character gets hit by the attack
or blokcs the attack successfully.

### Additional Characters:
The game now has 3 characters, although the priestess character is currently not finished. In the future, I would like to make 
her a more defensive type character with projectile attacks, as opposed to the other more offensively based characters.

### Title Screen and Character Select Screen:
The game now has a title and character select screen!

### 3 Round System and Winquotes
The game now has a best of 3 round system with win quotes when a player wins a best of 3.

## Future Functionality
In the future, I would like to add the following:

### Different kinds of attacks
I would like to add special attacks and throws to make the gameplay more interesting.

### Computer Opponents
I would like to add a computer opponent so that the game can be played with only one player.

### Extra Music and Stages
I would like to add extra stages and music as well as a stage and music select function.
