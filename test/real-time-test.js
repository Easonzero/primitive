let dst;
let json = {steps:[]};
function init(url) {
    let cfg = $P.DefaultConfig();
    cfg.shapeTypes = [$P.ShapeMap.Line, $P.ShapeMap.Heart, $P.ShapeMap.Bezier]
    $P.Pure(url, cfg).then((ori) => {
        let optimizer = new $P.Optimizer(ori, cfg);
        dst = $P.Canvas.empty(cfg);

        document.querySelector("#main").appendChild(dst.node);

        optimizer.onStep = step => {
            if(step) {
                json.steps.push(step.serialize());
                dst.drawStep(step);
            }
        }
        optimizer.start();
    })
}

function save(){
    var blob = new Blob([JSON.stringify(json)], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "steps.json");
}


// let canvas = document.querySelector("#my-canvas").getContext('2d');

init('input.jpg');

// function render(){
//     requestAnimationFrame(render);
//     if(dst)
//         canvas.drawImage(dst.node, 0, 0);
// }

// render();