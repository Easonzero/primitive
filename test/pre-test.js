let dst;
function init(url) {
    let cfg = $P.DefaultConfig();
    $P.Pure(url, cfg).then(() => {
        dst = $P.Canvas.empty(cfg);
        document.querySelector("#main").appendChild(dst.node);

    }).then(() => {
        fetch('steps.json')
        .then(response => {
            return response.json()
        }).then(json => {
            let i = 0;
            for(let step of json.steps){
                setTimeout(() => dst.drawStep($P.Step.deserialize(step)),150*i)
                i++;
            }
        });
    });
}

init('input.jpg');