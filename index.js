var frontTerms = [];
var backTerms = [];
var playerPower = 1;
var playerHealthMax = 35;
var playerHealthCurr = 20;
var monstersKilled = 0

var monsterPower = 0;
var monsterHealthMax = 40;
var monsterHealthCurr = 40;

var currentTurn = "player";

var card0 = {
    front: "",
    back: "",
    effect: {
        type: "",
        number: 0
    }
}
var card1 = {
    front: "",
    back: "",
    effect: {
        type: "",
        number: 0
    }
}
var card2 = {
    front: "",
    back: "",
    effect: {
        type: "",
        number: 0
    }
}
var card3 = {
    front: "",
    back: "",
    effect: {
        type: "",
        number: 0,
    }
}

// generate a flashcard object
function Flashcard(front_txt, back_txt){
    this.front = front_txt
    this.back = back_txt
}

// generate a card object
function Card (front_txt, back_txt, card_type, effect_num){
    this.front = front_txt,
    this.back = back_txt,
    this.effect = {
        type: card_type,
        number: effect_num
    }
}


// initialize cards
function generateCardHTML(card, pos){
    var cardType = card.effect.type;
    if(cardType == "heal"){
        return `<div class="flashcard" id="pos-${pos}"> 
        <img src="heart.png" alt="" class="card-icon">
        <div class="card-content">
            <h4>${card.front}</h4>
            <p class="card-desc">Heal for up to ${card.effect.number} HP.</p>
        </div>
        </div>`
    }
    else if(cardType == "arrow"){
        return `<div class="flashcard" id="pos-${pos}">
        <img src="arrow.png" alt="" class="card-icon">
        <div class="card-content">
            <h4>${card.front}</h4>
            <p class="card-desc">Shoot arrows for up to ${card.effect.number} damage.</p>
        </div>
    </div>`
    }
    else if(cardType == "wand"){
        return `<div class="flashcard" id="pos-${pos}">
        <img src="wand.png" alt="" class="card-icon">
        <div class="card-content">
            <h4>${card.front}</h4>
            <p class="card-desc">Cast a spell for ${card.effect.number} Damage. Superior inscriptions can increase damage by up to 2x.</p>
        </div>
    </div>`
    }
}
function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
    return shuffled.slice(0, num);
}

// returns array of Card objects
function getHand(){
    var used_nums = [];
    var hand = [];
    for(let i = 0; i < 4; i++){
        var curr_num = Math.floor(Math.random()*frontTerms.length);
        // reroll number until curr_num is a new number
        while(used_nums.includes(curr_num)){
            curr_num = Math.floor(Math.random()*frontTerms.length);
        }
        used_nums.push(curr_num)
        var front = frontTerms[curr_num];
        var back = backTerms[curr_num];
        var type = "arrow";
        var power = 3;
        if(Math.random() > 0.5){
            type = "heal"
        }
        if(back.split(" ").length > 3){
            type = "wand"
            // every three extra words increase the power of the card by 1
            power += Math.floor((back.length - 3) / 3)
        }
        power += playerPower;
        hand.push(new Card(front, back, type, power))
    }
    var used_nums = [];
    return hand;
    
}

function emptyCards(){
    $("#card-0").empty()
    $("#card-1").empty()
    $("#card-2").empty()
    $("#card-3").empty()
}

function initCards(){
    // empty card columns
    emptyCards()
    // fill in cards with 4 random from flashcards array
    var currHand = getHand();
    card0 = currHand[0];
    card1 = currHand[1];
    card2 = currHand[2];
    card3 = currHand[3];
    // hide initial screen
    $("#init-screen").hide()
    // load cards in
    $("#card-0").append(generateCardHTML(card0, 0))
    $("#card-1").append(generateCardHTML(card1, 1))
    $("#card-2").append(generateCardHTML(card2, 2))
    $("#card-3").append(generateCardHTML(card3, 3))

    // add event listeners
    $(".flashcard").each(function(){
        $(this).click(function(){
            var cardNum = $(this).attr("id").split("-")[1]
            playCard(currHand[cardNum]);
        })
    })
}

function playCard(card){
    // play card and start minigame based on card type
    if(card.effect.type == "heal"){
        playHeal(card)
    }
    else if(card.effect.type == "arrow"){
        playArrow(card)
    }
    else if(card.effect.type == "wand"){
        playWand(card)
    }
}

