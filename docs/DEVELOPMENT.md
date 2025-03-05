## WASM Build Process
1. Install Rust toolchain
2. Add wasm-bindgen:
   ```bash
   cargo install wasm-bindgen-cli

## BUILD OCR Engine
cd packages/ai-core/ocr-engine
wasm-pack build --target web

## Copy output to client public dir:
cp pkg/*.wasm ../../apps/client/public/wasm/



### Development Workflow
```bash
# Start all services
npm run dev

# Build WASM separately
npm run ai:build

# Run specific tests
npm test -- client:test

# Generate production build
npm run build