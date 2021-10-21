const axios = require('axios').default
const st = require('supertest')
const app = require('../../backend/processor')
const testEndpoint = 'http://localhost:3003'


const n4 = require('neo4j-driver')

const driver = n4.driver('bolt://127.0.0.1:7687', n4.auth.basic('neo4j', 'devloc'))
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

test('GET /getObjs', async () => {
    test = {
        'value':'127.0.0.1',
        'type':'ipv4',
        'desc':'This is a test variable'
    }
    await st(app).post('/createObj').send(test)
    .expect(200).then((res) => {
        expect(res.body.result).toBe('Success')
        expect(res.body.value).toBe(test.value)
        expect(res.body.type).toBe(test.type)
        expect(res.body.desc).toBe(test.desc)

        
    });

    await st(app).post('/getObjs')
        .send({'type':'ipv4', 'value':'127.0.0.1', 'desc':'This is a test variable'})
        .expect(200)
        .then((result) => {
            expect(result.body[0]['_fields'][0]['labels'][0]).toBe(test['type'])
            expect(result.body[0]['_fields'][0]['properties']['description']).toBe(test['desc'])
    })

    await st(app).post('/delObj').send(test)
    .expect(200)
    .then((res2) => {
        expect(res2.body.value).toBe(test.value)
        expect(res2.body.type).toBe(test.type)
    }
    )
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
    req1 = {
        'type':'ipv4',
        'value':'127.0.0.1',
        'desc':'Test description 1'
    }

    req2 = {
        'type':'ipv4',
        'value':'127.0.0.1',
        'desc':'Test description 2, this should be different!'
    }

    await st(app).post('/createObj').send(req1)
    .expect(200)
    .then((res) => {
        expect(res.body.result).toBe('Success')
        expect(res.body.value).toBe(req1.value)
        expect(res.body.type).toBe(req1.type)
        expect(res.body.desc).toBe(req1.desc)
    })


    await st(app).post('/updateObj')
    .send(req2)
    .expect(200)
    .then((res) => {
        expect(res.body.type).toBe(req1.type)
        expect(res.body.value).toBe(req1.value)
        expect(res.body.desc).toBe(req2.desc)
    })


    await st(app).post('/delObj').send(req2)
    .expect(200)
    .then((res2) => {
        expect(res2.body.value).toBe(req2.value)
        expect(res2.body.type).toBe(req2.type)
    }
    )




    
})