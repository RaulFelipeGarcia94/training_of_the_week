#!/bin/bash
npm install
npm install -g nodemon
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch