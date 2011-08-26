gnix.module.shader = function(gl) {
  // contains all programs currently loaded.
  var programs = {};
  // variables for program being used.
  var attribs = {};
  var uniforms = {};

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
  // TODO: uniformFunc for gl.SAMPLER_2D and gl.SAMPLER_CUBE.

  var attribFunc = {};
  // TODO: make other attribFunc.
  attribFunc[gl.FLOAT_VEC3] = function(l) {
    return function(stride, offset) {
      gl.vertexAttribPointer(l, 3, gl.FLOAT, false, stride || 0, offset || 0);
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
    gl.prog = {};
    for (var i in attrib) {
      gl.prog[i] = attrib[i];
      gl.enableVertexAttribArray(attrib[i]);
    }
    for (var i in uniform) {
      gl.prog[i] = uniform[i];
    }
  };

  gl.program = function(shaderName) {
    if (shaderName === undefined) shaderName = "";
    var p = programs[shaderName] || (programs[shaderName] = gl.createProgram());
    var attrib = attribs[shaderName] || (attribs[shaderName] = {});
    var uniform = uniforms[shaderName] || (uniforms[shaderName] = {});
    var _attached = 0;

    var _link = function(s) {
      _attached |= s;
      if (_attached != 3) return;
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.log("gl.linkProgram(" + shaderName + "): " + gl.getProgramInfoLog(p));
      }
      readProgram(p, attrib, uniform);
      if (shaderName == "") {
        useProgram(p, attrib, uniform);
      }
    };
    // chain object.
    var _ = {
      get: function() {
        return p;
      },
      vert: function(name) {
        gl.attachShader(p, loadShader(gl.VERTEX_SHADER, name));
        _link(1);
        return _;
      },
      frag: function(name) {
        gl.attachShader(p, loadShader(gl.FRAGMENT_SHADER, name));
        _link(2);
        return _;
      },
      use: function() {
        useProgram(p, attrib, uniform);
      }
    };
    return _;
  };
};
