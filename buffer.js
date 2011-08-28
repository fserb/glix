glix.module.buffer = function(gl) {
  gl.vertex = function(vertexName) {
    var b = gl._objects[vertexName];
    if (!b) {
      b = gl._objects[vertexName] = {
        val: gl.createBuffer(),
        length: 0,
        size: 0,
        data: function(array, size, drawMode) {
          if (drawMode === undefined) drawMode = gl.STATIC_DRAW;
          b.length = array.length/size;
          b.size = size;
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), drawMode);
          return b;
        },
        bind: function() {
          gl.bindBuffer(gl.ARRAY_BUFFER, b.val);
          return b;
        },
        assign: function() {
          gl._state.bufferStride = b.size;
          return gl.attrib;
        },
      };
    }
    return b.bind();
  };

  gl.elements = function(elementsName) {
    var e = gl._objects[elementsName];
    if (!e) {
      e = gl._objects[elementsName] = {
        val: gl.createBuffer(),
        length: 0,
        data: function(array, drawMode) {
          if (drawMode === undefined) drawMode = gl.STATIC_DRAW;
          e.length = array.length;
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), drawMode);
          return e;
        },
        bind: function() {
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e.val);
          return e;
        },
        draw: function(mode, offset, count) {
          offset = offset*2 || 0;
          gl.drawElements(mode, count || e.length - offset,
                          gl.UNSIGNED_SHORT, offset*2);
        },
      };
    }
    return e.bind();
  };
};