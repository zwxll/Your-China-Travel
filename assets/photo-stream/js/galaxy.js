/* Galaxy shader adapted for this website from React Bits:
 * https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/Galaxy/Galaxy.jsx
 * MIT + Commons Clause License Condition v1.0
 * Copyright (c) 2026 David Haz
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, and distribute the Software as part of
 * an application, website, or product, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * Commons Clause Restriction: You may use this Software, including for any
 * commercial purpose, so long as you do not sell, sublicense, or redistribute
 * the components themselves-whether alone, in a bundle, or as a ported version.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Default neutral stars, with density 1.1 / twinkle .4 and no mouse disturbance.
const GALAXY_FRAGMENT = `
precision highp float;
uniform vec2 resolution;
uniform float time;
#define MAT45 mat2(.7071,-.7071,.7071,.7071)
float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float tri(float x){return abs(fract(x)*2.-1.);}
float tris(float x){return 1.-smoothstep(0.,1.,abs(2.*fract(x)-1.));}
float star(vec2 uv,float flare){
  float d=length(uv),m=.015/max(d,.0001);
  m+=smoothstep(0.,1.,1.-abs(uv.x*uv.y*1000.))*flare*.3;
  uv*=MAT45;
  m+=smoothstep(0.,1.,1.-abs(uv.x*uv.y*1000.))*flare*.09;
  return m*(1.-smoothstep(.2,1.,d));
}
vec3 layer(vec2 uv){
  vec3 col=vec3(0.);vec2 gv=fract(uv)-.5,id=floor(uv);
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
    vec2 offset=vec2(float(x),float(y)),si=id+offset;
    float seed=hash21(si),size=fract(seed*345.32);
    float flare=smoothstep(.9,1.,size)*tri(time*.05/(3.*seed+1.));
    float red=smoothstep(.2,1.,hash21(si+1.))+.2;
    float blu=smoothstep(.2,1.,hash21(si+3.))+.2;
    vec2 pad=vec2(tris(seed*34.+time/10.),tris(seed*38.+time/30.))-.5;
    float twinkle=mix(1.,tris(time+seed*6.2831)+.5,.4);
    col+=star(gv-offset-pad,flare)*size*max(red,blu)*twinkle;
  }return col;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;
  float a=time*.1;uv=mat2(cos(a),-sin(a),sin(a),cos(a))*uv;
  vec3 col=vec3(0.);
  for(int i=0;i<4;i++){
    float n=float(i)*.25,depth=fract(n+time*.05);
    col+=layer(uv*mix(22.,.55,depth)+n*453.32)*depth*(1.-smoothstep(.9,1.,depth));
  }
  gl_FragColor=vec4(col,min(smoothstep(0.,.3,length(col)),1.));
}`;

export class StoryGalaxy {
  constructor(host) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'story-galaxy';
    this.canvas.setAttribute('aria-hidden', 'true');
    const gl = this.gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false });
    if (!gl) return; // Keep the existing dark backdrop on unsupported devices.
    const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].map((type, i) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, i ? GALAXY_FRAGMENT : 'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}');
      gl.compileShader(shader);return shader;
    });
    this.program = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(this.program, shader));
    gl.linkProgram(this.program);
    shaders.forEach(shader => gl.deleteShader(shader));
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) { gl.deleteProgram(this.program); this.gl = null; return; }
    gl.useProgram(this.program);
    this.buffer = gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    this.resolution = gl.getUniformLocation(this.program, 'resolution');
    this.time = gl.getUniformLocation(this.program, 'time');
    host.appendChild(this.canvas);
    this.elapsed = 0;this.drawn = false;
    addEventListener('pagehide', event => {
      if (event.persisted || !this.gl) return;
      gl.deleteBuffer(this.buffer);gl.deleteProgram(this.program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();this.gl = null;
    });
  }
  draw(dt, animate) {
    const gl = this.gl;
    if (!gl || document.hidden) return;
    const ratio = Math.min(1, Math.sqrt(900000 / (innerWidth * innerHeight)));
    const w = Math.round(innerWidth * ratio), h = Math.round(innerHeight * ratio);
    const resized = this.canvas.width !== w || this.canvas.height !== h;
    if (resized) { this.canvas.width = w;this.canvas.height = h; }
    if (this.drawn && !animate && !resized) return;
    if (animate) this.elapsed += dt;
    gl.viewport(0, 0, w, h);gl.useProgram(this.program);
    gl.uniform2f(this.resolution, w, h);gl.uniform1f(this.time, this.elapsed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);this.drawn = true;
  }
}
