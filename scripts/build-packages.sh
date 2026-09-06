#!/usr/bin/env bash
set -euo pipefail
OUT="${OUT_DIR:-site/public/downloads}"
mkdir -p "$OUT"
rm -f "$OUT"/*.skill "$OUT"/kit-completo.zip
for pasta in skills/*/; do
  nome=$(basename "$pasta")
  python3 scripts/package_skill.py "$pasta" "$OUT/" >/dev/null
done
( cd "$OUT" && zip -q kit-completo.zip *.skill )
echo "pacotes: $(ls "$OUT"/*.skill | wc -l) skills + kit-completo.zip em $OUT"
