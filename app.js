const express = require('express');
const mysql = require('mysql');
const Joi = require('@hapi/joi');
const passwordHash = require('password-hash');
const simpleProductsAPI = require('./simpleProductsAPI');
const complexMealsAPI = require('./complexMealsAPI');
const eatenMealsAPI = require('./eatenMealsAPI');
const goalsAPI = require('./goalsAPI');
const notificationsAPI = require('./notificationsAPI');


const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'EasyFit',
  charset : 'utf8',
  timezone: 'utc'
})

simpleProductsAPI.simpleProductsAPI(app,connection,Joi);
complexMealsAPI.complexMealsAPI(app,connection,Joi);
eatenMealsAPI.eatenMealsAPI(app,connection,Joi);
goalsAPI.goalsAPI(app,connection,Joi);
notificationsAPI.notificationsAPI(app,connection,Joi);



app.post('/register',(req,res)=>{
  const newUser = req.body;

  connection.query(`SELECT * FROM Users WHERE EMAIL = '${newUser.EMAIL}'`,(err, rows, fields)=>{
    if (err) {
      console.log("Failed to query", err);
      res.status(500);
      res.send("Failed to query");
      return
    }else{
      if(rows[0]){
        console.log("email taken");
        res.status("409");
        res.send("This email is taken");
        return
      }
      const values = [newUser.EMAIL, passwordHash.generate(newUser.PASSWORD)];
      connection.query(`INSERT INTO Users (EMAIL, PASSWORDHASH) VALUES (?)`,[values] , (err, rows, fields)=>{
        if (err) {
          console.log("Failed to query", err);
          res.status(500);
          res.send("Failed to query");
          return
        }else{
          
          res.status(201).json({USERID: rows.insertId})

          connection.query(`INSERT INTO Goals (USER_ID,KCAL,CARBOHYDRATES,PROTEINS,FATS) VALUES (${rows.insertId}, 2000, 50, 20, 30)` , (err, rows, fields)=>{})
          return
        }
        
      })
      
    }
    
  })

})

app.post('/login',(req,res)=>{
  const user = req.body;

  connection.query(`SELECT ID, PASSWORDHASH FROM Users WHERE EMAIL = '${user.EMAIL}'` , (err, rows, fields)=>{
    if (err) {
      console.log(err);
      res.status(500)
      res.end();
      return
    }
    if(!rows[0]){
      res.status(404).send();
      return;
    }else{
      if(passwordHash.verify(user.PASSWORD, rows[0].PASSWORDHASH)){
        res.json({USERID: rows[0].ID});
        res.end();
        return
      }else{
        res.status(401);
        res.end();
      }
      
    }
    
  })


})

app.listen(3000, ()=>{console.log('Listening...')})
