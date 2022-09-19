// express.js init
const express = require('express')
const app = express()
const port = 3000

// db init
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dominykas',
    password: 'password',
    database: 'test'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
    if (err) throw err

    console.log('The solution is: ', rows[0].solution)
})

connection.end()


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/wtf.test', (req, res) => {
    res.send('Hello WTFFFFF!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})