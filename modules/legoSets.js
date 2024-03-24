require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', '4Bbh1FNWQZLf', {
  host: 'ep-small-feather-a5ny1a9h.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const Theme = sequelize.define('Theme', { 
id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true},
name:{
  type:Sequelize.STRING
}},
{
  createdAt:false,
  updatedAt:false,
}
);

const Set = sequelize.define('Set', { 
  set_num:{
    type:Sequelize.STRING,
    primaryKey:true,
  },
  name:{
    type:Sequelize.STRING,
  },
  year:{
    type:Sequelize.INTEGER
  },
  num_parts:{
    type:Sequelize.INTEGER
  },
  theme_id:{
    type:Sequelize.INTEGER
  },
  img_url:{
    type:Sequelize.STRING
  },},
{
    createdAt:false,
    updatedAt:false
  }
  );

Set.belongsTo(Theme, {foreignKey:'theme_id'});


function initialize() {
  //guessing this doesnt do much anymore but just ensure everytrhings smooth?..
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getAllSets() {
  return new Promise((resolve, reject) => {
    Set.findAll({
      //rememebr add include theme option
      include:[Theme]
    })
.then((sets)=>{
  resolve(sets)
})
.catch((error)=>{
  reject(error)
})
  });
}

function getSetByNum(setNum) {

  return new Promise((resolve, reject)=>{
    Set.findOne({
      where:{set_num:setNum}, //check matching
      include:[Theme]
    })
    .then((setMatch)=>{
      if(setMatch){
        resolve (setMatch);
      }
      else{
        reject("Set was not found")
      }
    })
    .catch((error)=>{reject(error.message)})
  })
}

function getSetsByTheme(theme) {

  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
      where: {
        '$Theme.name$': {
          [Sequelize.Op.iLike]: `%${theme}%`
        }
      }
    })
    .then((setsMatch) => {
        resolve(setsMatch);
    
    })
    .catch((error) => {
      reject("Could not find the set! Contact admin");
    });
  });
  
}
//NEW
function addSet(setData){
return new Promise((resolve, reject)=>{
  Set.create({
    set_num: setData.set_num,
    name: setData.name,
    year:setData.year,
    num_parts:setData.num_parts,
    img_url: setData.img_url,
  })

  .then(()=>{
  resolve()
  })
.catch((err)=>{
reject(err.errors[0].message)
})
})
} 

function getAllThemes(){
return new Promise((resolve, reject)=>{
  Theme.findAll()
  .then(themeSet=>{
    resolve(themeSet)
  })
  .catch(error=>{
    reject(error)
  })
})

}
function editSet(set_num, setData) {
  return new Promise((resolve, reject) => {
    Set.findOne({
       where: { set_num } 
      })
    .then((setFound) => {
      if (!setFound) {
      reject(err.errors[0].message)
    } else {
        setFound
        .update(setData)
        .then(() => {
        resolve();
            })
        .catch((err) => {
        reject(err.errors[0].message);
        });}})
      .catch((err) => {
      reject(err.errors[0].message)
      });});
}



module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet }

