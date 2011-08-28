gnix.module.texture = function(gl) {
  var textures = {};

  gl.texture = function(textureUnit, textureName) {
    textureName = textureName || textureUnit;
    var t = textures[textureName];
    if (!t) {
      t = textures[textureName] = {
        val: gl.createTexture(),
        _image: null,
        store: function() {
          gl.bindTexture(gl.TEXTURE_2D, t.val);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t._image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          return t;
        },
        image: function(url) {
          t._image = new Image();
          t._image.onload = t.store;
          t._image.src = url;
          return t;
        },
        bind: function() {
          gl.activeTexture(gl.TEXTURE0 + textureUnit);
          gl.bindTexture(gl.TEXTURE_2D, t.val);
          gl._state.textureUnit = textureUnit;
          return gl.uniform;
        },
      };
    }
    return t;
  };
};