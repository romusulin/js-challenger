#!/usr/bin/env bash

function stopPostgres() {
	echo "Closing postgres..."
	npm run stop-docker-postgres
}

trap stopPostgres EXIT

npm run compile
npm run docker-postgres
./node_modules/wait-on/bin/wait-on tcp:5432 && npm run migrate-db

npm run mocha || exit 1
