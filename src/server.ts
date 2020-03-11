import * as express from "express";
import solrController from "./controllers/solr.controller";
import mysqlController from "./controllers/mysql.controller";
import mongoController from "./controllers/mongo.controller";
import * as bodyParser from "body-parser";

const app = express();

const jsonParser = bodyParser.json();

app.get("/", (req, res) =>
	res.send({
		message: "Node.js WS"
	})
);

app.get("/test", (req, res) =>
	res.send({
		status: "ok",
		message: "Invia Node.js REST API"
	})
);

app.get("/test/:id", (req, res) =>
	res.send({
		name: "Thajsko"
	})
);

app.post("/test", jsonParser, (req, res) => {
	const name = req.body.name || "unknown";

	res.send({
		message: `Hello ${name}!`
	});
});

app.use("/solr", solrController);
app.use("/mysql", mysqlController);
app.use("/mongo", mongoController);

app.listen(3000, () => console.log("Example app listening on port 3000!"));
