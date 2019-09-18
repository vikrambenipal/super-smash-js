// ** HTML5 CANVAS **

// Dimensions of canvas 
var canWidth = 1000; 
var canHeight = 420;

// Position where the sprite will be 
var x_link = 600;
var y_link = 160;

var x_mario = 100;
var y_mario = 150;

// Where to extract image from spritesheet 
var srcX_link;
var srcY_link;

var srcX_mario;
var srcY_mario;

// Dimensions of sprite sheet 
// Link
var sheetWidth_link = 576;
var sheetHeight_link = 233;

// Mario 
var sheetWidth_mario = 581;
var sheetHeight_mario = 230;

// Number of rows and cols 
// Link
var rows_link = 1;
var cols_link = 3; 

// Mario 
var rows_mario = 1;
var cols_mario = 4;

// width and height of each sprite image 
var width_link = sheetWidth_link / cols_link; 
var height_link = sheetHeight_link / rows_link; 

var width_mario = sheetWidth_mario / cols_mario;
var height_mario = sheetHeight_mario / rows_mario; 

// Current frame animation is on 
var currentFrameLink = 0; 
var currentFrameMario = 0;

// Get image from HTML 
var link_anim = new Image();
link_anim.src = "link_sprites2.png";

var mario_anim = new Image();
mario_anim.src = "mario_spritesheet.png";

// Create canva 
var canvas = document.getElementById('canvas');
// Assign canvas width and height 
canvas.width = canWidth;
canvas.height = canHeight;

// Context: specify that you are drawing in 2D
var ctx = canvas.getContext('2d');

// Update each frame of the animation 
function updateFrameLink(){
    // Looping occurs due to the % sign 
    // Goes through each frame of the animation and collects the correct (x,y) coordinates 
    currentFrameLink = (++currentFrameLink) % cols_link; 
    srcX_link = currentFrameLink * width_link;
    // srcY = 0 because this sprite sheet only has one row 
    srcY_link = 0;
    // Reset animation frames 
    ctx.clearRect(x_link,y_link,width_link,height_link);
}

function updateFrameMario(){
    currentFrameMario = (++currentFrameMario) % cols_mario;
    srcX_mario = currentFrameMario * width_mario;
    srcY_mario = 0;
    ctx.clearRect(x_mario,y_mario,width_mario,height_mario)
}

function drawImage(){
    // Update the frames of both characters 
    updateFrameLink();
    updateFrameMario();
    // Background Drawn 
    // Only (image,x,y,width,height) required for bg image 
    document.getElementById('bg');
    ctx.drawImage(bg,0,0,850,400);

    // Draw the animations 
    // The reason why this drawImage() has more paramters is because we are extracting images from a sprite sheet. 
    ctx.drawImage(link_anim, srcX_link, srcY_link, width_link, height_link, x_link, y_link, width_link, height_link);
    ctx.drawImage(mario_anim, srcX_mario, srcY_mario, width_mario, height_mario, x_mario, y_mario, width_mario, height_mario);
}

// Keeps calling drawImage() every 200ms
// That's why the animation of the characters keep moving! 
setInterval(function(){
    drawImage();
},200)


// ** ACTUAL GAME **
// One of three music selections will play when the player first attacks!
var sound1 = document.getElementById('sound1');
var sound2 = document.getElementById('sound2');
var sound3 = document.getElementById('sound3');
// Start song from certain points
sound1.currentTime = 1.3;
sound2.currentTime = 2;
sound3.currentTime = 20.5;
var selection = Math.floor(Math.random() * 3);
var music = [sound1,sound2,sound3];

// Mario Object
var mario = {
    percent: 0,
    attack: 1,
    ko: 350,
};

// Link Object
var link = {
    percent: 0,
    attack: 1,
    ko: 350,
};

