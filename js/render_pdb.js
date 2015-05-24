var render_pdb = {};

(function () {

            function transferase() {
                load('sh2');
                viewer_left.spin(1);
                // viewer_left.se
                viewer_right.spin(-1);
            }

            function cartoon() {
                viewer_left.clear();
                viewer_right.clear();
                var go = viewer_left.cartoon('structure', structure, {
                    color: color.ssSuccession(),
                    showRelated: '1',
                });
                var go = viewer_right.cartoon('structure', structure, {
                    color: color.ssSuccession(),
                    showRelated: '1',
                });
                var rotation = viewpoint.principalAxes(go);
                viewer_left.setRotation(rotation)
                viewer_right.setRotation(rotation)
            }

            function load(pdb_id) {
                $.ajax({
                    url: 'pdbs/' + pdb_id + '.pdb',
                    success: function(data) {
                        structure = io.pdb(data);
                        //mol.assignHelixSheet(structure);
                        cartoon();
                        viewer_left.autoZoom();
                        viewer_right.autoZoom();
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

            viewer_left.addListener('viewerReady', transferase);
            viewer_right.addListener('viewerReady', transferase);
            };
}());

render_pdb.render_title_page()

