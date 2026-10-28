#!/bin/sh
# Renders scripts/og-default.html to public/og/default.png with headless Chrome.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --window-size=1200,630 --screenshot="$PWD/public/og/default.png" "file://$PWD/scripts/og-default.html"
