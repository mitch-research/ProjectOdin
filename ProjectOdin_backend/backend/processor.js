// Imports
const express = require('express')
const bodyParser = require('body-parser')
const n4 = require('neo4j-driver')
var cors = require('cors')



// Initializations
const app = express()
app.use(cors())

const serverport = '127.0.0.1:7687'


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

app.post('/getAllObjs', async (req, res)=>{
    const driver = n4.driver(`bolt://${serverport}`, n4.auth.basic('neo4j', 'devlocal'))
    const session = driver.session(database='testdb');

    const readQuery = "MATCH (n) RETURN (n)"
    const result = await session.run(readQuery);

    res.send(result.records)
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
app.post('/updateObj', async (req, res) => {
    // res.send({response:'Hit updateObj endpoint'})
    const driver = n4.driver(`bolt://${serverport}`, n4.auth.basic('neo4j', 'devlocal'))
    const session = driver.session(database='testdb');
    var type = req.body.type;
    var value = req.body.value;
    var desc = req.body.desc;
    if(desc.length > 1){
        console.log(`[-] Updating the description to value ${req.body.desc}`)
        query = `MATCH (n:${type} {value:'${value}'}) SET n.description = '${req.body.desc}' RETURN n;`
    }
    const result = await session.run(query);
    driver.close();
    session.close();

    const singleRecord = result.records[0]
    const node = singleRecord.get(0)
    ret = {
        'type': node.labels[0],
        'value':node.properties.value,
        'desc':node.properties.description,
        'result':'Success'
    }
    res.send(ret);
})

app.post('/addRel', async (req,res) =>{
    // TODO: Add the add relationship endpoint functionality
    const driver = n4.driver(`bolt://${serverport}`, n4.auth.basic('neo4j', 'devlocal'))
    const session = driver.session(database='testdb');
    console.log('hit addRel endpoint');

    // Extract root entity
    const root = req.body.root;
    const node_type = req.body.node_type;
    console.log(root)
    // Check to see if the root node exists
    const checkQuery = `MATCH (n:${node_type} {value:'${root}'}) RETURN n;`;
    const result = await session.run(checkQuery);

    if (result.records.length === 0){
        // If not, create it
    
        const addQuery = `CREATE (n:${node_type} {value:'${root}'}) RETURN n;`;
        const result = await session.run(addQuery);

        if(result.records.length > 0){
            console.log('Successfully created node!')
        }else{
            console.log('Error adding node')
        }
    }else{
        console.log('Found node in the database already')
    }
     // Extract entities to be related
    const rel = req.body.related;
    

    // Loop through related entities
    for(const entity of rel){
        var rel_node_type = entity.node_type;
        // test to see if the entity exists
        const checkQuery = `MATCH (n:${rel_node_type} {value:'${entity.value}'}) RETURN n;`;
        const result = await session.run(checkQuery);
        if(result.records.length === 0){
            // if not, create it and add the relationship in the same query
            const addQuery = `CREATE (n:${rel_node_type} {value:'${entity.value}'}) RETURN n`;
            const result_add = await session.run(addQuery);
        }else{
            console.log(`Related ${entity.value} already in db`)
        }
        // build query to relate each related entity to the root
        const query = `MATCH (a:${node_type}), (b:${rel_node_type}) WHERE a.value = '${root}' AND b.value='${entity.value}' CREATE (a) -[r:${entity.rel_type}]-> (b) RETURN a,b`;
        // run the query
        const result_rel = await session.run(query);
        if(result_rel.records.length > 0){
            console.log('Success!')
            console.log(result_rel.records)
        }else{
            console.log('Fail!')
            console.log(result_rel)
        }
    }   
    driver.close();
    session.close();
    res.send('Successfully hit addRel endpoint!')
})



// Run the Express app
module.exports = app