function attack(marioAttack,message){   
    playMusic();
    var gameMessage = document.getElementById('game-message');
    var restartButton = document.getElementById('restart-button');
    var punchEffect = document.getElementById('punch');

    if(marioAttack > 0){
        // Punch effect if Mario gets a hit 
        punchEffect.play();
    }

    marioAttack *= mario.attack;
    link.percent += marioAttack;
    printScreen();
    // Disable Mario from using moves before Link next attack
    hideButtons();
    gameMessage.innerText = message;

    setTimeout(function(){
        var linkChoice = Math.floor(Math.random() * 4)+1;

        if(gameOver(mario.percent,mario.ko)){
            var linkAttack = champions_arrow();
            // If Link hit his final smash, end game as Link is the winner 
            if(linkAttack == -1){
                endGame(0);

                return;
            }
        }else if(linkChoice == 1){
            var linkAttack = bomb_arrow();
            gameMessage.innerText = "Link used Bomb Arrow!";
        }else if(linkChoice == 2){
            var linkAttack = triforce_power();
            gameMessage.innerText = "Link Triforce Power! Link's Attack rose!";
        }else if(linkChoice == 3){
            var linkAttack = hookshot();
            gameMessage.innerText = "Link used Hookshot!";
        }else if(linkChoice == 4){
            var linkAttack = sword_slash();
            if(linkAttack == 0){
                gameMessage.innerText = "Link used Sword Slash! Link missed!";
            }else{
                gameMessage.innerText = "Link used Sword Slash!";
            }  
        }

        if(linkAttack > 0){
            punchEffect.play();
        }

        // Multiply by attack factor 
        linkAttack *= link.attack;
        // Floor decimal places on attack amount 
        linkAttack = Math.floor(linkAttack);
        // Attack Mario!
        mario.percent += linkAttack;
        printScreen();
        // Enable Mario to Attack

        setTimeout(function(){
            showButtons();
        },2000);
        
    },2000);

    
}

//Mario: Final Smash
function mario_finale(){
    if(gameOver(link.percent,link.ko)){
        var chance = Math.floor(Math.random() * 10) + 1;
        if(chance <= 4){
            stopMusic();
            document.getElementById('game-message').innerText = "Mario used Mario Finale! Mario KO'd Link! Mario Wins!";
            endGame(1);
            return;
        }else{
            document.getElementById('gasp').play();
            return attack(0, "Mario used Mario Finale! Mario missed!");
        }
    }else{
        document.getElementById('aww').play();
        return attack(0, "Mario used Mario Finale! Link's not at a high enough %!");
    }
}

//Link: Final Smash
function champions_arrow(){
    // If Mario is at a high enough % to get KO'd, proceed 
    if(gameOver(mario.percent,mario.ko)){
        var chance = Math.floor(Math.random() * 10) + 1;
        //If Link hits Mario 
        if(chance <= 4){
            stopMusic();
            document.getElementById('game-message').innerText = "Link used Champion's Arrow! Link KO'd Mario! Link Wins!"
            return -1;
            //If Link misses Mario 
        }else{
            document.getElementById('game-message').innerText = "Link used Champion's Arrow! Link missed!";
            document.getElementById('gasp').play();
            return 0;
        }
        //If Mario is not at a high enough % 
    }else{
        document.getElementById('game-message').innerText = "Link used Champion's Arrow! Mario's not at a high enough %!";
        return 0;
    }
}

// Mario: Does 25 damage everytime 
function fireball(){
    var marioAttack = 25;
    attack(marioAttack,"Mario used Fireball!");
}

//Mario: Either restores percent and raises attack
function super_mushroom(){
    var heal = Math.floor(Math.random() * 20) + 1;
    var marioAttack = 0;
    if(mario.percent - heal <= 0){
        mario.percent = 0;
    }else{
        mario.percent -= heal;
    }
    document.getElementById('heal').play();
    attack(marioAttack, "Mario used Super Mushroom! Mario recovered Health!");
}

//Mario: Has a 80% accuracy rate
function aerial_punch(){  
    var marioAttack = 55;
    var chance = Math.floor(Math.random() * 10) + 1;
    if(chance <= 7){
        return attack(marioAttack,"Mario used Aerial Punch!");      
    }else{
        document.getElementById('aww').play();
        return attack(0,"Mario used Aerial Punch! Mario missed!");
        
    }
}

