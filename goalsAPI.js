
exports.goalsAPI = function(app, connection, Joi){
    app.get('/goals/:id',(req,res)=>{
        connection.query(`SELECT * FROM Goals WHERE USER_ID = ${req.params.id}` , (err, rows, fields)=>{
            if (err) {
              console.log("Failed to query");
              res.status(500)
              res.end();
              return
            }
            if(rows[0]){
                const goals = {KCAL: rows[0].KCAL, CARBOHYDRATES: rows[0].CARBOHYDRATES, PROTEINS: rows[0].PROTEINS, FATS: rows[0].FATS};
                res.json(goals);
                return
            }else{
                res.status(404);
                res.end();
            }
            
          })
    })

    app.put('/goals/:id',(req,res)=>{
    
        connection.query(`UPDATE Goals SET KCAL = ${req.body.KCAL}, CARBOHYDRATES = ${req.body.CARBOHYDRATES}, PROTEINS = ${req.body.PROTEINS}, FATS = ${req.body.FATS} WHERE USER_ID = ${req.params.id}` , (err, rows, fields)=>{
            if (err) {
              console.log("Failed to query",err);
              res.status(500)
              res.end();
              return
            }
            if(rows.affectedRows !== 0){
                res.status(204);
                res.end();
                return
            }else{
                res.status(404);
                res.end();
            }
            
          })
    })
};

