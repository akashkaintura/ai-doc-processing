use wasm_bindgen::prelude::*;
use std::alloc::{alloc, dealloc, Layout};
use tesseract::TessApi;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn error(msg: String);
}

#[wasm_bindgen]
pub fn malloc(size: usize) -> *mut u8 {
    let layout = Layout::from_size_align(size, 1).unwrap();
    unsafe { alloc(layout) }
}

#[wasm_bindgen]
pub fn free(ptr: *mut u8, size: usize) {
    let layout = Layout::from_size_align(size, 1).unwrap();
    unsafe { dealloc(ptr, layout) }
}

#[wasm_bindgen]
pub fn process_image(ptr: *mut u8, len: usize) -> String {
    let buffer = unsafe { std::slice::from_raw_parts(ptr, len) };
    
    let mut api = match TessApi::new(Some("eng"), None) {
        Ok(api) => api,
        Err(e) => {
            error(format!("Tesseract init error: {}", e));
            return String::new();
        }
    };

    if let Err(e) = api.set_image_from_mem(buffer) {
        error(format!("Image processing error: {}", e));
        return String::new();
    }

    match api.get_utf8_text() {
        Ok(text) => text,
        Err(e) => {
            error(format!("OCR error: {}", e));
            String::new()
        }
    }
}