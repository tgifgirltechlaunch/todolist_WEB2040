const moment = require('moment');
const path = require('path');

//crud API
//create read update and delete

//the callback function will run everytime a request to get is made
//export the function app.get with 2 parameters
module.exports = function(app, database){
    //the order in which youput your middleware matters
    //we always get two parameters theroute name and a request and a response
    //here we are serving a file;
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views','index.html'));
  });

  app.get('/get-todos', function (req, res) {
    database.query(
        `SELECT * FROM todos`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results:::::: ', results);
            res.send(results);
        });
  });

  app.get('/sort-todos-desc', function (req, res) {
    database.query(
        `SELECT * FROM todos ORDER BY created DESC`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });

  app.get('/sort-todos-asc', function (req, res) {
    database.query(
        `SELECT * FROM todos ORDER BY created`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });
  app.get('/created-date-todo', function (req, res) {
    let id = req.body.id;
    database.query(
        `SELECT created FROM todos WHERE id = ${id}`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });
  app.get('/get-checkdate', function (req, res) {
    let id = req.body.id;
    let checkdate = req.body.checkdate;
    database.query(
        `SELECT checkboxdate FROM todos WHERE id = ${id}`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });

  
  app.get('/get-count', function (req, res) {
    database.query(
        `SELECT COUNT(*) AS count FROM todos`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);

            res.send(results);
        });
  });

  app.get('/view/:id', function (req, res) {
    let id = req.params.id;

    database.query(
        `SELECT * FROM todos WHERE id = ${id}`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });

  app.post('/edit-todo', function (req, res) {
    
    let id = req.body.id;
    let text = req.body.text;
    // console.log('edit to do ' + id + " " + text);
    database.query(
        `UPDATE todos SET text = '${text}' WHERE id = ${id}`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });

  app.delete('/delete-todo', function (req, res) {
    let id = req.body.id;

    database.query(
        `DELETE FROM todos WHERE id = ${id}`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });
  
  
  app.delete('/wipe-todo', function (req, res) {
    database.query(
        `TRUNCATE todos`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });
  

  app.put('/create-todo', function (req, res) {
    let text = req.body.text;
    let created = new Date().toISOString().slice(0, 19).replace('T', ' ');

    database.query(
        `INSERT INTO todos (text, created) VALUES('${text}', '${created}');`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });

  app.post('/update-todo', function (req, res) {
    let id = req.body.id;
    let done = req.body.completed;

    database.query(
        `UPDATE todos SET completed = ${done} WHERE id = ${id};`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });
  

  app.post('/priority', function (req, res) {
    let id = req.body.id;
    let pri = req.body.priority;

    console.log("------>>>>>>>" + pri)
    database.query(
        `UPDATE todos SET priority = '${pri}' WHERE id = ${id};`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });
  

  app.put('/checkdate-todo', function (req, res) {
    let id = req.body.id;
    let checkdate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    database.query(
        `UPDATE todos SET checkboxdate = '${checkdate}' WHERE id = ${id};`,
        function (error, results, fields){
            if(error) throw error;
            console.log('results: ', results);
            res.send(results);
        });
  });
}
