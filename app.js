const express = require('express');
const mysql = require('mysql')
const Joi = require('@hapi/joi')

const app = express();
app.use(express.json())





const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'EasyFit',
  charset : 'utf8'
})

app.get('/',(req, res)=>{
  res.send('Hello World');
})

app.get('/simpleProducts/:id',(req,res)=>{
  connection.query(`SELECT * FROM SimpleProducts WHERE ID = ${req.params.id}` , (err, rows, fields)=>{
    if (err) {
      console.log("Failed to query");
      res.status(500);
      res.end();
      return
    }
    if(rows[0]){
      res.json(rows[0]);
    }else{
      res.status(404);
      res.end();
    }
  })
})

app.get('/complexMeals',(req,res)=>{

  connection.query('SELECT c.ID, c.NAME, SUM(s.KCAL*i.QUANTITY/100) as KCAL, SUM(s.PROTEINS*i.QUANTITY/100) as PROTEINS, SUM(s.FATS*i.QUANTITY/100) as FATS, SUM(s.CARBOHYDRATES*i.QUANTITY/100) as CARBOHYDRATES FROM ComplexMeals c JOIN ComplexMealsIngredients i ON c.ID = i.COMPLEXMEAL_ID JOIN SimpleProducts s ON i.SIMPLEPRODUCT_ID = S.ID GROUP BY c.ID' , (err, rows, fields)=>{
    console.log("New request");
    if (err) {
      console.log(err);
      res.status(500)
      res.end();
      return
    }
     
    res.json(rows);
    return
  })
})

app.get('/complexMealDetailed/:id',(req,res)=>{
  let ComplexMeals;
  connection.query(`SELECT c.ID, s.NAME, i.QUANTITY FROM ComplexMeals c JOIN ComplexMealsIngredients i ON c.ID = i.COMPLEXMEAL_ID JOIN SimpleProducts s ON i.SIMPLEPRODUCT_ID = S.ID WHERE c.ID = ${req.params.id}` , (err, rows, fields)=>{
    console.log("New request");
    if (err) {
      console.log(err);
      res.status(500)
      res.end();
      return
    }else if(!rows[0]){
      res.status(404);
      res.end();
      return
    }
    ComplexMeals = rows;
    let pairs = ComplexMeals.map(obj=>{return{NAME: obj.NAME,QUANTITY: obj.QUANTITY}})
    
    res.json({ID: req.params.id,INGREDIANS: pairs});
    return
  })
})

app.post('/complexMeals',(req,res)=>{
  
  connection.query(`INSERT INTO ComplexMeals (NAME) VALUES ("${req.body.name}")`, (err, rows, fields)=>{
    if (err) {
      console.log("Failed to query", err);
      res.status(500);
      res.end();
      return
    }
    console.log(rows.insertId);
    const id = rows.insertId;
    const vals = req.body.ingredians.map(obj=>[rows.insertId, obj.simpleProductId, obj.quantity]);
    connection.query(`INSERT INTO ComplexMealsIngredients (COMPLEXMEAL_ID, SIMPLEPRODUCT_ID, QUANTITY) VALUES ?`,[vals], (err, rows, fields)=>{
      if (err) {
        console.log("Failed to query", err);
        res.status(500);
        res.end();
        return
      }
      
      res.json({ID: id})
      
    })

  })
})

app.get('/simpleProducts',(req,res)=>{
  connection.query('SELECT * FROM SimpleProducts ORDER BY NAME' , (err, rows, fields)=>{
    console.log("New request");
    if (err) {
      console.log("Failed to query");
      res.status(500)
      res.end();
      return
    }
    res.json(rows);
  })
})

app.post('/simpleProducts',(req,res)=>{
  const schema = {
    name: Joi.string().min(3).required(),
    kcal: Joi.number().required(),
    proteins: Joi.number().required(),
    fats: Joi.number().required(),
    carbohydrates: Joi.number().required()
  }
  const validationResult = Joi.validate(req.body, schema);
  if(!validationResult.error){
    connection.query(`INSERT INTO SimpleProducts (NAME, KCAL, PROTEINS, FATS, CARBOHYDRATES) VALUES ("${req.body.name}", ${req.body.kcal}, ${req.body.proteins}, ${req.body.fats}, ${req.body.carbohydrates})` , (err, rows, fields)=>{
      if (err) {
        console.log("Failed to query", err);
        res.status(500);
        res.end();
        return
      }
      console.log(rows.insertId);
      res.json({ID: rows.insertId, ...req.body})
    })
  }else{
    res.status(400)
    res.send(validationResult.error.details[0].message);
    return
  }
})

