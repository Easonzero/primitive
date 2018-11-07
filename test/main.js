function init(url) {
    let cfg = $P.DefaultConfig();
    cfg.shapeTypes = [$P.ShapeMap.rectangle]//[$P.ShapeMap.triangle, $P.ShapeMap.bezier, $P.ShapeMap.ellipse]
    $P.Pure(url, cfg).then((origin) => {
        let optimizer = new $P.Optimizer(origin, cfg);
        let result = $P.Canvas.empty(cfg);

        document.querySelector("#main").appendChild(result.node);

        optimizer.onStep = step => step && result.drawStep(step);
        optimizer.start();
    })
}

init('../image/test.jpg');