//Mario: Does 20 damage everytime and may lower enemy attack
function fludd(){
    var marioAttack = 20;
    var chance = Math.floor(Math.random() * 10) + 1;
    if(chance <= 7){
        link.attack -= 0.2;
        return attack(marioAttack, "Mario used F.L.U.D.D! Link's Attack fell!");
    }else{
        return attack(marioAttack, "Mario used F.L.U.D.D");
    }
}

//Link: Boost attack by 0.1
function triforce_power(){
    link.attack += 0.3;
    document.getElementById('link-attack-rose').play();
    return 0;
}

//Link: Does 30 damage every time 
function hookshot(){
    return 30;
}

//Link: Can do up to 60 damage with a 10 damage recoil 
function bomb_arrow(){
    link.percent += 10;
    return Math.floor(Math.random() * 60)+10;
}

//Link: Has a 70% accuracy rate 
function sword_slash(){
    var chance = Math.floor(Math.random() * 10)+1;
    if(chance >= 7){
        return 60;
    }else{
        document.getElementById('aww').play();
        return 0;
    }
}

//Hide all attack buttons and reveal the reset button
function endGame(winner){
    // Home run and GAME sound effects 
    document.getElementById('homerun').play();
    if(winner == 0){
        document.getElementById('mario-scream').play();
    }else if(winner == 1){
        document.getElementById('link-scream').play();
    }

    document.getElementById('game').play();
    // Hide Attack Buttons 
    hideButtons();
    // Enable Reset Button 
    document.getElementById('restart-button').hidden = false;
}

//Enable all attack buttons 
function enable(){
    document.getElementById('fireball-button').disabled = false;
    document.getElementById('fludd-button').disabled = false;
    document.getElementById('aerial-punch-button').disabled = false;
    document.getElementById('super-mushroom-button').disabled = false;   
    document.getElementById('mario-finale').disabled = false;
}

//Disable all attack buttons 
function disable() {
    document.getElementById('fireball-button').disabled = true;
    document.getElementById('fludd-button').disabled = true;
    document.getElementById('aerial-punch-button').disabled = true;
    document.getElementById('super-mushroom-button').disabled = true;
    document.getElementById('mario-finale').disabled = true;
}

//Check to see if a player is eligible to be KO'd 
function gameOver(current,ko){
    return (current >= ko);
}

// Restarts the game Does not seem to work*********
function restartGame(){
    // Reset player stats 
    mario.percent = 0;
    mario.attack = 1;
    link.percent = 0;
    link.attack = 1;
    // New music selection 
    selection = Math.floor(Math.random() * 3);
    // Enable player to use buttons 
    showButtons();
    // Remove restart button 
    document.getElementById('restart-button').hidden = true;
    //Remove Game Text 
    document.getElementById('game-message').innerText = "";
    printScreen();
}

function hideButtons(){
    document.getElementById('fireball-button').hidden = true;
    document.getElementById('fludd-button').hidden = true;
    document.getElementById('aerial-punch-button').hidden = true;
    document.getElementById('super-mushroom-button').hidden = true;
    document.getElementById('mario-finale').hidden = true; 
}

function showButtons(){
    enable();
    document.getElementById('fireball-button').hidden = false;
    document.getElementById('fludd-button').hidden = false;
    document.getElementById('aerial-punch-button').hidden = false;
    document.getElementById('super-mushroom-button').hidden = false;
    document.getElementById('mario-finale').hidden = false; 
}

// Will play one of three tracks for each match 
function playMusic(){
    music[selection].play();
    music[selection].lopp = true;
}

// Will stop music when a player has won
function stopMusic(){
    music[selection].pause();
    music[selection].load();
}

//Print current % for each player on screen 
// HOW TO: PASS OBJECT THROUGH A FUNCTION 
function printScreen(){
    var mario_percent = document.getElementById('mario-health');
    var link_percent = document.getElementById('link-health'); 
    mario_percent.innerText = mario.percent;
    link_percent.innerText = link.percent;
}

