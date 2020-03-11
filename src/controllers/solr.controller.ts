import PromiseRouter from "express-promise-router";
import axios from "axios";
import * as bodyParser from "body-parser";
import idx from "idx";
require("dotenv").config();

const router = PromiseRouter();
const jsonParser = bodyParser.json();

router.get("/", jsonParser, async function(req, res) {
	const countries = req.body.countries || [];
	let result: Object[] = [];

	await Promise.all(
		countries.map(async (countryId: number) => {
			const solrResponse = await getMinPrice(countryId);
			result.push({
				countryId: countryId,
				minPrice: idx(solrResponse, _ => _.response.docs[0].c_price_from_web) || null
			});
		})
	);

	res.json(result);
});

// TODO: try to replace axios with isomorphic-fetch?
async function getMinPrice(countryId: number) {
	let solrParams = {
		query: `nl_country_id:(${countryId})`,
		limit: 1,
		offset: 0,
		sort: "c_price_from_web ASC"
	};

	const response = await axios({
		url: process.env.SOLR_URL,
		method: "get",
		data: solrParams
	});

	//console.log("response", response.data);
	return response.data;
}

export default router;
