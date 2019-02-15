let dst;
let json = {steps:[]};
function init(url) {
    let cfg = $P.DefaultConfig();
    cfg.computeSize = 512;
    cfg.viewSize = 256;
    cfg.shapeTypes = [$P.ShapeMap.Line, $P.ShapeMap.Heart, $P.ShapeMap.Bezier]
    
    $P.Pure(url, cfg).then((ori) => {
        let optimizer = new $P.Optimizer(ori, cfg);
        dst = $P.Canvas.empty(cfg, true);
        document.querySelector("#main").appendChild(dst.node);
        document.querySelector("#main").appendChild(ori.node);
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

init('input.jpg');