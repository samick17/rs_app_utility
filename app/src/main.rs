// use image_utils;
use cli;

fn main() {
    // image_utils::process();
    loop {
        let prompt = cli::prompt(">");
        println!("{:?}", prompt);
    }
}
