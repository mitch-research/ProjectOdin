const axios = require('axios').default
const st = require('supertest')
const app = require('../../backend/processor')
const testEndpoint = 'http://localhost:3000'


const n4 = require('neo4j-driver')

const driver = n4.driver('bolt://10.0.0.42:7687', n4.auth.basic('neo4j', 'devlocal'))
const session = driver.session(database='testdb');


jest.mock('axios')

test('Test file properly initialized', () => {
    expect(1+1).toBe(2)
});

test('GET /', async () => {
    await st(app).get('/')
    .expect(200)
    .then((res) => {
        expect(res.body.response).toEqual('Hello world!')
    })
})

test('GET /getObj', async () => {
    await st(app).get('/getObj')
    .expect(200)
    .then((res) => {
        expect(res.body.response).toBe('Hit getObj endpoint')
    })
})


test('GET /createObj', async () => {
    req = {
        'value':'Foo',
        'type':'Bar',
        'desc':'FooBar'
    }
    await st(app).post('/createObj').send(req)
    .expect(200)
    .then((res) => {
        expect(res.body.result).toBe('Success')
        expect(res.body.value).toBe(req.value)
        expect(res.body.type).toBe(req.type)
        expect(res.body.desc).toBe(req.desc)
    })

    await st(app).post('/delObj').send(req)
    .expect(200)
    .then((res2) => {
        expect(res2.body.value).toBe(req.value)
        expect(res2.body.type).toBe(req.type)
    }
    )
})

test('GET /delObj', async () => {
    obj = {
        'type':'Foo',
        'value':'Bar',
        'desc':'This is a test object'
    }
    
    await st(app).post('/createObj').send(obj)
    .expect(200).then(async (res) => {
        await st(app).post('/delObj').send(obj)
        .expect(200)
        .then((res2) => {
            expect(res2.body.value).toBe(obj.value)
            expect(res2.body.type).toBe(obj.type)
        })
        
    })
    
})

test('GET /updateObj', async () => {
    await st(app).get('/updateObj')
    .expect(200)
    .then((res) => {
        expect(res.body.response).toBe('Hit updateObj endpoint')
    })
})