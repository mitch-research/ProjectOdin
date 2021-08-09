
const n4 = require('neo4j-driver')
const serverport = '10.0.0.42:7687'

const driver = n4.driver(`bolt://${serverport}`, n4.auth.basic('neo4j', 'devlocal'))
const session = driver.session(database='testdb');

jest.setTimeout(5000)

beforeAll(done => {
    done()
})
  

test('Test that the connection is available', async () => {
    await driver.verifyConnectivity()
    .then((cnxMsg) => {
        expect(cnxMsg.address).toEqual(`${serverport}`)
    })
    
});



afterAll(done => {
    session.close();
    driver.close();
    done()
})