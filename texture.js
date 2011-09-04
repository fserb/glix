glix.module.texture = function(gl) {
  gl._new.texture = function(textureUnit) {
    var t = {
      val: gl.createTexture(),
      _image: null,
      _loaded: false,
      width: 0,
      height: 0,
      _deferred: [],
      empty: function(width, height) {
        t.width = width;
        t.height = height;
        t._loaded = true;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height,
                      0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        return t;
      },
      store: function() {
        t._loaded = true;
        t.bind();
        t.width = t._image.width;
        t.height = t._image.height;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t._image);
        for (var i in t._deferred) {
          t._deferred[i]();
        }
        return t;
      },
      wrap: function(ws, wt) {
        if (!t._loaded) {
          t._deferred.push(function() { t.wrap(ws,wt); });
          return t;
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, ws);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wt);
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
          t.mipmap();
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
      mipmap: function() {
        gl.generateMipmap(gl.TEXTURE_2D);
      },
    };
    return t;
  };

  gl.texture = function(textureName, textureUnit) {
    var t = gl._objects[textureName] || (gl._objects[textureName] = gl._new.texture(textureUnit));
    return t.bind();
  };
};