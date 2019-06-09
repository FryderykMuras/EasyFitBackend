
exports.notificationsAPI = function(app, connection, Joi){
    app.get('/notifications/:id',(req,res)=>{
        connection.query(`SELECT TIME FROM Notifications WHERE USER_ID = ${req.params.id}` , (err, rows, fields)=>{
            if (err) {
              console.log("Failed to query");
              res.status(500)
              res.end();
              return
            }
            if(rows[0]){
                const notifications = rows.map((obj)=>obj.TIME);
                res.json(notifications);
                return
            }else{
                res.status(404);
                res.end();
            }
            
          })
    })
    app.post('/notifications/:id',(req,res)=>{
        console.log(req.body.TIME);
        connection.query(`INSERT INTO Notifications (TIME,USER_ID) SELECT '${req.body.TIME}', ${req.params.id} WHERE NOT EXISTS (SELECT 1 FROM Notifications WHERE USER_ID = ${req.params.id} AND TIME = '${req.body.TIME}')` , (err, rows, fields)=>{
            if (err) {
              console.log("Failed to query",err);
              res.status(500)
              res.end();
              return
            }
            console.log(rows);
            if(rows.affectedRows===0){
                res.status(409);
                res.end();
                
                return
            }else{
                res.status(204);
                res.end();
            }
            
          })
    })

    app.delete('/notifications/:id',(req,res)=>{
        console.log(req.body.TIME);
        connection.query(`DELETE FROM Notifications WHERE TIME='${req.body.TIME}' AND USER_ID = ${req.params.id}` , (err, rows, fields)=>{
            if (err) {
              console.log("Failed to query",err);
              res.status(500)
              res.end();
              return
            }
            console.log(rows);
            if(rows.affectedRows===0){
                res.status(404);
                res.end();
                
                return
            }else{
                res.status(204);
                res.end();
            }
            
          })
    })
};