function spellWrong(text){
    var option = Math.round(Math.random()*2)
    var index = Math.round(Math.random()*text.length);
    // double letter
    if(option == 0){
        return text.substring(0,index) + text[index] + text.substring(index);
    }
    // question mark
    else if(option == 1){
        return text.substring(0,index) + "?" + text.substring(index);
    }
    // remove letter
    else if(option == 2){
        return text.substring(0,index - 1) + text.substring(index);
    }
}
// cards show up on player side, click right one to heal
function playHeal(card){
    var numTags = 4 + Math.round(Math.random()*4);
    var baseTags = getMultipleRandom(backTerms, numTags-1);
    baseTags.push(card.back);
    var allTags = [];
    
    for(let i = 0; i < baseTags.length; i++){
        allTags.push(baseTags[i])
        allTags.push(spellWrong(baseTags[i]))
    }
    // position the tags
    for(let i = 0; i < allTags.length; i++){
        var xpos = Math.round(Math.random()*300);
        var ypos = 150 + Math.round(Math.random()*350);
        $("#player-display").append(`<div style="top: ${ypos}px; left: ${xpos}px;" class="heal-tag">
        ${allTags[i]}</div>`)
    }
    // remove all cards
    emptyCards();
    // add event listeners to each tag
    $(".heal-tag").each(function(){
        $(this).click(function(){
            if($(this).text().trim() == card.back){
                updateHealth("player", card.effect.number);
                $(this).css("background-color", "green").fadeOut(300, function(){
                    $(this).remove()
                })
                $(".heal-tag").each(function(){
                    $(this).css("background-color", "green")
                    $(this).fadeOut(300, function(){
                        $(this).remove()
                    })
                })
                monsterTurn();
            }
            else{
                $(this).css("background-color", "red")
                $(this).fadeOut(300, function(){
                    $(this).remove()
                })
            }
        })
    })
    // load the board:
    $("#center-display").append(`<div class="center-box">
    <p>Your term is:</p>
    <h1>${card.front}</h1>
    <p>Quick! Find the correct term before time runs out to heal <span id="center-num">${card.effect.number}</span> HP!</p>
</div>`)
}
// cards show up on enemy side, click right one to attack
// each wrong arrow decreases damage by 1/3
function playArrow(card){
    var numTags = 4 + Math.round(Math.random()*4);
    var baseTags = getMultipleRandom(backTerms, numTags-1);
    baseTags.push(card.back);
    var allTags = [];
    
    for(let i = 0; i < baseTags.length; i++){
        allTags.push(baseTags[i])
        allTags.push(spellWrong(baseTags[i]))
    }
    // position the tags
    for(let i = 0; i < allTags.length; i++){
        var xpos = Math.round(Math.random()*300);
        var ypos = 150 + Math.round(Math.random()*350);
        $("#monster-display").append(`<div style="top: ${ypos}px; right: ${xpos}px;" class="arrow-tag">
        ${allTags[i]}</div>`)
    }
    // remove all cards
    emptyCards();
    // add event listeners to each tag
    $(".arrow-tag").each(function(){
        $(this).click(function(){
            if($(this).text().trim() == card.back){
                updateHealth("monster", (card.effect.number)*-1);
                $(this).css("background-color", "green").fadeOut(300, function(){
                    $(this).remove()
                })
                $(".arrow-tag").each(function(){
                    $(this).css("background-color", "green")
                    $(this).fadeOut(300, function(){
                        $(this).remove()
                    })
                })
                monsterTurn();
            }
            else{
                $(this).css("background-color", "red")
                $(this).fadeOut(300, function(){
                    $(this).remove()
                })
            }
        })
    })
    // load the board:
    $("#center-display").append(`<div class="center-box">
    <p>Your term is:</p>
    <h1>${card.front}</h1>
    <p>Quick! Shoot the correct term before time runs out to do <span id="center-num">${card.effect.number}</span> Damage!</p>
</div>`)
}

// a script shows up with a fill in 
// each correct fill in increases damage upwards of 2x
function playWand(card){

}



function initMonster(){
    var monsters = ["Big Ol' Crocs", "Pink Lil Miss Peep", "Wandering Dead Devil"];
    var randNum = Math.round(Math.random()*2);
    var monsterName = monsters[randNum];
    $("#monster-display").append(`<img class="monster" src="monster-${randNum}.gif" alt="" id="monster-sprite">`)
    monsterHealthMax = 20 + 10*(Math.round(Math.random()*3))
    monsterPower += 1
    updateHealth("monster", monsterHealthMax-monsterHealthCurr)
}

function initHealth(){
    $("#player-display").append(`<div class="health-bar" id="player-bar-container">
    <div style="width: 100%" class="inner-bar" id="player-health">${playerHealthMax}</div>
</div>`);
    $("#monster-display").append(`<div class="health-bar" id="monster-bar-container">
    <div style="width: 100%" class="inner-bar" id="enemy-health">${monsterHealthMax}</div>
</div>`)
}

