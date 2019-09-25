const cutDownImg = (file, encoder=0.5) => {
  return new Promise((resolve, reject) => {
    if(!file) return;
    let img = new Image();
    img.src = URL.createObjectURL(file);
    if (img.complete) {
      callback();
    } else {
      img.onload = callback;
    }
    function callback() {
      let data = compress(img, encoder);	//base64
      let res = toBlob(data, file.type);
      resolve(res);
      img = null;
    }
    reject();
  })
}
// 将base64的图片转成二进制对象
const toBlob = (basestr, type) => {
	let text = window.atob(basestr.split(",")[1]);
	let buffer = new Uint8Array(text.length);
	for (let i = 0; i < text.length; i++) {
		buffer[i] = text.charCodeAt(i);
	}
	let blob = new Blob(buffer, {type});
	return blob;
}
// 压缩函数
const compress = (img, encoder=0.5) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    //    瓦片canvas
    let tCanvas = document.createElement("canvas");
    let tctx = tCanvas.getContext("2d");
    let width = img.width;
    let height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio;
    if ((ratio = width * height / 4000000) > 1) {
      ratio = Math.sqrt(ratio);
      width /= ratio;
      height /= ratio;
    } else {
      ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
//        铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    let count;
    if ((count = width * height / 1000000) > 1) {
      count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
//            计算每块瓦片的宽和高
      let nw = ~~(width / count);
      let nh = ~~(height / count);
      tCanvas.width = nw;
      tCanvas.height = nh;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }
    //进行最小压缩
    let ndata = canvas.toDataURL('image/jpeg',encoder);
    canvas = null;
    tCanvas = null;
    return ndata;
}
export default cutDownImg