app.get('/eatenMeals/:user/:year/:month/:day',(req, res)=>{
  const query = `SELECT sum(s.KCAL*e.QUANTITY/100) as CALORIES, sum(s.PROTEINS*e.QUANTITY/100) as PROTEINS, sum(s.FATS*e.QUANTITY/100) as FATS, sum(s.CARBOHYDRATES*e.QUANTITY/100) as CARBOHYDRATES FROM EatenMeals e join SimpleProducts s on e.SIMPLEPRODUCT_ID = s.ID WHERE e.USER_ID = ${req.params.user} AND date(e.DATE) = "${req.params.year}-${req.params.month}-${req.params.day}"`
  connection.query(query , (err, rows, fields)=>{
    if (err) {
      console.log("Failed to query");
      res.status(500)
      res.end();
      return
    }
    if(rows[0][Object.keys(rows[0])[0]]){
      res.json(rows[0]);
    }else{
      res.status(404);
      res.end();
    }
    
  })
})

app.get('/eatenMealsDetailed/:user/:year/:month/:day',(req, res)=>{
  const query = `SELECT e.SIMPLEPRODUCT_ID, s.NAME, sum(e.QUANTITY) as QUANTITY, sum(s.KCAL*e.QUANTITY/100) as CALORIES, sum(s.PROTEINS*e.QUANTITY/100) as PROTEINS, sum(s.FATS*e.QUANTITY/100) as FATS, sum(s.CARBOHYDRATES*e.QUANTITY/100) as CARBOHYDRATES FROM EatenMeals e join SimpleProducts s on e.SIMPLEPRODUCT_ID = s.ID WHERE e.USER_ID = ${req.params.user} AND date(e.DATE) = "${req.params.year}-${req.params.month}-${req.params.day}" GROUP BY e.SIMPLEPRODUCT_ID`
  connection.query(query , (err, rows, fields)=>{
    if (err) {
      console.log("Failed to query");
      res.status(500);
      res.end();
      return
    }
    if(rows[0]){
      console.log(rows.map(obj=>{
          return {SIMPLEPRODUCT: {
            ID: obj.SIMPLEPRODUCT_ID,
            NAME: obj.NAME,
            KCAL: obj.CALORIES,
            PROTEINS: obj.PROTEINS,
            FATS: obj.FATS,
            CARBOHYDRATES1: obj.CARBOHYDRATES
            },
            QUANTITY: obj.QUANTITY  
          }
        })
      );
      res.json(rows.map(obj=>{
        return {SIMPLEPRODUCT: {
          ID: obj.SIMPLEPRODUCT_ID,
          NAME: obj.NAME,
          KCAL: obj.CALORIES,
          PROTEINS: obj.PROTEINS,
          FATS: obj.FATS,
          CARBOHYDRATES: obj.CARBOHYDRATES
          },
          QUANTITY: obj.QUANTITY  
        }
      }));
    }else{
      res.status(404);
      res.end();
    }
    
  })
})

app.post('/eatenMeals',(req,res)=>{
  const eatenProductSchema = Joi.object().keys({
    simpleProductId: Joi.number().required(),
    quantity: Joi.number().required()
  })

  const schema = Joi.object().keys({
    userId: Joi.number().required(),
    eatenProducts: Joi.array().items(eatenProductSchema)
  })
  


  const validationResult = Joi.validate(req.body, schema);
  if(!validationResult.error){
    const values = req.body.eatenProducts.map(eatenProduct=>{
      let v = Object.values(eatenProduct);
      v.push(req.body.userId);
      return v;
    });

    connection.query(`INSERT INTO EatenMeals (SIMPLEPRODUCT_ID, QUANTITY, USER_ID) VALUES ?`,[values] , (err, rows, fields)=>{
      if (err) {
        console.log("Failed to query", err);
        res.status(400);
        res.send("Failed to query");
        return
      }else{
        res.send('Records added to database');
      }
      
    })
    

  }else{
    res.status(400);
    res.send(validationResult.error.details[0].message);
    return
  }
})

app.listen(3000, ()=>{console.log('Listening...')})
