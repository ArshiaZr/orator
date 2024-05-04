import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";

config({ path: './config.env' });

const uri = process.env.ATLAS_URI || "";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to the database");
} catch (err) {
    console.error(err);
}

let db = client.db("customers");

export default db;
