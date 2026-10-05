/* Lightfall adapted for this website from React Bits:
 * https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/Lightfall/Lightfall.jsx
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

// User's three colors; upstream default speed, streaks, density and zoom.
// No pointer interaction: only the original foreground handles input.
export const LIGHTFALL_FS = `#version 300 es
precision highp float;
uniform vec2 uLightfallRes;
uniform float uLightfallTime;
in vec2 vUv;out vec4 o;
vec3 palette(float h){
  if(h<1./3.)return vec3(3.,91.,234.)/255.;
  if(h<2./3.)return vec3(55.,10.,234.)/255.;
  return vec3(230.,12.,223.)/255.;
}
vec3 tanhv(vec3 x){vec3 e=exp(-2.*x);return (1.-e)/(1.+e);}
vec2 sceneC(vec2 frag,vec2 r){
  vec2 p=(frag+frag-r)/r.x;float z=0.,d=1e3;vec4 q=vec4(0.);
  for(int k=0;k<39;k++){
    if(d<=1e-4)break;
    q=z*normalize(vec4(p,3.,0.))-vec4(0.,4.,1.,0.)/4.5;
    d=1.-sqrt(length(q*q));z+=d;
  }
  return vec2(q.x,atan(q.z,q.y));
}
void main(){
  vec2 r=uLightfallRes,C=vUv*r,uv0=(C+C-r)/r.x;
  float t=.05*uLightfallTime+9.;
  vec2 y=vec2(.005,6.28318530718/4.);
  vec2 c0=sceneC(C,r),dx=sceneC(C+vec2(1.,0.),r)-c0,dy=sceneC(C+vec2(0.,1.),r)-c0;
  dx.y-=6.28318530718*floor(dx.y/6.28318530718+.5);
  dy.y-=6.28318530718*floor(dy.y/6.28318530718+.5);
  vec2 fw=abs(dx)+abs(dy);C=c0;
  vec2 p=vec2(2.,1.)*uv0-(r/r.x)*vec2(0.,1.);
  vec3 col=vec3(10.,41.,255.)/255.*45./(1e3*dot(p,p)+6.);
  float zr=.0005;vec2 rr=vec2(max(length(fw),1e-5));
  for(int m=0;m<2;m++){
    float jf=float(m)+1.;
    float ic=fract(sin(dot(vec2(jf,floor(C.x/y.x+.5)),vec2(7.,11.))*73.));
    vec2 pp=C-(t+t*ic)*vec2(0.,1.);pp-=floor(pp/y+.5)*y;
    float h=fract(8663.*ic),weight=1.+sin(t+7.*h+4.);
    vec2 inner=vec2(length(max(pp,vec2(-1.,0.))),length(pp)-zr)-zr;
    vec2 sm=vec2(1.)-smoothstep(-rr,rr,inner);
    col+=dot(sm,vec2(exp(19.*pp.y),3.))*palette(h)*weight;
    C.x+=y.x/8.;
  }
  o=vec4(sqrt(tanhv(max(col-vec3(.04,.08,.02),0.))),1.);
}`;
