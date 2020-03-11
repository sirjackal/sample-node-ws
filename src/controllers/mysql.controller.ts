import PromiseRouter from "express-promise-router";
import * as mysql from "mysql";
import * as bodyParser from "body-parser";
import idx from "idx";
require("dotenv").config();

const MYSQL_CONFIG: mysql.ConnectionConfig = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE
};

const router = PromiseRouter();
const jsonParser = bodyParser.json();

let callCounter = 0;

router.get("/", jsonParser, async function(req, res) {
	const countries = req.body.countries || [];
	let result: Object[] = [];

	await Promise.all(
		countries.map(async (countryId: number) => {
			const countryName = await getCountryName(countryId);
			result.push({
				id: countryId,
				name: countryName
			});
		})
	);

	console.log(`WS called ${++callCounter} times`);
	res.json(result);
});

let pool: mysql.Pool = null;

const getConnection = async (): Promise<mysql.PoolConnection> => {
	if (pool == null) {
		pool = mysql.createPool(MYSQL_CONFIG);
		console.info("DB pool created");
	}

	return new Promise<mysql.PoolConnection>((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if (err) {
				reject(err);
			} else {
				resolve(conn);
			}
		});
	});
};

async function getCountryName(countryId: number): Promise<string> {
	const conn = await getConnection();

	const query = `
		SELECT
			s_caption
		FROM d_country
		WHERE d_country.nl_country_id = ?
	`;

	return new Promise<string>((resolve, reject) => {
		conn.query(query, [countryId], (err, rows, fields) => {
			conn.release();
			if (err) {
				reject(err);
			} else {
				//console.log(rows[0].s_caption);
				resolve(idx(rows, _ => rows[0].s_caption) || null);
			}
		});
	});
}

export default router;