function updateHealth(target, n){
    console.log(n)
    if(target == "monster"){
        monsterHealthCurr += n
        if(monsterHealthCurr < 0){
            monsterHealthCurr = 0
        }
    }
    else{
        playerHealthCurr += n
        if(playerHealthCurr > playerHealthMax){
            playerHealthCurr = playerHealthMax
        }
    }

    $("#player-bar-container").empty()
    $("#monster-bar-container").empty()

    $("#player-bar-container").append(`<div style="width:${Math.round(playerHealthCurr/playerHealthMax*100)}%" class="inner-bar" id="player-health">${playerHealthCurr}</div>`);
    $("#monster-bar-container").append(`<div style="width:${Math.round(monsterHealthCurr/monsterHealthMax*100)}%" class="inner-bar" id="enemy-health">${monsterHealthCurr}</div>`)
}

$("#start-button").click(function(){
    $("#dark-overlay").empty()
    $("#dark-overlay").append(`<p class="title-text">Choose a starting deck:</p>
    <div class="button-group">
        <button class="title-button" id="span-deck">Spanish Foods</button>
        <button class="title-button" id="custom-deck">Custom</button>
    </div>`)
    $("#span-deck").click(function(){
        frontTerms = ["la sandía", "la manzana", "la fresa", "la comida", "cocinar", "el pepino", "el arroz", "las verduras"];
        backTerms = ["watermelon", "apple", "strawberry", "food", "to cook", "cucumber", "rice", "vegetables"];
        initGame()
    })
    $("#custom-deck").click(function(){
        console.log("hi")
        $("#dark-overlay").empty()
        $("#dark-overlay").append(`
        <h1>Custom Input</h1>
        <p class="title-text">Front Terms (Separate each with two commas, min. 4)</p><input type="text" id="front-term-input">
        <p class="title-text">Back Terms (Separate each with two commas, same order as above)</p><input type="text" id="back-term-input">
        <br><br><button class="title-button" id="play-custom">Play</button>
    </div>`)
        $("#play-custom").click(function(){
            frontTerms = $("#front-term-input").val().split(",,")
            backTerms = $("#back-term-input").val().split(",,")
            initGame()
        })
    })
})

function initGame(){
    initCards();
    initMonster();
    initHealth();
}

function monsterTurn(){
    $("#center-display").empty()
    updateHealth("player", -1*(monsterPower*Math.round(Math.random())));
    checkFinish()
}
function checkFinish(){
    if(monsterHealthCurr == 0){
        $("#monster-sprite").remove()
        monstersKilled += 1;
        playerPower += 1;
        monsterPower += 2;
        initMonster()
        monsterTurn()
    }
    else if(playerHealthCurr == 0){
        lose()
    }
    else{
        playerTurn()
    }
}
function playerTurn(){
     // fill in cards with 4 random from flashcards array
     var currHand = getHand();
     card0 = currHand[0];
     card1 = currHand[1];
     card2 = currHand[2];
     card3 = currHand[3];
     // load cards in
     $("#card-0").append(generateCardHTML(card0, 0))
     $("#card-1").append(generateCardHTML(card1, 1))
     $("#card-2").append(generateCardHTML(card2, 2))
     $("#card-3").append(generateCardHTML(card3, 3))
     // add event listeners
     $(".flashcard").each(function(){
         $(this).click(function(){
             var cardNum = $(this).attr("id").split("-")[1]
             playCard(currHand[cardNum]);
         })
     })
}
function lose(){
    $("#init-screen").empty()
    $("#init-screen").append(`<div id="dark-overlay" class="black-screen">
    <h1 class="title-head">You've Lost...</h1>
    <p class="title-text">You've defeated ${monstersKilled} monsters</p>
    <button id="start-button" class="title-button">Play Again</button>
</div>`)
    $("#init-screen").show()

    $("#start-button").click(function(){
        $("#dark-overlay").empty()
        $("#dark-overlay").append(`<p class="title-text">Choose a starting deck:</p>
        <div class="button-group">
            <button class="title-button" id="span-deck">Spanish Foods</button>
            <button class="title-button" id="custom-deck">Custom</button>
        </div>`)
        $("#span-deck").click(function(){
            frontTerms = ["la sandía", "la manzana", "la fresa", "la comida", "cocinar", "el pepino", "el arroz", "las verduras"];
            backTerms = ["watermelon", "apple", "strawberry", "food", "to cook", "cucumber", "rice", "vegetables"];
            initGame()
        })
        $("#custom-deck").click(function(){
            console.log("hi")
            $("#dark-overlay").empty()
            $("#dark-overlay").append(`
            <h1>Custom Input</h1>
            <p class="title-text">Front Terms (Separate each with two commas, min. 4)</p><input type="text" id="front-term-input">
            <p class="title-text">Back Terms (Separate each with two commas, same order as above)</p><input type="text" id="back-term-input">
            <br><br><button class="title-button" id="play-custom">Play</button>
        </div>`)
            $("#play-custom").click(function(){
                frontTerms = $("#front-term-input").val().split(",,")
                backTerms = $("#back-term-input").val().split(",,")
                initGame()
            })
        })
    })
}