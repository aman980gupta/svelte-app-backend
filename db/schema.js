const client = require("./mongodbClient");
const env = require("dotenv").config()

const createUserCollection = async () => {
    try {
        await client.connect();
        const db = client.db(process.env.MONGO_DB);
        const userSchema = {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["first_name", "last_name", "email", "password"],
                    properties: {
                        first_name: {
                            bsonType: "string",
                            description: "First name must be a string",
                        },
                        last_name: {
                            bsonType: "string",
                            description: "Last name must be a string",
                        },
                        email: {
                            bsonType: "string",
                            description: "Email must be a string",
                        },
                        password: {
                            bsonType: "string",
                            description: "Password must be a string",
                        },
                    }
                }
            }
        }
        await db.createCollection(process.env.MONGO_COLLECTION_2, userSchema);
        console.log('User collection created with schema validation.');
        //console.log(data);
    } catch (err) { console.log(err) }
    finally {
        await client.close();
    }
}
module.exports = createUserCollection;
