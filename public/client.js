genres = ['classics','historical-fiction','history','humor','mystery-suspense','romance','science-fiction-fantasy','teen-young-adult']
score = 0;


window.onload = async function () {
    const response = await fetch('/api/highScore')
    const data = await response.json()
    highscore =data.newHigh
    document.getElementById("highscore").innerText = highscore
}

async function getClicked(){
    
    const response = await fetch('/api/highScore')
    const data = await response.json()
    highscore =data.newHigh
    document.getElementById("highscore").innerText = highscore
    document.getElementById("startButton").style.display='none';

    newQuestion();
    }

async function newQuestion() {
    document.getElementById("score").textContent=score
    document.getElementById("bookCover").src="imgs/loading.gif"
    document.getElementById("bookCover").style.display="block"
    clear_options();
    const response = await fetch('/api/bookCover')
    const data = await response.json()
    console.log(data)
    coverEl = document.getElementById("bookCover")
    coverEl.src = data.imgUrl
    showOptions(data.correctAnswer)
}

function showOptions(correctAnswer){
    optionButtons = document.getElementById("options");
    existingButtons= []
    existingButtons.push(correctAnswer)
    correctButton = document.createElement("button");
    correctButton.setAttribute("id","correctAnswer");
    correctButton.setAttribute("onclick","correctAnswer()");
    correctButton.classList.add("optionButton")
    correctButton.innerText = correctAnswer.split("-").join(" ")

    randNum = Math.floor(Math.random()*3)+1
    while (existingButtons.length < 4){
        if (existingButtons.length == randNum){
            optionButtons.appendChild(correctButton)
        }
        wrongButton = document.createElement("button");
        wrongButton.setAttribute("id","wrongAnswer");
        wrongButton.setAttribute("onclick","wrongAnswer()");
        wrongButton.classList.add("optionButton")
        genre = genres[Math.floor(Math.random()*genres.length)]
        if(existingButtons.includes(genre)){
            continue
        }
        wrongButton.innerText = genre.split("-").join(" ")
        existingButtons.push(genre)
        optionButtons.appendChild(wrongButton)
    }
    console.log(existingButtons)
    
}

function clear_options() {
    
    document.getElementById("message").style.display="none";
    options = document.querySelectorAll(".optionButton")
    options.forEach(button => {
        button.remove();
    })
}

function correctAnswer(){
    score+=1;
    newQuestion();
}

async function wrongAnswer(){
    document.getElementById("message").innerText = "WRONG!";
    document.getElementById("message").style.display="inline";


    scoreObj = { lastScore: score}
    

    const options = {
        method: 'POST',
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scoreObj)
    };
    fetch('/api/highScore',options)
    score=0;
document.getElementById("bookCover").style.display="none"
clear_options()
document.getElementById("startButton").style.display="inline"
document.getElementById("message").style.display="inline"
document.getElementById("startButton").innerText = "Try Again"
}