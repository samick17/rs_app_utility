MAKEFLAGS += --silent

launch-cli:
	cd app && cargo run

launch-web:
	cd webapp && serve -s .

build-wasm:
	cd libs/image_utils && wasm-pack build --target web --release
	rm -rf webapp/libs
	cp -r libs/image_utils/pkg webapp/libs
