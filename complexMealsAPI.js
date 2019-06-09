exports.complexMealsAPI = function(app, connection, Joi){

    app.get('/complexMeals',(req,res)=>{

        connection.query('SELECT c.ID, c.NAME, SUM(s.KCAL*i.QUANTITY/100) as KCAL, SUM(s.PROTEINS*i.QUANTITY/100) as PROTEINS, SUM(s.FATS*i.QUANTITY/100) as FATS, SUM(s.CARBOHYDRATES*i.QUANTITY/100) as CARBOHYDRATES FROM ComplexMeals c JOIN ComplexMealsIngredients i ON c.ID = i.COMPLEXMEAL_ID JOIN SimpleProducts s ON i.SIMPLEPRODUCT_ID = S.ID GROUP BY c.ID ORDER BY c.NAME' , (err, rows, fields)=>{
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
        
        connection.query(`INSERT INTO ComplexMeals (NAME) VALUES ("${req.body.NAME}")`, (err, rows, fields)=>{
          if (err) {
            console.log("Failed to query", err);
            res.status(500);
            res.end();
            return
          }
          console.log(rows.insertId);
          const id = rows.insertId;
          const vals = req.body.INGREDIENTS.map(obj=>[rows.insertId, obj.SIMPLEPRODUCT_ID, obj.QUANTITY]);
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

};
