// MVP 2
// difficulty levels
// level 1: 1 letter blocked out of half the words
// level 2: 1 letter blocked out of half the words, 2 on the other half
// level 3: All letters blocked out except for first letter on 60% of the words, 40% have 1-3 letters blocked out
// level 4: completely blank
var level = 3;
var answersArr = [];

// genBlankedWord(text, num) -> string
// takes some input string and returns HTML code with some number of letters of the code blanked out either from the start or the end
// genBlankedWord adds the blanked portion to the answers arr and assigns each input with the id fi-X where X is equal to the length of the answersArr
// when num > text.length, returns the string back without any changes
function genBlankedWord(text, num, fromStart = false){
  if(num > text.length){
    return text;
  }
  
  // if 0, eliminate from the back
  // if 1, eliminate from the front
  var elimFlag = 1;
  if(!fromStart){
    elimFlag = Math.round(Math.random());
  }
  var workingText = text;
  
  // reverse the text for 0, from back
  if(elimFlag == 0){
    workingText = workingText.split("").reverse().join("")
  }
  
  // remove the first n letters
  var eliminated = workingText.substring(0, num);
  var workingText = workingText.substring(num);
  
  // add the eliminated text to the answers array
  answersArr.push(eliminated);
  // eliminated from the back
  if(elimFlag == 0){
    workingText = workingText.split("").reverse().join("");
    return `${workingText}<input type="text" id="fi-${answersArr.length-1}" class="underline">`;
  }
  // eliminated from the front
  return `<input type="text" id="fi-${answersArr.length-1}" class="underline">${workingText}`;
}


// genT1Code(text, level) -> string
// takes some input string and returns HTML code based on the level returned that represents a fill in
// depends on genBlankedWord

// difficulty levels
// level 1: 1 letter blocked out of half the words
// level 2: 1 letter blocked out of half the words, 2 on the other half
// level 3: All letters blocked out except for first letter on half of the words, the rest have 20%-60% of the letters blocked out
// level 4: completely blank
function genT1Code(text, level){
  var textArr = text.split(" ")
  var outputArr = [];
  
  for(let i = 0; i < textArr.length; i++){
    var currEle = textArr[i];
    // blank based on levels
    c(level)
    if(level == 1){
      if(Math.round(Math.random()) == 0){
        currEle = genBlankedWord(currEle, 1)
      }
    }
    else if(level == 2){
      if(Math.round(Math.random()) == 0){
        currEle = genBlankedWord(currEle, 1)
      }
      else{
        currEle = genBlankedWord(currEle, 2)
      }
    }
    else if(level == 3){
      if(Math.round(Math.random()) == 0){
        currEle = genBlankedWord(currEle, currEle.length - 1, true)
      }
      else{
        // 20%-60% blanked
        let n = Math.random()*0.4+0.2;
        currEle = genBlankedWord(currEle, Math.round(currEle.length*n))
      }
    }
    else if(level == 4){
      currEle = genBlankedWord(currEle, currEle.length)
    }
    outputArr.push(currEle);
  }
  return outputArr.join(" ");
}

function addEventListenerT1(){
  $(".underline").each(function(){
  $(this).on("input", function(){
    var fiNum = $(this).attr("id").split("-")[1]
    // alter the width of input based on characters
    var letterWidth = 9;
    var currString = $(this).val();
    $(this).width(letterWidth * currString.length)
    
    if(answersArr[fiNum] == $(this).val()){
      // green background highlighting
      $(this).css("background-color", "#c8e3b3")
      // jump to next
      $(`#fi-${parseInt(fiNum)+1}`).focus()
      // disable it
      $(this).attr('disabled','disabled')
    }
    else{
      $(this).css("background-color", "#d9d9d9")
    }
  })
})
}


$("#make-game").click(function(){
  var card = {front: $("#front").val(), 
              back: $("#back").val()}
  // add the title 
  $("#t1-out").append(`<p>${card.front}</p>`);
  $("#t1-out").append(genT1Code(card.back, level));
  addEventListenerT1();
})

function c(text){
  console.log(text)
}