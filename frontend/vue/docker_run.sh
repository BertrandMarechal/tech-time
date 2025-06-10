#!/bin/ash
set -eu

cd /opt/app/
npm install

npm run dev

wait
