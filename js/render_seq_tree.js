render_seq_tree = {};

(function () {
var seq_tree = {
    sequence : "YHFWHRG",
    children : [{
        sequence : "YHFWDRG",
        children : [{
            sequence: "YFWDRG" },{
            sequence: "YHWWDRG" },{
            sequence: "YHFWDRP"}]},
        { sequence: "YHFWHKG",
        children: [{
            sequence: "FHFWHKG"},{
            sequence: "YHFWHLKG"},{
            sequence: "YHFWHAG"}]}]};
   var tree = d3.layout.tree() ;
function cloneSelection(appendTo, toCopy, times) {
  toCopy.each(function() {
    for (var i = 0; i < times; i++) {
        var clone = svg.node().appendChild(this.cloneNode(true));
        d3.select(clone).attr("class", "clone");
        var id = d3.select(clone).attr("id") + "c";
        d3.select(clone).attr("id",id);
    }
  });
  return appendTo.selectAll('.clone');
}
   var diagonal = d3.svg.diagonal()
       .target(function (d) {
           return {x: d.target.x,y:d.target.y-10};})
       .source(function (d) {
           return {x: d.source.x, y: d.source.y+10};});
     //   .projection(function(d) { return [d.x, d.y]; });
var svg;
    render_seq_tree.render = function() {
        var svg_elem = d3.select("#seq_tree");
   svg = svg_elem.append("g")
 .attr("transform", "translate(0 " + 25 + ")");
    tree.size([svg_elem.attr("width"),150]);
   var nodes = tree.nodes(seq_tree).reverse();
   var links = tree.links(nodes);
        console.log(links);

      var node = svg.selectAll("g.node")
   .data(nodes);

  // Enter the nodes.
  var nodeEnter = node.enter().append("text")
   .attr("x",function (d) { return d.x;})
   .attr("y", function (d) { return d.y;})
   .attr("text-anchor","middle")
   .attr("dominant-baseline","central")
   .attr("id", function (d) { return d.sequence; })
   .text(function(d) { return d.sequence; })
   .style("fill-opacity", 1);
render_seq_tree.nodeEnter = nodeEnter;
  // Declare the linksâ€¦
  var link = svg.selectAll("path.link")
   .data(links);

  // Enter the links.
  link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);


};
render_seq_tree.pairwise_align = function(seq1,seq2,x,y) {
    var seq_sel = svg.selectAll(seq1+", "+seq2);
    var move_seq_sel = cloneSelection(svg, seq_sel, 1);
    move_seq_sel
        .transition()
        .duration(1000)
        .attr("text-anchor","left")
        .attr("class", "oldclone")
        .attr("x", x)
        .attr("y", function (d,i) { return y + i * 15;});

};
render_seq_tree.pairwise_align_del = function(seq1,seq2) {
    var seq_sel = svg.selectAll(seq1+"c, "+seq2+"c");
    seq_sel.remove();
};

render_seq_tree.multiple_align = function(x,y) {
var seq_sel = render_seq_tree.nodeEnter.filter( function (d) { return (d.depth == 2);});

    var move_seq_sel = cloneSelection(svg, seq_sel, 1);
    move_seq_sel
        .transition()
        .duration(1000)
        .attr("text-anchor","left")
        .attr("class", "oldclonem")
        .attr("x", x)
        .attr("y", function (d,i) { return y + i * 15;});

};
render_seq_tree.multiple_align_del = function() {
    svg.selectAll(".oldclonem").remove();
};
})();
render_seq_tree.render();
