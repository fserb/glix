gnix.module.buffer = function(gl) {
  var buffers = {};

  gl.buffer = function(bufferName, drawMode) {
    var b = buffers[bufferName];
    if (!b) {
      b = buffers[bufferName] = {
        val: gl.createBuffer(),
        data: function(array) {
          if (drawMode === undefined) drawMode = gl.STATIC_DRAW;
          gl.bindBuffer(gl.ARRAY_BUFFER, b.val);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), drawMode);
          return b;
        },
        bind: function() {
          gl.bindBuffer(gl.ARRAY_BUFFER, b.val);
          return b;
        },
      };
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, b.val);
    return b;
  };
};