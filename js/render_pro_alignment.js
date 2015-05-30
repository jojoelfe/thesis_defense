render_pro_alignment = {};

(function () {

render_pro_alignment.render = function () {
    var m = new msa({
    el: d3.select("#pro_alignment")[0][0],
    importURL: "./data/pro_align.fasta"
});
m.render();
var fun = m.g.colorscheme.addDynScheme("fscheme", function(letter,info){
    if (info.pos == 53) return "#DC1505";
    if (letter == 'H') return "#0E4D8F";
    return "#eee";
});

//var scheme = schemeMgr.getScheme("fscheme");
m.g.colorscheme.addStaticScheme("own",{H: "blue"});
m.g.colorscheme.set("scheme", "fscheme");
m.g.vis.set("labelId",false);
m.g.vis.set("leftHeader",false);
m.g.vis.set("markers",false);
m.g.zoomer.set("alignmentWidth",880);
m.g.zoomer.set("alignmentHeight",100);
m.g.zoomer.set("labelIdLength",0);
m.g.zoomer.set("residueFont",10);
m.g.zoomer.set("columnWidth",10);
m.g.zoomer.set("rowHeight",12);
};

})();

render_pro_alignment.render();


