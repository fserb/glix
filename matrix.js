// based on glmatrix.js 0.9.6. Copyright (c) 2011 Brandon Jones.
// Modifications by Fernando Serboncini.

(function() {
  var Float32Array = window.Float32Array || Array;

  window.vec3 = function(vec) {
    var v = new Float32Array(3);
    if(vec) {
      v[0] = vec[0];
      v[1] = vec[1];
      v[2] = vec[2];
    }
    v.clear = function() {
      v[0] = 0.0;
      v[1] = 0.0;
      v[2] = 0.0;
      return v;
    }
    v.add = function(vec) {
      v[0] += vec[0];
      v[1] += vec[1];
      v[2] += vec[2];
      return v;
    };
    v.subtract = function(vec) {
      v[0] -= vec[0];
      v[1] -= vec[1];
      v[2] -= vec[2];
      return v;
    };
    v.negate = function() {
      v[0] = -v[0];
      v[1] = -v[1];
      v[2] = -v[2];
      return v;
    }
    v.scale = function(val) {
      v[0] *= val;
      v[1] *= val;
      v[2] *= val;
      return v;
    }
    v.normalize = function() {
      var len = v.module();
      if (len == 0) {
        return v.clear();
      }
      v.scale(1.0/len);
      return v;
    }
    v.cross = function(vec) {
      var out = vec3();
      out[0] = v[1]*vec[2] - v[2]*vec[1];
      out[1] = v[2]*vec[0] - v[0]*vec[2];
      out[2] = v[0]*vec[1] - v[1]*vec[0];
      return out;
    }
    v.module = function() {
      return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    }
    v.dot = function(vec) {
      return v[0]*vec[0] + v[1]*vec[1] + v[2]*vec[2];
    }
    v.direction = function(vec) {
      return vec3(vec).subtract(v).normalize();
    }
    v.lerp = function(vec, lerp) {
      return vec3(vec).subtract(v).scale(lerp).add(v);
    }
    v.str = function() {
      return '[' + v[0] + ', ' + v[1] + ', ' + v[2] + ']';
    }
    return v;
  }

  window.mat4 = function(mat) {
    var m = new Float32Array(16);
    if (mat) {
      m[0] = mat[0];
      m[1] = mat[1];
      m[2] = mat[2];
      m[3] = mat[3];
      m[4] = mat[4];
      m[5] = mat[5];
      m[6] = mat[6];
      m[7] = mat[7];
      m[8] = mat[8];
      m[9] = mat[9];
      m[10] = mat[10];
      m[11] = mat[11];
      m[12] = mat[12];
      m[13] = mat[13];
      m[14] = mat[14];
      m[15] = mat[15];
    }
    m.clear = function() {
      m[0] = 0;
      m[1] = 0;
      m[2] = 0;
      m[3] = 0;
      m[4] = 0;
      m[5] = 0;
      m[6] = 0;
      m[7] = 0;
      m[8] = 0;
      m[9] = 0;
      m[10] = 0;
      m[11] = 0;
      m[12] = 0;
      m[13] = 0;
      m[14] = 0;
      m[15] = 0;
      return m;
    }

    m.identity = function() {
      m[0] = 1;
      m[1] = 0;
      m[2] = 0;
      m[3] = 0;
      m[4] = 0;
      m[5] = 1;
      m[6] = 0;
      m[7] = 0;
      m[8] = 0;
      m[9] = 0;
      m[10] = 1;
      m[11] = 0;
      m[12] = 0;
      m[13] = 0;
      m[14] = 0;
      m[15] = 1;
      return m;
    }
    m.transpose = function() {
      var a01 = m[1], a02 = m[2], a03 = m[3];
      var a12 = m[6], a13 = m[7];
      var a23 = m[11];
      m[1] = m[4];
      m[2] = m[8];
      m[3] = m[12];
      m[4] = a01;
      m[6] = m[9];
      m[7] = m[13];
      m[8] = a02;
      m[9] = a12;
      m[11] = m[14];
      m[12] = a03;
      m[13] = a13;
      m[14] = a23;
      return m;
    }
    m.det = function() {
      var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
      var a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
      var a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
      var a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

      return  a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
        a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
        a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
        a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
        a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
        a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
    }
    m.inverse = function() {
      var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
      var a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
      var a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
      var a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

      var b00 = a00*a11 - a01*a10;
      var b01 = a00*a12 - a02*a10;
      var b02 = a00*a13 - a03*a10;
      var b03 = a01*a12 - a02*a11;
      var b04 = a01*a13 - a03*a11;
      var b05 = a02*a13 - a03*a12;
      var b06 = a20*a31 - a21*a30;
      var b07 = a20*a32 - a22*a30;
      var b08 = a20*a33 - a23*a30;
      var b09 = a21*a32 - a22*a31;
      var b10 = a21*a33 - a23*a31;
      var b11 = a22*a33 - a23*a32;

      // Calculate the determinant (inlined to avoid double-caching)
      var invDet = 1/(b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);

      dest[0] = (a11*b11 - a12*b10 + a13*b09)*invDet;
      dest[1] = (-a01*b11 + a02*b10 - a03*b09)*invDet;
      dest[2] = (a31*b05 - a32*b04 + a33*b03)*invDet;
      dest[3] = (-a21*b05 + a22*b04 - a23*b03)*invDet;
      dest[4] = (-a10*b11 + a12*b08 - a13*b07)*invDet;
      dest[5] = (a00*b11 - a02*b08 + a03*b07)*invDet;
      dest[6] = (-a30*b05 + a32*b02 - a33*b01)*invDet;
      dest[7] = (a20*b05 - a22*b02 + a23*b01)*invDet;
      dest[8] = (a10*b10 - a11*b08 + a13*b06)*invDet;
      dest[9] = (-a00*b10 + a01*b08 - a03*b06)*invDet;
      dest[10] = (a30*b04 - a31*b02 + a33*b00)*invDet;
      dest[11] = (-a20*b04 + a21*b02 - a23*b00)*invDet;
      dest[12] = (-a10*b09 + a11*b07 - a12*b06)*invDet;
      dest[13] = (a00*b09 - a01*b07 + a02*b06)*invDet;
      dest[14] = (-a30*b03 + a31*b01 - a32*b00)*invDet;
      dest[15] = (a20*b03 - a21*b01 + a22*b00)*invDet;
    }
    m.multiply = function(mat) {
      var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
      var a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
      var a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
      var a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

      var b00 = mat[0], b01 = mat[1], b02 = mat[2], b03 = mat[3];
      var b10 = mat[4], b11 = mat[5], b12 = mat[6], b13 = mat[7];
      var b20 = mat[8], b21 = mat[9], b22 = mat[10], b23 = mat[11];
      var b30 = mat[12], b31 = mat[13], b32 = mat[14], b33 = mat[15];

      m[0] = b00*a00 + b01*a10 + b02*a20 + b03*a30;
      m[1] = b00*a01 + b01*a11 + b02*a21 + b03*a31;
      m[2] = b00*a02 + b01*a12 + b02*a22 + b03*a32;
      m[3] = b00*a03 + b01*a13 + b02*a23 + b03*a33;
      m[4] = b10*a00 + b11*a10 + b12*a20 + b13*a30;
      m[5] = b10*a01 + b11*a11 + b12*a21 + b13*a31;
      m[6] = b10*a02 + b11*a12 + b12*a22 + b13*a32;
      m[7] = b10*a03 + b11*a13 + b12*a23 + b13*a33;
      m[8] = b20*a00 + b21*a10 + b22*a20 + b23*a30;
      m[9] = b20*a01 + b21*a11 + b22*a21 + b23*a31;
      m[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
      m[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
      m[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
      m[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
      m[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
      m[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
      return m;
    }
    m.multvec3 = function(vec) {
      var x = vec[0], y = vec[1], z = vec[2];
      var out = vec3();
      out[0] = m[0]*x + m[4]*y + m[8]*z + m[12];
      out[1] = m[1]*x + m[5]*y + m[9]*z + m[13];
      out[2] = m[2]*x + m[6]*y + m[10]*z + m[14];
      return out;
    }
    m.multvec4 = function(vec) {
      var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
      out[0] = m[0]*x + m[4]*y + m[8]*z + m[12]*w;
      out[1] = m[1]*x + m[5]*y + m[9]*z + m[13]*w;
      out[2] = m[2]*x + m[6]*y + m[10]*z + m[14]*w;
      out[3] = m[3]*x + m[7]*y + m[11]*z + m[15]*w;
    }
    m.translate = function(vec) {
      var x = vec[0], y = vec[1], z = vec[2];
      m[12] = m[0]*x + m[4]*y + m[8]*z + m[12];
      m[13] = m[1]*x + m[5]*y + m[9]*z + m[13];
      m[14] = m[2]*x + m[6]*y + m[10]*z + m[14];
      m[15] = m[3]*x + m[7]*y + m[11]*z + m[15];
      return m;
    }
    m.scale = function(vec) {
      var x = vec[0], y = vec[1], z = vec[2];
      m[0] *= x;
      m[1] *= x;
      m[2] *= x;
      m[3] *= x;
      m[4] *= y;
      m[5] *= y;
      m[6] *= y;
      m[7] *= y;
      m[8] *= z;
      m[9] *= z;
      m[10] *= z;
      m[11] *= z;
      return m;
    }
    m.rotate = function(angle, axis) {
      var s = Math.sin(angle);
      var c = Math.cos(angle);
      var t = 1-c;
      var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
      var a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
      var a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
      var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
      var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
      var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;
      m[0] = a00*b00 + a10*b01 + a20*b02;
      m[1] = a01*b00 + a11*b01 + a21*b02;
      m[2] = a02*b00 + a12*b01 + a22*b02;
      m[3] = a03*b00 + a13*b01 + a23*b02;
      m[4] = a00*b10 + a10*b11 + a20*b12;
      m[5] = a01*b10 + a11*b11 + a21*b12;
      m[6] = a02*b10 + a12*b11 + a22*b12;
      m[7] = a03*b10 + a13*b11 + a23*b12;
      m[8] = a00*b20 + a10*b21 + a20*b22;
      m[9] = a01*b20 + a11*b21 + a21*b22;
      m[10] = a02*b20 + a12*b21 + a22*b22;
      m[11] = a03*b20 + a13*b21 + a23*b22;
      return m;
    }
    m.rotateX = function(angle) {
      var s = Math.sin(angle);
      var c = Math.cos(angle);
      var a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
      var a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
      m[4] = a10*c + a20*s;
      m[5] = a11*c + a21*s;
      m[6] = a12*c + a22*s;
      m[7] = a13*c + a23*s;
      m[8] = a10*-s + a20*c;
      m[9] = a11*-s + a21*c;
      m[10] = a12*-s + a22*c;
      m[11] = a13*-s + a23*c;
      return m;
    }
    m.rotateY = function(angle) {
      var s = Math.sin(angle);
      var c = Math.cos(angle);
      var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
      var a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
      m[0] = a00*c + a20*-s;
      m[1] = a01*c + a21*-s;
      m[2] = a02*c + a22*-s;
      m[3] = a03*c + a23*-s;
      m[8] = a00*s + a20*c;
      m[9] = a01*s + a21*c;
      m[10] = a02*s + a22*c;
      m[11] = a03*s + a23*c;
      return m;
    }
    m.rotateZ = function(angle) {
      var s = Math.sin(angle);
      var c = Math.cos(angle);
      var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
      var a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
      m[0] = a00*c + a10*s;
      m[1] = a01*c + a11*s;
      m[2] = a02*c + a12*s;
      m[3] = a03*c + a13*s;
      m[4] = a00*-s + a10*c;
      m[5] = a01*-s + a11*c;
      m[6] = a02*-s + a12*c;
      m[7] = a03*-s + a13*c;
      return m;
    }
    m.rotateXYZ = function(x, y, z) {
      return m.rotateX(x).rotateY(y).rotateZ(z);
    }
    m.frustum = function(left, right, bottom, top, near, far) {
      var rl = (right - left);
      var tb = (top - bottom);
      var fn = (far - near);
      m[0] = (near*2) / rl;
      m[1] = 0;
      m[2] = 0;
      m[3] = 0;
      m[4] = 0;
      m[5] = (near*2) / tb;
      m[6] = 0;
      m[7] = 0;
      m[8] = (right + left) / rl;
      m[9] = (top + bottom) / tb;
      m[10] = -(far + near) / fn;
      m[11] = -1;
      m[12] = 0;
      m[13] = 0;
      m[14] = -(far*near*2) / fn;
      m[15] = 0;
      return m;
    }
    m.perspective = function(fovy, aspect, near, far) {
      var top = near*Math.tan(fovy*Math.PI / 360.0);
      var right = top*aspect;
      return m.frustum(-right, right, -top, top, near, far);
    }
    m.ortho = function(left, right, bottom, top, near, far) {
      var rl = (right - left);
      var tb = (top - bottom);
      var fn = (far - near);
      m[0] = 2 / rl;
      m[1] = 0;
      m[2] = 0;
      m[3] = 0;
      m[4] = 0;
      m[5] = 2 / tb;
      m[6] = 0;
      m[7] = 0;
      m[8] = 0;
      m[9] = 0;
      m[10] = -2 / fn;
      m[11] = 0;
      m[12] = -(left + right) / rl;
      m[13] = -(top + bottom) / tb;
      m[14] = -(far + near) / fn;
      m[15] = 1;
      return m;
    }
    m.lookAt = function(eye, center, up) {
      var z = vec3(eye).direction(center);
      if (z[0] == 0 && z[1] == 0 && z[2] == 0) {
        return m.identity();
      }
      var x = up.cross(z).normalize();
      var y = z.cross(x).normalize();

      m[0] = x[0];
      m[1] = y[0];
      m[2] = z[0];
      m[3] = 0;
      m[4] = x[1];
      m[5] = y[1];
      m[6] = z[1];
      m[7] = 0;
      m[8] = x[2];
      m[9] = y[2];
      m[10] = z[2];
      m[11] = 0;
      m[12] = -eye.dot(x);
      m[13] = -eye.dot(y);
      m[14] = -eye.dot(z);
      m[15] = 1;
      return m;
    }
    m.str = function() {
      return '[' + m[0] + ', ' + m[1] + ', ' + m[2] + ', ' + m[3] +
        ', '+ m[4] + ', ' + m[5] + ', ' + m[6] + ', ' + m[7] +
        ', '+ m[8] + ', ' + m[9] + ', ' + m[10] + ', ' + m[11] +
        ', '+ m[12] + ', ' + m[13] + ', ' + m[14] + ', ' + m[15] + ']';
    }
    return m;
  }

  window.quat = function(quat) {
    var q = new Float32Array(4);
    if (quat) {
      q[0] = quat[0];
      q[1] = quat[1];
      q[2] = quat[2];
      q[3] = quat[3];
    }
    q.calculateW = function() {
      q[3] = -Math.sqrt(Math.abs(1.0 - q[0]*q[0] - q[1]*q[1] - q[2]*q[2]));
      return q;
    }
    q.inverse = function() {
      q[0] = -q[0];
      q[1] = -q[1];
      q[2] = -q[2];
      return q;
    }
    q.module = function() {
      return Math.sqrt(q[0]*q[0] + q[1]*q[1] + q[2]*q[2]);
    }
    q.normalize = function() {
      var len = q.module;
      if (len == 0) {
        q[0] = q[1] = q[2] = q[3] = 0;
        return q;
      }
      q[0] /= len;
      q[1] /= len;
      q[2] /= len;
      q[3] /= len;
      return q;
    }
    q.multiply = function(qua) {
      var qax = q[0], qay = q[1], qaz = q[2], qaw = q[3];
      var qbx = qua[0], qby = qua[1], qbz = qua[2], qbw = qua[3];
      q[0] = qax*qbw + qaw*qbx + qay*qbz - qaz*qby;
      q[1] = qay*qbw + qaw*qby + qaz*qbx - qax*qbz;
      q[2] = qaz*qbw + qaw*qbz + qax*qby - qay*qbx;
      q[3] = qaw*qbw - qax*qbx - qay*qby - qaz*qbz;
      return q;
    }
    q.multvec3 = function(vec) {
      var x = vec[0], y = vec[1], z = vec[2];
      var qx = q[0], qy = q[1], qz = q[2], qw = q[3];

      // calculate quat * vec
      var ix = qw*x + qy*z - qz*y;
      var iy = qw*y + qz*x - qx*z;
      var iz = qw*z + qx*y - qy*x;
      var iw = -qx*x - qy*y - qz*z;

      // calculate result * inverse quat
      q[0] = ix*qw + iw*-qx + iy*-qz - iz*-qy;
      q[1] = iy*qw + iw*-qy + iz*-qx - ix*-qz;
      q[2] = iz*qw + iw*-qz + ix*-qy - iy*-qx;
      return q;
    }
    q.mat4 = function() {
      var out = mat4();
      var x = q[0], y = q[1], z = q[2], w = q[3];

      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;

      var xx = x*x2;
      var xy = x*y2;
      var xz = x*z2;

      var yy = y*y2;
      var yz = y*z2;
      var zz = z*z2;

      var wx = w*x2;
      var wy = w*y2;
      var wz = w*z2;

      out[0] = 1 - (yy + zz);
      out[1] = xy - wz;
      out[2] = xz + wy;
      out[3] = 0;

      out[4] = xy + wz;
      out[5] = 1 - (xx + zz);
      out[6] = yz - wx;
      out[7] = 0;

      out[8] = xz - wy;
      out[9] = yz + wx;
      out[10] = 1 - (xx + yy);
      out[11] = 0;

      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    q.slerp = function(qua, slerp) {
      var cosHalfTheta =  q[0]*qua[0] + q[1]*qua[1] + q[2]*qua[2] + q[3]*qua[3];

      if (Math.abs(cosHalfTheta) >= 1.0) {
        return quat(q);
      }

      var halfTheta = Math.acos(cosHalfTheta);
      var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta*cosHalfTheta);

      var ratioA, ratioB;

      if (Math.abs(sinHalfTheta) < 0.001){
        ratioA = 0.5;
        ratioB = 0.5;
      } else {
        ratioA = Math.sin((1 - slerp)*halfTheta) / sinHalfTheta;
        ratioB = Math.sin(slerp*halfTheta) / sinHalfTheta;
      }

      var out = quat(q);
      out[0] = (q[0]*ratioA + qua[0]*ratioB);
      out[1] = (q[1]*ratioA + qua[1]*ratioB);
      out[2] = (q[2]*ratioA + qua[2]*ratioB);
      out[3] = (q[3]*ratioA + qua[3]*ratioB);
      return out;
    }
    q.str = function() {
      return '[' + q[0] + ', ' + q[1] + ', ' + q[2] + ', ' + q[3] + ']';
    }
    return q;
  }
})();