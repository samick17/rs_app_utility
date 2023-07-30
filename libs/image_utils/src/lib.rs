use wasm_bindgen::prelude::*;
use std::io::Cursor;
use image::io::Reader as ImageReader;
use image::imageops::FilterType;
use image::{ImageFormat};

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
    pub fn read_file() -> Vec<u8>;
    pub fn write_file(buffer: Vec<u8>);
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn resize_image(file_ext: &str, new_width: u32, new_height: u32) {
    log(file_ext);
    let bytes = read_file();
    let img2 = ImageReader::new(Cursor::new(bytes)).with_guessed_format().unwrap().decode().unwrap();
    log(&format!("{}, {}", img2.width(), img2.height()));
    let mut buff = Cursor::new(Vec::new());
    let image_format = match file_ext {
        ".jpg" => ImageFormat::Jpeg,
        ".png" => ImageFormat::Png,
        _ => ImageFormat::Jpeg,
    };
    img2.resize(new_width, new_height, FilterType::CatmullRom).write_to(&mut buff, image_format).expect("Error encoding image to JPEG");
    write_file(buff.into_inner());
}

pub fn process() {
    println!("process called!!");
}
