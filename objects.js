glix.module.objects = function(gl) {
  gl.assign = function(objectName) {
    var b = gl._objects[objectName];
    if (!b) throw "'" + objectName + "' used before being initialized.";
    b.bind();
    return b.assign();
  };
  gl.remove = function(objectName) {
    delete gl._objects[objectName];
    return gl;
  };
};