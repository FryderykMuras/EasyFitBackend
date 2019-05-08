const express = require('express');
const mysql = require('mysql')
const Joi = require('@hapi/joi')

const app = express();
app.use(express.json())





const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'EasyFit'
})

app.get('/',(req, res)=>{
  res.send('Hello World');
})

app.get('/simpleProducts/:id',(req,res)=>{
  connection.query(`SELECT * FROM SimpleProducts WHERE ID = ${req.params.id}` , (err, rows, fields)=>{
    if (err) {
      console.log("Failed to query");
      res.end();
      return
    }
    res.json(rows);
  })
})

app.get('/simpleProducts',(req,res)=>{
  connection.query('SELECT * FROM SimpleProducts' , (err, rows, fields)=>{
    if (err) {
      console.log("Failed to query");
      res.end();
      return
    }
    res.json(rows);
  })
})

app.post('/simpleProducts',(req,res)=>{
  const schema = {
    NAME: Joi.string().min(3).required(),
    KCAL: Joi.number().required(),
    PROTEINS: Joi.number().required(),
    FATS: Joi.number().required(),
    CARBOHYDRATES: Joi.number().required()
  }
  const validationResult = Joi.validate(req.body, schema);
  if(!validationResult.error){
    connection.query(`INSERT INTO SimpleProducts (NAME, KCAL, PROTEINS, FATS, CARBOHYDRATES) VALUES ("${req.body.NAME}", ${req.body.KCAL}, ${req.body.PROTEINS}, ${req.body.FATS}, ${req.body.CARBOHYDRATES})` , (err, rows, fields)=>{
      if (err) {
        console.log("Failed to query", err);
        res.end();
        return
      }
      console.log(rows.insertId);
      res.json({ID: rows.insertId, ...req.body})
    })
  }else{
    res.send(validationResult.error.details[0].message);
    return
  }
})

app.get('/eatenMeals/:user/:year/:month/:day',(req, res)=>{
  const query = `SELECT sum(s.KCAL*e.QUANTITY/100) as CALORIES, sum(s.PROTEINS*e.QUANTITY/100) as PROTEINS, sum(s.FATS*e.QUANTITY/100) as FATS, sum(s.CARBOHYDRATES*e.QUANTITY/100) as CARBOHYDRATES FROM EatenMeals e join SimpleProducts s on e.SIMPLEPRODUCT_ID = s.ID WHERE e.USER_ID = ${req.params.user} AND date(e.DATE) = "${req.params.year}-${req.params.month}-${req.params.day}"`
  connection.query(query , (err, rows, fields)=>{
    if (err) {
      console.log("Failed to query");
      res.end();
      return
    }
    res.json(rows);
  })
})

app.get('/eatenMealsDetailed/:user/:year/:month/:day',(req, res)=>{
  const query = `SELECT e.SIMPLEPRODUCT_ID, s.NAME, sum(e.QUANTITY) as QUANTITY, sum(s.KCAL*e.QUANTITY/100) as CALORIES, sum(s.PROTEINS*e.QUANTITY/100) as PROTEINS, sum(s.FATS*e.QUANTITY/100) as FATS, sum(s.CARBOHYDRATES*e.QUANTITY/100) as CARBOHYDRATES FROM EatenMeals e join SimpleProducts s on e.SIMPLEPRODUCT_ID = s.ID WHERE e.USER_ID = ${req.params.user} AND date(e.DATE) = "${req.params.year}-${req.params.month}-${req.params.day}" GROUP BY e.SIMPLEPRODUCT_ID`
  connection.query(query , (err, rows, fields)=>{
    if (err) {
      console.log("Failed to query");
      res.end();
      return
    }
    res.json(rows);
  })
})

app.listen(3000, ()=>{console.log('Listening...')})
