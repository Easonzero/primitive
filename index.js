import Canvas from "./src/canvas";
import {getFill, getScale} from "./src/util";
import Optimizer from "./src/optimizer";

function originalCanvas(url, cfg) {
    return new Promise(resolve => {
        let img = new Image();
        img.crossOrigin = true;
        img.src = url;
        img.onload = e => {
            let w = img.naturalWidth;
            let h = img.naturalHeight;

            let computeScale = getScale(w, h, cfg.computeSize);
            cfg.width = w / computeScale;
            cfg.height = h / computeScale;

            let viewScale = getScale(w, h, cfg.viewSize);

            cfg.scale = computeScale / viewScale;

            let canvas = new Canvas(cfg.width, cfg.height).fill(cfg.fill);
            canvas.ctx.drawImage(img, 0, 0, cfg.width, cfg.height);

            if (cfg.fill === "auto") {
                cfg.fill = getFill(canvas);
            }

            resolve(canvas);
        };
        img.onerror = e => {
            console.error(e);
            alert("The image URL cannot be loaded. Does the server support CORS?");
        }
    });
}

const config = () => ({
    alpha: 0.5,
    computeSize: 256,
    fill: "rgb(255, 255, 255)",
    height: 256,
    mutateAlpha: true,
    mutations: 30,
    scale: 1,
    shapeTypes: [],// shape map
    shapes: 200,
    steps: 50,
    viewSize: 512,
    width: 256
});

function init(url){
    let cfg = config();
    originalCanvas(url, cfg).then((origin)=>{
        let optimizer = new Optimizer(origin, cfg);
        let result = Canvas.empty(cfg);
        optimizer.onStep = result.drawStep;
        optimizer.start();
    })
}