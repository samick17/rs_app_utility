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
function tableHeader(name) {
  const th = document.createElement('th');
  th.innerText = name;
  return th;
}
function createTableView(id) {
  const table = document.createElement('table');
  table.id = id;
  const tr = document.createElement('tr');
  table.append(tr);
  const th1 = tableHeader('Origin');
  const th2 = tableHeader('Resized');
  const th3 = tableHeader('Information');
  const th4 = tableHeader('Operations');
  tr.append(th1);
  tr.append(th2);
  tr.append(th3);
  tr.append(th4);
  document.body.append(table);
}
function appendRow(elements) {
  const table = document.querySelector('table#images');
  const tr = document.createElement('tr');
  elements.forEach(element => {
    const td = document.createElement('td');
    td.append(element);
    tr.append(td);
  });
  table.append(tr);
}
async function loadImage(url) {
  return new Promise(resolve => {
    const image = document.createElement('img');
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}
async function displayImage(originFile, resizedFile) {
  const url1 = URL.createObjectURL(originFile);
  const image1 = await loadImage(url1);

  const url2 = URL.createObjectURL(resizedFile);
  const image2 = await loadImage(url2);

  const information = document.createElement('div');
  [
  `Origin File Size: ${originFile.size}`,
  `Origin Image Size: ${image1.width} x ${image1.height}`,
  `Resized File Size: ${resizedFile.size}`,
  `Resized Image Size: ${image2.width} x ${image2.height}`,
  ].forEach(text => {
    const element = document.createElement('div');;
    element.innerText = text;
    information.append(element);
  });

  const btnDownload = document.createElement('button');
  btnDownload.innerText = 'Download';
  btnDownload.addEventListener('click', () => {
    saveFile(file.name, file, true);
  });
  appendRow([image1, image2, information, btnDownload]);
}
(() => {
  async function main() {
    await init();
    createTableView('images');
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
          const resizedFile = new File([data.buffer], 'resized' + fileExt, option);
          displayImage(file, resizedFile);
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
