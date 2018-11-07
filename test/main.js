function init(url) {
    let cfg = $P.DefaultConfig();
    cfg.shapeTypes = [$P.ShapeMap.line]
    $P.Pure(url, cfg).then((ori) => {
        let optimizer = new $P.Optimizer(ori, cfg);
        let dst = $P.Canvas.empty(cfg);

        document.querySelector("#main").appendChild(dst.node);

        optimizer.onStep = step => step && dst.drawStep(step);
        optimizer.start();
    })
}

init('../image/test.jpg');