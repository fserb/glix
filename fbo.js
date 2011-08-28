glix.module.fbo = function(gl) {
  gl.fbo = function(fboName, width, height) {
    if (!fboName) {
      return gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    var f = gl._objects[fboName];
    if (!f) {
      f = gl._objects[fboName] = {
        val: gl.createFramebuffer(),
        _color: null,
        _depth: null,
        _stencil: null,
        width: width,
        height: height,
        bind: function() {
          gl.bindFramebuffer(gl.FRAMEBUFFER, f.val);
          return f;
        },
        color: function(textureName) {
          f._color = gl.texture(textureName).empty(f.width, f.height).filter(gl.LINEAR, gl.LINEAR);
          gl.bindTexture(gl.TEXTURE_2D, f._color.val);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
                                  f._color.val, 0);
          return f;
        },
        filter: function(min, mag) {
          f._color.bind().filter(min, mag);
          return f;
        },
        wrap: function(s, t) {
          f._color.bind().wrap(s, t);
          return f;
        },
        depth: function() {
          f._depth = gl.createRenderbuffer();
          gl.bindRenderbuffer(gl.RENDERBUFFER, f._depth);
          gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, f.width, f.height);
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                                     gl.RENDERBUFFER, f._depth);
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          return f;
        },
        stencil: function() {
          f._stencil = gl.createRenderbuffer();
          gl.bindRenderbuffer(gl.RENDERBUFFER, f._stencil);
          gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, f.width, f.height);
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,
                                     gl.RENDERBUFFER, f._stencil);
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          return f;
        },

      };
    }
    return f.bind();
  };
};