#!/bin/bash

docker stop js-challenger || true
docker rm js-challenger || true

if [[ "$#" == "0" || "$#" > "0" && "$1" != "stop" ]]; then
	docker run --name js-challenger -p 5432:5432 -itd --env 'PG_PASSWORD=password' postgres:10-alpine;
fi
