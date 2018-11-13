let dst;

function init(url) {
    let cfg = $P.DefaultConfig();
    cfg.shapeTypes = [$P.ShapeMap.Line, $P.ShapeMap.Rectangle, $P.ShapeMap.Bezier]
    $P.Pure(url, cfg).then((ori) => {
        let optimizer = new $P.Optimizer(ori, cfg);
        dst = $P.Canvas.empty(cfg);

        document.querySelector("#main").appendChild(dst.node);

        optimizer.onStep = step => step && dst.drawStep(step);
        optimizer.start();
    })
}

// let canvas = document.querySelector("#my-canvas").getContext('2d');

init('input.jpg');

// function render(){
//     requestAnimationFrame(render);
//     if(dst)
//         canvas.drawImage(dst.node, 0, 0);
// }

// render();