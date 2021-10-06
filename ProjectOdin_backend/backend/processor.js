// Imports
const express = require('express')
const bodyParser = require('body-parser')
const n4 = require('neo4j-driver')
var cors = require('cors')



// Initializations
const app = express()
app.use(cors())

const serverport = '10.0.0.42:7687'


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 

const port = 3000
// Custom functions


// Routes 
app.get('/', (req, res) => {
    res.send({response:'Hello world!'})
})

app.post('/getObjs', async (req, res) => {

    const driver = n4.driver(`bolt://${serverport}`, n4.auth.basic('neo4j', 'devlocal'))
    const session = driver.session(database='testdb');

    const type = req.body.type;
    const value = req.body.value;
    const description = req.body.desc;

    const query = `MATCH (n:${type}) WHERE n.value='${value}' OR n.description CONTAINS '${description}' RETURN n`;

    const result = await session.run(query)
    session.close()
    driver.close()

    res.send(result.records)


})

app.post('/createObj', async (req, res) => {

    const driver = n4.driver(`bolt://${serverport}`, n4.auth.basic('neo4j', 'devlocal'))
    const session = driver.session(database='testdb');
    
    const type = req.body.type;
    const value = req.body.value;
    const description = req.body.desc;
    

    
    const query = `CREATE (n:${type} {value:'${value}', description:'${description}'}) RETURN n`
    
    const result = await session.run(query)
    session.close()
    driver.close()
    
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    ret = {
        'type': node.labels[0],
        'value':node.properties.value,
        'desc':node.properties.description,
        'result':'Success'
    }

    res.send(ret)
})
app.post('/delObj', async (req, res) => {
    const driver = n4.driver(`bolt://${serverport}`, n4.auth.basic('neo4j', 'devlocal'))
    const session = driver.session(database='testdb');
    
    const type = req.body.type;
    const value = req.body.value;
    

    const query = `MATCH (n:${type} {value:'${value}'}) DETACH DELETE n`
    
    const result = await session.run(query)
    driver.close();
    session.close();

    ret = {
        'type': type,
        'value':value,
        'result':'Success'
    }

    res.send(ret)
})
app.get('/updateObj', (req, res) => {
    res.send({response:'Hit updateObj endpoint'})
})



// Run the Express app
module.exports = app