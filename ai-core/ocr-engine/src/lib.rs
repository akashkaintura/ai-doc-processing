use wasm_bindgen::prelude::*;
use tesseract::TessApi;

#[wasm_bindgen]
pub struct OcrEngine {
    api: TessApi,
}

#[wasm_bindgen]
impl OcrEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<OcrEngine, JsValue> {
        let mut api = TessApi::new(Some("eng"), None)
            .map_err(|e| JsValue::from_str(&format!("Init error: {}", e)))?;
        Ok(Self { api })
    }

    #[wasm_bindgen]
    pub fn process_image(&mut self, buffer: &[u8]) -> Result<String, JsValue> {
        self.api.set_image_from_mem(buffer)
            .map_err(|e| JsValue::from_str(&format!("Image error: {}", e)))?;
        
        self.api.get_utf8_text()
            .map_err(|e| JsValue::from_str(&format!("OCR error: {}", e)))
    }
}