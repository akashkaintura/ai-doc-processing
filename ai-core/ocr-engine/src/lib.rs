use wasm_bindgen::prelude::*;
use tesseract::TessApi;

#[wasm_bindgen]
pub fn process_image(buffer: &[u8]) -> Result<String, JsValue> {
    let mut api = TessApi::new(Some("eng"), None)
        .map_err(|e| JsValue::from_str(&format!("Init error: {}", e)))?;
    
    api.set_image_from_mem(buffer)
        .map_err(|e| JsValue::from_str(&format!("Image error: {}", e)))?;
    
    api.get_utf8_text()
        .map_err(|e| JsValue::from_str(&format!("OCR error: {}", e)))
}