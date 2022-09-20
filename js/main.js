//constants for card deck and plays
const suits = ["s", "d", "c", "h"];
const values = ["A", "02", "03", "04", "05", "06", "07", "08", "09", "10", "J", "Q", "K"];

let deck;
let draw;
let waste;
let aces;
let stacks;
let clickedCard;
let firstStackId;
let winner;

//playing area of board
const gameBoard = {draw: document.getElementById('draw'),
waste: document.getElementById('waste'),
ace1: document.getElementById('ace1'),
ace2: document.getElementById('ace2'),
ace3: document.getElementById('ace3'),
ace4: document.getElementById('ace4'),
stack1: document.getElementById('stack1'),
stack2: document.getElementById('stack2'),
stack3: document.getElementById('stack3'),
stack4: document.getElementById('stack4'),
stack5: document.getElementById('stack5'),
stack6: document.getElementById('stack6'),
stack7: document.getElementById('stack7')}

window.addEventListener('DOMContentLoaded', (e) => {
document.querySelector('body').addEventListener('click', handleClick);


//initiate game 
init();
function init(){
    deck = [];
    cardArr=[];
    draw = [];
    waste = [];
    aces = [[], [], [], []];
    stacks = [[],[],[],[],[],[],[]];
    stackUp=[1,1,1,1,1,1,1];
    clickedCard=null;
    newDeck();
    shuffleDeck();
    dealGame();
    render();
}
function render(){
    resetGame();
    drawPile();
    wastePile();
    acePile();
    tableauStack();
    if(checkWin()=== true) {
        document.getElementById('win').textContent = 'You Win!';
    }
}
//set up bottom row of cards, 1-7
function tableauStack(){
    let numCards;
    let cardBack;
    stacks.forEach((stack, ind) => {
        numCards = 0;
        cardBack = 0;
        stack.forEach((card, indCard) =>{
            let cardEle = document.createElement('div');
            cardEle.className = `card back ${card.suit}${card.value}`
            let faceUp = stackUp[ind];
            while(faceUp > 0){
                if(indCard === stack.length - faceUp){
                    cardEle.className = cardEle.className.replace(' back','');
                }
                faceUp--;
            }
            if (cardEle.className.includes('back')){
                cardEle.style = `position: absolute; left: -7px; top: ${-7 + (indCard * 12)}px;`;
                cardBack++;
            } else {
                if (numCards === 0) {
                    cardEle.style = `position: absolute; left: -7px; top: ${-7 + (indCard * 12)}px;`
                    numCards++
                } else {
                    cardEle.style = `position: absolute; left: -7px; top:  ${-7 + (indCard * 12)+(40 * (indCard-cardBack))}px;`
                }
            }
            gameBoard[`stack${ind +1}`].appendChild(cardEle);
        })
    })
}
function drawPile(){
    draw.forEach((card, indCard) => {
        let cardEle = document.createElement('div');
        cardEle.className = `card back ${card.suit}${card.value}`
        cardEle.style = `position: absolute; left: -7px; top: ${-7 + (indCard*-.5)}px;`
        gameBoard.draw.appendChild(cardEle);
    });
}
function wastePile(){
    waste.forEach((card, indCard) => {
        let cardEle = document.createElement('div');
        cardEle.className = `card ${card.suit}${card.value}`
        cardEle.style = `position: absolute; left: -7px; top: ${-7 + (indCard*-.5)}px;`
        gameBoard.waste.appendChild(cardEle);
    });
}
function acePile(){
    aces.forEach((stack, ind)=>{
        stack.forEach((card, indCard)=>{
            let cardEle = document.createElement('div');
            cardEle.className = `card ${card.suit}${card.value}`
            cardEle.style = `position: absolute; left: -7px; top: ${-7 + (indCard*-.5)}px;`
            gameBoard[`ace${ind +1}`].appendChild(cardEle);
        });
    });
}
function newDeck(){
    suits.forEach(suit =>{
        values.forEach(value=>{
            let card = {value: value, suit: suit};
            deck.push(card);
        });
    });
}
function shuffleDeck() {
    var i = deck.length, temp, rand;
    while (0 !== i) {
        rand = Math.floor(Math.random() * i);
        i--;
        temp = deck[i];
        deck[i] = deck[rand];
        deck[rand] = temp;
    }
    return deck;
}
function dealGame(){
    stacks.forEach((stack, ind)=>{
        for (let i=0; i<ind +1; i++)
        stack.unshift(deck.shift());
    });
    deck.forEach(card =>{
        draw.push(card);
    });
}
function resetGame(){
    for(let gameEl in gameBoard){
        while(gameBoard[gameEl].firstChild){
            gameBoard[gameEl].removeChild(gameBoard[gameEl].firstChild);
        }
    }
}
//when cards are clicked
function handleClick(e) {
    let clickDest = getClickDestination(e.target);
    if (clickDest.includes('stack')) {
        handleStackClick(e.target);
    } else if (clickDest.includes('ace')) {
        handleAceClick(e.target);
    } else if (clickDest === 'waste') {
        handleWasteClick(e.target);
    } else if (clickDest === 'draw') {
        handleDrawClick();
    } else if (clickDest === 'button') {
        init();
    }
}
function handleStackClick(element) {
    let stackId = getClickDestination(element).replace('stack', '') -1;
    let clickDest = getClickDestination(element);
    let topCard = stacks[stackId][stacks[stackId].length -1];
    let stackPos;
    if (!clickedCard && isFaceUpCard(element)) {
        firstStackId = stackId;
        firstClickDest = clickDest;
        element.className += ' highlight';
        stackPos = getPositionInStack(element.parentNode.children);
        clickedCard = stacks[stackId][stackPos];
        let cardsToPush = stackPos - stacks[stackId].length;
        while(cardsToPush < 0){
            cardArr.push(stacks[stackId].pop());
            stackUp[stackId]--;
            cardsToPush++;
        }
    } else if (!clickedCard && element === element.parentNode.lastChild) {
        stackUp[stackId]++;
        render();
    } else if (clickedCard && isFaceUpCard(element)) {
        if (stackId === firstStackId && clickDest === firstClickDest) {
            while(cardArr.length > 0) {
                stacks[stackId].push(cardArr.pop());
                stackUp[stackId]++
            }
            clickedCard = null;
            render();
        } else if(allowMove(clickedCard, topCard)){
            while(cardArr.length > 0) {
                stacks[stackId].push(cardArr.pop());
                stackUp[stackId]++;
            }clickedCard = null;
            render();
        }
    } else if (clickedCard && isEmptyStack(element) && getCardValue(clickedCard) === 13) {
        while(cardArr.length > 0) {
            stacks[stackId].push(cardArr.pop());
            stackUp[stackId]++;
        }clickedCard = null;
        render();
    } 
} 

function handleAceClick(element) {
    let aceId = getClickDestination(element).replace('ace', '') -1;
    let clickDest = getClickDestination(element);
    let topCard = aces[aceId][aces[aceId].length -1];

    if(!clickedCard && isFaceUpCard(element)){
        firstStackId = aceId;
        firstClickDest = clickDest;
        element.className += ' highlight';
        stackPos = getPositionInStack(element.parentNode.children);
        clickedCard = aces[aceId][stackPos];
        let cardsToPush = stackPos - aces[aceId].length;
        while(cardsToPush < 0){
            cardArr.push(aces[aceId].pop());
            cardsToPush++;
        }

    } else if (clickedCard) {
        if(!topCard) {
            if(getCardValue(clickedCard) === 1) {
                while(cardArr.length > 0) {
                    aces[aceId].push(cardArr.pop());
                }
                clickedCard = null;
                render();
            }

        } else {
            if (getCardValue(clickedCard) === getCardValue(topCard) + 1 && clickedCard.suit === topCard.suit) {
                while(cardArr.length > 0) {
                    aces[aceId].push(cardArr.pop());
                }
                clickedCard = null;
                render();
            }
        }    
    }
}

function handleWasteClick(element) {

    let topCard = waste[waste.length -1];
    let topCardEl = gameBoard.waste.lastChild;

    if(!clickedCard && !isEmptyStack(element)){
        topCardEl.className += ' highlight';
        clickedCard = topCard;
        firstStackId = 'waste';
        firstClickDest = 'waste';
        let cardsToPush = -1;
        while(cardsToPush < 0){
            cardArr.push(waste.pop());
            cardsToPush++;
        }
    } else if (!isEmptyStack(element) && topCardEl.className.includes('highlight') && getClickDestination(element) === 'waste') {
        while(cardArr.length > 0) {
            waste.push(cardArr.pop());
        }
        clickedCard = null;
        render();
    } 
}

function handleDrawClick () {
    if(!clickedCard) {
        // if there are cards in the draw stack flip and add to waste
        if(draw.length > 0) {
            waste.push(draw.pop());
            render();
        // when draw is empty, restart with waste    
        } else {
            while(waste.length > 0) {
                draw.push(waste.pop())
            }
        render();
        }
    }
}
//validates moves; if stack is empty, only kings are allowed. colors must alternate, and aces must go in order by suit
function isEmptyStack(element) {
    return !!element.id;
}
function allowMove(card1, card2) {
    
    let card1Color = getCardColor(card1);
    let card1Value = getCardValue(card1);
    let card2Color = getCardColor(card2);
    let card2Value = getCardValue(card2);

    if(card1Color === card2Color) {
        return false;
    } else if (card2Value - card1Value === 1) {
        return true;
    } else return false;
}

function getCardColor(cardObj) {
    if (cardObj.suit === 'h' || cardObj.suit === 'd') {
        return 'red'
    } else return 'black';
}

function getCardValue(cardObj) {
    switch(cardObj.value) {
        case 'A': return 1;
        break;
        case '02': return 2;
        break;
        case '03': return 3;
        break;
        case '04': return 4;
        break;
        case '05': return 5;
        break;
        case '06': return 6;
        break;
        case '07': return 7;
        break;
        case '08': return 8;
        break;
        case '09': return 9;
        break;
        case '10': return 10;
        break;
        case 'J': return 11;
        break;
        case 'Q': return 12;
        break;
        case 'K': return 13;
        break;
    }
}

function getPositionInStack(stackPos) {
    for(let i = 0; i < stackPos.length; i++) {
        if(stackPos[i].className.includes('highlight')) {
            return i;
        }
    } 
}
function isFaceUpCard(element) {
    return (element.className.includes('card') && !(element.className.includes('back')) && !(element.className.includes('outline'))) 
}
function getClickDestination(element) {
    if (element.id) {
        return element.id;
    } 
    else {
        return element.parentNode.id;
    }
}
function checkWin(){
    if (gameBoard.ace1.length + gameBoard.ace2.length + gameBoard.ace3.length + gameBoard.ace4.length === 52){
        return winner;
        } else {
            return false;
            }
}render();
})