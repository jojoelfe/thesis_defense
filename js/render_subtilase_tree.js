var tree_render = {};

(function() {

    var r = 300 / 2;

    var cluster = d3.layout.cluster()
        .size([360, 1])
        .sort(null)
        .value(function(d) {
            return d.length;
        })
        .children(function(d) {
            return d.branchset;
        })
        .separation(function(a, b) {
            return 1;
        });

    function project(d) {
        var r = d.y,
            a = (d.x - 90) / 180 * Math.PI;
        return [r * Math.cos(a), r * Math.sin(a)];
    }

    function cross(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }

    function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }

    function step(d) {
        var s = project(d.source),
            m = project({
                x: d.target.x,
                y: d.source.y
            }),
            t = project(d.target),
            r = d.source.y,
            sweep = d.target.x > d.source.x ? 1 : 0;
        return (
            "M" + s[0] + "," + s[1] +
            "A" + r + "," + r + " 0 0," + sweep + " " + m[0] + "," + m[1] +
            "L" + t[0] + "," + t[1]);
    }

    var wrap = d3.select("#vis").append("svg")
        .attr("width", 650)
        .attr("height", 650)
        .style("-webkit-backface-visibility", "hidden");

    // Catch mouse events in Safari.
    wrap.append("rect")
        .attr("width", 650)
        .attr("height", 650)
        .attr("fill", "none")

    var vis = wrap.append("g")
        .attr("transform", "translate(" + 325 + "," + 325 + ")");

    var start = null,
        rotate = 0;


    function phylo(n, offset) {
        if (n.length != null) offset += n.length * 55;
        n.y = offset;
        if (n.children)
            n.children.forEach(function(n) {
                phylo(n, offset);
            });
    }

    function count_children(n, max, before) {
        if (n.children) {
            var sum_children = 0;
            n.children.forEach(function(n) {
                var l = count_children(n, max, before + n.length);
                sum_children += l;
            });
            n.y = sum_children
            return sum_children;
        } else {
            n.y = 0;
            return 1;
        }
    }
    var uid = 0;

    function calculate_r(n, num_tip) {
        n.y = (1 - n.y / num_tip) * 170;
        n.uid = uid;
        uid += 1;
        if (n.children) n.children.forEach(function(n) {
            calculate_r(n, num_tip);
        });
    }

    function assign_family(n, family_list, family_angles, family) {
        if (n.uid in family_list) 
            family = family_list[n.uid];
        n.family = family;
        if (n.children) n.children.forEach(function(n) {
            assign_family(n, family_list, family_angles, family);
        }); else {
            if (family != "") {
                if (family in family_angles) {
                    if (n.x < family_angles[family].min) family_angles[family].min = n.x;
                    if (n.x > family_angles[family].max) family_angles[family].max = n.x;
                } else {
                    family_angles[family] = {}
                    family_angles[family].min = n.x
                    family_angles[family].max = n.x
                }
            }
        }

    }
    
    tree_render.render_subtilase_tree = function() {
        d3.text("data/PF00082_converted.nhx", function(text) {
            //d3.text("data/life.txt", function(text) {
            var x = Newick.parse(text);
            var nodes = cluster.nodes(x);
            phylo(nodes[0], 0);
            var dists = nodes.map(function(d) {
                return d.y
            });
            var maxdist = d3.max(dists);
            count_children(nodes[0], maxdist, 0);
            calculate_r(nodes[0], nodes[0].y);
            var family_list = {
                261 : "Kexin/PC",
                9299 : "Subtilisin",
                3170 : "Cucumulisin/Pyrolisin",
                6245 : "Sedolisin",
                7352 : "Proteinase K"
            };
            var family_angles = {};
            assign_family(nodes[0],family_list,family_angles,"");
            console.log(d3.entries(family_angles));
            tree_render.nodes = nodes;
            var link = vis.selectAll("path.link")
                .data(cluster.links(nodes))
                .enter().append("path")
                .attr("class", "link")
                .attr("d", step);

            var node = vis.selectAll("g.node")
                .data(nodes.filter(function(n) {
                    return n.x !== undefined;
                }))
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                })

            //node.append("circle")
            //      .attr("r", 2.5);
            protein_list = {
                "P09958": "Furin",
                "P04189": "Subtilisin",
                "P08594": "Aqualysin",
                "Q8RR56": "Kumamolisin",
                "P29120": "PC1",
                "Q8NBP7": "PC9",
                "P16519": "PC2",
                "Q6UW60": "PC4",
                "Q92824": "PC5",
                "P29122": "PC6",
                "Q16549": "PC7",
                "P13134": "Kexin",
                "P09232": "Cerevisin",
                "O14773": "TPP-1",
                "Q14703": "SKI-1",
                "P06873": "Proteinase K",
                "Q9LLL8": "XSP1",
                "O65351": "ARA12",
                "Q39547": "Cucumisin",
                "Q60106": "Xanthomonalisin",
                "P13134": "Kexin",
                "P04189": "Subtilisin",
                "P06873": "Proteinase K",
                "Q63JI2": "Sedolisin",
            }
            /*
            var label = vis.selectAll("text")
                .data(nodes.filter(function(d) {
                    return d.x !== undefined && !d.children;
                }))
                .enter().append("text")
                .attr("dy", ".31em")
                .attr("text-anchor", function(d) {
                    return d.x < 180 ? "start" : "end";
                })
                .attr("transform", function(d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + (170) + ")rotate(" + (d.x < 180 ? 0 : 180) + ")";
                })
                .text(function(d) {
                    return protein_list[d.name.replace(/_/g, ' ')];
                });
            var label_temp = vis.selectAll("text.label")
                .data(nodes.filter(function(d) {
                    return d.x !== undefined && d.children;
                }))
                .enter().append("text")
                .attr("dy", ".31em")
                .style("font-size", ".5em")
                .attr("text-anchor", function(d) {
                    return d.x < 180 ? "start" : "end";
                })
                .attr("transform", function(d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + (d.y) + ")rotate(" + (d.x < 180 ? 0 : 180) + ")";
                })
                .text(function(d) {
                    if (d.y < 150) return d.uid;
                    else return "";
                });*/

                // Render arches
                function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                  var angleInRadians = angleInDegrees * Math.PI / 180.0;
                  var x = centerX + radius * Math.cos(angleInRadians);
                  var y = centerY + radius * Math.sin(angleInRadians);
                  return [x,y];
                }
                vis.selectAll("path.arc").data(d3.entries(family_angles))
                    .enter().append("path")
                    .attr("class","arc")
                    .attr("d", function (d) {
                        var start = polarToCartesian(0,0,250,d.value.min);
                        var stop = polarToCartesian(0,0,250,d.value.max);
                        return "M " + start[0] + " " + start[1]+ " A 250 250 0 0 1 " +stop[0] + " " +stop[1];
                    });
                vis.insert("defs").selectAll("path").data(d3.entries(family_angles))
                    .enter().append("path")
                    .attr("d", function (d) {
                        var start = polarToCartesian(0,0,250,d.value.min);
                        var stop = polarToCartesian(0,0,250,d.value.max);
                        return "M " + start[0] + " " + start[1]+ " A 250 250 0 0 1 " +stop[0] + " " +stop[1];
                    })
                    .attr("id",function (d) {return d.key;});

                vis.selectAll("text").data(d3.entries(family_angles))
                    .enter().append("text")
                    .attr("x",0)
                    .attr("z",0)
                    .attr("text-anchor","middle")
                    .insert("textPath")
                    .attr("xlink:href", function (d) {return "#"+d.key;})
                    .attr("startOffset", "50%")
                    .text(function (d) { return d.key;});

                tree_render.vis = vis;
                tree_render.link = link;
        });
    };
    tree_render.highlight_family = function (family) {
        tree_render.link.attr("class", function (d) { if (d.target.family == family ) return "highlight link"; else return "link";});
    };
})();

tree_render.render_subtilase_tree();
