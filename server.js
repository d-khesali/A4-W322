/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*NOTE I am using faculty solution for A4

*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Daniel Khesali Student ID: 146228200 Date: Mar 18, 2024
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render("home")
});

app.get('/about', (req, res) => {
  res.render("about");
});


app.get("/lego/sets", async (req,res)=>{

  let sets = [];

  try{    
    if(req.query.theme){
      sets = await legoData.getSetsByTheme(req.query.theme);
    }else{
      sets = await legoData.getAllSets();
    }

    res.render("sets", {sets})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
  
});


app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    res.render("set", {set})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});


app.get("/lego/addSet", async (req, res)=>{
  try{
    const themeData= await legoData.getAllThemes();
    res.render('addSet', {themes:themeData})
  }
  catch(err){
    res.status(505).render("505",{message:err});
  }
})

app.post('/lego/addSet', async (req, res)=>{
  try{
    const setData= req.body;
    await legoSets.addSet(setData)
    res.redirect('/lego/sets');
  }
  catch(err){
    res.render('500', {message:'We had difficulty with adding a set'})
  }

})

app.get('/lego/editSet/:num', async(req,res)=>{
  try{
    const themeData= await legoData.getAllThemes();
    const setNum = req.params.num;
    const setData = await legoData.getSetByNum(setNum);

    res.render("editSet", { themes: themeData, set: setData });
  }
  catch(err){
    res.status(404).render("404",{message:err});
  }
  }
)

app.post('/lego/editSet', async(req, res)=>{
  try{
    const setNum = req.body.set_num;
    const setData = req.body;
    await setData(setNum, setData)
    res.redirect('/lego/sets')
  }
  catch(err){
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
})


app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});
/* was useless:
app.use((req, res, next) => {
  res.status(505).render("505", {message: "I'm sorry, we're unable to process adding sets right now."});
});
*/


legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});