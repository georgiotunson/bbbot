#!/bin/sh
set -e

while true; do
  sleep 10 &
    node scraper.js
  wait # for sleep
done

