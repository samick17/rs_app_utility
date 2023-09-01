use std::io;
use std::io::Write;

pub fn prompt(msg: &str) -> String {
    print!("{}", msg);
    io::stdout().flush().unwrap();
    let mut user_input = String::new();

    let stdin = io::stdin();
    stdin.read_line(&mut user_input).unwrap();
    return String::from(user_input.trim());
}
