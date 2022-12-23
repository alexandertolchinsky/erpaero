setup:
	npm ci && npx typeorm migration:run -d data_source.js
start:
	npm start
lint:
	npx eslint .
