render_mc_vis = {};

(function() {
        aminoprops = [{
            "fullName": "Alanine",
            "abbreviation": "Ala",
            "symbol": "A",
            "molWeight": 89.09,
            "charge": 0,
            "hydrophobicityRB": 2.15,
            "pK": 0,
            "surface": 115,
            "volume": 88.6,
            "solubility": 16.65,
            "hydrophobicity": 1,
            "property": "Total aliphatic; hydrophobic"
        }, {
            "fullName": "Arginine",
            "abbreviation": "Arg",
            "symbol": "R",
            "molWeight": 174.2,
            "charge": 1,
            "hydrophobicityRB": 2.23,
            "pK": 12,
            "surface": 225,
            "volume": 173.4,
            "solubility": 15,
            "hydrophobicity": -2,
            "property": "Acidic side chains; strongly polar; cationic"
        }, {
            "fullName": "Asparagine",
            "abbreviation": "Asn",
            "symbol": "N",
            "molWeight": 132.12,
            "charge": 0,
            "hydrophobicityRB": 1.05,
            "pK": 0,
            "surface": 160,
            "volume": 114.1,
            "solubility": 3.53,
            "hydrophobicity": -1,
            "property": "Strongly polar"
        }, {
            "fullName": "Asparticacid",
            "abbreviation": "Asp",
            "symbol": "D",
            "molWeight": 133.1,
            "charge": -1,
            "hydrophobicityRB": 1.13,
            "pK": 4.4,
            "surface": 150,
            "volume": 111.1,
            "solubility": 0.778,
            "hydrophobicity": -2,
            "property": "Acidic side chains; strongly polar; anionic"
        }, {
            "fullName": "Cysteine",
            "abbreviation": "Cys",
            "symbol": "C",
            "molWeight": 121.15,
            "charge": 0,
            "hydrophobicityRB": 1.2,
            "pK": 8.5,
            "surface": 135,
            "volume": 108.5,
            "solubility": 1000,
            "hydrophobicity": 1,
            "property": "Polar side chains; semipolar"
        }, {
            "fullName": "Glutamine",
            "abbreviation": "Gln",
            "symbol": "Q",
            "molWeight": 146.15,
            "charge": 0,
            "hydrophobicityRB": 1.65,
            "pK": 0,
            "surface": 180,
            "volume": 143.8,
            "solubility": 2.5,
            "hydrophobicity": -1,
            "property": "Strongly polar"
        }, {
            "fullName": "Glutamicacid",
            "abbreviation": "Glu",
            "symbol": "E",
            "molWeight": 147.13,
            "charge": -1,
            "hydrophobicityRB": 1.73,
            "pK": 4.4,
            "surface": 190,
            "volume": 138.4,
            "solubility": 0.864,
            "hydrophobicity": -2,
            "property": "Acidic side chains; strongly polar; anionic"
        }, {
            "fullName": "Glycine",
            "abbreviation": "Gly",
            "symbol": "G",
            "molWeight": 75.07,
            "charge": 0,
            "hydrophobicityRB": 1.18,
            "pK": 0,
            "surface": 75,
            "volume": 60.1,
            "solubility": 24.99,
            "hydrophobicity": 1,
            "property": "Semipolar"
        }, {
            "fullName": "Histidine",
            "abbreviation": "His",
            "symbol": "H",
            "molWeight": 155.16,
            "charge": 1,
            "hydrophobicityRB": 2.45,
            "pK": 6.5,
            "surface": 195,
            "volume": 153.2,
            "solubility": 4.19,
            "hydrophobicity": -2,
            "property": "Basic side chains; strongly polar; cationic"
        }, {
            "fullName": "Isoleucine",
            "abbreviation": "Ile",
            "symbol": "I",
            "molWeight": 131.17,
            "charge": 0,
            "hydrophobicityRB": 3.88,
            "pK": 0,
            "surface": 175,
            "volume": 166.7,
            "solubility": 4.117,
            "hydrophobicity": 1,
            "property": "Branched chain aliphatic; hydrophobic"
        }, {
            "fullName": "Leucine",
            "abbreviation": "Leu",
            "symbol": "L",
            "molWeight": 131.17,
            "charge": 0,
            "hydrophobicityRB": 4.1,
            "pK": 10,
            "surface": 170,
            "volume": 166.7,
            "solubility": 2.426,
            "hydrophobicity": 1,
            "property": "Branched chain aliphatic; hydrophobic"
        }, {
            "fullName": "Lysine",
            "abbreviation": "Lys",
            "symbol": "K",
            "molWeight": 146.19,
            "charge": 1,
            "hydrophobicityRB": 3.05,
            "pK": 0,
            "surface": 200,
            "volume": 168.6,
            "solubility": 1000,
            "hydrophobicity": -2,
            "property": "Acidic side chains; strongly polar; cationic"
        }, {
            "fullName": "Methionine",
            "abbreviation": "Met",
            "symbol": "M",
            "molWeight": 149.21,
            "charge": 0,
            "hydrophobicityRB": 3.43,
            "pK": 0,
            "surface": 185,
            "volume": 162.9,
            "solubility": 3.81,
            "hydrophobicity": 1,
            "property": "Totally alyphatic"
        }, {
            "fullName": "Phenylalanine",
            "abbreviation": "Phe",
            "symbol": "F",
            "molWeight": 165.19,
            "charge": 0,
            "hydrophobicityRB": 3.46,
            "pK": 0,
            "surface": 210,
            "volume": 189.9,
            "solubility": 2.965,
            "hydrophobicity": 2,
            "property": "Totally aromatic"
        }, {
            "fullName": "Proline",
            "abbreviation": "Pro",
            "symbol": "P",
            "molWeight": 115.13,
            "charge": 0,
            "hydrophobicityRB": 3.1,
            "pK": 0,
            "surface": 145,
            "volume": 112.7,
            "solubility": 162.3,
            "hydrophobicity": 1,
            "property": "Totally alyphatic"
        }, {
            "fullName": "Serine",
            "abbreviation": "Ser",
            "symbol": "S",
            "molWeight": 105.09,
            "charge": 0,
            "hydrophobicityRB": 1.4,
            "pK": 0,
            "surface": 115,
            "volume": 89,
            "solubility": 5.023,
            "hydrophobicity": -1,
            "property": "Semipolar"
        }, {
            "fullName": "Threonine",
            "abbreviation": "Thr",
            "symbol": "T",
            "molWeight": 119.12,
            "charge": 0,
            "hydrophobicityRB": 2.25,
            "pK": 0,
            "surface": 140,
            "volume": 116.1,
            "solubility": 1000,
            "hydrophobicity": -1,
            "property": "Semipolar"
        }, {
            "fullName": "Tryptophan",
            "abbreviation": "Trp",
            "symbol": "W",
            "molWeight": 204.23,
            "charge": 0,
            "hydrophobicityRB": 4.11,
            "pK": 0,
            "surface": 255,
            "volume": 227.8,
            "solubility": 1.136,
            "hydrophobicity": 2,
            "property": "Totally aromatic"
        }, {
            "fullName": "Tyrosine",
            "abbreviation": "Tyr",
            "symbol": "Y",
            "molWeight": 181.19,
            "charge": 0,
            "hydrophobicityRB": 2.81,
            "pK": 10,
            "surface": 230,
            "volume": 193.6,
            "solubility": 0.045,
            "hydrophobicity": 1,
            "property": "Hydrophobic; total aromatic"
        }, {
            "fullName": "Valine",
            "abbreviation": "Val",
            "symbol": "V",
            "molWeight": 117.15,
            "charge": 0,
            "hydrophobicityRB": 3.38,
            "pK": 0,
            "surface": 155,
            "volume": 140,
            "solubility": 8.85,
            "hydrophobicity": 1,
            "property": "Branched chain aliphatic; hydrophobic"
        }];
        render_mc_vis.step = 0;
        render_mc_vis.showvel = false;
        var project_x = function(x) {
            return x * 50 ;
        };
        var project_y = function(x) {
            return x * 50 + 5;
        };
        render_mc_vis.traj_data = {};
        render_mc_vis.setup = function() {

            d3.json("data/2dtrajectory.json", function(traj_data) {
                render_mc_vis.traj_data = traj_data;
                render_mc_vis.render();
            });
        };
        render_mc_vis.render = function() {
            var svg = d3.select("#mc-vis");
            var width = svg.attr("width");
            var height = svg.attr("height");
            svg.html('<defs>' +
                '    <marker id="markerCircle" markerWidth="8" markerHeight="8" refx="5" refy="5">' +
                '        <circle cx="5" cy="5" r="3" style="stroke: none; fill:#000000;"/>' +
                '    </marker>' +
                '' +
                '    <marker id="markerArrow" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" refx="2" refy="6"' +
                '           orient="auto">' +
                '        <path d="M2,2 L2,11 L10,6 L2,2" style="fill: #000000;" />' +
                '    </marker>' +
                '</defs>');
            var frame_data = render_mc_vis.traj_data[render_mc_vis.step];
            var link = svg.selectAll('.link')
                .data(frame_data.x)
                .enter().append('line')
                .attr('class', 'link');
            var node = svg.selectAll('.node')
                .data(frame_data.x)
                .enter().append('g')
                .attr('class', function(d, i) {
                    var prop = 'nonpolar';
                    if (/polar/i.test(aminoprops[frame_data.element[i] - 5].property)) prop = 'polar';
                    if (/catio/i.test(aminoprops[frame_data.element[i] - 5].property)) prop = 'pos';
                    if (/anion/i.test(aminoprops[frame_data.element[i] - 5].property)) prop = 'neg';
                    if (aminoprops[frame_data.element[i] - 5].symbol == 'C') prop = 'nonpolar';
                    return prop + ' node';
                });

            node.append('circle')
                .attr("r", function(d, i) {
                    return Math.sqrt(aminoprops[frame_data.element[i] - 5].molWeight)/2;
                })
                .attr("cx", 0)
                .attr("cy", 0);
            node.append('text')
                .attr("x", 0)
                .attr("y", 0)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .text(function(d, i) {
                    return aminoprops[frame_data.element[i] - 5].symbol;
                });
            if (render_mc_vis.showvel) {
                node.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", function(d, i) {
                        return frame_data.vx[i] * 100000;
                    })
                    .attr("y2", function(d, i) {
                        return frame_data.vy[i] * 100000;
                    })
                    .style("stroke", "#222")
                    .style("stroke-width", "3px")
                    .style("marker-end", "url(#markerArrow)");
            }

            node.attr('transform', function(d, i) {
                return "translate(" + project_x(d) + " " + project_y(frame_data.y[i]) + ")";
            });
            link.attr('x1', function(d) {
                    return project_x(d);
                })
                .attr('y1', function(d, i) {
                    return project_y(frame_data.y[i]);
                })
                .attr('x2', function(d, i) {
                    if (i < 47) i += 1;
                    return project_x(frame_data.x[i]);
                })
                .attr('y2', function(d, i) {
                    if (i < 47) i += 1;
                    return project_y(frame_data.y[i]);
                });

};
render_mc_vis.rot_move = function(id,angle) {
    var frame_data = render_mc_vis.traj_data[0];
    var new_x = frame_data.x.map(function(x,i) {
        var angle_rad = angle * (Math.PI / 180);
        var cosTheta = Math.cos(angle_rad);
        var sinTheta = Math.sin(angle_rad);
        var xn = (cosTheta * (x - frame_data.x[id]) - sinTheta * (frame_data.y[i] - frame_data.y[id])) + frame_data.x[id];
        if (i > id) return xn; else return x;
        });
    var new_y = frame_data.x.map(function(x,i) {
        var angle_rad = angle * (Math.PI / 180);
        var cosTheta = Math.cos(angle_rad);
        var sinTheta = Math.sin(angle_rad);
        var yn = (sinTheta * (x - frame_data.x[id]) + cosTheta * (frame_data.y[i] - frame_data.y[id])) + frame_data.y[id];
        if (i > id) return yn; else return frame_data.y[i];
        });
    render_mc_vis.traj_data[0].x = new_x;
    render_mc_vis.traj_data[0].y = new_y;
    render_mc_vis.render();
};
render_mc_vis.rot_moven = function(id,angle) {
    var frame_data = render_mc_vis.traj_data[0];
    var new_x = frame_data.x.map(function(x,i) {
        var angle_rad = angle * (Math.PI / 180);
        var cosTheta = Math.cos(angle_rad);
        var sinTheta = Math.sin(angle_rad);
        var xn = (cosTheta * (x - frame_data.x[id]) - sinTheta * (frame_data.y[i] - frame_data.y[id])) + frame_data.x[id];
        if (i < id) return xn; else return x;
        });
    var new_y = frame_data.x.map(function(x,i) {
        var angle_rad = angle * (Math.PI / 180);
        var cosTheta = Math.cos(angle_rad);
        var sinTheta = Math.sin(angle_rad);
        var yn = (sinTheta * (x - frame_data.x[id]) + cosTheta * (frame_data.y[i] - frame_data.y[id])) + frame_data.y[id];
        if (i < id) return yn; else return frame_data.y[i];
        });
    render_mc_vis.traj_data[0].x = new_x;
    render_mc_vis.traj_data[0].y = new_y;
    render_mc_vis.render();
};
})();

render_mc_vis.setup();
