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

   var diagonal = d3.svg.diagonal()
       .target(function (d) {
           return {x: d.target.x,y:d.target.y-10};})
       .source(function (d) {
           return {x: d.source.x, y: d.source.y+10};});
     //   .projection(function(d) { return [d.x, d.y]; });

    render_seq_tree.render = function() {
        var svg_elem = d3.select("#seq_tree");
   var svg = svg_elem.append("g")
 .attr("transform", "translate(0 " + 25 + ")");
    tree.size([svg_elem.attr("width"),svg_elem.attr("height")-50]);
   var nodes = tree.nodes(seq_tree).reverse();
   var links = tree.links(nodes);
        console.log(links);

      var node = svg.selectAll("g.node")
   .data(nodes);

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) { 
    return "translate(" + d.x + "," + d.y + ")"; });

  nodeEnter.append("circle")
   .attr("r", 10)
   .style("fill", "#fff");

  nodeEnter.append("text")
   .attr("x",0)
   .attr("y", 0)
   .attr("text-anchor","middle")
   .attr("dominant-baseline","central")
   .attr("id", function (d) { return d.sequence; })
   .text(function(d) { return d.sequence; })
   .style("fill-opacity", 1);

  // Declare the linksâ€¦
  var link = svg.selectAll("path.link")
   .data(links);

  // Enter the links.
  link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);


}
})();

render_seq_tree.render();
