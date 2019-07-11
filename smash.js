
// Player Object 
var player = {
    health: 100,
    power: 20,
    speed: 50
};

// Enemy Object 
var enemy = {
    health: 100,
    power: 15,
    speed: 60
};

//Checks to see if player/enemy has been defeated 
function gameOver(health){
    return health <= 0;
}

function restart(){

}


// Player Attacks Enemy
function attack(){ 

    console.log(param);
    var attackButton = document.getElementById('attack-button');
    var gameMessage = document.getElementById('game-message');
    var restartButton = document.getElementById('restart-button');

    // Player attacks enemy, Enemy health decreases 
    var playerAttack = (Math.floor(Math.random() * player.power)) + 1;
    enemy.health -= playerAttack;
    if (enemy.health <= 0){
        enemy.health = 0;
    }
    printToScreen();


    // Check to see if enemy lost
    if(gameOver(enemy.health)){
        gameMessage.innerText = "Player has Won!";
        attackButton.hidden = true;
        restartButton.hidden = false;
        return;
    }

    // Disable the button so the player cannot attack twice in a row
    attackButton.disabled = true;
    // Reveal game message to the player 
    gameMessage.innerText = "Enemy is about to strike!";
    
    // Enemy turn to attack. Delay of 2 seconds between player attack and enemy attack.
    setTimeout(function enemy_attack(){
        var oppenentAttack = 8;
        player.health -= oppenentAttack;
        if (player.health <= 0){
            player.health = 0;
        }
        printToScreen();


        // Check to see if player lost
        if(gameOver(player.health)){
            gameMessage.innerText = "Enemy has Won!";
            attackButton.hidden = true;
            restartButton.hidden = false;
            return;
        }

        attackButton.disabled = false;
    }, 200)

}

// Prints status to screen 
function printToScreen (){
    document.getElementById('player-health').innerText = player.health;
    document.getElementById('enemy-health').innerText = enemy.health;
}


