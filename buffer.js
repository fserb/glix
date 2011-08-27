gnix.module.buffer = function(gl) {
  var buffers = {};

  gl.buffer = function(bufferName) {
    var b = buffers[bufferName];
    if (!b) {
      b = buffers[bufferName] = {
        val: gl.createBuffer(),
        length: 0,
        size: 0,
        data: function(array, size, drawMode) {
          if (drawMode === undefined) drawMode = gl.STATIC_DRAW;
          b.length = array.length;
          b.size = size;
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

  gl.assign = function(bufferName) {
    var b = buffers[bufferName];
    if (!b) throw "buffer '" + bufferName + "' must be initialized with buffer() before use.";
    b.bind();
    gl._state.bufferStride = b.size;
    return gl.attrib;
  };

};