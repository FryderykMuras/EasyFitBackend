exports.eatenMealsAPI = function(app, connection, Joi){
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

      app.get('/eatenMeals/:userId',(req,res)=>{
        const query = `SELECT date(e.DATE) AS DATE, sum(s.KCAL*e.QUANTITY/100) as CALORIES, sum(s.PROTEINS*e.QUANTITY/100) as PROTEINS, sum(s.FATS*e.QUANTITY/100) as FATS, sum(s.CARBOHYDRATES*e.QUANTITY/100) as CARBOHYDRATES FROM EatenMeals e join SimpleProducts s on e.SIMPLEPRODUCT_ID = s.ID WHERE e.USER_ID = ${req.params.userId} AND NOT date(e.DATE) = date(CURRENT_TIMESTAMP) GROUP BY date(e.DATE) ORDER BY date(e.DATE) DESC LIMIT 365`;
        connection.query(query , (err, rows, fields)=>{
          if (err) {
            console.log("Failed to query",err);
            res.status(500)
            res.end();
            return
          }
          if(rows[0]){
            const values = rows.map(obj=>{return {
              DAY: new Date(obj.DATE).getUTCDate(),
              MONTH: new Date(obj.DATE).getUTCMonth()+1,
              YEAR: new Date(obj.DATE).getUTCFullYear(),
              KCAL: obj.CALORIES,
              PROTEINS: obj.PROTEINS,
              FATS: obj.FATS,
              CARBOHYDRATES: obj.CARBOHYDRATES
            };})
            
            const date = new Date(rows[0].DATE);
            console.log(rows);
            res.json(values);
            res.end();
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
      
      app.post('/eatenComplexMeal',(req,res)=>{
        const eatenComplexMeal = req.body;
        
        connection.query(`SELECT s.ID as 'S_ID', i.QUANTITY FROM ComplexMeals c JOIN ComplexMealsIngredients i ON c.ID = i.COMPLEXMEAL_ID JOIN SimpleProducts s ON i.SIMPLEPRODUCT_ID = S.ID WHERE c.ID = ${eatenComplexMeal.MEAL_ID}` , (err, rows, fields)=>{
          if (err) {
            console.log("Failed to query");
            res.status(500);
            res.end();
            return
          }
          if(rows[0]){
            console.log(rows);
            const sum = rows.reduce((acc,obj)=>{return acc+obj.QUANTITY},0);
            console.log(sum);

            const values = rows.map(obj=>[obj.S_ID,obj.QUANTITY/sum*eatenComplexMeal.QUANTITY,eatenComplexMeal.USER_ID,]);

            console.log(values);

            connection.query(`INSERT INTO EatenMeals (SIMPLEPRODUCT_ID, QUANTITY, USER_ID) VALUES ?`,[values] , (err, rows, fields)=>{
              if (err) {
                console.log("Failed to query", err);
                res.status(500);
                res.end();
                return
              }else{
                res.status(204);
                res.end();
              }
              
            })


            
          }else{
            res.status(404);
            res.end();
          }
        })

        // connection.query(`INSERT INTO EatenMeals (SIMPLEPRODUCT_ID, QUANTITY, USER_ID) VALUES ?`,[values] , (err, rows, fields)=>{
        //   if (err) {
        //     console.log("Failed to query", err);
        //     res.status(400);
        //     res.send("Failed to query");
        //     return
        //   }else{
        //     res.send('Records added to database');
        //   }
          
        // })
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
};
