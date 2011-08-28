(function() {
  var glix = function(id) {
    var canvas = document.getElementById(id);
    var gl = canvas.getContext("experimental-webgl");
    gl.canvas = canvas;
    for (var i in glix.module) {
      glix.module[i](gl);
    }
    return gl;
  };

  glix.module = {
    base: function(gl) {
      gl._state = {};
      gl._objects = {};
    }
  };

  'glix' in window || (window.glix = glix);
})();
glix.module.objects = function(gl) {
  gl.assign = function(objectName) {
    var b = gl._objects[objectName];
    if (!b) throw "'" + objectName + "' used before being initialized.";
    b.bind();
    return b.assign();
  };
};glix.module.shader = function(gl) {
  // contains all programs currently loaded.
  var programs = {};

  var loadShader = function(type, name) {
    var data;
    if (name[0] == "#") {
      var c = document.getElementById(name.slice(1));
      data = c.textContent;
    } else {
      // we need some sort of sync ajax.
      var c = $.ajax({url: name, async: false});
      data = c.responseText;
    }

    var s = gl.createShader(type);
    gl.shaderSource(s, data);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw "gl.compileShader(" + name + "): " + gl.getShaderInfoLog(s);
    }
    return s;
  };

  var uniformFunc = {};
  uniformFunc[gl.INT] = function(l) { return function(v) { gl.uniform1i(l, v); }; };
  uniformFunc[gl.FLOAT] = function(l) { return function(v) { gl.uniform1f(l, v); }; };
  uniformFunc[gl.INT_VEC2] = function(l) { return function(v) { gl.uniform2iv(l, v); }; };
  uniformFunc[gl.INT_VEC3] = function(l) { return function(v) { gl.uniform3iv(l, v); }; };
  uniformFunc[gl.INT_VEC4] = function(l) { return function(v) { gl.uniform4iv(l, v); }; };
  uniformFunc[gl.FLOAT_VEC2] = function(l) { return function(v) { gl.uniform2fv(l, v); }; };
  uniformFunc[gl.FLOAT_VEC3] = function(l) { return function(v) { gl.uniform2fv(l, v); }; };
  uniformFunc[gl.FLOAT_VEC4] = function(l) { return function(v) { gl.uniform2fv(l, v); }; };
  uniformFunc[gl.FLOAT_MAT2] = function(l) { return function(v) { gl.uniformMatrix2fv(l, false, v); }; };
  uniformFunc[gl.FLOAT_MAT3] = function(l) { return function(v) { gl.uniformMatrix3fv(l, false, v); }; };
  uniformFunc[gl.FLOAT_MAT4] = function(l) { return function(v) { gl.uniformMatrix4fv(l, false, v); }; };
  uniformFunc[gl.SAMPLER_2D] = function(l) { return function() { gl.uniform1i(l, gl._state.textureUnit); }; };
  // TODO: uniformFunc for gl.SAMPLER_CUBE.

  var attribFunc = {};
  // TODO: make other attribFunc: FLOAT, FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4.
  attribFunc[gl.FLOAT_VEC2] = function(l) {
    return function(offset) {
      gl.vertexAttribPointer(l, 2, gl.FLOAT, false, gl._state.bufferStride*4 || 0, offset*4 || 0);
      return gl.attrib;
    };
  };

  attribFunc[gl.FLOAT_VEC3] = function(l) {
    return function(offset) {
      gl.vertexAttribPointer(l, 3, gl.FLOAT, false, gl._state.bufferStride*4 || 0, offset*4 || 0);
      return gl.attrib;
    };
  };
  attribFunc[gl.FLOAT_VEC4] = function(l) {
    return function(offset) {
      gl.vertexAttribPointer(l, 4, gl.FLOAT, false, gl._state.bufferStride*4 || 0, offset*4 || 0);
      return gl.attrib;
    };
  };

  var readProgram = function(p, attrib, uniform) {
    var aa = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < aa; ++i) {
      var a = gl.getActiveAttrib(p, i);
      var l = gl.getAttribLocation(p, a.name);
      attrib[a.name] = attribFunc[a.type](l);
      attrib[a.name].val = l;
    }
    var aa = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < aa; ++i) {
      var a = gl.getActiveUniform(p, i);
      var l = gl.getUniformLocation(p, a.name);
      uniform[a.name] = uniformFunc[a.type](l);
      uniform[a.name].val = l;
    }
  };

  var useProgram = function(p, attrib, uniform) {
    gl.useProgram(p);
    gl.uniform = uniform;
    gl.attrib = {};
    for (var i in attrib) {
      gl.attrib[i] = attrib[i];
      gl.enableVertexAttribArray(attrib[i].val);
    }
  };

  var linkProgram = function(name, p, s) {
    p.attached |= s;
    if (p.attached != 3) return;
    gl.linkProgram(p.val);
    if (!gl.getProgramParameter(p.val, gl.LINK_STATUS)) {
      console.log("gl.linkProgram(" + name + "): " + gl.getProgramInfoLog(p.val));
    }
    readProgram(p.val, p.attrib, p.uniform);
    if (name == "") {
      useProgram(p.val, p.attrib, p.uniform);
    }
  };

  gl.program = function(shaderName) {
    if (shaderName === undefined) shaderName = "";
    var p = programs[shaderName];
    if (!p) {
      p = programs[shaderName] = {
        _attached: 0,
        val: gl.createProgram(),
        attrib: {},
        uniform: {},
        vert: function(name) {
          gl.attachShader(p.val, loadShader(gl.VERTEX_SHADER, name));
          linkProgram(shaderName, p, 1);
          return p;
        },
        frag: function(name) {
          gl.attachShader(p.val, loadShader(gl.FRAGMENT_SHADER, name));
          linkProgram(shaderName, p, 2);
          return p;
        },
        use: function() {
          useProgram(p.val, p.attrib, p.uniform);
        }
      }
    }
    return p;
  };
};
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
};glix.module.texture = function(gl) {
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
};glix.module.utils = function(gl) {
  var raf =
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { window.setTimeout( callback, 1000 / 60 ); };

  var craf =
    window.cancelRequestAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout;

  gl.requestFrame = function(func) { return raf(func); };
  gl.cancelRequestFrame = function(func) { return craf(func); };
};
