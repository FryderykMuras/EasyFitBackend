
exports.simpleProductsAPI = function(app, connection, Joi){
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
              res.status(500);
              res.end();
              return
            }
            console.log(rows.insertId);
            res.json({ID: rows.insertId, ...req.body})
          })
        }else{
          console.log(validationResult.error);
          res.status(400)
          res.send(validationResult.error.details[0].message);
          return
        }
      })


};

