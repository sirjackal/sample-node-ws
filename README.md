# Invia Node.js WS

Invia Node.js REST API.

## Installation

```
npm install
```

## Deployment

To run the app in **development** mode:

```
npm start
```

WS runs on http://localhost:3000. You get try it with calling

```
curl --request GET \
  --url http://localhost:3000/solr \
  --header 'content-type: application/json' \
  --data '{
	"countries": [
		5,
		28,
		22,
		71,
		56,
		11,
		12,
		6,
		10,
		14
	]
}'
```

To build the server for **production** to the `dist` folder:

```
npm run build
```

and then start it with

```
node ./dist/bundle.js
```

## TODO:

* tests
* API Blueprint
* TSLint
* restify
* GraphQL
* route handlers as classes
* models
