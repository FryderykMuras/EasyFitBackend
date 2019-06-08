const express = require('express');
const mysql = require('mysql');
const Joi = require('@hapi/joi');
const simpleProductsAPI = require('./simpleProductsAPI');
const complexMealsApi = require('./complexMealsAPI');
const eatenMealsApi = require('./eatenMealsAPI');

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'EasyFit',
  charset : 'utf8'
})

simpleProductsAPI.simpleProductsAPI(app,connection,Joi);
complexMealsApi.complexMealsAPI(app,connection,Joi);
eatenMealsApi.eatenMealsAPI(app,connection,Joi);



app.post('/register',(req,res)=>{
  const newUser = req.body;
  console.log(newUser);

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
      const values = [newUser.EMAIL, newUser.PASSWORD];
      console.log(values);
      connection.query(`INSERT INTO Users (EMAIL, PASSWORDHASH) VALUES (?)`,[values] , (err, rows, fields)=>{
        if (err) {
          console.log("Failed to query", err);
          res.status(500);
          res.send("Failed to query");
          return
        }else{
          console.log(rows);
          res.status(201).json({USERID: rows.insertId})
          return
        }
        
      })
      
    }
    
  })

})

app.post('/login',(req,res)=>{
  const user = req.body;

  connection.query(`SELECT ID FROM Users WHERE EMAIL = '${user.EMAIL}' AND PASSWORDHASH = '${user.PASSWORD}'` , (err, rows, fields)=>{
    if (err) {
      console.log(err);
      res.status(500)
      res.end();
      return
    }
    if(!rows[0]){
      res.status(401).send();
      return;
    }else{
      res.json({USERID: rows[0].ID})
      res.end();
    }
    console.log(rows);
    
  })


})

app.listen(3000, ()=>{console.log('Listening...')})
