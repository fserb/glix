(function() {
  var gnix = function(id) {
    var canvas = document.getElementById(id);
    var gl = canvas.getContext("experimental-webgl");
    gl.canvas = canvas;
    for (var i in gnix.module) {
      gnix.module[i](gl);
    }
    return gl;
  };

  gnix.module = {
    base: function(gl) {
      gl._state = {};
    }
  };

  'gnix' in window || (window.gnix = gnix);
})();
