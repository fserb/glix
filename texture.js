glix.module.texture = function(gl) {
  gl.texture = function(textureUnit, textureName) {
    textureName = textureName || textureUnit;
    var t = gl._objects[textureName];
    if (!t) {
      t = gl._objects[textureName] = {
        val: gl.createTexture(),
        _image: null,
        _loaded: false,
        _deferred: [],
        store: function() {
          t._loaded = true;
          t.bind();
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t._image);
          for (var i in t._deferred) {
            t._deferred[i]();
          }
          return t;
        },
        wrap: function(s, t) {
          if (!t._loaded) {
            t._deferred.push(function() { t.wrap(s,t); });
            return t;
          }
          gl.texParamteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, s);
          gl.texParamteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, t);
          return t;
        },
        filter: function(min, mag) {
          if (!t._loaded) {
            t._deferred.push(function() { t.filter(min, mag); });
            return t;
          }
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min);
          if (min == gl.NEAREST_MIPMAP_NEAREST || min == gl.LINEAR_MIPMAP_NEAREST ||
              min == gl.NEAREST_MIPMAP_LINEAR  || min == gl.LINEAR_MIPMAP_LINEAR) {
            gl.generateMipmap(gl.TEXTURE_2D);
          }
          return t;
        },
        param: function(key, value) {
          if (!t._loaded) {
            t._deferred.push(function() { t.param(key, value); });
            return t;
          }
          gl.texParameteri(gl.TEXTURE_2D, key, value);
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
          return t;
        },
        assign: function() {
          gl._state.textureUnit = textureUnit;
          return gl.uniform;
        },
      };
    }
    return t.bind();
  };
};