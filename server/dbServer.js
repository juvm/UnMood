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

