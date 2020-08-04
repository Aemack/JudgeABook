require('dotenv').config();
const puppeteer = require('puppeteer');
const express = require('express');
const { response } = require('express');
const app = express()
const port = process.env.PORT || 80
app.listen(port,() => console.log(`You are listening at ${port}`))
app.use(express.static('public'));
app.use(express.json());


genres = ['classics','historical-fiction','history','humor','mystery-suspense','romance','science-fiction-fantasy','teen-young-adult']
highscore = 0;
try{
app.get('/api/highScore', async (req,res)=>{
    res.json({newHigh:highscore})
})}
catch(e){
    console.log(e.message)
}

app.post('/api/highScore',async (req,res)=>{
    lastScore = req.body.lastScore
     if (lastScore > highscore){
         highscore=lastScore;
     }
     console.log(`Highscore: ${highscore}`)
})

app.get('/api/bookCover', async (req,res) => {
    randNum = Math.floor(Math.random()*8)
    genre = genres[randNum]
    imgSrc = await getBookImage(`https://www.penguinrandomhouse.com/books/best-sellers-${genre}`)
    res.json({imgUrl:imgSrc, correctAnswer: genre})
})



async function getBookImage(url){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url);


    const [el] = await page.$x(`//*[@id="main"]/div[7]/div/div[2]/div/div[${Math.floor(Math.random()*10)+1}]/div[1]/a/img`);
    const src= el.getProperty('src');
    const srcTxt = (await src).jsonValue()


    browser.close()

    return srcTxt;
}

