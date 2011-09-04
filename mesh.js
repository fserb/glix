glix.module.mesh = function(gl) {
  gl._new.mesh = function() {
    var m = {
      _vertex: null,
      _elements: null,
      _elementsFormat: null,
      vertex: function(data, size) {
        m._vertex = gl._new.vertex().bind().data(data, size);
        return m;
      },
      elements: function(indices, format) {
        m._elementsFormat = format;
        m._elements = gl._new.elements().bind().data(indices);
        return m;
      },
      assign: function() {
        return m._vertex.assign();
      },
      bind: function() {
        m._vertex.bind();
        return m;
      },
      draw: function() {
        m._elements.draw(m._elementsFormat);
        return m;
      },
    };
    return m;
  };

  gl.mesh = function(meshName) {
    var m = gl._objects[meshName] || (gl._objects[meshName] = gl._new.mesh());
    return m;
  };
};