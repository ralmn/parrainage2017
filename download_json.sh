#! /bin/sh
wget https://presidentielle2017.conseil-constitutionnel.fr/?dwl=1569 -O data.json
if [ -d dist ]; then
    cp data.json dist/
fi