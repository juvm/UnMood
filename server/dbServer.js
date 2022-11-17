const express = require('express')
const app = express()
const mysql = require('mysql')
const dotenv = require('dotenv')
const path = require('path')

/*The below line gave me a lot of trouble because the location
  was unable to resolve correctly.
  I used a solution on StackOverflow the made use of 
  the path module for correct resolution of address.
  site: https://stackoverflow.com/questions/42335016/dotenv-file-is-not-loading-environment-variables
  Problem: undefined .env variables despite installing
  the dotenv package and using correct methods
  Solution: using path module and relative address
*/
//.env file to hide DB credentials
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
})

db.getConnection((err, connection) => {
    if(err) throw(err)
    console.log('DB connected successfully: ' + connection.threadId)
})

/*Problem 2: resolved the dotenv errors yet the db was 
  not connecting. the error was that the db password 
  in the dotenv file was not noting the # at the end which
  was giving an error as the pw became wrong.
  Solution: add "" to the pw in .env file
*/

/*Problem: mysql workbench is freezing when stopping/starting
  server.
  Solution: start>services>mysql80 : Start and Stop the 
  server as required
*/




//Register a new user and save in mySQL DB
//We use bcrypt to store hashed passwords in our database
//Adding a route to "createUser"
const bcrypt = require('bcrypt')

//Calling the express.json() method for parsing
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

//Create user
app.post('/client/signup.html', async(req, res) => {
  console.log(req.body)
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmpw = req.body.confirmpassword;

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log(hashedPassword)
  
  db.getConnection( async(err, connection) => {
    if(err) throw(err)
    const sqlSearch = "SELECT * FROM user_table WHERE username = ?"
    const search_query = mysql.format(sqlSearch, [username])
    const sqlInsert = "INSERT INTO user_table VALUES (0,?,?,?)"
    const insert_query = mysql.format(sqlInsert,[email, username, hashedPassword])

    await connection.query (search_query, async(err, result) => {
      if(err) throw(err)
      console.log("------> Search Results")
      console.log(result.length)
      if(result.length != 0) {
        connection.release()
        console.log("------> User already exists")
        res.sendStatus(409)
      }
      else {
        await connection.query(insert_query, (err, result) => {
          connection.release()
          if(err) throw(err)
          console.log("--------> Created new user")
          console.log(result.insertId)
          res.sendStatus(201)
        })
      }
    })
  })
})


//app.listen() should be at the end after configuring the server for better and clean logic
//however it can also be before
//https://stackoverflow.com/questions/59835089/why-app-listen-should-be-at-the-end-after-all-the-requests-also-why-is-it-neces
//Getting the NodeJS/ExpressJS server running
const port = process.env.port

app.listen(port,
  () => console.log(`Server started on port ${port}...`))




