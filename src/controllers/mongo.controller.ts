import PromiseRouter from "express-promise-router";
import * as bodyParser from "body-parser";
import idx from "idx";
import { MongoClient, Server } from "mongodb";
require("dotenv").config();

const router = PromiseRouter();
const jsonParser = bodyParser.json();

router.get("/", jsonParser, async function(req, res) {
	const countries = req.body.countries || [];
	let result: Object[] = [];

	await Promise.all(
		countries.map(async (countryId: number) => {
			const localities = await getLocalities(countryId);
			result.push({
				id: countryId,
				localities: localities
			});
		})
	);

	res.json(result);
});

let mongoDb: MongoClient = null;

async function getMongoDb() {
	if (mongoDb == null) {
		mongoDb = await MongoClient.connect(process.env.MONGO_URL);
	}

	return mongoDb;
}

async function getLocalities(countryId: number) {
	return new Promise<string[]>(async (resolve, reject) => {
		const db = await getMongoDb();
		const dbo = db.db("web-enum");
		const query = { nl_country_id: countryId };
		dbo
			.collection("Locality.cs_CZ")
			.find(query)
			.toArray(function(err, result) {
				if (err) {
					return reject(err);
				}

				let localities = [];

				for (const loc of result) {
					localities.push(loc.value);
				}

				resolve(localities);
			});
	});
}

export default router;
