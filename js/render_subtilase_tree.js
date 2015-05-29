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
            a = (d.x) / 180 * Math.PI;
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
        .attr("fill", "none");

    var vis = wrap.append("g")
        .attr("transform", "translate(" + 325 + "," + 325 + ")");

    var start = null,
        rotate = 0;


    function phylo(n, offset) {
        if (n.length !== null) offset += n.length * 55;
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
            n.y = sum_children;
            return sum_children;
        } else {
            n.y = 0;
            return 1;
        }
    }
    var uid = 0;

    function calculate_r(n, num_tip) {
        n.y = (1 - n.y / num_tip) * 130;
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
        });
        else {
            if (family !== "") {
                if (family in family_angles) {
                    if (n.x < family_angles[family].min) family_angles[family].min = n.x;
                    if (n.x > family_angles[family].max) family_angles[family].max = n.x;
                } else {
                    family_angles[family] = {};
                    family_angles[family].min = n.x;
                    family_angles[family].max = n.x;
                }
            }
        }

    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees) * Math.PI / 180.0;
        var x = centerX + radius * Math.cos(angleInRadians);
        var y = centerY + radius * Math.sin(angleInRadians);
        return [x, y];
    }

    function create_arc(d) {
        var radius = 250;
        if ("offset" in d.value) radius += d.value.offset;
        var start = polarToCartesian(0, 0, radius, d.value.min);
        var stop = polarToCartesian(0, 0, radius, d.value.max);
        var dir = 1;
        var l_arc = 0;
        if ("dir" in d.value) l_arc = d.value.dir;
        if (d.value.invert) {
            var temp = start;
            start = stop;
            stop = temp;
            dir = 0;
        }
        return "M " + start[0] + " " + start[1] + " A " + radius + " " + radius + " 0 " + l_arc + " " + dir + " " + stop[0] + " " + stop[1];

    }
    tree_render.render_subtilase_tree = function() {
        queue()
            .defer(d3.text, "data/PF00082_converted.nhx")
            .defer(d3.json, "data/his_pro.json")
            .defer(d3.json, "data/his_mat.json")
            .defer(d3.json, "data/protein_species.json")
            .defer(d3.text, "data/protein_tree_complete.nw")
            .await(plot_tree);
        //d3.text("data/life.txt", function(text) {
        function plot_tree(error, text, hispro, hismat, taxo,spectext) {
            var x = Newick.parse(text);

            tree_render.hispro = hispro;
            tree_render.hismat = hismat;
            tree_render.taxo = taxo;
            tree_render.spectext = spectext;

            var nodes = cluster.nodes(x);
            phylo(nodes[0], 0);
            var dists = nodes.map(function(d) {
                return d.y;
            });
            var maxdist = d3.max(dists);
            count_children(nodes[0], maxdist, 0);
            calculate_r(nodes[0], nodes[0].y);
            var family_list = {
                261: "Kexin/PC",
                9299: "Subtilisin",
                3170: "Cucumulisin/Pyrolisin",
                6245: "Sedolisin",
                7352: "Proteinase K"
            };
            var family_angles = {};
            assign_family(nodes[0], family_list, family_angles, "");
            tree_render.nodes = nodes;
            nodes.forEach(function(d) {
                if (!d.children) {
                    d.dhis = hispro[d.name] - hismat[d.name];
                    if (isNaN(d.dhis)) d.dhis = 0;
                }
            });
            nodes.forEach(function(d) {
                if (!d.children) {
                    d.tax = taxo[d.name];
                }
            });

            var link = vis.selectAll("path.link")
                .data(cluster.links(nodes))
                .enter().append("path")
                .attr("class", "link")
                .attr("d", step);

            var node = vis.selectAll("g.node")
                .data(nodes.filter(function(n) {
                    return n.x !== undefined;
                }), function(d) {
                    return d.name;
                })
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "rotate(" + (d.x) + ")translate(" + d.y + ")";
                });

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
                "Q63JI2": "Sedolisin",
            };
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

            family_angles["Sedolisin"].offset = 10; // jshint ignore:line
            family_angles["Kexin/PC"].invert = true;
            family_angles["Cucumulisin/Pyrolisin"].invert = true;


            vis.selectAll("path.arc").data(d3.entries(family_angles))
                .enter().append("path")
                .attr("class", "arc")
                .attr("id", function(d) {
                    return d.key.substring(0, 4);
                })
                .attr("d", create_arc);
            vis.insert("defs").selectAll("path").data(d3.entries(family_angles))
                .enter().append("path")
                .attr("d", create_arc)
                .attr("id", function(d) {
                    return d.key;
                });

            vis.selectAll("text").data(d3.entries(family_angles))
                .enter().append("text")
                .attr("class", "arc")
                .attr("id", function(d) {
                    return d.key.substring(0, 4);
                })
                .attr("x", 0)
                .attr("z", 0)
                .attr("dy", function(d) {
                    if (d.value.invert) return 25;
                    else return -5;
                })
                .attr("text-anchor", "middle")
                .insert("textPath")
                .attr("xlink:href", function(d) {
                    return "#" + d.key;
                })
                .attr("startOffset", "50%")
                .text(function(d) {
                    return d.key;
                });

            tree_render.vis = vis;
            tree_render.link = link;

            //Plot dhis bars
            var dhisbar = vis.selectAll("g.dhisbar")
                .data(nodes.filter(function(n) {
                    return n.x !== undefined && !n.children;
                }), function(d) {
                    return d.name;
                })
                .enter().append("g")
                .attr("class", "dhisbar")
                .attr("transform", function(d) {
                    return "rotate(" + (d.x) + ")translate(" + (d.y + 50) + ")";
                }).insert("line")
                .attr("y", 0)
                .attr("x", 0)
                .attr("y2", 0)
                .attr("class", "dhisbar")
                .attr("x2", function(d) {
                    return d.dhis * 500;
                });
            vis.insert("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 180)
                .attr("class", "measure");
            tree_render.dhisbar = dhisbar;
        }
    };
    tree_render.highlight_family = function(family) {
        if (family) {
            d3.selectAll("#" + family.substring(0, 4)).style("display", "block");
            tree_render.link.attr("class", function(d) {
                if (d.target.family == family) return "highlight link";
                else return "link";
            });
        } else {
            tree_render.link.attr("class", "link");

        }
    };

    tree_render.color_nodes = function() {
        tree_render.dhisbar.attr("class", function(d) {
            if (d.tax == "Eukaryota") return "euk dhisbar";
            if (d.tax == "Bacteria") return "prok dhisbar";
            return "dhisbar";
        });
    };

    tree_render.show_circle = function() {
        d3.select("circle.measure").style("display", "block");
    };

    tree_render.show_dhis = function() {
        tree_render.dhisbar.style("display", "block");
    };
    tree_render.update_to_species = function() {
        vis.selectAll(".arc").style("display", "none");

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
        var x = Newick.parse(tree_render.spectext);
        var nodes = cluster.nodes(x);
        phylo(nodes[0], 0);
        var dists = nodes.map(function(d) {
            return d.y;
        });
        var maxdist = d3.max(dists);
        count_children(nodes[0], maxdist, 0);
        uid = 0;
        calculate_r(nodes[0], nodes[0].y);

        var family_list = {
            346: "Eukaryota",
            2810: "Prokaryota",
            7287: "Actinobacteria",
            5243: "Proteobacteria",
            1304: "Animals",
            1705: "Fungi",
            622: "Plants",
            2816: "Firmicutes"

        };
        var family_angles = {};
        assign_family(nodes[0], family_list, family_angles, "");
        family_angles["Prokaryota"].dir = 1; // jshint ignore:line
        family_angles["Prokaryota"].invert = 1; // jshint ignore:line
        family_angles["Prokaryota"].offset = 20; // jshint ignore:line
        family_angles["Eukaryota"].offset = 40; // jshint ignore:line
        family_angles["Eukaryota"].cont = "<tspan style='text-decoration:overline'>\u0394[His]</tspan>=1.72%"; // jshint ignore:line
        family_angles["Prokaryota"].cont = "<tspan style='text-decoration:overline'>\u0394[His]</tspan>=-0.34%"; // jshint ignore:line
        family_angles["Actinobacteria"].cont = "<tspan style='text-decoration:overline'>\u0394[His]</tspan>=-0.39%"; // jshint ignore:line
        family_angles["Firmicutes"].cont = "<tspan style='text-decoration:overline'>\u0394[His]</tspan>=-0.32%"; // jshint ignore:line
        family_angles["Proteobacteria"].cont = "<tspan style='text-decoration:overline'>\u0394[His]</tspan>=-0.26%"; // jshint ignore:line
        family_angles["Animals"].cont = "<tspan style='text-decoration:overline'>\u0394[His]</tspan>=2.36%"; // jshint ignore:line
        family_angles["Animals"].breaks = 1; // jshint ignore:line
        family_angles["Plants"].cont = "<tspan style='text-decoration:overline'>\u0394[His]</tspan>=2.08%"; // jshint ignore:line
        family_angles["Fungi"].cont = "<tspan style='text-decoration:overline'>\u0394[His]</tspan>=1.61%"; // jshint ignore:line
        family_angles["Actinobacteria"].invert = 1; // jshint ignore:line
        family_angles["Actinobacteria"].tclass = "minor "; // jshint ignore:line
        family_angles["Actinobacteria"].offset = -20; // jshint ignore:line
        family_angles["Proteobacteria"].invert = 1; // jshint ignore:line
        family_angles["Proteobacteria"].tclass = "minor "; // jshint ignore:line
        family_angles["Proteobacteria"].offset = -20; // jshint ignore:line
        family_angles["Firmicutes"].tclass = "minor "; // jshint ignore:line
        family_angles["Firmicutes"].offset = -20; // jshint ignore:line
        family_angles["Fungi"].offset = -10; // jshint ignore:line
        family_angles["Fungi"].tclass = "minor "; // jshint ignore:line
        family_angles["Animals"].tclass = "minor "; // jshint ignore:line
        family_angles["Plants"].tclass = "minor "; // jshint ignore:line
        var link = vis.selectAll("path.link")
            .data(cluster.links(nodes));
        link.enter().append("path");
        link.attr("class", "link")
            .attr("d", step);
        link.exit().remove();

        var node = tree_render.vis.selectAll("g.node")
            .data(nodes.filter(function(n) {
                return n.x !== undefined;
            }));
        node.enter().append("g");
        node.attr("class", "node")
            .attr("transform", function(d) {
                return "rotate(" + (d.x) + ")translate(" + d.y + ")";
            });
        node.exit().remove();

        nodes.forEach(function(d) {
            if (!d.children) {
                d.tax = tree_render.taxo[d.name];
            }
        });
        var dhisbar = vis.selectAll("g.dhisbar")
            .data(nodes.filter(function(n) {
                return n.x !== undefined && !n.children;
            }), function(d) {
                return d.name;
            });
        dhisbar.attr("class", "dhisbar")
            .transition().duration(5000).attr("transform", function(d) {
                return "rotate(" + (d.x) + ")translate(" + (d.y + 50) + ")";
            });
        dhisbar.exit().remove();
        vis.transition().duration(5000)
            .attr("transform", "translate(" + 325 + "," + 325 + ")rotate(180)");
        vis.selectAll("path.spec_arc").data(d3.entries(family_angles))
            .enter().append("path")
            .attr("class", function(d) {
                if ("tclass" in d.value)
                    return d.value.tclass + "spec_arc";
                else
                    return "spec_arc";
            })
            .attr("id", function(d) {
                return d.key.substring(0, 4);
            })
            .attr("d", create_arc);
        vis.insert("defs").selectAll("path").data(d3.entries(family_angles))
            .enter().append("path")
            .attr("d", create_arc)
            .attr("id", function(d) {
                return d.key;
            });

        vis.selectAll("text.spec_arc").data(d3.entries(family_angles))
            .enter().append("text")
            .attr("class", function(d) {
                if ("tclass" in d.value)
                    return d.value.tclass + "spec_arc";
                else
                    return "spec_arc";
            })
            .attr("id", function(d) {
                return d.key.substring(0, 4);
            })
            .attr("x", 0)
            .attr("z", 0)
            .attr("dy", function(d) {
                console.log("test");
                if (d.value.invert && "tclass" in d.value) return 18;
                else if (d.value.invert) return 25;
                else return -5;
            })
            .attr("text-anchor", "middle")
            .insert("textPath")
            .attr("xlink:href", function(d) {
                return "#" + d.key;
            })
            .attr("startOffset", "50%")
            .html(function(d) {
                if ("breaks" in d.value)
                    return '<tspan x=15>' + d.key + '</tspan><tspan x=15 dy=15>' + d.value.cont + '</tspan>';
                return d.key + " " + d.value.cont;
            });
    };
})();

tree_render.render_subtilase_tree();
