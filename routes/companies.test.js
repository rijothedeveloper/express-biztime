const request = require("supertest");
const db = require("../db");

const app = require("../app");

const dbObj = new db("postgresql:///biztime");

let company;


beforeEach(async () => {
    const results = await dbObj.db.query(
        `INSERT INTO companies (code, name, description) 
         values ('aapltest', 'appletest', 'apple company') 
        returning code, name, description`
        )
        company = results.rows[0]
});

afterEach( async () => {
    const results = await dbObj.db.query(
        'delete from companies'
    )
})

afterAll(async ()=> {
    await dbObj.db.end();
})

describe("GET /companies", function() {
    test("GET /companies", async function() {
        const response = await request(app).get(`/companies`);
        expect(response.statusCode).toEqual(200)
    });
});