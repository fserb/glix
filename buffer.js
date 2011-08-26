gnix.module.buffer = function(gl) {
  var buffers = {};

  gl.buffer = function(bufferName, drawMode) {
    if (drawMode === undefined) drawMode = gl.STATIC_DRAW;
    var b = buffers[bufferName] || (buffers[bufferName] = gl.createBuffer());

    var _ = {
      buffer: function() {
        return b['buffer'];
      },

      data: function(array) {
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), drawMode);
        return _;
      },

      bind: function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        return _;
      },
    };
    return _;
  };
};