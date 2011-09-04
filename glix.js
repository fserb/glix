(function() {
  var glix = function(id) {
    var canvas = document.getElementById(id);
    var gl = canvas.getContext("experimental-webgl");
    gl.canvas = canvas;
    for (var i in glix.module) {
      glix.module[i](gl);
    }
    return gl;
  };

  glix.module = {
    base: function(gl) {
      gl._state = {};
      gl._objects = {};
      gl._new = {};
      gl.width = gl.canvas.width;
      gl.height = gl.canvas.height;
    }
  };

  'glix' in window || (window.glix = glix);
})();
