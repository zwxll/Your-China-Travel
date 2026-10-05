// Button-only adaptation of Meng To's Nexus Tactile Fluidics reference.
window.initTactileButton=function(button){
  const canvas=button.querySelector('canvas'),gl=canvas.getContext('webgl',{alpha:false});
  const fallback=()=>{canvas.hidden=true;return {setActive(){}};};
  if(!gl) return fallback();
  const vertex='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fragment=`
    precision mediump float;
    uniform vec2 u_res;
    uniform float u_time,u_level,u_tilt,u_slosh;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
    float noise(vec2 p){
      vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
    }
    float fbm(vec2 p){
      float v=0.,a=.5;
      for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.04+vec2(11.3,7.1);a*=.5;}
      return v;
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res;
      float x=uv.x*u_res.x/u_res.y,t=u_time,amp=.012+u_slosh*.045;
      float surf=u_level+u_tilt*(uv.x-.5)*.34
        +amp*sin(x*5.1+t*4.6)+amp*.62*sin(x*9.7-t*6.8+1.7)+amp*.38*sin(x*14.3+t*8.9+4.2);
      float d=surf-uv.y;
      vec3 col=mix(vec3(.03,.06,.1),vec3(.05,.09,.15),uv.y);
      col+=vec3(.02,.05,.1)*pow(max(0.,1.-abs(uv.y-.88)*6.),2.);
      float inside=smoothstep(0.,.012,d),depth=clamp(d/max(u_level,.001),0.,1.);
      vec3 liq=mix(vec3(0.,.9,1.),vec3(.02,.15,.45),depth);
      liq*=.8+.42*fbm(vec2(x*4.2,(uv.y+t*.14)*4.2));
      liq+=vec3(.02,.25,.35)*pow(max(0.,d*3.),1.5)*u_slosh;
      col=mix(col,liq,inside);
      col+=vec3(.4,.9,1.)*exp(-abs(d)*80.)*.85;
      col+=vec3(.8,.98,1.)*exp(-abs(d)*220.)*.5;
      vec2 e=uv*(1.-uv);col*=.55+.45*pow(e.x*e.y*16.,.22);
      gl_FragColor=vec4(col,1.);
    }`;
  const program=gl.createProgram();
  for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) return fallback();
    gl.attachShader(program,shader);gl.deleteShader(shader);
  }
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)) return fallback();
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
  const uniforms=Object.fromEntries(['res','time','level','tilt','slosh'].map(name=>[name,gl.getUniformLocation(program,'u_'+name)]));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let enabled=true,visible=false,raf=0,last=0,time=0,level=.56,gulp=0,slosh=.4,tilt=0,target=0,lastX=null;
  function draw(now){
    raf=0;
    const dt=last?Math.min(.05,(now-last)/1000):0;last=now;time+=dt;
    slosh*=Math.exp(-1.5*dt);gulp*=Math.exp(-1.1*dt);
    tilt+=(target-tilt)*Math.min(1,dt*5);level+=(.56-.36*gulp-level)*Math.min(1,dt*5.5);
    const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.round(button.clientWidth*dpr)),h=Math.max(1,Math.round(button.clientHeight*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
    gl.uniform2f(uniforms.res,w,h);gl.uniform1f(uniforms.time,reduced.matches?2:time);
    gl.uniform1f(uniforms.level,reduced.matches?.56:level);gl.uniform1f(uniforms.tilt,reduced.matches?0:tilt);
    gl.uniform1f(uniforms.slosh,reduced.matches?.25:slosh);gl.drawArrays(gl.TRIANGLES,0,3);
    if(!reduced.matches) raf=requestAnimationFrame(draw);
  }
  function refresh(){
    if(raf) cancelAnimationFrame(raf);raf=0;last=0;
    if(enabled&&visible&&!document.hidden&&!canvas.hidden) raf=requestAnimationFrame(draw);
  }
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();});observer.observe(button);
  new ResizeObserver(refresh).observe(button);
  document.addEventListener('visibilitychange',refresh);reduced.addEventListener('change',refresh);
  button.addEventListener('pointermove',e=>{
    if(reduced.matches) return;
    const rect=button.getBoundingClientRect(),x=(e.clientX-rect.left)/Math.max(1,rect.width);
    if(lastX!==null) slosh=Math.min(1.4,slosh+Math.abs(x-lastX)*2.6);
    lastX=x;target=Math.max(-1,Math.min(1,(x-.5)*2));
  });
  button.addEventListener('pointerleave',()=>{lastX=null;target=0;});
  button.addEventListener('focus',()=>{slosh=Math.min(1.4,slosh+.5);});
  button.addEventListener('click',()=>{gulp=1;slosh=Math.min(1.4,slosh+.7);});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();canvas.hidden=true;refresh();});
  return {setActive(value){enabled=value;refresh();}};
};
