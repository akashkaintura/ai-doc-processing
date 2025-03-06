#!/bin/bash

# Build OCR Engine
cd ocr-engine
wasm-pack build --release --target web --out-dir ../../client/public/wasm

# Optimize WASM
wasm-opt -Oz -o ocr_engine_opt.wasm pkg/ocr_engine_bg.wasm
mv ocr_engine_opt.wasm pkg/ocr_engine_bg.wasm

# Compress
gzip -9 -k -f pkg/*.wasm