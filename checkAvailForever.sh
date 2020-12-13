while true; do
  sleep 1 &
    node scraper.js
  wait # for sleep
done

