import init, { resize_image } from "./libs/image_utils.js";

async function openFile(exts) {
  return new Promise((resolve) => {
    const element = document.createElement('input');
    element.setAttribute('type', 'file');
    element.setAttribute('accept', exts.join(','));
    element.addEventListener('change', (e) => {
      const files = e.target.files;
      const file = files[0];
      resolve(file);
    });
    element.click();
  });
}
function saveFile(name, arg, revokeURL) {
  const a = document.createElement('a');
  a.style.display = 'none';
  const isBlob = arg instanceof Blob;
  const url = isBlob ? URL.createObjectURL(arg) : arg;
  a.href = url;
  a.download = name;
  a.click();
  if(isBlob && revokeURL) URL.revokeObjectURL(url);
};
function fileExtToMimeType(ext) {
  switch(ext) {
    case '.jpg':
    return 'image/jpg';
    case '.png':
    return 'image/png';
    default:
    break;
  }
}
(() => {
  async function main() {
    await init();
    async function start() {
      const file = await openFile(['.png', '.jpg']);
      const fileExt = file.name.substring(file.name.lastIndexOf('.'));
      const buffer = await (file).arrayBuffer();
      const ubuffer = new Uint8Array(buffer);
      Object.assign(window, {
        read_file: () => {
          return ubuffer;
        },
        write_file: (data) => {
          const option = {
            type: fileExtToMimeType(fileExt),
          };
          const file = new File([data.buffer], 'resized' + fileExt, option);
          saveFile(file.name, file, true);
        }
      });
      resize_image(fileExt, 300, 300);
    };
    document.querySelector('#btn_resize_img').addEventListener('click', () => {
      start();
    });
  }
  window.addEventListener('load', () => {
    main();
  });
})();
