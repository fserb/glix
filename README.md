
glix - a Minimalist WebGL Framework
===================================

glix works by returning an extended version of the GL context.

### this is still in very early stage of development. API will change in the future. ###

Check the `examples/` directory for a few basic examples on how to use *glix*.


API overview
------------

You can start using it *glix* on a canvas with id `canvasid` with:

    var gl = glix("canvasid");

all default gl context objects are exposed. In aditional *glix* provides:

**gl.program** reads and compiles shaders and programs. To read a vertex shader from a `script` tag with id `shader-vert-script-id` and to load a fragment shader from a `frag.shader` file, use:

    gl.program("myprogram").vert("#shader-vert-script-id").frag("frag.shader");

loads a program, compiles it. To run it:

    gl.program("myprogram").use();

**gl.vertex** manages vertex data buffer. To load 4 vertices with 3 values:

    var vertices = [ 0, 0, 1,  0, 1, 0,  1, 0, 0,  1, 1, 1 ];
    gl.vertex("triangle").data(vertices, 3);

assign the data to a `vertexPosition` shader attribute:

    gl.assign("triangle").vertexPosition(0);

**gl.elements** manages elements data buffer.

    gl.elements("el").data([ 0, 1, 2]);
    gl.elements("el").data(gl.TRIANGLES);

**gl.texture** loads texture data.

    gl.texture("text", 0).image("text.png").filter(gl.NEAREST, gl.NEAREST);

and assign to a shader uniform 2D sampler `uSampler`:

    gl.assign("text").uSampler();

**gl.requestFrame** encapsulates RequestAnimationFrame.


Notes
-----

Includes a modified version of glmatrix.js by Brandon Jones.
