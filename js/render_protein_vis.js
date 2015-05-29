render_protein_vis = {};

(function () {

function calculate_initial_position(n,i,a) {
    var length = a.length;
    var stepx = 24;
    var stepy = 22;
    n.x = 10 + stepx * (i +1);
    n.y = 10 +  stepy * (i +1);
}

function collide(node) {
      var r = node.radius + 10,
          nx1 = node.x - r,
            nx2 = node.x + r,
                    ny1 = node.y - r,
                      ny2 = node.y + r;
        return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                          var x = node.x - quad.point.x,
                                        y = node.y - quad.point.y,
                                    l = Math.sqrt(x * x + y * y),
                                                      r = node.radius + quad.point.radius;
                                if (l < r) {
                                            l = (l - r) / l * 0.5;
                                                    node.x -= x *= l;
                                                            node.y -= y *= l;
                                                                    quad.point.x += x;
                                                                            quad.point.y += y;
                                                                                  }
                                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                      };
}
render_protein_vis.render = function () {

var nodes = [
{ aa: "Asn", type : "polar",radius : 14 },
{ aa: "Leu", type : "nonpolar",radius : 14 },
{ aa: "Tyr", type : "polar",radius : 17 },
{ aa: "Ile", type : "nonpolar",radius : 14},
{ aa: "Gln", type : "polar",radius : 15 },
{ aa: "Trp", type : "nonpolar",radius : 18 },
{ aa: "Leu", type : "nonpolar",radius : 14 },
{ aa: "Lys", type : "pos",radius:15 },
{ aa: "Asp", type : "neg",radius : 14 },
{ aa: "Gly", type : "polar", radius : 10 },
{ aa: "Gly", type : "polar", radius : 10 },
{ aa: "Pro", type : "nonpolar", radius : 12 },
{ aa: "Ser", type : "polar", radius : 12 },
{ aa: "Ser", type : "polar", radius : 12 },
{ aa: "Gly", type : "polar",radius : 10 },
{ aa: "Arg", type : "pos",radius : 16 },
{ aa: "Pro", type : "nonpolar", radius: 12 },
{ aa: "Pro", type : "nonpolar", radius: 12 },
{ aa: "Pro", type : "nonpolar", radius: 12 },
{ aa: "Ser", type : "polar",radius:12 },
    ];
var links = [
{source: 0, target: 1},
{source: 1, target: 2},
{source: 2, target: 3},
{source: 3, target: 4},
{source: 4, target: 5},
{source: 5, target: 6},
{source: 6, target: 7},
{source: 7, target: 8},
{source: 8, target: 9},
{source: 9, target: 10},
{source: 10, target: 11},
{source: 11, target: 12},
{source: 12, target: 13},
{source: 13, target: 14},
{source: 14, target: 15},
{source: 15, target: 16},
{source: 16, target: 17},
{source: 17, target: 18},
{source: 18, target: 19},
];

var svg = d3.select("#protein-vis");
var width = svg.attr("width");
var height = svg.attr("height");
var force = d3.layout.force()
    .size([width, height])
    .nodes(nodes)
    .links(links);

force.linkDistance(0);
force.linkStrength(0);
force.charge(0);
force.gravity(0);
force.friction(0);
force.alpha(0);
nodes.forEach(calculate_initial_position, svg);
svg.html("");
var link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link');
var node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', function (d) {return d.type + ' node';});
node.append('circle')
    .attr("r", function (d) {return d.radius;})
    .attr("cx",0)
    .attr("cy",0);
node.append('text')
    .attr("x", 0)
    .attr("y",0)
    .attr("text-anchor","middle")
    .attr("dominant-baseline","central")
    .text(function (d) { return d.aa; });

force.on('end', function() {

    node.attr('transform', function(d) {
        return "translate("+d.x+" "+d.y+")";});
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
});
render_protein_vis.stepForce = function () {
var q = d3.geom.quadtree(nodes),
          i = 0,
      n = nodes.length;

    while (++i < n) {
        if (nodes[i].type == "nonpolar") {
            var midx = width/2;
            var midy = height/2;
            var dx = nodes[i].x-midx;
            var dy = nodes[i].y-midy;
            nodes[i].x -= (dx *force.alpha() * 0.06)*(nodes[i].radius-8);
            nodes[i].y -= (dy *force.alpha() * 0.06)*(nodes[i].radius-8);
        }
    }
   i = 0;
    n = nodes.length;
  while (++i < n) q.visit(collide(nodes[i]));
    node.attr('transform', function(d) {
        return "translate("+d.x+" "+d.y+")";});
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
};

force.start();
render_protein_vis.force = force;
};

render_protein_vis.apply_force_field = function () {
var force = render_protein_vis.force;
force.on('tick',render_protein_vis.stepForce);
force.gravity(0.00);
force.linkDistance(32.5);
force.linkStrength(1.0);
force.charge(5);
force.alpha(0.03);
force.friction(0.8);
force.start();
};
})();

render_protein_vis.render();
