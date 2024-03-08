/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Daniel Khesali Student ID: 146228200 Date: 2024-03-05
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


app.get('/', (req, res) => {
  res.render("home")
});

app.get('/about', (req, res) => {
  res.render("about")
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
    res.status(404).render("404", {message: "We were unable to find your desired set(s) based on the theme you chose."});
  }

});

app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    res.render("set", {set});
  }catch(err){
    res.status(404).render("404", {message:"No Sets found for your specific set number."});
  }
});

app.use((req, res, next) => {
  res.status(404).render("404", {message: "No view matched for a specific view."});
});


legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});