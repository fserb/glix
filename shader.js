glix.module.shader = function(gl) {
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

    data = "#ifdef GL_ES\nprecision highp float;\n#endif\n" + data;
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
    aa = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
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
    p._attached |= s;
    if (p._attached != 3) return;
    gl.linkProgram(p.val);
    if (!gl.getProgramParameter(p.val, gl.LINK_STATUS)) {
      throw "gl.linkProgram(" + name + "): " + gl.getProgramInfoLog(p.val);
    }
    readProgram(p.val, p.attrib, p.uniform);
    p._attached = 4;
  };

  gl.program = function(shaderName) {
    if (shaderName === undefined) shaderName = "";
    var p = gl._objects[shaderName];
    if (!p) {
      p = gl._objects[shaderName] = {
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
    if (p._attached == 4) {
      p.use();
    }
    return p;
  };
};
