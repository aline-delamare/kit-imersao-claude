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

# Pacotes do dia 2 (R11.3): pastas inteiras de extras/, fora do kit completo.
# A pasta oculta .claude vai junto; arquivos de sistema e o .gitkeep ficam de fora.
OUT_ABS="$(cd "$OUT" && pwd)"
rm -f "$OUT_ABS/meu-financeiro.zip" "$OUT_ABS/link-da-bio.zip"
( cd extras && zip -q -r "$OUT_ABS/meu-financeiro.zip" meu-financeiro -x "*.DS_Store" "*.cc-writes*" "*.gitkeep" )
( cd extras && zip -q -r "$OUT_ABS/link-da-bio.zip" link-da-bio -x "*.DS_Store" )
echo "pacotes do dia 2: meu-financeiro.zip + link-da-bio.zip em $OUT"
