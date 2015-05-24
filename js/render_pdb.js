var render_pdb = {};

(function () {

            function initialize_left() {
                load('sh2',viewer_left);
                viewer_left.spin(1);
            }
            function initialize_right() {
                load('sh2',viewer_right);
                viewer_right.spin(1);
            }

            function cartoon(viewer) {
                viewer.clear();
                var go = viewer.cartoon('structure', structure, {
                    color: color.ssSuccession(),
                    showRelated: '1',
                });
                var rotation = viewpoint.principalAxes(go);
                viewer.setRotation(rotation)
            }

            function load(pdb_id,viewer) {
                $.ajax({
                    url: 'pdbs/' + pdb_id + '.pdb',
                    success: function(data) {
                        structure = io.pdb(data);
                        //mol.assignHelixSheet(structure);
                        cartoon(viewer);
                        viewer.autoZoom();
                        viewer.autoZoom();
                    }
                });
            }
            render_pdb.render_title_page = function () {
            viewer_left = pv.Viewer(document.getElementById('viewer_left'), {
                width: 'auto',
                height: 'auto',
                antialias: true,
                outline: true,
                quality: 'high',
                style: 'hemilight',
                background: '#eee',
                animateTime: 500,
            });
            viewer_right = pv.Viewer(document.getElementById('viewer_right'), {
                width: 'auto',
                height: 'auto',
                antialias: true,
                outline: true,
                quality: 'medium',
                style: 'hemilight',
                background: '#eee',
                animateTime: 500,
            });

            viewer_left.addListener('viewerReady', initialize_left);
            viewer_right.addListener('viewerReady', initialize_right);
            };
})();

render_pdb.render_title_page()

