var Album3DReader=(()=>{var mh=Object.create;var Cs=Object.defineProperty;var gh=Object.getOwnPropertyDescriptor;var _h=Object.getOwnPropertyNames;var xh=Object.getPrototypeOf,yh=Object.prototype.hasOwnProperty;var vh=(i,t)=>()=>(t||i((t={exports:{}}).exports,t),t.exports),Mh=(i,t)=>{for(var e in t)Cs(i,e,{get:t[e],enumerable:!0})},dc=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of _h(t))!yh.call(i,s)&&s!==e&&Cs(i,s,{get:()=>t[s],enumerable:!(n=gh(t,s))||n.enumerable});return i};var pc=(i,t,e)=>(e=i!=null?mh(xh(i)):{},dc(t||!i||!i.__esModule?Cs(e,"default",{value:i,enumerable:!0}):e,i)),bh=i=>dc(Cs({},"__esModule",{value:!0}),i);var Qa=vh((Ss,Ka)=>{/*! three.modifiers-v2.5.7 */(function(i,t){if(typeof Ss=="object"&&typeof Ka=="object")Ka.exports=t();else if(typeof define=="function"&&define.amd)define([],t);else{var e=t();for(var n in e)(typeof Ss=="object"?Ss:i)[n]=e[n]}})(typeof self<"u"?self:Ss,function(){return(function(i){function t(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return i[n].call(s.exports,s,s.exports,t),s.l=!0,s.exports}var e={};return t.m=i,t.c=e,t.d=function(n,s,r){t.o(n,s)||Object.defineProperty(n,s,{configurable:!1,enumerable:!0,get:r})},t.n=function(n){var s=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(s,"a",s),s},t.o=function(n,s){return Object.prototype.hasOwnProperty.call(n,s)},t.p="",t(t.s=7)})([function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Modifier=void 0;var n=(function(){function s(){}return s.prototype.setModifiable=function(r){this.mod=r},s.prototype.getVertices=function(){return this.mod.getVertices()},s.prototype.destroy=function(){this.mod=null},s})();t.Modifier=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Vector3=void 0;var n=(function(){function s(r,o,a){r===void 0&&(r=0),o===void 0&&(o=0),a===void 0&&(a=0),this.x=r,this.y=o,this.z=a}return s.prototype.clone=function(){return new s(this.x,this.y,this.z)},s.prototype.equals=function(r){return this.x==r.x&&this.y==r.y&&this.z==r.z},s.prototype.zero=function(){this.x=this.y=this.z=0},s.prototype.negate=function(){return new s(-this.x,-this.y,-this.z)},s.prototype.add=function(r){return new s(this.x+r.x,this.y+r.y,this.z+r.z)},s.prototype.subtract=function(r){return new s(this.x-r.x,this.y-r.y,this.z-r.z)},s.prototype.multiplyScalar=function(r){return new s(this.x*r,this.y*r,this.z*r)},s.prototype.multiply=function(r){return new s(this.x*r.x,this.y*r.y,this.z*r.z)},s.prototype.divide=function(r){var o=1/r;return new s(this.x*o,this.y*o,this.z*o)},s.prototype.normalize=function(){var r=this.x*this.x+this.y*this.y+this.z*this.z;if(r>0){var o=1/Math.sqrt(r);this.x*=o,this.y*=o,this.z*=o}},Object.defineProperty(s.prototype,"magnitude",{get:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},set:function(r){this.normalize(),this.x*=r,this.y*=r,this.z*=r},enumerable:!1,configurable:!0}),s.prototype.fromBufferAttribute=function(r,o){return this.x=r.getX(o),this.y=r.getY(o),this.z=r.getZ(o),this},s.prototype.toString=function(){return"["+this.x+" , "+this.y+" , "+this.z+"]"},s.sum=function(r,o){return r.add(o)},s.dot=function(r,o){return r.x*o.x+r.y*o.y+r.z*o.z},s.cross=function(r,o){return new s(r.y*o.z-r.z*o.y,r.z*o.x-r.x*o.z,r.x*o.y-r.y*o.x)},s.distance=function(r,o){var a=r.x-o.x,l=r.y-o.y,c=r.z-o.z;return Math.sqrt(a*a+l*l+c*c)},s.ZERO=new s(0,0,0),s})();t.Vector3=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ModConstant=void 0;var n=(function(){function s(){}return s.NONE=0,s.X=1,s.Y=2,s.Z=4,s.LEFT=-1,s.RIGHT=1,s})();t.ModConstant=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.TMath=void 0;var n=(function(){function s(){}return s.normalize=function(r,o,a){var l=o-r;return l==0?1:s.trim(0,1,(a-r)/o)},s.toRange=function(r,o,a){var l=o-r;return l==0?0:r+(o-r)*a},s.inInRange=function(r,o,a,l){return l===void 0&&(l=!1),l?a>=r&&a<=o:a>r&&a<o},s.sign=function(r,o){return o===void 0&&(o=0),r==0?o:r>0?1:-1},s.trim=function(r,o,a){return Math.min(o,Math.max(r,a))},s.wrap=function(r,o,a){return a<r?a+(o-r):a>=o?a-(o-r):a},s.degToRad=function(r){return r/180*Math.PI},s.radToDeg=function(r){return r/Math.PI*180},s.presicion=function(r,o){var a=Math.pow(10,o);return Math.round(r*a)/a},s.uceil=function(r){return r<0?Math.floor(r):Math.ceil(r)},s.mappedKey=function(r){var o=Math.pow(10,4);return Math.round(r.x*o)+"_"+Math.round(r.y*o)+"_"+Math.round(r.z*o)},s.PI=3.1415,s})();t.TMath=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Matrix4=void 0;var n=(function(){function s(r,o,a,l,c,h,f,u,d,p,y,g,m,S,C,v){r===void 0&&(r=1),o===void 0&&(o=0),a===void 0&&(a=0),l===void 0&&(l=0),c===void 0&&(c=0),h===void 0&&(h=1),f===void 0&&(f=0),u===void 0&&(u=0),d===void 0&&(d=0),p===void 0&&(p=0),y===void 0&&(y=1),g===void 0&&(g=0),m===void 0&&(m=0),S===void 0&&(S=0),C===void 0&&(C=0),v===void 0&&(v=1),this.n11=r,this.n12=o,this.n13=a,this.n14=l,this.n21=c,this.n22=h,this.n23=f,this.n24=u,this.n31=d,this.n32=p,this.n33=y,this.n34=g,this.n41=m,this.n42=S,this.n43=C,this.n44=v}return s.translationMatrix=function(r,o,a){var l=new s;return l.n14=r,l.n24=o,l.n34=a,l},s.scaleMatrix=function(r,o,a){var l=new s;return l.n11=r,l.n22=o,l.n33=a,l},s.rotationMatrix=function(r,o,a,l,c){c===void 0&&(c=null);var h;h=c||new s;var f=Math.cos(l),u=Math.sin(l),d=1-f,p=r*o*d,y=o*a*d,g=r*a*d,m=u*a,S=u*o,C=u*r;return h.n11=f+r*r*d,h.n12=-m+p,h.n13=S+g,h.n14=0,h.n21=m+p,h.n22=f+o*o*d,h.n23=-C+y,h.n24=0,h.n31=-S+g,h.n32=C+y,h.n33=f+a*a*d,h.n34=0,h},s.prototype.calculateMultiply=function(r,o){var a=r.n11,l=o.n11,c=r.n21,h=o.n21,f=r.n31,u=o.n31,d=r.n12,p=o.n12,y=r.n22,g=o.n22,m=r.n32,S=o.n32,C=r.n13,v=o.n13,E=r.n23,A=o.n23,R=r.n33,x=o.n33,w=r.n14,D=o.n14,L=r.n24,N=o.n24,J=r.n34,$=o.n34;this.n11=a*l+d*h+C*u,this.n12=a*p+d*g+C*S,this.n13=a*v+d*A+C*x,this.n14=a*D+d*N+C*$+w,this.n21=c*l+y*h+E*u,this.n22=c*p+y*g+E*S,this.n23=c*v+y*A+E*x,this.n24=c*D+y*N+E*$+L,this.n31=f*l+m*h+R*u,this.n32=f*p+m*g+R*S,this.n33=f*v+m*A+R*x,this.n34=f*D+m*N+R*$+J},s.multiply=function(r,o){var a=new s;return a.calculateMultiply(r,o),a},s.multiplyVector=function(r,o){var a=o.x,l=o.y,c=o.z;o.x=a*r.n11+l*r.n12+c*r.n13+r.n14,o.y=a*r.n21+l*r.n22+c*r.n23+r.n24,o.z=a*r.n31+l*r.n32+c*r.n33+r.n34},s})();t.Matrix4=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Vector2=void 0;var n=(function(){function s(r,o){this.x=r,this.y=o}return s.prototype.clone=function(){return new s(this.x,this.y)},s.prototype.equals=function(r){return this.x==r.x&&this.y==r.y},s.prototype.zero=function(){this.x=this.y},s.prototype.negate=function(){return new s(-this.x,-this.y)},s.prototype.add=function(r){return new s(this.x+r.x,this.y+r.y)},s.prototype.subtract=function(r){return new s(this.x-r.x,this.y-r.y)},s.prototype.multiplyScalar=function(r){return new s(this.x*r,this.y*r)},s.prototype.multiply=function(r){return new s(this.x*r.x,this.y*r.y)},s.prototype.divide=function(r){var o=1/r;return new s(this.x*o,this.y*o)},s.prototype.normalize=function(){var r=this.x*this.x+this.y*this.y;if(r>0){var o=1/Math.sqrt(r);this.x*=o,this.y*=o}},Object.defineProperty(s.prototype,"magnitude",{get:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},set:function(r){this.normalize(),this.x*=r,this.y*=r},enumerable:!1,configurable:!0}),s.prototype.toString=function(){return"["+this.x+" , "+this.y+"]"},s.sum=function(r,o){return r.add(o)},s.dot=function(r,o){return r.x*o.x+r.y*o.y},s.distance=function(r,o){var a=r.x-o.x,l=r.y-o.y;return Math.sqrt(a*a+l*l)},s.ZERO=new s(0,0),s})();t.Vector2=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Range=void 0;var n=e(3),s=(function(){function r(o,a){o===void 0&&(o=0),a===void 0&&(a=1),this._start=o,this._end=a}return Object.defineProperty(r.prototype,"start",{get:function(){return this._start},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"end",{get:function(){return this._end},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"size",{get:function(){return this._end-this._start},enumerable:!1,configurable:!0}),r.prototype.move=function(o){this._start+=o,this._end+=o},r.prototype.isIn=function(o){return o>=this._start&&o<=this._end},r.prototype.normalize=function(o){return n.TMath.normalize(this._start,this._end,o)},r.prototype.toRange=function(o){return n.TMath.toRange(this._start,this._end,o)},r.prototype.trim=function(o){return n.TMath.trim(this._start,this._end,o)},r.prototype.interpolate=function(o,a){return this.toRange(a.normalize(o))},r.prototype.toString=function(){return"["+this.start+" - "+this.end+"]"},r})();t.Range=s},function(i,t,e){i.exports=e(8)},function(i,t,e){"use strict";var n=this&&this.__createBinding||(Object.create?function(r,o,a,l){l===void 0&&(l=a),Object.defineProperty(r,l,{enumerable:!0,get:function(){return o[a]}})}:function(r,o,a,l){l===void 0&&(l=a),r[l]=o[a]}),s=this&&this.__exportStar||function(r,o){for(var a in r)a==="default"||Object.prototype.hasOwnProperty.call(o,a)||n(o,r,a)};Object.defineProperty(t,"__esModule",{value:!0}),s(e(9),t),s(e(16),t),s(e(6),t),s(e(5),t),s(e(1),t),s(e(3),t),s(e(2),t),s(e(17),t),s(e(19),t),s(e(20),t),s(e(21),t),s(e(25),t),s(e(26),t),s(e(27),t),s(e(28),t),s(e(29),t),s(e(30),t),s(e(31),t)},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ModifierStack=void 0;var n=e(10),s=(function(){function r(o){this.baseMesh=new n.ThreeMesh,this.baseMesh.setMesh(o),this.baseMesh.analyzeGeometry(),this.stack=[]}return Object.defineProperty(r.prototype,"indexUpdate",{set:function(o){this.baseMesh.indexUpdate=o},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"boundUpdate",{set:function(o){this.baseMesh.boundUpdate=o},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"uvsAndColorUpdate",{set:function(o){this.baseMesh.uvsAndColorUpdate=o},enumerable:!1,configurable:!0}),r.prototype.addModifier=function(o){o.setModifiable(this.baseMesh),this.stack.push(o)},r.prototype.removeModifier=function(o){var a=this.stack.indexOf(o);a>-1&&this.stack.splice(a,1)},r.prototype.apply=function(){this.baseMesh.resetGeometry();for(var o=0;o<this.stack.length;o++)this.stack[o].apply();this.baseMesh.postApply()},r.prototype.collapse=function(){this.apply(),this.baseMesh.collapseGeometry(),this.stack.length=0},r.prototype.reset=function(){this.baseMesh.resetGeometry()},r.prototype.clear=function(){this.stack.length=0},r.prototype.destroy=function(){this.baseMesh.destroy();for(var o=0;o<this.stack.length;o++)this.stack[o].destroy();this.clear()},r})();t.ModifierStack=s},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var f=function(u,d){return(f=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(p,y){p.__proto__=y}||function(p,y){for(var g in y)Object.prototype.hasOwnProperty.call(y,g)&&(p[g]=y[g])})(u,d)};return function(u,d){function p(){this.constructor=u}if(typeof d!="function"&&d!==null)throw new TypeError("Class extends value "+String(d)+" is not a constructor or null");f(u,d),u.prototype=d===null?Object.create(d):(p.prototype=d.prototype,new p)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.ThreeMesh=void 0;var s=e(11),r=e(13),o=e(14),a=e(3),l=e(1),c=e(15),h=(function(f){function u(){var d=f!==null&&f.apply(this,arguments)||this;return d.verticesMap=new c.TMap,d.uvsAndColorUpdate=!1,d}return n(u,f),u.prototype.setMesh=function(d){this.mesh=d,this.setVertices(),this.setFaces(),this.mergeVertices(),this.mergeFaces()},u.prototype.setVertices=function(){for(var d=this.getAttr("position"),p=0;p<d.count;p++){var y=new s.ThreeVertex,g=new l.Vector3().fromBufferAttribute(d,p);y.setVertex(g),this.vertices.push(y)}},u.prototype.setFaces=function(){var d=this.getAttr("index"),p=this.getAttr("position");if(d!==null)for(var y=0;y<d.count;y+=3){var g=new o.FaceProxy,m=d.getX(y),S=d.getX(y+1),C=d.getX(y+2),v=this.vertices[m],E=this.vertices[S],A=this.vertices[C];g.addVertices(v,E,A),this.faces.push(g)}else for(var y=0;y<p.count;y+=3){var g=new o.FaceProxy,m=y,S=y+1,C=y+2,v=this.vertices[m],E=this.vertices[S],A=this.vertices[C];g.addVertices(v,E,A),this.faces.push(g)}},u.prototype.mergeVertices=function(){for(var d=[],p=this.verticesMap,y=0;y<this.vertices.length;y++){var g=this.vertices[y],m=a.TMath.mappedKey(g);if(p.includeByValue(m)){var S=p.getToByValue(m);p.add(S,y,m)}else{var S=d.length;g.only=!0,d.push(g),p.add(S,y,m)}}this.vertices=d},u.prototype.mergeFaces=function(){for(var d=[],p=0,y=this.faces.length;p<y;p++){var g=this.faces[p],m=a.TMath.mappedKey(g.a),S=a.TMath.mappedKey(g.b),C=a.TMath.mappedKey(g.c),v=this.verticesMap.getToByValue(m),E=this.verticesMap.getToByValue(S),A=this.verticesMap.getToByValue(C);g.a=this.vertices[v],g.b=this.vertices[E],g.c=this.vertices[A];for(var R=[v,E,A],x=0;x<3;x++)if(R[x]===R[(x+1)%3]){d.push(p);break}}for(var p=d.length-1;p>=0;p--){var w=d[p];this.faces.splice(w,1)}},u.prototype.postApply=function(){this.updatePosition(),this.updateIndex(),this.computeBounding(),this.updateUvsAndColor()},u.prototype.updateUvsAndColor=function(){if(this.uvsAndColorUpdate){var d=this.getAttr("color");d&&(d.needsUpdate=!0);var p=this.getAttr("uv");p&&(p.needsUpdate=!0)}},u.prototype.computeBounding=function(){if(this.boundUpdate){var d=this.mesh.geometry;d.computeBoundingBox(),d.computeBoundingSphere()}},u.prototype.updatePosition=function(){var d,p,y,g,m,S=this.getAttr("position"),C=this.vertices.length;for(y=0;y<C;y++)for(p=this.vertices[y],d=this.verticesMap.getFromByTo(y),g=0;g<d.length;g++)m=d[g],S.setX(m,p.x),S.setY(m,p.y),S.setZ(m,p.z);S.needsUpdate=!0},u.prototype.updateIndex=function(){if(this.indexUpdate){var d=this.getAttr("index");d&&(d.needsUpdate=!0)}},u.prototype.getAttr=function(d){var p=this.mesh.geometry;return d==="index"?p.getIndex():p.getAttribute(d)},u.prototype.updateMeshPosition=function(d){this.mesh.position.x+=d.x,this.mesh.position.y+=d.y,this.mesh.position.z+=d.z},u.prototype.destroy=function(){f.prototype.destroy.call(this),this.verticesMap.destroy(),this.verticesMap=null,this.mesh=null},u})(r.MeshProxy);t.ThreeMesh=h},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var o=function(a,l){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(c,h){c.__proto__=h}||function(c,h){for(var f in h)Object.prototype.hasOwnProperty.call(h,f)&&(c[f]=h[f])})(a,l)};return function(a,l){function c(){this.constructor=a}if(typeof l!="function"&&l!==null)throw new TypeError("Class extends value "+String(l)+" is not a constructor or null");o(a,l),a.prototype=l===null?Object.create(l):(c.prototype=l.prototype,new c)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.ThreeVertex=void 0;var s=e(12),r=(function(o){function a(){var l=o.call(this)||this;return l.only=!1,l}return n(a,o),a.prototype.setVertex=function(l){this.vertor=l,this.ox=this.vertor.x,this.oy=this.vertor.y,this.oz=this.vertor.z},Object.defineProperty(a.prototype,"x",{get:function(){return this.vertor.x},set:function(l){this.vertor.x=l},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"y",{get:function(){return this.vertor.y},set:function(l){this.vertor.y=l},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"z",{get:function(){return this.vertor.z},set:function(l){this.vertor.z=l},enumerable:!1,configurable:!0}),a.prototype.toString=function(){return o.prototype.toString.call(this)+" only:"+this.only},a})(s.VertexProxy);t.ThreeVertex=r},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VertexProxy=void 0;var n=e(1),s=e(2),r=(function(){function o(){this.id=""}return o.prototype.setVertex=function(a){},o.prototype.setRatios=function(a,l,c){this._ratioX=a,this._ratioY=l,this._ratioZ=c},o.prototype.setOriginalPosition=function(a,l,c){this.ox=a,this.oy=l,this.oz=c},Object.defineProperty(o.prototype,"x",{get:function(){return 0},set:function(a){},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"y",{get:function(){return 0},set:function(a){},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"z",{get:function(){return 0},set:function(a){},enumerable:!1,configurable:!0}),o.prototype.getValue=function(a){switch(a){case s.ModConstant.X:return this.x;case s.ModConstant.Y:return this.y;case s.ModConstant.Z:return this.z}return 0},o.prototype.setValue=function(a,l){switch(a){case s.ModConstant.X:this.x=l;break;case s.ModConstant.Y:this.y=l;break;case s.ModConstant.Z:this.z=l}},Object.defineProperty(o.prototype,"ratioX",{get:function(){return this._ratioX},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"ratioY",{get:function(){return this._ratioY},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"ratioZ",{get:function(){return this._ratioZ},enumerable:!1,configurable:!0}),o.prototype.getRatio=function(a){switch(a){case s.ModConstant.X:return this._ratioX;case s.ModConstant.Y:return this._ratioY;case s.ModConstant.Z:return this._ratioZ}return-1},Object.defineProperty(o.prototype,"originalX",{get:function(){return this.ox},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"originalY",{get:function(){return this.oy},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"originalZ",{get:function(){return this.oz},enumerable:!1,configurable:!0}),o.prototype.getOriginalValue=function(a){switch(a){case s.ModConstant.X:return this.ox;case s.ModConstant.Y:return this.oy;case s.ModConstant.Z:return this.oz}return 0},o.prototype.reset=function(){this.x=this.ox,this.y=this.oy,this.z=this.oz},o.prototype.collapse=function(){this.ox=this.x,this.oy=this.y,this.oz=this.z},Object.defineProperty(o.prototype,"vector",{get:function(){return new n.Vector3(this.x,this.y,this.z)},set:function(a){this.x=a.x,this.y=a.y,this.z=a.z},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"ratioVector",{get:function(){return new n.Vector3(this.ratioX,this.ratioY,this.ratioZ)},enumerable:!1,configurable:!0}),o.prototype.toString=function(){return"Vertex id:"+this.id+" xyz:"+this.x+" "+this.y+" "+this.z},o})();t.VertexProxy=r},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.MeshProxy=void 0;var n=e(2),s=(function(){function r(){this.boundUpdate=!1,this.indexUpdate=!1,this.uvsAndColorUpdate=!1,this.vertices=[],this.faces=[]}return r.prototype.setMesh=function(o){},r.prototype.updateMeshPosition=function(o){},r.prototype.getVertices=function(){return this.vertices},r.prototype.getFaces=function(){return this.faces},r.prototype.analyzeGeometry=function(){for(var o,a=this.getVertices().length,l=0;l<a;l++)o=this.getVertices()[l],l==0?(this._minX=this._maxX=o.x,this._minY=this._maxY=o.y,this._minZ=this._maxZ=o.z):(this._minX=Math.min(this._minX,o.x),this._minY=Math.min(this._minY,o.y),this._minZ=Math.min(this._minZ,o.z),this._maxX=Math.max(this._maxX,o.x),this._maxY=Math.max(this._maxY,o.y),this._maxZ=Math.max(this._maxZ,o.z)),o.setOriginalPosition(o.x,o.y,o.z);this._width=this._maxX-this._minX,this._height=this._maxY-this._minY,this._depth=this._maxZ-this._minZ;var c=Math.max(this._width,Math.max(this._height,this._depth)),h=Math.min(this._width,Math.min(this._height,this._depth));c==this._width&&h==this._height?(this._minAxis=n.ModConstant.Y,this._midAxis=n.ModConstant.Z,this._maxAxis=n.ModConstant.X):c==this._width&&h==this._depth?(this._minAxis=n.ModConstant.Z,this._midAxis=n.ModConstant.Y,this._maxAxis=n.ModConstant.X):c==this._height&&h==this._width?(this._minAxis=n.ModConstant.X,this._midAxis=n.ModConstant.Z,this._maxAxis=n.ModConstant.Y):c==this._height&&h==this._depth?(this._minAxis=n.ModConstant.Z,this._midAxis=n.ModConstant.X,this._maxAxis=n.ModConstant.Y):c==this._depth&&h==this._width?(this._minAxis=n.ModConstant.X,this._midAxis=n.ModConstant.Y,this._maxAxis=n.ModConstant.Z):c==this._depth&&h==this._height&&(this._minAxis=n.ModConstant.Y,this._midAxis=n.ModConstant.X,this._maxAxis=n.ModConstant.Z);for(var l=0;l<a;l++)o=this.getVertices()[l],o.setRatios((o.x-this._minX)/this._width,(o.y-this._minY)/this._height,(o.z-this._minZ)/this._depth)},r.prototype.resetGeometry=function(){for(var o=this.getVertices().length,a=0;a<o;a++)this.getVertices()[a].reset()},r.prototype.collapseGeometry=function(){for(var o=this.getVertices().length,a=0;a<o;a++)this.getVertices()[a].collapse();this.analyzeGeometry()},Object.defineProperty(r.prototype,"minX",{get:function(){return this._minX},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"minY",{get:function(){return this._minY},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"minZ",{get:function(){return this._minZ},enumerable:!1,configurable:!0}),r.prototype.getMin=function(o){switch(o){case n.ModConstant.X:return this._minX;case n.ModConstant.Y:return this._minY;case n.ModConstant.Z:return this._minZ}return-1},Object.defineProperty(r.prototype,"maxX",{get:function(){return this._maxX},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"maxY",{get:function(){return this._maxY},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"maxZ",{get:function(){return this._maxZ},enumerable:!1,configurable:!0}),r.prototype.getMax=function(o){switch(o){case n.ModConstant.X:return this._maxX;case n.ModConstant.Y:return this._maxY;case n.ModConstant.Z:return this._maxZ}return-1},Object.defineProperty(r.prototype,"maxAxis",{get:function(){return this._maxAxis},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"midAxis",{get:function(){return this._midAxis},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"minAxis",{get:function(){return this._minAxis},enumerable:!1,configurable:!0}),r.prototype.getSize=function(o){switch(o){case n.ModConstant.X:return this._width;case n.ModConstant.Y:return this._height;case n.ModConstant.Z:return this._depth}return-1},Object.defineProperty(r.prototype,"width",{get:function(){return this._width},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"height",{get:function(){return this._height},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"depth",{get:function(){return this._depth},enumerable:!1,configurable:!0}),r.prototype.postApply=function(){},r.prototype.destroy=function(){this.vertices.length=0,this.faces.length=0},r})();t.MeshProxy=s},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.FaceProxy=void 0;var n=(function(){function s(){this._vertices=[]}return Object.defineProperty(s.prototype,"a",{get:function(){return this._vertices[0]},set:function(r){this._vertices[0]=r},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"b",{get:function(){return this._vertices[1]},set:function(r){this._vertices[1]=r},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"c",{get:function(){return this._vertices[2]},set:function(r){this._vertices[2]=r},enumerable:!1,configurable:!0}),s.prototype.addVertex=function(r){this._vertices.push(r)},s.prototype.addVertices=function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];for(var a=0;a<r.length;a++)this.addVertex(r[a])},s.prototype.addABC=function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];for(var a=0;a<r.length;a++)this.addVertex(r[a])},Object.defineProperty(s.prototype,"vertices",{get:function(){return this._vertices},enumerable:!1,configurable:!0}),s.prototype.toString=function(){for(var r="",o=0;o<this._vertices.length;o++)r+=o+":"+this._vertices[o]+" ";return r},s})();t.FaceProxy=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.TMap=void 0;var n=(function(){function r(){this.from=[]}return r.prototype.push=function(o){this.from.push(o)},r})(),s=(function(){function r(){this._map={}}return r.prototype.add=function(o,a,l){var c="t_"+o;this._map[c]||(this._map[c]=new n),this._map[c].push(a),this._map[c].to=o,this._map[c].value=l},r.prototype.getToByValue=function(o){var a=this.getItemByValue(o);return a?a.to:-1},r.prototype.getFromByTo=function(o){var a=this.getItemByTo(o);return a?a.from:null},r.prototype.includeByValue=function(o){return!!this.getItemByValue(o)},r.prototype.getItemByValue=function(o){for(var a in this._map){var l=this._map[a];if(l.value===o)return l}return null},r.prototype.getItemByTo=function(o){var a="t_"+o;return this._map[a]},r.prototype.destroy=function(){for(var o in this._map)delete this._map[o]},r})();t.TMap=s},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Phase=void 0;var n=(function(){function s(r){r===void 0&&(r=0),this.v=r}return Object.defineProperty(s.prototype,"value",{get:function(){return this.v},set:function(r){this.v=r},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"phasedValue",{get:function(){return Math.sin(this.v)},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"absPhasedValue",{get:function(){return Math.abs(this.phasedValue)},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"normValue",{get:function(){return(this.phasedValue+1)/2},enumerable:!1,configurable:!0}),s})();t.Phase=n},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var c=function(h,f){return(c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(u,d){u.__proto__=d}||function(u,d){for(var p in d)Object.prototype.hasOwnProperty.call(d,p)&&(u[p]=d[p])})(h,f)};return function(h,f){function u(){this.constructor=h}if(typeof f!="function"&&f!==null)throw new TypeError("Class extends value "+String(f)+" is not a constructor or null");c(h,f),h.prototype=f===null?Object.create(f):(u.prototype=f.prototype,new u)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Bend=void 0;var s=e(2),r=e(0),o=e(5),a=e(18),l=(function(c){function h(f,u,d){f===void 0&&(f=0),u===void 0&&(u=.5),d===void 0&&(d=0);var p=c.call(this)||this;return p._constraint=s.ModConstant.NONE,p.switchAxes=!1,p._force=f,p._offset=u,p.angle=d,p}return n(h,c),h.prototype.setModifiable=function(f){c.prototype.setModifiable.call(this,f),this.max=this.switchAxes?f.midAxis:f.maxAxis,this.min=f.minAxis,this.mid=this.switchAxes?f.maxAxis:f.midAxis,this.width=f.getSize(this.max),this.height=f.getSize(this.mid),this.origin=f.getMin(this.max),this._diagAngle=Math.atan(this.width/this.height)},Object.defineProperty(h.prototype,"force",{get:function(){return this._force},set:function(f){this._force=f},enumerable:!1,configurable:!0}),Object.defineProperty(h.prototype,"constraint",{get:function(){return this._constraint},set:function(f){this._constraint=f},enumerable:!1,configurable:!0}),Object.defineProperty(h.prototype,"offset",{get:function(){return this._offset},set:function(f){this._offset=f},enumerable:!1,configurable:!0}),Object.defineProperty(h.prototype,"diagAngle",{get:function(){return this._diagAngle},enumerable:!1,configurable:!0}),Object.defineProperty(h.prototype,"angle",{get:function(){return this._angle},set:function(f){this._angle=f,this.m1=new a.Matrix(1,0,0,1),this.m1.rotate(this._angle),this.m2=new a.Matrix(1,0,0,1),this.m2.rotate(-this._angle)},enumerable:!1,configurable:!0}),h.prototype.apply=function(){if(this.force!=0)for(var f=this.mod.getVertices(),u=f.length,d=this.origin+this.width*this.offset,p=this.width/Math.PI/this.force,y=2*Math.PI*(this.width/(p*Math.PI*2)),g=0;g<u;g++){var m=f[g],S=m.getValue(this.max),C=m.getValue(this.mid),v=m.getValue(this.min),E=this.m1.transformPoint(new o.Vector2(S,C));S=E.x,C=E.y;var A=(S-this.origin)/this.width;if(!(this.constraint==s.ModConstant.LEFT&&A<=this.offset||this.constraint==s.ModConstant.RIGHT&&A>=this.offset)){var R=Math.PI/2-y*this.offset+y*A,x=Math.sin(R)*(p+v),w=Math.cos(R)*(p+v);v=x-p,S=d-w}var D=this.m2.transformPoint(new o.Vector2(S,C));S=D.x,C=D.y,m.setValue(this.max,S),m.setValue(this.mid,C),m.setValue(this.min,v)}},h})(r.Modifier);t.Bend=l},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Matrix=void 0;var n=e(5),s=(function(){function r(o,a,l,c){this.m=[o,a,l,c]}return r.prototype.dispose=function(){return this.m.length=0,this},r.prototype.reset=function(){return this.m[0]=1,this.m[1]=0,this.m[2]=0,this.m[3]=1,this},r.prototype.rotate=function(o){var a=Math.cos(o),l=Math.sin(o);return this.m[0]=a,this.m[1]=-l,this.m[2]=l,this.m[3]=a,this},r.prototype.scale=function(o,a){return this.m[0]=1,this.m[1]=0,this.m[2]=0,this.m[3]=1,o!==void 0&&(this.m[0]=o,this.m[3]=o),a!==void 0&&(this.m[3]=a),this},r.prototype.multiply=function(o){return r.mult(this,o)},r.prototype.transformPoint=function(o){var a=r.transform(this,[o.x,o.y]);return new n.Vector2(a[0],a[1])},r.prototype.transformPointSelf=function(o){var a=r.transform(this,[o.x,o.y]);return o.x=a[0],o.y=a[1],o},r.prototype.clone=function(){var o=this.m;return new r(o[0],o[1],o[2],o[3])},r.transform=function(o,a){var l=o.m,c=a[0],h=a[1];return a[0]=l[0]*c+l[1]*h,a[1]=l[2]*c+l[3]*h,a},r.mult=function(o,a){var l=o.m,c=a.m,h=l[0],f=l[1],u=l[2],d=l[3];return l[0]=h*c[0]+f*c[2],l[1]=h*c[1]+f*c[3],l[2]=u*c[0]+d*c[2],l[3]=u*c[1]+d*c[3],o},r})();t.Matrix=s},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var a=function(l,c){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(h,f){h.__proto__=f}||function(h,f){for(var u in f)Object.prototype.hasOwnProperty.call(f,u)&&(h[u]=f[u])})(l,c)};return function(l,c){function h(){this.constructor=l}if(typeof c!="function"&&c!==null)throw new TypeError("Class extends value "+String(c)+" is not a constructor or null");a(l,c),l.prototype=c===null?Object.create(c):(h.prototype=c.prototype,new h)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Bloat=void 0;var s=e(1),r=e(0),o=(function(a){function l(){var c=a!==null&&a.apply(this,arguments)||this;return c._center=s.Vector3.ZERO,c._r=0,c._a=.01,c._u=s.Vector3.ZERO,c}return n(l,a),Object.defineProperty(l.prototype,"center",{get:function(){return this._center},set:function(c){this._center=c},enumerable:!1,configurable:!0}),Object.defineProperty(l.prototype,"radius",{get:function(){return this._r},set:function(c){this._r=Math.max(0,c)},enumerable:!1,configurable:!0}),Object.defineProperty(l.prototype,"a",{get:function(){return this._a},set:function(c){this._a=Math.max(0,c)},enumerable:!1,configurable:!0}),l.prototype.apply=function(){for(var c=this.mod.getVertices(),h=0,f=c;h<f.length;h++){var u=f[h],d=u;this._u.x=d.x-this._center.x,this._u.y=d.y-this._center.y,this._u.z=d.z-this._center.z,this._u.magnitude+=this._r*Math.exp(-this._u.magnitude*this._a),d.x=this._u.x+this._center.x,d.y=this._u.y+this._center.y,d.z=this._u.z+this._center.z}},l})(r.Modifier);t.Bloat=o},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var c=function(h,f){return(c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(u,d){u.__proto__=d}||function(u,d){for(var p in d)Object.prototype.hasOwnProperty.call(d,p)&&(u[p]=d[p])})(h,f)};return function(h,f){function u(){this.constructor=h}if(typeof f!="function"&&f!==null)throw new TypeError("Class extends value "+String(f)+" is not a constructor or null");c(h,f),h.prototype=f===null?Object.create(f):(u.prototype=f.prototype,new u)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Break=void 0;var s=e(6),r=e(1),o=e(4),a=e(0),l=(function(c){function h(f,u){f===void 0&&(f=0),u===void 0&&(u=0);var d=c.call(this)||this;return d.bv=new r.Vector3(0,1,0),d.range=new s.Range(0,1),d.angle=u,d._offset=f,d}return n(h,c),h.prototype.apply=function(){for(var f=this.mod.getVertices(),u=f.length,d=new r.Vector3(0,0,-(this.mod.minZ+this.mod.depth*this.offset)),p=0;p<u;p++){var y=f[p],g=y.vector;if(g=g.add(d),g.z>=0&&this.range.isIn(y.ratioY)){var m=this.angle,S=o.Matrix4.rotationMatrix(this.bv.x,this.bv.y,this.bv.z,m);o.Matrix4.multiplyVector(S,g)}var C=d.negate();g=g.add(C),y.x=g.x,y.y=g.y,y.z=g.z}},Object.defineProperty(h.prototype,"offset",{get:function(){return this._offset},set:function(f){this._offset=f},enumerable:!1,configurable:!0}),h})(a.Modifier);t.Break=l},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var h=function(f,u){return(h=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,p){d.__proto__=p}||function(d,p){for(var y in p)Object.prototype.hasOwnProperty.call(p,y)&&(d[y]=p[y])})(f,u)};return function(f,u){function d(){this.constructor=f}if(typeof u!="function"&&u!==null)throw new TypeError("Class extends value "+String(u)+" is not a constructor or null");h(f,u),f.prototype=u===null?Object.create(u):(d.prototype=u.prototype,new d)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Cloth=void 0;var s=e(2),r=e(22),o=e(0),a=e(23),l=e(24),c=(function(h){function f(u,d){u===void 0&&(u=1),d===void 0&&(d=0);var p=h.call(this)||this;return p._forceX=0,p._forceY=0,p._forceZ=0,p._dic=new r.Dictionary,p._rigidity=u,p.friction=d,p}return n(f,h),f.prototype.setBounds=function(u,d,p,y,g,m){u===void 0&&(u=Number.NEGATIVE_INFINITY),d===void 0&&(d=Number.POSITIVE_INFINITY),p===void 0&&(p=Number.NEGATIVE_INFINITY),y===void 0&&(y=Number.POSITIVE_INFINITY),g===void 0&&(g=Number.NEGATIVE_INFINITY),m===void 0&&(m=Number.POSITIVE_INFINITY),this._useBounds=!0,this._boundsMinX=u,this._boundsMaxX=d,this._boundsMinY=p,this._boundsMaxY=y,this._boundsMinZ=g,this._boundsMaxZ=m},f.prototype.clearBounds=function(){this._useBounds=!1},Object.defineProperty(f.prototype,"verletVertices",{get:function(){return this._vertices},enumerable:!1,configurable:!0}),Object.defineProperty(f.prototype,"friction",{get:function(){return 100*(this._friction-1)},set:function(u){u<0&&(u=0),this._friction=u/100+1},enumerable:!1,configurable:!0}),Object.defineProperty(f.prototype,"rigidity",{get:function(){return this._rigidity},set:function(u){var d,p,y=this._connections.length;for(u>1?u=1:u<0&&(u=0),this._rigidity=u,d=.5*u;p=this._connections[--y];)p.rigidity=d},enumerable:!1,configurable:!0}),f.prototype.setForce=function(u,d,p){this._forceX=u,this._forceY=d,this._forceZ=p},Object.defineProperty(f.prototype,"forceX",{get:function(){return this._forceX},set:function(u){this._forceX=u},enumerable:!1,configurable:!0}),Object.defineProperty(f.prototype,"forceY",{get:function(){return this._forceY},set:function(u){this._forceY=u},enumerable:!1,configurable:!0}),Object.defineProperty(f.prototype,"forceZ",{get:function(){return this._forceZ},set:function(u){this._forceZ=u},enumerable:!1,configurable:!0}),f.prototype.unlockAll=function(){for(var u,d=this._vertices.length;u=this._vertices[--d];)u.mobileX=!0,u.mobileY=!0,u.mobileZ=!0},f.prototype.lockXMin=function(u,d){u===void 0&&(u=0),d===void 0&&(d=7),this.lockSet(this.mod.minX,"x",u,d)},f.prototype.lockXMax=function(u,d){u===void 0&&(u=0),d===void 0&&(d=7),this.lockSet(this.mod.maxX,"x",u,d)},f.prototype.lockYMin=function(u,d){u===void 0&&(u=0),d===void 0&&(d=7),this.lockSet(this.mod.minY,"y",u,d)},f.prototype.lockYMax=function(u,d){u===void 0&&(u=0),d===void 0&&(d=7),this.lockSet(this.mod.maxY,"y",u,d)},f.prototype.lockZMin=function(u,d){u===void 0&&(u=0),d===void 0&&(d=7),this.lockSet(this.mod.minZ,"z",u,d)},f.prototype.lockZMax=function(u,d){u===void 0&&(u=0),d===void 0&&(d=7),this.lockSet(this.mod.maxZ,"z",u,d)},f.prototype.lockSet=function(u,d,p,y){p===void 0&&(p=0),y===void 0&&(y=7);for(var g,m=this._vertices.length;g=this._vertices[--m];)Math.abs(g[d]-u)<=p&&(y&s.ModConstant.X&&(g.mobileX=!1),y&s.ModConstant.Y&&(g.mobileY=!1),y&s.ModConstant.Z&&(g.mobileZ=!1))},f.prototype.setModifiable=function(u){h.prototype.setModifiable.call(this,u),this.initVerletVertices(),this.initVerletConnections(),this.rigidity=this._rigidity},f.prototype.apply=function(){var u,d,p;for(u=this._connections.length;d=this._connections[--u];)d.update();for(u=this._vertices.length;p=this._vertices[--u];)p.mobileX&&(p.x+=this._forceX),p.mobileY&&(p.y+=this._forceY),p.mobileZ&&(p.z+=this._forceZ),p.velocityX/=this._friction,p.velocityY/=this._friction,p.velocityZ/=this._friction,this._useBounds&&(p.x<this._boundsMinX?p.x=this._boundsMinX:p.x>this._boundsMaxX&&(p.x=this._boundsMaxX),p.y<this._boundsMinY?p.y=this._boundsMinY:p.y>this._boundsMaxY&&(p.y=this._boundsMaxY),p.z<this._boundsMinZ?p.z=this._boundsMinZ:p.z>this._boundsMaxZ&&(p.z=this._boundsMaxZ)),p.update()},f.prototype.initVerletVertices=function(){var u,d=this.mod.getVertices(),p=d.length;for(this._vertices=[];u=d[--p];){var y=new l.VerletVertex(u);this._vertices.push(y),this._dic.setVal(u,y)}},f.prototype.initVerletConnections=function(){var u,d,p,y=this.mod.getFaces(),g=y.length;this._connections=[];for(var m=0;m<g;m++){u=y[m],d=u.vertices,p=d.length;for(var S=0;S<p-1;S++)this.createConnection(this._dic.getVal(d[S]),this._dic.getVal(d[S+1])),S>1&&this.createConnection(this._dic.getVal(d[0]),this._dic.getVal(d[S]));this.createConnection(this._dic.getVal(d[p-1]),this._dic.getVal(d[0]))}},f.prototype.createConnection=function(u,d){if(u&&d){var p=u.distanceTo(d),y=new a.VerletConnection(u,d,p,this._rigidity);this._connections.push(y)}},f})(o.Modifier);t.Cloth=c},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Dictionary=void 0;var n=(function(){function s(){this.dic={}}return s.prototype.setVal=function(r,o){var a=this.getKey(r);this.dic[a]=o},s.prototype.getVal=function(r){var o=this.getKey(r);return this.dic[o]},s.prototype.getKey=function(r){if(typeof r=="object"){if(r.id)return r.id;var o="d_"+Math.floor(Math.random()*Math.pow(10,10));return r.id=o,o}return r+""},s})();t.Dictionary=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VerletConnection=void 0;var n=(function(){function s(r,o,a,l){l===void 0&&(l=.5),this._rigidity=.5,this._v1=r,this._v2=o,this._strictDistance=a,this._rigidity=l}return Object.defineProperty(s.prototype,"rigidity",{get:function(){return this._rigidity},set:function(r){this._rigidity=r},enumerable:!1,configurable:!0}),s.prototype.update=function(){var r,o,a,l,c=this._v1.x,h=this._v2.x,f=this._v1.y,u=this._v2.y,d=this._v1.z,p=this._v2.z,y=h-c,g=u-f,m=p-d,S=Math.sqrt(y*y+g*g+m*m);S!=this._strictDistance&&(r=(this._strictDistance-S)/S*this._rigidity,o=r*y,a=r*g,l=r*m,this._v1.mobileX&&this._v2.mobileX||(o*=2),this._v1.mobileY&&this._v2.mobileY||(a*=2),this._v1.mobileZ&&this._v2.mobileZ||(l*=2),this._v1.mobileX&&(this._v1.x-=o),this._v1.mobileY&&(this._v1.y-=a),this._v1.mobileZ&&(this._v1.z-=l),this._v2.mobileX&&(this._v2.x+=o),this._v2.mobileY&&(this._v2.y+=a),this._v2.mobileZ&&(this._v2.z+=l))},s})();t.VerletConnection=n},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VerletVertex=void 0;var n=(function(){function s(r){this.mobileX=!0,this.mobileY=!0,this.mobileZ=!0,this._v=r,this.setPosition(this._v.x,this._v.y,this._v.z)}return s.prototype.setPosition=function(r,o,a){this._x=this._oldX=r,this._y=this._oldY=o,this._z=this._oldZ=a,this._v.x=r,this._v.y=o,this._v.z=a},s.prototype.update=function(){var r,o,a;this.mobileX&&(r=this.x,this.x+=this.velocityX,this._oldX=r),this.mobileY&&(o=this.y,this.y+=this.velocityY,this._oldY=o),this.mobileZ&&(a=this.z,this.z+=this.velocityZ,this._oldZ=a)},Object.defineProperty(s.prototype,"x",{get:function(){return this._x},set:function(r){this._x=r,this.mobileX||(this._oldX=r),this._v.x=r},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"y",{get:function(){return this._y},set:function(r){this._y=r,this.mobileY||(this._oldY=r),this._v.y=r},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"z",{get:function(){return this._z},set:function(r){this._z=r,this.mobileZ||(this._oldZ=r),this._v.z=r},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"velocityX",{get:function(){return this._x-this._oldX},set:function(r){this._oldX=this._x-r},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"velocityY",{get:function(){return this._y-this._oldY},set:function(r){this._oldY=this._y-r},enumerable:!1,configurable:!0}),Object.defineProperty(s.prototype,"velocityZ",{get:function(){return this._z-this._oldZ},set:function(r){this._oldZ=this._z-r},enumerable:!1,configurable:!0}),s.prototype.distanceTo=function(r){return Math.sqrt((this.x-r.x)*(this.x-r.x)+(this.y-r.y)*(this.y-r.y)+(this.z-r.z)*(this.z-r.z))},s})();t.VerletVertex=n},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var a=function(l,c){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(h,f){h.__proto__=f}||function(h,f){for(var u in f)Object.prototype.hasOwnProperty.call(f,u)&&(h[u]=f[u])})(l,c)};return function(l,c){function h(){this.constructor=l}if(typeof c!="function"&&c!==null)throw new TypeError("Class extends value "+String(c)+" is not a constructor or null");a(l,c),l.prototype=c===null?Object.create(c):(h.prototype=c.prototype,new h)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Noise=void 0;var s=e(2),r=e(0),o=(function(a){function l(c){c===void 0&&(c=0);var h=a.call(this)||this;return h.axc=s.ModConstant.NONE,h.start=0,h.end=0,h.frc=c,h}return n(l,a),Object.defineProperty(l.prototype,"force",{get:function(){return this.frc},set:function(c){this.frc=c},enumerable:!1,configurable:!0}),l.prototype.constraintAxes=function(c){this.axc=c},l.prototype.setFalloff=function(c,h){c===void 0&&(c=0),h===void 0&&(h=1),this.start=c,this.end=h},l.prototype.apply=function(){for(var c=this.mod.getVertices(),h=c.length,f=0;f<h;f++){var u=c[f],d=Math.random()*this.force-this.force/2,p=u.getRatio(this.mod.maxAxis);this.start<this.end?(p<this.start&&(p=0),p>this.end&&(p=1)):this.start>this.end?(p=1-p,p>this.start&&(p=0),p<this.end&&(p=1)):p=1,1&this.axc||(u.x+=d*p),this.axc>>1&1||(u.y+=d*p),this.axc>>2&1||(u.z+=d*p)}},l})(r.Modifier);t.Noise=o},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var a=function(l,c){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(h,f){h.__proto__=f}||function(h,f){for(var u in f)Object.prototype.hasOwnProperty.call(f,u)&&(h[u]=f[u])})(l,c)};return function(l,c){function h(){this.constructor=l}if(typeof c!="function"&&c!==null)throw new TypeError("Class extends value "+String(c)+" is not a constructor or null");a(l,c),l.prototype=c===null?Object.create(c):(h.prototype=c.prototype,new h)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Pivot=void 0;var s=e(1),r=e(0),o=(function(a){function l(c,h,f){c===void 0&&(c=0),h===void 0&&(h=0),f===void 0&&(f=0);var u=a.call(this)||this;return u.pivot=new s.Vector3(c,h,f),u}return n(l,a),l.prototype.setMeshCenter=function(){var c=-(this.mod.minX+this.mod.width/2),h=-(this.mod.minY+this.mod.height/2),f=-(this.mod.minZ+this.mod.depth/2);this.pivot=new s.Vector3(c,h,f)},l.prototype.apply=function(){for(var c=this.mod.getVertices(),h=c.length,f=0;f<h;f++){var u=c[f];u.vector=u.vector.add(this.pivot)}var d=this.pivot.clone();this.mod.updateMeshPosition(d.negate())},l})(r.Modifier);t.Pivot=o},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var l=function(c,h){return(l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(f,u){f.__proto__=u}||function(f,u){for(var d in u)Object.prototype.hasOwnProperty.call(u,d)&&(f[d]=u[d])})(c,h)};return function(c,h){function f(){this.constructor=c}if(typeof h!="function"&&h!==null)throw new TypeError("Class extends value "+String(h)+" is not a constructor or null");l(c,h),c.prototype=h===null?Object.create(h):(f.prototype=h.prototype,new f)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Skew=void 0;var s=e(3),r=e(2),o=e(0),a=(function(l){function c(h){h===void 0&&(h=0);var f=l.call(this)||this;return f._offset=.5,f._constraint=r.ModConstant.NONE,f._power=1,f._falloff=1,f._inverseFalloff=!1,f._oneSide=!1,f._swapAxes=!1,f._force=h,f}return n(c,l),c.prototype.setModifiable=function(h){l.prototype.setModifiable.call(this,h),this._skewAxis=this._skewAxis||h.maxAxis},c.prototype.apply=function(){for(var h=this.mod.getVertices(),f=h.length,u=0;u<f;u++){var d=h[u];if(!(this._constraint==r.ModConstant.LEFT&&d.getRatio(this._skewAxis)<=this._offset)&&!(this._constraint==r.ModConstant.RIGHT&&d.getRatio(this._skewAxis)>this._offset)){var p=d.getRatio(this._skewAxis)-this._offset;this._oneSide&&(p=Math.abs(p));var y=d.getRatio(this.displaceAxis);this._inverseFalloff&&(y=1-y);var g=this._falloff+y*(1-this._falloff),m=Math.pow(Math.abs(p),this._power)*s.TMath.sign(p,1),S=d.getValue(this.displaceAxis)+this.force*m*g;d.setValue(this.displaceAxis,S)}}},Object.defineProperty(c.prototype,"displaceAxis",{get:function(){switch(this._skewAxis){case r.ModConstant.X:return this._swapAxes?r.ModConstant.Z:r.ModConstant.Y;case r.ModConstant.Y:return this._swapAxes?r.ModConstant.Z:r.ModConstant.X;case r.ModConstant.Z:return this._swapAxes?r.ModConstant.Y:r.ModConstant.X;default:return 0}},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"force",{get:function(){return this._force},set:function(h){this._force=h},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"constraint",{get:function(){return this._constraint},set:function(h){this._constraint=h},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"offset",{get:function(){return this._offset},set:function(h){this._offset=s.TMath.trim(0,1,h)},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"power",{get:function(){return this._power},set:function(h){this._power=Math.max(1,h)},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"falloff",{get:function(){return this._falloff},set:function(h){this._falloff=s.TMath.trim(0,1,h)},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"oneSide",{get:function(){return this._oneSide},set:function(h){this._oneSide=h},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"skewAxis",{get:function(){return this._skewAxis},set:function(h){this._skewAxis=h},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"swapAxes",{get:function(){return this._swapAxes},set:function(h){this._swapAxes=h},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"inverseFalloff",{get:function(){return this._inverseFalloff},set:function(h){this._inverseFalloff=h},enumerable:!1,configurable:!0}),c})(o.Modifier);t.Skew=a},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var l=function(c,h){return(l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(f,u){f.__proto__=u}||function(f,u){for(var d in u)Object.prototype.hasOwnProperty.call(u,d)&&(f[d]=u[d])})(c,h)};return function(c,h){function f(){this.constructor=c}if(typeof h!="function"&&h!==null)throw new TypeError("Class extends value "+String(h)+" is not a constructor or null");l(c,h),c.prototype=h===null?Object.create(h):(f.prototype=h.prototype,new f)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Taper=void 0;var s=e(4),r=e(1),o=e(0),a=(function(l){function c(h){var f=l.call(this)||this;return f.start=0,f.end=1,f._vector=new r.Vector3(1,0,1),f._vector2=new r.Vector3(0,1,0),f.frc=h,f.pow=1,f}return n(c,l),c.prototype.setFalloff=function(h,f){h===void 0&&(h=0),f===void 0&&(f=1),this.start=h,this.end=f},Object.defineProperty(c.prototype,"force",{get:function(){return this.frc},set:function(h){this.frc=h},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"power",{get:function(){return this.pow},set:function(h){this.pow=h},enumerable:!1,configurable:!0}),c.prototype.apply=function(){for(var h=this.mod.getVertices(),f=h.length,u=0;u<f;u++){var d=h[u],p=d.ratioVector.multiply(this._vector2),y=this.frc*Math.pow(p.magnitude,this.pow),g=s.Matrix4.scaleMatrix(1+y*this._vector.x,1+y*this._vector.y,1+y*this._vector.z),m=d.vector;s.Matrix4.multiplyVector(g,m),d.vector=m}},c})(o.Modifier);t.Taper=a},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var l=function(c,h){return(l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(f,u){f.__proto__=u}||function(f,u){for(var d in u)Object.prototype.hasOwnProperty.call(u,d)&&(f[d]=u[d])})(c,h)};return function(c,h){function f(){this.constructor=c}if(typeof h!="function"&&h!==null)throw new TypeError("Class extends value "+String(h)+" is not a constructor or null");l(c,h),c.prototype=h===null?Object.create(h):(f.prototype=h.prototype,new f)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Twist=void 0;var s=e(4),r=e(1),o=e(0),a=(function(l){function c(h){h===void 0&&(h=0);var f=l.call(this)||this;return f._vector=new r.Vector3(0,1,0),f.center=r.Vector3.ZERO,f._angle=h,f}return n(c,l),Object.defineProperty(c.prototype,"angle",{get:function(){return this._angle},set:function(h){this._angle=h},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"vector",{get:function(){return this._vector},set:function(h){this._vector=h},enumerable:!1,configurable:!0}),c.prototype.apply=function(){this._vector.normalize();for(var h=new r.Vector3(this.mod.maxX/2,this.mod.maxY/2,this.mod.maxZ/2),f=-r.Vector3.dot(this._vector,this.center),u=0;u<this.mod.getVertices().length;u++){var d=this.mod.getVertices()[u],p=r.Vector3.dot(new r.Vector3(d.x,d.y,d.z),this._vector)+f;this.twistPoint(d,p/h.magnitude*this._angle)}},c.prototype.twistPoint=function(h,f){var u=s.Matrix4.translationMatrix(h.x,h.y,h.z);u=s.Matrix4.multiply(s.Matrix4.rotationMatrix(this._vector.x,this._vector.y,this._vector.z,f),u),h.x=u.n14,h.y=u.n24,h.z=u.n34},c})(o.Modifier);t.Twist=a},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var l=function(c,h){return(l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(f,u){f.__proto__=u}||function(f,u){for(var d in u)Object.prototype.hasOwnProperty.call(u,d)&&(f[d]=u[d])})(c,h)};return function(c,h){function f(){this.constructor=c}if(typeof h!="function"&&h!==null)throw new TypeError("Class extends value "+String(h)+" is not a constructor or null");l(c,h),c.prototype=h===null?Object.create(h):(f.prototype=h.prototype,new f)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.Wheel=void 0;var s=e(4),r=e(1),o=e(0),a=(function(l){function c(){var h=l.call(this)||this;return h.steerVector=new r.Vector3(0,1,0),h.rollVector=new r.Vector3(0,0,1),h.speed=0,h.turn=0,h.roll=0,h}return n(c,l),c.prototype.setModifiable=function(h){l.prototype.setModifiable.call(this,h),this._radius=h.width/2},c.prototype.apply=function(){this.roll+=this.speed;var h,f,u=this.mod.getVertices(),d=u.length;if(this.turn!=0){f=s.Matrix4.rotationMatrix(this.steerVector.x,this.steerVector.y,this.steerVector.z,this.turn);var p=this.rollVector.clone();s.Matrix4.multiplyVector(f,p),h=s.Matrix4.rotationMatrix(p.x,p.y,p.z,this.roll)}else h=s.Matrix4.rotationMatrix(this.rollVector.x,this.rollVector.y,this.rollVector.z,this.roll);for(var y=0;y<d;y++){var g=u[y],m=g.vector.clone();this.turn!=0&&s.Matrix4.multiplyVector(f,m),s.Matrix4.multiplyVector(h,m),g.x=m.x,g.y=m.y,g.z=m.z}},Object.defineProperty(c.prototype,"step",{get:function(){return this._radius*this.speed/Math.PI},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"perimeter",{get:function(){return 2*this._radius*Math.PI},enumerable:!1,configurable:!0}),Object.defineProperty(c.prototype,"radius",{get:function(){return this._radius},enumerable:!1,configurable:!0}),c})(o.Modifier);t.Wheel=a},function(i,t,e){"use strict";var n=this&&this.__extends||(function(){var a=function(l,c){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(h,f){h.__proto__=f}||function(h,f){for(var u in f)Object.prototype.hasOwnProperty.call(f,u)&&(h[u]=f[u])})(l,c)};return function(l,c){function h(){this.constructor=l}if(typeof c!="function"&&c!==null)throw new TypeError("Class extends value "+String(c)+" is not a constructor or null");a(l,c),l.prototype=c===null?Object.create(c):(h.prototype=c.prototype,new h)}})();Object.defineProperty(t,"__esModule",{value:!0}),t.UserDefined=void 0;var s=e(0),r=e(32),o=(function(a){function l(){var c=a.call(this)||this;return c.eventEmitter=new r.EventEmitter,c}return n(l,a),l.prototype.apply=function(){for(var c=this.mod.getVertices(),h=c.length,f=0;f<h;f++){var u=c[f];this.renderVector&&this.renderVector(u,f,h)}this.dispatchEvent("CHANGE")},l.prototype.addEventListener=function(c,h){this.eventEmitter.on(c,h)},l.prototype.dispatchEvent=function(c){return this.eventEmitter.emit(c)},l.prototype.hasEventListener=function(c){return this.eventEmitter.has(c)},l.prototype.removeEventListener=function(c,h){this.eventEmitter.off(c,h)},l})(s.Modifier);t.UserDefined=o},function(i,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.EventEmitter=void 0;var n=(function(){function r(){}return r.prototype.on=function(o,a){return s||(s={}),s[o]||(s[o]=[]),s[o].push(a),a},r.prototype.emit=function(o){for(var a=[],l=1;l<arguments.length;l++)a[l-1]=arguments[l];var c=!1;if(o&&s){var h=s[o];if(!h)return c;h=h.slice();var f=h.length,u=Array.prototype.slice.call(arguments);for(u.shift();f--;){var d=h[f];c=c||d.apply(null,u)}}return!!c},r.prototype.one=function(o,a){var l=this,c=Array.prototype.slice.call(arguments,2),h=function(){l.off(o,h),a.apply(null,c)};this.on(o,h)},r.prototype.has=function(o){return!(!s||!s[o])},r.prototype.off=function(o,a){if(s&&s[o]){for(var l=s[o],c=0,h=l.length;c<h;c++)if(l[c].toString()==a.toString()){h==1?delete s[o]:l.splice(c,1);break}}},r.prototype.offAll=function(o){o?s&&delete s[o]:s=null},r})();t.EventEmitter=n;var s}])})});var ig={};Mh(ig,{createAlbum3DReader:()=>ah});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var Fc=0,ua=1,Oc=2;var oi=1,Bc=2,Fi=3,wn=0,Le=1,qe=2,dn=0,ii=1,fa=2,da=3,pa=4,zc=5;var Vn=100,Vc=101,kc=102,Gc=103,Hc=104,Wc=200,Xc=201,Yc=202,qc=203,js=204,Ks=205,Zc=206,Jc=207,$c=208,jc=209,Kc=210,Qc=211,tl=212,el=213,nl=214,Qs=0,tr=1,er=2,si=3,nr=4,ir=5,sr=6,rr=7,ma=0,il=1,sl=2,Ge=0,ga=1,_a=2,xa=3,ya=4,va=5,Ma=6,ba=7;var Sa=300,Yn=301,ai=302,Lr=303,Dr=304,us=306,or=1e3,cn=1001,ar=1002,Me=1003,rl=1004;var fs=1005;var ue=1006,Nr=1007;var pn=1008;var Ne=1009,Aa=1010,wa=1011,Oi=1012,Ur=1013,tn=1014,en=1015,mn=1016,Fr=1017,Or=1018,Bi=1020,Ta=35902,Ea=35899,Ca=1021,Ra=1022,Ze=1023,ln=1026,qn=1027,Pa=1028,Br=1029,Zn=1030,zr=1031;var Vr=1033,ds=33776,ps=33777,ms=33778,gs=33779,kr=35840,Gr=35841,Hr=35842,Wr=35843,Xr=36196,Yr=37492,qr=37496,Zr=37488,Jr=37489,_s=37490,$r=37491,jr=37808,Kr=37809,Qr=37810,to=37811,eo=37812,no=37813,io=37814,so=37815,ro=37816,oo=37817,ao=37818,co=37819,lo=37820,ho=37821,uo=36492,fo=36494,po=36495,mo=36283,go=36284,xs=36285,_o=36286;var qi=2300,cr=2301,Js=2302,ea=2303,na=2400,ia=2401,sa=2402;var ol=3200;var xo=0,al=1,Rn="",ve="srgb",Zi="srgb-linear",Ji="linear",Zt="srgb";var ei=7680;var ra=519,cl=512,ll=513,hl=514,yo=515,ul=516,fl=517,vo=518,dl=519,oa=35044;var Ia="300 es",Ke=2e3,Ti=2001;function Sh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ah(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Ei(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function pl(){let i=Ei("canvas");return i.style.display="block",i}var mc={},Ci=null;function La(...i){let t="THREE."+i.shift();Ci?Ci("log",t,...i):console.log(t,...i)}function ml(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Et(...i){i=ml(i);let t="THREE."+i.shift();if(Ci)Ci("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Ct(...i){i=ml(i);let t="THREE."+i.shift();if(Ci)Ci("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function ni(...i){let t=i.join(" ");t in mc||(mc[t]=!0,Et(...i))}function gl(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var _l={[Qs]:tr,[er]:sr,[nr]:rr,[si]:ir,[tr]:Qs,[sr]:er,[rr]:nr,[ir]:si},hn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Te=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Io=Math.PI/180,lr=180/Math.PI;function ys(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Te[i&255]+Te[i>>8&255]+Te[i>>16&255]+Te[i>>24&255]+"-"+Te[t&255]+Te[t>>8&255]+"-"+Te[t>>16&15|64]+Te[t>>24&255]+"-"+Te[e&63|128]+Te[e>>8&255]+"-"+Te[e>>16&255]+Te[e>>24&255]+Te[n&255]+Te[n>>8&255]+Te[n>>16&255]+Te[n>>24&255]).toLowerCase()}function kt(i,t,e){return Math.max(t,Math.min(e,i))}function wh(i,t){return(i%t+t)%t}function Lo(i,t,e){return(1-e)*i+e*t}function Gi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function De(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Gt=class i{static{i.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=kt(this.x,t.x,e.x),this.y=kt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=kt(this.x,t,e),this.y=kt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},un=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],u=r[o+0],d=r[o+1],p=r[o+2],y=r[o+3];if(f!==y||l!==u||c!==d||h!==p){let g=l*u+c*d+h*p+f*y;g<0&&(u=-u,d=-d,p=-p,y=-y,g=-g);let m=1-a;if(g<.9995){let S=Math.acos(g),C=Math.sin(S);m=Math.sin(m*S)/C,a=Math.sin(a*S)/C,l=l*m+u*a,c=c*m+d*a,h=h*m+p*a,f=f*m+y*a}else{l=l*m+u*a,c=c*m+d*a,h=h*m+p*a,f=f*m+y*a;let S=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=S,c*=S,h*=S,f*=S}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[o],u=r[o+1],d=r[o+2],p=r[o+3];return t[e]=a*p+h*f+l*d-c*u,t[e+1]=l*p+h*u+c*f-a*d,t[e+2]=c*p+h*d+a*u-l*f,t[e+3]=h*p-a*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),f=a(r/2),u=l(n/2),d=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"YXZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"ZXY":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"ZYX":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"YZX":this._x=u*h*f+c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f-u*d*p;break;case"XZY":this._x=u*h*f-c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f+u*d*p;break;default:Et("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>f){let d=2*Math.sqrt(1+n-a-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>f){let d=2*Math.sqrt(1+a-n-f);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+f-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(kt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class i{static{i.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(gc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(gc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),f=2*(r*n-o*e);return this.x=e+l*c+o*f-a*h,this.y=n+l*h+a*c-r*f,this.z=s+l*f+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=kt(this.x,t.x,e.x),this.y=kt(this.y,t.y,e.y),this.z=kt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=kt(this.x,t,e),this.y=kt(this.y,t,e),this.z=kt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Do.copy(this).projectOnVector(t),this.sub(Do)}reflect(t){return this.sub(Do.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Do=new H,gc=new un,Pt=class i{static{i.prototype.isMatrix3=!0}constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],p=n[8],y=s[0],g=s[3],m=s[6],S=s[1],C=s[4],v=s[7],E=s[2],A=s[5],R=s[8];return r[0]=o*y+a*S+l*E,r[3]=o*g+a*C+l*A,r[6]=o*m+a*v+l*R,r[1]=c*y+h*S+f*E,r[4]=c*g+h*C+f*A,r[7]=c*m+h*v+f*R,r[2]=u*y+d*S+p*E,r[5]=u*g+d*C+p*A,r[8]=u*m+d*v+p*R,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,u=a*l-h*r,d=c*r-o*l,p=e*f+n*u+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/p;return t[0]=f*y,t[1]=(s*c-h*n)*y,t[2]=(a*n-s*o)*y,t[3]=u*y,t[4]=(h*e-s*l)*y,t[5]=(s*r-a*e)*y,t[6]=d*y,t[7]=(n*l-c*e)*y,t[8]=(o*e-n*r)*y,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return ni("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(No.makeScale(t,e)),this}rotate(t){return ni("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(No.makeRotation(-t)),this}translate(t,e){return ni("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(No.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},No=new Pt,_c=new Pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xc=new Pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Th(){let i={enabled:!0,workingColorSpace:Zi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Zt&&(s.r=An(s.r),s.g=An(s.g),s.b=An(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Zt&&(s.r=wi(s.r),s.g=wi(s.g),s.b=wi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Rn?Ji:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ni("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ni("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Zi]:{primaries:t,whitePoint:n,transfer:Ji,toXYZ:_c,fromXYZ:xc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ve},outputColorSpaceConfig:{drawingBufferColorSpace:ve}},[ve]:{primaries:t,whitePoint:n,transfer:Zt,toXYZ:_c,fromXYZ:xc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ve}}}),i}var Vt=Th();function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function wi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var fi,hr=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{fi===void 0&&(fi=Ei("canvas")),fi.width=t.width,fi.height=t.height;let s=fi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=fi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Ei("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=An(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(An(e[n]/255)*255):e[n]=An(e[n]);return{data:e,width:t.width,height:t.height}}else return Et("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Eh=0,Ri=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Eh++}),this.uuid=ys(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Uo(s[o].image)):r.push(Uo(s[o]))}else r=Uo(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Uo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?hr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Et("Texture: Unable to serialize Texture."),{})}var Ch=0,Fo=new H,be=class i extends hn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=cn,s=cn,r=ue,o=pn,a=Ze,l=Ne,c=i.DEFAULT_ANISOTROPY,h=Rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ch++}),this.uuid=ys(),this.name="",this.source=new Ri(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Fo).x}get height(){return this.source.getSize(Fo).y}get depth(){return this.source.getSize(Fo).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Et(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Et(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Sa)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case or:t.x=t.x-Math.floor(t.x);break;case cn:t.x=t.x<0?0:1;break;case ar:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case or:t.y=t.y-Math.floor(t.y);break;case cn:t.y=t.y<0?0:1;break;case ar:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};be.DEFAULT_IMAGE=null;be.DEFAULT_MAPPING=Sa;be.DEFAULT_ANISOTROPY=1;var se=class i{static{i.prototype.isVector4=!0}constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],p=l[9],y=l[2],g=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-y)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+y)<.1&&Math.abs(p+g)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let C=(c+1)/2,v=(d+1)/2,E=(m+1)/2,A=(h+u)/4,R=(f+y)/4,x=(p+g)/4;return C>v&&C>E?C<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(C),s=A/n,r=R/n):v>E?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=A/s,r=x/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=x/r),this.set(n,s,r,e),this}let S=Math.sqrt((g-p)*(g-p)+(f-y)*(f-y)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(g-p)/S,this.y=(f-y)/S,this.z=(u-h)/S,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=kt(this.x,t.x,e.x),this.y=kt(this.y,t.y,e.y),this.z=kt(this.z,t.z,e.z),this.w=kt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=kt(this.x,t,e),this.y=kt(this.y,t,e),this.z=kt(this.z,t,e),this.w=kt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ur=class extends hn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ue,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new be(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:ue,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Ri(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},ze=class extends ur{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},$i=class extends be{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Me,this.minFilter=Me,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var fr=class extends be{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Me,this.minFilter=Me,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ae=class i{static{i.prototype.isMatrix4=!0}constructor(t,e,n,s,r,o,a,l,c,h,f,u,d,p,y,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,f,u,d,p,y,g)}set(t,e,n,s,r,o,a,l,c,h,f,u,d,p,y,g){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=f,m[14]=u,m[3]=d,m[7]=p,m[11]=y,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/di.setFromMatrixColumn(t,0).length(),r=1/di.setFromMatrixColumn(t,1).length(),o=1/di.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let u=o*h,d=o*f,p=a*h,y=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+p*c,e[5]=u-y*c,e[9]=-a*l,e[2]=y-u*c,e[6]=p+d*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,d=l*f,p=c*h,y=c*f;e[0]=u+y*a,e[4]=p*a-d,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=d*a-p,e[6]=y+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,d=l*f,p=c*h,y=c*f;e[0]=u-y*a,e[4]=-o*f,e[8]=p+d*a,e[1]=d+p*a,e[5]=o*h,e[9]=y-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,d=o*f,p=a*h,y=a*f;e[0]=l*h,e[4]=p*c-d,e[8]=u*c+y,e[1]=l*f,e[5]=y*c+u,e[9]=d*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,d=o*c,p=a*l,y=a*c;e[0]=l*h,e[4]=y-u*f,e[8]=p*f+d,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*f+p,e[10]=u-y*f}else if(t.order==="XZY"){let u=o*l,d=o*c,p=a*l,y=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+y,e[5]=o*h,e[9]=d*f-p,e[2]=p*f-d,e[6]=a*h,e[10]=y*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Rh,t,Ph)}lookAt(t,e,n){let s=this.elements;return Fe.subVectors(t,e),Fe.lengthSq()===0&&(Fe.z=1),Fe.normalize(),Dn.crossVectors(n,Fe),Dn.lengthSq()===0&&(Math.abs(n.z)===1?Fe.x+=1e-4:Fe.z+=1e-4,Fe.normalize(),Dn.crossVectors(n,Fe)),Dn.normalize(),Rs.crossVectors(Fe,Dn),s[0]=Dn.x,s[4]=Rs.x,s[8]=Fe.x,s[1]=Dn.y,s[5]=Rs.y,s[9]=Fe.y,s[2]=Dn.z,s[6]=Rs.z,s[10]=Fe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],p=n[2],y=n[6],g=n[10],m=n[14],S=n[3],C=n[7],v=n[11],E=n[15],A=s[0],R=s[4],x=s[8],w=s[12],D=s[1],L=s[5],N=s[9],J=s[13],$=s[2],W=s[6],O=s[10],Y=s[14],Q=s[3],nt=s[7],lt=s[11],ut=s[15];return r[0]=o*A+a*D+l*$+c*Q,r[4]=o*R+a*L+l*W+c*nt,r[8]=o*x+a*N+l*O+c*lt,r[12]=o*w+a*J+l*Y+c*ut,r[1]=h*A+f*D+u*$+d*Q,r[5]=h*R+f*L+u*W+d*nt,r[9]=h*x+f*N+u*O+d*lt,r[13]=h*w+f*J+u*Y+d*ut,r[2]=p*A+y*D+g*$+m*Q,r[6]=p*R+y*L+g*W+m*nt,r[10]=p*x+y*N+g*O+m*lt,r[14]=p*w+y*J+g*Y+m*ut,r[3]=S*A+C*D+v*$+E*Q,r[7]=S*R+C*L+v*W+E*nt,r[11]=S*x+C*N+v*O+E*lt,r[15]=S*w+C*J+v*Y+E*ut,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],p=t[3],y=t[7],g=t[11],m=t[15],S=l*d-c*u,C=a*d-c*f,v=a*u-l*f,E=o*d-c*h,A=o*u-l*h,R=o*f-a*h;return e*(y*S-g*C+m*v)-n*(p*S-g*E+m*A)+s*(p*C-y*E+m*R)-r*(p*v-y*A+g*R)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],p=t[12],y=t[13],g=t[14],m=t[15],S=e*a-n*o,C=e*l-s*o,v=e*c-r*o,E=n*l-s*a,A=n*c-r*a,R=s*c-r*l,x=h*y-f*p,w=h*g-u*p,D=h*m-d*p,L=f*g-u*y,N=f*m-d*y,J=u*m-d*g,$=S*J-C*N+v*L+E*D-A*w+R*x;if($===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let W=1/$;return t[0]=(a*J-l*N+c*L)*W,t[1]=(s*N-n*J-r*L)*W,t[2]=(y*R-g*A+m*E)*W,t[3]=(u*A-f*R-d*E)*W,t[4]=(l*D-o*J-c*w)*W,t[5]=(e*J-s*D+r*w)*W,t[6]=(g*v-p*R-m*C)*W,t[7]=(h*R-u*v+d*C)*W,t[8]=(o*N-a*D+c*x)*W,t[9]=(n*D-e*N-r*x)*W,t[10]=(p*A-y*v+m*S)*W,t[11]=(f*v-h*A-d*S)*W,t[12]=(a*w-o*L-l*x)*W,t[13]=(e*L-n*w+s*x)*W,t[14]=(y*C-p*E-g*S)*W,t[15]=(h*E-f*C+u*S)*W,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,f=a+a,u=r*c,d=r*h,p=r*f,y=o*h,g=o*f,m=a*f,S=l*c,C=l*h,v=l*f,E=n.x,A=n.y,R=n.z;return s[0]=(1-(y+m))*E,s[1]=(d+v)*E,s[2]=(p-C)*E,s[3]=0,s[4]=(d-v)*A,s[5]=(1-(u+m))*A,s[6]=(g+S)*A,s[7]=0,s[8]=(p+C)*R,s[9]=(g-S)*R,s[10]=(1-(u+y))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=di.set(s[0],s[1],s[2]).length(),a=di.set(s[4],s[5],s[6]).length(),l=di.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Je.copy(this);let c=1/o,h=1/a,f=1/l;return Je.elements[0]*=c,Je.elements[1]*=c,Je.elements[2]*=c,Je.elements[4]*=h,Je.elements[5]*=h,Je.elements[6]*=h,Je.elements[8]*=f,Je.elements[9]*=f,Je.elements[10]*=f,e.setFromRotationMatrix(Je),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=Ke,l=!1){let c=this.elements,h=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),p,y;if(l)p=r/(o-r),y=o*r/(o-r);else if(a===Ke)p=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===Ti)p=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Ke,l=!1){let c=this.elements,h=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),d=-(n+s)/(n-s),p,y;if(l)p=1/(o-r),y=o/(o-r);else if(a===Ke)p=-2/(o-r),y=-(o+r)/(o-r);else if(a===Ti)p=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},di=new H,Je=new ae,Rh=new H(0,0,0),Ph=new H(1,1,1),Dn=new H,Rs=new H,Fe=new H,yc=new ae,vc=new un,Tn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(kt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-kt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(kt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-kt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(kt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Et("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return yc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(yc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return vc.setFromEuler(this),this.setFromQuaternion(vc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Tn.DEFAULT_ORDER="XYZ";var ji=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Ih=0,Mc=new H,pi=new un,xn=new ae,Ps=new H,Hi=new H,Lh=new H,Dh=new un,bc=new H(1,0,0),Sc=new H(0,1,0),Ac=new H(0,0,1),wc={type:"added"},Nh={type:"removed"},mi={type:"childadded",child:null},Oo={type:"childremoved",child:null},Ce=class i extends hn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ih++}),this.uuid=ys(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new H,e=new Tn,n=new un,s=new H(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Pt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ji,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return pi.setFromAxisAngle(t,e),this.quaternion.multiply(pi),this}rotateOnWorldAxis(t,e){return pi.setFromAxisAngle(t,e),this.quaternion.premultiply(pi),this}rotateX(t){return this.rotateOnAxis(bc,t)}rotateY(t){return this.rotateOnAxis(Sc,t)}rotateZ(t){return this.rotateOnAxis(Ac,t)}translateOnAxis(t,e){return Mc.copy(t).applyQuaternion(this.quaternion),this.position.add(Mc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(bc,t)}translateY(t){return this.translateOnAxis(Sc,t)}translateZ(t){return this.translateOnAxis(Ac,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ps.copy(t):Ps.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Hi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(Hi,Ps,this.up):xn.lookAt(Ps,Hi,this.up),this.quaternion.setFromRotationMatrix(xn),s&&(xn.extractRotation(s.matrixWorld),pi.setFromRotationMatrix(xn),this.quaternion.premultiply(pi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ct("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(wc),mi.child=t,this.dispatchEvent(mi),mi.child=null):Ct("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Nh),Oo.child=t,this.dispatchEvent(Oo),Oo.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(xn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(wc),mi.child=t,this.dispatchEvent(mi),mi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hi,t,Lh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hi,Dh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),u=o(t.skeletons),d=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Ce.DEFAULT_UP=new H(0,1,0);Ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Sn=class extends Ce{constructor(){super(),this.isGroup=!0,this.type="Group"}},Uh={type:"move"},Pi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Sn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Sn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Sn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let y of t.hand.values()){let g=e.getJointPose(y,n),m=this._getHandJoint(c,y);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,p=.005;c.inputState.pinching&&u>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Uh)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Sn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},xl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},Is={h:0,s:0,l:0};function Bo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Ft=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ve){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Vt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Vt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Vt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Vt.workingColorSpace){if(t=wh(t,1),e=kt(e,0,1),n=kt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Bo(o,r,t+1/3),this.g=Bo(o,r,t),this.b=Bo(o,r,t-1/3)}return Vt.colorSpaceToWorking(this,s),this}setStyle(t,e=ve){function n(r){r!==void 0&&parseFloat(r)<1&&Et("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Et("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Et("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ve){let n=xl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Et("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=An(t.r),this.g=An(t.g),this.b=An(t.b),this}copyLinearToSRGB(t){return this.r=wi(t.r),this.g=wi(t.g),this.b=wi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ve){return Vt.workingToColorSpace(Ee.copy(this),t),Math.round(kt(Ee.r*255,0,255))*65536+Math.round(kt(Ee.g*255,0,255))*256+Math.round(kt(Ee.b*255,0,255))}getHexString(t=ve){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Vt.workingColorSpace){Vt.workingToColorSpace(Ee.copy(this),e);let n=Ee.r,s=Ee.g,r=Ee.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Vt.workingColorSpace){return Vt.workingToColorSpace(Ee.copy(this),e),t.r=Ee.r,t.g=Ee.g,t.b=Ee.b,t}getStyle(t=ve){Vt.workingToColorSpace(Ee.copy(this),t);let e=Ee.r,n=Ee.g,s=Ee.b;return t!==ve?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Nn),this.setHSL(Nn.h+t,Nn.s+e,Nn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Nn),t.getHSL(Is);let n=Lo(Nn.h,Is.h,e),s=Lo(Nn.s,Is.s,e),r=Lo(Nn.l,Is.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ee=new Ft;Ft.NAMES=xl;var Ki=class extends Ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},$e=new H,yn=new H,zo=new H,vn=new H,gi=new H,_i=new H,Tc=new H,Vo=new H,ko=new H,Go=new H,Ho=new se,Wo=new se,Xo=new se,zn=class i{constructor(t=new H,e=new H,n=new H){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),$e.subVectors(t,e),s.cross($e);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){$e.subVectors(s,e),yn.subVectors(n,e),zo.subVectors(t,e);let o=$e.dot($e),a=$e.dot(yn),l=$e.dot(zo),c=yn.dot(yn),h=yn.dot(zo),f=o*c-a*a;if(f===0)return r.set(0,0,0),null;let u=1/f,d=(c*l-a*h)*u,p=(o*h-a*l)*u;return r.set(1-d-p,p,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vn.x),l.addScaledVector(o,vn.y),l.addScaledVector(a,vn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Ho.setScalar(0),Wo.setScalar(0),Xo.setScalar(0),Ho.fromBufferAttribute(t,e),Wo.fromBufferAttribute(t,n),Xo.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Ho,r.x),o.addScaledVector(Wo,r.y),o.addScaledVector(Xo,r.z),o}static isFrontFacing(t,e,n,s){return $e.subVectors(n,e),yn.subVectors(t,e),$e.cross(yn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $e.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),$e.cross(yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;gi.subVectors(s,n),_i.subVectors(r,n),Vo.subVectors(t,n);let l=gi.dot(Vo),c=_i.dot(Vo);if(l<=0&&c<=0)return e.copy(n);ko.subVectors(t,s);let h=gi.dot(ko),f=_i.dot(ko);if(h>=0&&f<=h)return e.copy(s);let u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(gi,o);Go.subVectors(t,r);let d=gi.dot(Go),p=_i.dot(Go);if(p>=0&&d<=p)return e.copy(r);let y=d*c-l*p;if(y<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(_i,a);let g=h*p-d*f;if(g<=0&&f-h>=0&&d-p>=0)return Tc.subVectors(r,s),a=(f-h)/(f-h+(d-p)),e.copy(s).addScaledVector(Tc,a);let m=1/(g+y+u);return o=y*m,a=u*m,e.copy(n).addScaledVector(gi,o).addScaledVector(_i,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},kn=class{constructor(t=new H(1/0,1/0,1/0),e=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(je.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(je.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=je.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,je):je.fromBufferAttribute(r,o),je.applyMatrix4(t.matrixWorld),this.expandByPoint(je);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ls.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ls.copy(n.boundingBox)),Ls.applyMatrix4(t.matrixWorld),this.union(Ls)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,je),je.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wi),Ds.subVectors(this.max,Wi),xi.subVectors(t.a,Wi),yi.subVectors(t.b,Wi),vi.subVectors(t.c,Wi),Un.subVectors(yi,xi),Fn.subVectors(vi,yi),jn.subVectors(xi,vi);let e=[0,-Un.z,Un.y,0,-Fn.z,Fn.y,0,-jn.z,jn.y,Un.z,0,-Un.x,Fn.z,0,-Fn.x,jn.z,0,-jn.x,-Un.y,Un.x,0,-Fn.y,Fn.x,0,-jn.y,jn.x,0];return!Yo(e,xi,yi,vi,Ds)||(e=[1,0,0,0,1,0,0,0,1],!Yo(e,xi,yi,vi,Ds))?!1:(Ns.crossVectors(Un,Fn),e=[Ns.x,Ns.y,Ns.z],Yo(e,xi,yi,vi,Ds))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,je).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(je).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Mn=[new H,new H,new H,new H,new H,new H,new H,new H],je=new H,Ls=new kn,xi=new H,yi=new H,vi=new H,Un=new H,Fn=new H,jn=new H,Wi=new H,Ds=new H,Ns=new H,Kn=new H;function Yo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Kn.fromArray(i,r);let a=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),l=t.dot(Kn),c=e.dot(Kn),h=n.dot(Kn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var ge=new H,Us=new Gt,Fh=0,Ie=class extends hn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Fh++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=oa,this.updateRanges=[],this.gpuType=en,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Us.fromBufferAttribute(this,e),Us.applyMatrix3(t),this.setXY(e,Us.x,Us.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix4(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyNormalMatrix(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.transformDirection(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Gi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=De(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Gi(e,this.array)),e}setX(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Gi(e,this.array)),e}setY(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Gi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Gi(e,this.array)),e}setW(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array),s=De(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array),s=De(s,this.array),r=De(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==oa&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}};var Qi=class extends Ie{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var ts=class extends Ie{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Be=class extends Ie{constructor(t,e,n){super(new Float32Array(t),e,n)}},Oh=new kn,Xi=new H,qo=new H,Ii=class{constructor(t=new H,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Oh.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xi.subVectors(t,this.center);let e=Xi.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(qo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xi.copy(t.center).add(qo)),this.expandByPoint(Xi.copy(t.center).sub(qo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Bh=0,Xe=new ae,Zo=new Ce,Mi=new H,Oe=new kn,Yi=new kn,ye=new H,Ye=class i extends hn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bh++}),this.uuid=ys(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Sh(t)?ts:Qi)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Pt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Xe.makeRotationFromQuaternion(t),this.applyMatrix4(Xe),this}rotateX(t){return Xe.makeRotationX(t),this.applyMatrix4(Xe),this}rotateY(t){return Xe.makeRotationY(t),this.applyMatrix4(Xe),this}rotateZ(t){return Xe.makeRotationZ(t),this.applyMatrix4(Xe),this}translate(t,e,n){return Xe.makeTranslation(t,e,n),this.applyMatrix4(Xe),this}scale(t,e,n){return Xe.makeScale(t,e,n),this.applyMatrix4(Xe),this}lookAt(t){return Zo.lookAt(t),Zo.updateMatrix(),this.applyMatrix4(Zo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mi).negate(),this.translate(Mi.x,Mi.y,Mi.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Be(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Et("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ct("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Oe.setFromBufferAttribute(r),this.morphTargetsRelative?(ye.addVectors(this.boundingBox.min,Oe.min),this.boundingBox.expandByPoint(ye),ye.addVectors(this.boundingBox.max,Oe.max),this.boundingBox.expandByPoint(ye)):(this.boundingBox.expandByPoint(Oe.min),this.boundingBox.expandByPoint(Oe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ct('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ii);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ct("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){let n=this.boundingSphere.center;if(Oe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Yi.setFromBufferAttribute(a),this.morphTargetsRelative?(ye.addVectors(Oe.min,Yi.min),Oe.expandByPoint(ye),ye.addVectors(Oe.max,Yi.max),Oe.expandByPoint(ye)):(Oe.expandByPoint(Yi.min),Oe.expandByPoint(Yi.max))}Oe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ye.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ye));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ye.fromBufferAttribute(a,c),l&&(Mi.fromBufferAttribute(t,c),ye.add(Mi)),s=Math.max(s,n.distanceToSquared(ye))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ct('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ct("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Ie(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let x=0;x<n.count;x++)a[x]=new H,l[x]=new H;let c=new H,h=new H,f=new H,u=new Gt,d=new Gt,p=new Gt,y=new H,g=new H;function m(x,w,D){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,w),f.fromBufferAttribute(n,D),u.fromBufferAttribute(r,x),d.fromBufferAttribute(r,w),p.fromBufferAttribute(r,D),h.sub(c),f.sub(c),d.sub(u),p.sub(u);let L=1/(d.x*p.y-p.x*d.y);isFinite(L)&&(y.copy(h).multiplyScalar(p.y).addScaledVector(f,-d.y).multiplyScalar(L),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(L),a[x].add(y),a[w].add(y),a[D].add(y),l[x].add(g),l[w].add(g),l[D].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let x=0,w=S.length;x<w;++x){let D=S[x],L=D.start,N=D.count;for(let J=L,$=L+N;J<$;J+=3)m(t.getX(J+0),t.getX(J+1),t.getX(J+2))}let C=new H,v=new H,E=new H,A=new H;function R(x){E.fromBufferAttribute(s,x),A.copy(E);let w=a[x];C.copy(w),C.sub(E.multiplyScalar(E.dot(w))).normalize(),v.crossVectors(A,w);let L=v.dot(l[x])<0?-1:1;o.setXYZW(x,C.x,C.y,C.z,L)}for(let x=0,w=S.length;x<w;++x){let D=S[x],L=D.start,N=D.count;for(let J=L,$=L+N;J<$;J+=3)R(t.getX(J+0)),R(t.getX(J+1)),R(t.getX(J+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Ie(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);let s=new H,r=new H,o=new H,a=new H,l=new H,c=new H,h=new H,f=new H;if(t)for(let u=0,d=t.count;u<d;u+=3){let p=t.getX(u+0),y=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,g),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ye.fromBufferAttribute(t,e),ye.normalize(),t.setXYZ(e,ye.x,ye.y,ye.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h),d=0,p=0;for(let y=0,g=l.length;y<g;y++){a.isInterleavedBufferAttribute?d=l[y]*a.data.stride+a.offset:d=l[y]*h;for(let m=0;m<h;m++)u[p++]=c[d++]}return new Ie(u,h,f)}if(this.index===null)return Et("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,f=c.length;h<f;h++){let u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){let d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var zh=0,Qe=class extends hn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zh++}),this.uuid=ys(),this.name="",this.type="Material",this.blending=ii,this.side=wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=js,this.blendDst=Ks,this.blendEquation=Vn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ft(0,0,0),this.blendAlpha=0,this.depthFunc=si,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ra,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ei,this.stencilZFail=ei,this.stencilZPass=ei,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Et(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Et(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ii&&(n.blending=this.blending),this.side!==wn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==js&&(n.blendSrc=this.blendSrc),this.blendDst!==Ks&&(n.blendDst=this.blendDst),this.blendEquation!==Vn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==si&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ra&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ei&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ei&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ei&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ft().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Gt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Gt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var bn=new H,Jo=new H,Fs=new H,On=new H,$o=new H,Os=new H,jo=new H,dr=class{constructor(t=new H,e=new H(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(bn.copy(this.origin).addScaledVector(this.direction,e),bn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Jo.copy(t).add(e).multiplyScalar(.5),Fs.copy(e).sub(t).normalize(),On.copy(this.origin).sub(Jo);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Fs),a=On.dot(this.direction),l=-On.dot(Fs),c=On.lengthSq(),h=Math.abs(1-o*o),f,u,d,p;if(h>0)if(f=o*l-a,u=o*a-l,p=r*h,f>=0)if(u>=-p)if(u<=p){let y=1/h;f*=y,u*=y,d=f*(f+o*u+2*a)+u*(o*f+u+2*l)+c}else u=r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;else u<=-p?(f=Math.max(0,-(-o*r+a)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(o*r+a)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=o>0?-r:r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Jo).addScaledVector(Fs,u),d}intersectSphere(t,e){bn.subVectors(t.center,this.origin);let n=bn.dot(this.direction),s=bn.dot(bn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,bn)!==null}intersectTriangle(t,e,n,s,r){$o.subVectors(e,t),Os.subVectors(n,t),jo.crossVectors($o,Os);let o=this.direction.dot(jo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;On.subVectors(this.origin,t);let l=a*this.direction.dot(Os.crossVectors(On,Os));if(l<0)return null;let c=a*this.direction.dot($o.cross(On));if(c<0||l+c>o)return null;let h=-a*On.dot(jo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},es=class extends Qe{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=ma,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Ec=new ae,Qn=new dr,Bs=new Ii,Cc=new H,zs=new H,Vs=new H,ks=new H,Ko=new H,Gs=new H,Rc=new H,Hs=new H,Se=class extends Ce{constructor(t=new Ye,e=new es){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Gs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],f=r[l];h!==0&&(Ko.fromBufferAttribute(f,t),o?Gs.addScaledVector(Ko,h):Gs.addScaledVector(Ko.sub(e),h))}e.add(Gs)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Bs.copy(n.boundingSphere),Bs.applyMatrix4(r),Qn.copy(t.ray).recast(t.near),!(Bs.containsPoint(Qn.origin)===!1&&(Qn.intersectSphere(Bs,Cc)===null||Qn.origin.distanceToSquared(Cc)>(t.far-t.near)**2))&&(Ec.copy(r).invert(),Qn.copy(t.ray).applyMatrix4(Ec),!(n.boundingBox!==null&&Qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Qn)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,y=u.length;p<y;p++){let g=u[p],m=o[g.materialIndex],S=Math.max(g.start,d.start),C=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let v=S,E=C;v<E;v+=3){let A=a.getX(v),R=a.getX(v+1),x=a.getX(v+2);s=Ws(this,m,t,n,c,h,f,A,R,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,d.start),y=Math.min(a.count,d.start+d.count);for(let g=p,m=y;g<m;g+=3){let S=a.getX(g),C=a.getX(g+1),v=a.getX(g+2);s=Ws(this,o,t,n,c,h,f,S,C,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,y=u.length;p<y;p++){let g=u[p],m=o[g.materialIndex],S=Math.max(g.start,d.start),C=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let v=S,E=C;v<E;v+=3){let A=v,R=v+1,x=v+2;s=Ws(this,m,t,n,c,h,f,A,R,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,d.start),y=Math.min(l.count,d.start+d.count);for(let g=p,m=y;g<m;g+=3){let S=g,C=g+1,v=g+2;s=Ws(this,o,t,n,c,h,f,S,C,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function Vh(i,t,e,n,s,r,o,a){let l;if(t.side===Le?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===wn,a),l===null)return null;Hs.copy(a),Hs.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Hs);return c<e.near||c>e.far?null:{distance:c,point:Hs.clone(),object:i}}function Ws(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,zs),i.getVertexPosition(l,Vs),i.getVertexPosition(c,ks);let h=Vh(i,t,e,n,zs,Vs,ks,Rc);if(h){let f=new H;zn.getBarycoord(Rc,zs,Vs,ks,f),s&&(h.uv=zn.getInterpolatedAttribute(s,a,l,c,f,new Gt)),r&&(h.uv1=zn.getInterpolatedAttribute(r,a,l,c,f,new Gt)),o&&(h.normal=zn.getInterpolatedAttribute(o,a,l,c,f,new H),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new H,materialIndex:0};zn.getNormal(zs,Vs,ks,u.normal),h.face=u,h.barycoord=f}return h}var pr=class extends be{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Me,h=Me,f,u){super(null,o,a,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Qo=new H,kh=new H,Gh=new Pt,an=class{constructor(t=new H(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Qo.subVectors(n,e).cross(kh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Qo),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Gh.getNormalMatrix(t),s=this.coplanarPoint(Qo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ti=new Ii,Hh=new Gt(.5,.5),Xs=new H,Li=class{constructor(t=new an,e=new an,n=new an,s=new an,r=new an,o=new an){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Ke,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],p=r[8],y=r[9],g=r[10],m=r[11],S=r[12],C=r[13],v=r[14],E=r[15];if(s[0].setComponents(c-o,d-h,m-p,E-S).normalize(),s[1].setComponents(c+o,d+h,m+p,E+S).normalize(),s[2].setComponents(c+a,d+f,m+y,E+C).normalize(),s[3].setComponents(c-a,d-f,m-y,E-C).normalize(),n)s[4].setComponents(l,u,g,v).normalize(),s[5].setComponents(c-l,d-u,m-g,E-v).normalize();else if(s[4].setComponents(c-l,d-u,m-g,E-v).normalize(),e===Ke)s[5].setComponents(c+l,d+u,m+g,E+v).normalize();else if(e===Ti)s[5].setComponents(l,u,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ti.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ti.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ti)}intersectsSprite(t){ti.center.set(0,0,0);let e=Hh.distanceTo(t.center);return ti.radius=.7071067811865476+e,ti.applyMatrix4(t.matrixWorld),this.intersectsSphere(ti)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Xs.x=s.normal.x>0?t.max.x:t.min.x,Xs.y=s.normal.y>0?t.max.y:t.min.y,Xs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Xs)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ns=class extends be{constructor(t=[],e=Yn,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ri=class extends be{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var En=class extends be{constructor(t,e,n=tn,s,r,o,a=Me,l=Me,c,h=ln,f=1){if(h!==ln&&h!==qn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:f};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ri(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},mr=class extends En{constructor(t,e=tn,n=Yn,s,r,o=Me,a=Me,l,c=ln){let h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},is=class extends be{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Di=class i extends Ye{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],f=[],u=0,d=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,s,o,2),p("x","z","y",1,-1,t,n,-e,s,o,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Be(c,3)),this.setAttribute("normal",new Be(h,3)),this.setAttribute("uv",new Be(f,2));function p(y,g,m,S,C,v,E,A,R,x,w){let D=v/R,L=E/x,N=v/2,J=E/2,$=A/2,W=R+1,O=x+1,Y=0,Q=0,nt=new H;for(let lt=0;lt<O;lt++){let ut=lt*L-J;for(let gt=0;gt<W;gt++){let zt=gt*D-N;nt[y]=zt*S,nt[g]=ut*C,nt[m]=$,c.push(nt.x,nt.y,nt.z),nt[y]=0,nt[g]=0,nt[m]=A>0?1:-1,h.push(nt.x,nt.y,nt.z),f.push(gt/R),f.push(1-lt/x),Y+=1}}for(let lt=0;lt<x;lt++)for(let ut=0;ut<R;ut++){let gt=u+ut+W*lt,zt=u+ut+W*(lt+1),ee=u+(ut+1)+W*(lt+1),Ht=u+(ut+1)+W*lt;l.push(gt,zt,Ht),l.push(zt,ee,Ht),Q+=6}a.addGroup(d,Q,w),d+=Q,u+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var fn=class i extends Ye{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,f=t/a,u=e/l,d=[],p=[],y=[],g=[];for(let m=0;m<h;m++){let S=m*u-o;for(let C=0;C<c;C++){let v=C*f-r;p.push(v,-S,0),y.push(0,0,1),g.push(C/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let S=0;S<a;S++){let C=S+c*m,v=S+c*(m+1),E=S+1+c*(m+1),A=S+1+c*m;d.push(C,v,A),d.push(v,E,A)}this.setIndex(d),this.setAttribute("position",new Be(p,3)),this.setAttribute("normal",new Be(y,3)),this.setAttribute("uv",new Be(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var ss=class extends Qe{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ft(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}};function ci(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Pc(s))s.isRenderTargetTexture?(Et("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Pc(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function Re(i){let t={};for(let e=0;e<i.length;e++){let n=ci(i[e]);for(let s in n)t[s]=n[s]}return t}function Pc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Wh(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Da(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Vt.workingColorSpace}var yl={clone:ci,merge:Re},Xh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ve=class extends Qe{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Xh,this.fragmentShader=Yh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ci(t.uniforms),this.uniformsGroups=Wh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Ft().setHex(s.value);break;case"v2":this.uniforms[n].value=new Gt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new H().fromArray(s.value);break;case"v4":this.uniforms[n].value=new se().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Pt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ae().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},gr=class extends Ve{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Cn=class extends Qe{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ft(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ft(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xo,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var _r=class extends Qe{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ol,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},xr=class extends Qe{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ys(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}var Gn=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},yr=class extends Gn{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:na,endingEnd:na}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ia:r=t,a=2*e-n;break;case sa:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ia:o=t,l=2*n-e;break;case sa:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(n-e)/(s-e),y=p*p,g=y*p,m=-u*g+2*u*y-u*p,S=(1+u)*g+(-1.5-2*u)*y+(-.5+u)*p+1,C=(-1-d)*g+(1.5+d)*y+.5*p,v=d*g-d*y;for(let E=0;E!==a;++E)r[E]=m*o[h+E]+S*o[c+E]+C*o[l+E]+v*o[f+E];return r}},vr=class extends Gn{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),f=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*f+o[l+u]*h;return r}},Mr=class extends Gn{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},br=class extends Gn{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,f=this.outTangents;if(!h||!f){let p=(n-e)/(s-e),y=1-p;for(let g=0;g!==a;++g)r[g]=o[c+g]*y+o[l+g]*p;return r}let u=a*2,d=t-1;for(let p=0;p!==a;++p){let y=o[c+p],g=o[l+p],m=d*u+p*2,S=f[m],C=f[m+1],v=t*u+p*2,E=h[v],A=h[v+1],R=(n-e)/(s-e),x,w,D,L,N;for(let J=0;J<8;J++){x=R*R,w=x*R,D=1-R,L=D*D,N=L*D;let W=N*e+3*L*R*S+3*D*x*E+w*s-n;if(Math.abs(W)<1e-10)break;let O=3*L*(S-e)+6*D*R*(E-S)+3*x*(s-E);if(Math.abs(O)<1e-10)break;R=R-W/O,R=Math.max(0,Math.min(1,R))}r[p]=N*y+3*L*R*C+3*D*x*A+w*g}return r}},ke=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ys(e,this.TimeBufferType),this.values=Ys(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ys(t.times,Array),values:Ys(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Mr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new vr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new yr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new br(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case qi:e=this.InterpolantFactoryMethodDiscrete;break;case cr:e=this.InterpolantFactoryMethodLinear;break;case Js:e=this.InterpolantFactoryMethodSmooth;break;case ea:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Et("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qi;case this.InterpolantFactoryMethodLinear:return cr;case this.InterpolantFactoryMethodSmooth:return Js;case this.InterpolantFactoryMethodBezier:return ea}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Ct("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ct("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Ct("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Ct("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Ah(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Ct("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Js,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let f=a*n,u=f-n,d=f+n;for(let p=0;p!==n;++p){let y=e[f+p];if(y!==e[u+p]||y!==e[d+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let f=a*n,u=o*n;for(let d=0;d!==n;++d)e[u+d]=e[f+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};ke.prototype.ValueTypeName="";ke.prototype.TimeBufferType=Float32Array;ke.prototype.ValueBufferType=Float32Array;ke.prototype.DefaultInterpolation=cr;var Hn=class extends ke{constructor(t,e,n){super(t,e,n)}};Hn.prototype.ValueTypeName="bool";Hn.prototype.ValueBufferType=Array;Hn.prototype.DefaultInterpolation=qi;Hn.prototype.InterpolantFactoryMethodLinear=void 0;Hn.prototype.InterpolantFactoryMethodSmooth=void 0;var Sr=class extends ke{constructor(t,e,n,s){super(t,e,n,s)}};Sr.prototype.ValueTypeName="color";var Ar=class extends ke{constructor(t,e,n,s){super(t,e,n,s)}};Ar.prototype.ValueTypeName="number";var wr=class extends Gn{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)un.slerpFlat(r,0,o,c-a,o,c,l);return r}},rs=class extends ke{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new wr(this.times,this.values,this.getValueSize(),t)}};rs.prototype.ValueTypeName="quaternion";rs.prototype.InterpolantFactoryMethodSmooth=void 0;var Wn=class extends ke{constructor(t,e,n){super(t,e,n)}};Wn.prototype.ValueTypeName="string";Wn.prototype.ValueBufferType=Array;Wn.prototype.DefaultInterpolation=qi;Wn.prototype.InterpolantFactoryMethodLinear=void 0;Wn.prototype.InterpolantFactoryMethodSmooth=void 0;var Tr=class extends ke{constructor(t,e,n,s){super(t,e,n,s)}};Tr.prototype.ValueTypeName="vector";var $s={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(Ic(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!Ic(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Ic(i){try{let t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var Er=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){let d=c[f],p=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},vl=new Er,Ni=class{constructor(t){this.manager=t!==void 0?t:vl,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Ni.DEFAULT_MATERIAL_NAME="__DEFAULT";var bi=new WeakMap,Cr=class extends Ni{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=$s.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let f=bi.get(o);f===void 0&&(f=[],bi.set(o,f)),f.push({onLoad:e,onError:s})}return o}let a=Ei("img");function l(){h(),e&&e(this);let f=bi.get(this)||[];for(let u=0;u<f.length;u++){let d=f[u];d.onLoad&&d.onLoad(this)}bi.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),$s.remove(`image:${t}`);let u=bi.get(this)||[];for(let d=0;d<u.length;d++){let p=u[d];p.onError&&p.onError(f)}bi.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),$s.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}};var os=class extends Ni{constructor(t){super(t)}load(t,e,n,s){let r=new be,o=new Cr(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},Ui=class extends Ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ft(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},as=class extends Ui{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ft(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},ta=new ae,Lc=new H,Dc=new H,Rr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Gt(512,512),this.mapType=Ne,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Li,this._frameExtents=new Gt(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Lc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Lc),Dc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Dc),e.updateMatrixWorld(),ta.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ta,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Ti||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ta)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},qs=new H,Zs=new un,on=new H,cs=class extends Ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Ke,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(qs,Zs,on),on.x===1&&on.y===1&&on.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(qs,Zs,on.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(qs,Zs,on),on.x===1&&on.y===1&&on.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(qs,Zs,on.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Bn=new H,Nc=new Gt,Uc=new Gt,Pe=class extends cs{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=lr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Io*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lr*2*Math.atan(Math.tan(Io*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z)}getViewSize(t,e){return this.getViewBounds(t,Nc,Uc),e.subVectors(Uc,Nc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Io*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var aa=class extends Rr{constructor(){super(new Pe(90,1,.5,500)),this.isPointLightShadow=!0}},ls=class extends Ui{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new aa}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Xn=class extends cs{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},ca=class extends Rr{constructor(){super(new Xn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},hs=class extends Ui{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ce.DEFAULT_UP),this.updateMatrix(),this.target=new Ce,this.shadow=new ca}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Si=-90,Ai=1,Pr=class extends Ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Pe(Si,Ai,t,e);s.layers=this.layers,this.add(s);let r=new Pe(Si,Ai,t,e);r.layers=this.layers,this.add(r);let o=new Pe(Si,Ai,t,e);o.layers=this.layers,this.add(o);let a=new Pe(Si,Ai,t,e);a.layers=this.layers,this.add(a);let l=new Pe(Si,Ai,t,e);l.layers=this.layers,this.add(l);let c=new Pe(Si,Ai,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Ke)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ti)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ir=class extends Pe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Na="\\[\\]\\.:\\/",qh=new RegExp("["+Na+"]","g"),Ua="[^"+Na+"]",Zh="[^"+Na.replace("\\.","")+"]",Jh=/((?:WC+[\/:])*)/.source.replace("WC",Ua),$h=/(WCOD+)?/.source.replace("WCOD",Zh),jh=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ua),Kh=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ua),Qh=new RegExp("^"+Jh+$h+jh+Kh+"$"),tu=["material","materials","bones","map"],la=class{constructor(t,e,n){let s=n||ne.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ne=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(qh,"")}static parseTrackName(t){let e=Qh.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);tu.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Et("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Ct("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ct("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ct("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ct("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ct("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ct("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Ct("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;Ct("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ct("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ct("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ne.Composite=la;ne.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ne.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ne.prototype.GetterByBindingType=[ne.prototype._getValue_direct,ne.prototype._getValue_array,ne.prototype._getValue_arrayElement,ne.prototype._getValue_toArray];ne.prototype.SetterByBindingTypeAndVersioning=[[ne.prototype._setValue_direct,ne.prototype._setValue_direct_setNeedsUpdate,ne.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ne.prototype._setValue_array,ne.prototype._setValue_array_setNeedsUpdate,ne.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ne.prototype._setValue_arrayElement,ne.prototype._setValue_arrayElement_setNeedsUpdate,ne.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ne.prototype._setValue_fromArray,ne.prototype._setValue_fromArray_setNeedsUpdate,ne.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var rg=new Float32Array(1);var ha=class i{static{i.prototype.isMatrix2=!0}constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};function Fa(i,t,e,n){let s=eu(n);switch(e){case Ca:return i*t;case Pa:return i*t/s.components*s.byteLength;case Br:return i*t/s.components*s.byteLength;case Zn:return i*t*2/s.components*s.byteLength;case zr:return i*t*2/s.components*s.byteLength;case Ra:return i*t*3/s.components*s.byteLength;case Ze:return i*t*4/s.components*s.byteLength;case Vr:return i*t*4/s.components*s.byteLength;case ds:case ps:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ms:case gs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Gr:case Wr:return Math.max(i,16)*Math.max(t,8)/4;case kr:case Hr:return Math.max(i,8)*Math.max(t,8)/2;case Xr:case Yr:case Zr:case Jr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case qr:case _s:case $r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case jr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Kr:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Qr:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case to:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case eo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case no:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case io:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case so:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ro:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case oo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ao:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case co:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case lo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case ho:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case uo:case fo:case po:return Math.ceil(i/4)*Math.ceil(t/4)*16;case mo:case go:return Math.ceil(i/4)*Math.ceil(t/4)*8;case xs:case _o:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function eu(i){switch(i){case Ne:case Aa:return{byteLength:1,components:1};case Oi:case wa:case mn:return{byteLength:2,components:1};case Fr:case Or:return{byteLength:2,components:4};case tn:case Ur:case en:return{byteLength:4,components:1};case Ta:case Ea:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Et("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Hl(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function lu(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,l,c){let h=l.array,f=l.updateRanges;if(i.bindBuffer(c,a),f.length===0)i.bufferSubData(c,0,h);else{f.sort((d,p)=>d.start-p.start);let u=0;for(let d=1;d<f.length;d++){let p=f[u],y=f[d];y.start<=p.start+p.count+1?p.count=Math.max(p.count,y.start+y.count-p.start):(++u,f[u]=y)}f.length=u+1;for(let d=0,p=f.length;d<p;d++){let y=f[d];i.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var hu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,du=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,_u=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,yu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,vu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Su=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Au=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Tu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Eu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ru=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Pu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Iu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Lu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Du=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Uu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Fu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ou=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Vu="gl_FragColor = linearToOutputTexel( gl_FragColor );",ku=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Hu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Wu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Xu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ju=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$u=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ju=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ku=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ef=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,nf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,sf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,of=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,af=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,uf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ff=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,df=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,pf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,mf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_f=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,yf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Mf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Af=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Tf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ef=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Cf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Pf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,If=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Df=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Nf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Uf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ff=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Of=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Bf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,kf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Wf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Zf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Jf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,$f=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,jf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Kf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Qf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,td=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ed=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,nd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,id=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,sd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,rd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,od=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ad=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ld=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,hd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ud=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fd=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,md=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_d=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,xd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,yd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,vd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Md=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ad=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Td=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ed=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cd=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Pd=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Id=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ld=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nd=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ud=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Fd=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Od=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zd=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Vd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kd=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gd=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hd=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Wd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ot={alphahash_fragment:hu,alphahash_pars_fragment:uu,alphamap_fragment:fu,alphamap_pars_fragment:du,alphatest_fragment:pu,alphatest_pars_fragment:mu,aomap_fragment:gu,aomap_pars_fragment:_u,batching_pars_vertex:xu,batching_vertex:yu,begin_vertex:vu,beginnormal_vertex:Mu,bsdfs:bu,iridescence_fragment:Su,bumpmap_pars_fragment:Au,clipping_planes_fragment:wu,clipping_planes_pars_fragment:Tu,clipping_planes_pars_vertex:Eu,clipping_planes_vertex:Cu,color_fragment:Ru,color_pars_fragment:Pu,color_pars_vertex:Iu,color_vertex:Lu,common:Du,cube_uv_reflection_fragment:Nu,defaultnormal_vertex:Uu,displacementmap_pars_vertex:Fu,displacementmap_vertex:Ou,emissivemap_fragment:Bu,emissivemap_pars_fragment:zu,colorspace_fragment:Vu,colorspace_pars_fragment:ku,envmap_fragment:Gu,envmap_common_pars_fragment:Hu,envmap_pars_fragment:Wu,envmap_pars_vertex:Xu,envmap_physical_pars_fragment:nf,envmap_vertex:Yu,fog_vertex:qu,fog_pars_vertex:Zu,fog_fragment:Ju,fog_pars_fragment:$u,gradientmap_pars_fragment:ju,lightmap_pars_fragment:Ku,lights_lambert_fragment:Qu,lights_lambert_pars_fragment:tf,lights_pars_begin:ef,lights_toon_fragment:sf,lights_toon_pars_fragment:rf,lights_phong_fragment:of,lights_phong_pars_fragment:af,lights_physical_fragment:cf,lights_physical_pars_fragment:lf,lights_fragment_begin:hf,lights_fragment_maps:uf,lights_fragment_end:ff,lightprobes_pars_fragment:df,logdepthbuf_fragment:pf,logdepthbuf_pars_fragment:mf,logdepthbuf_pars_vertex:gf,logdepthbuf_vertex:_f,map_fragment:xf,map_pars_fragment:yf,map_particle_fragment:vf,map_particle_pars_fragment:Mf,metalnessmap_fragment:bf,metalnessmap_pars_fragment:Sf,morphinstance_vertex:Af,morphcolor_vertex:wf,morphnormal_vertex:Tf,morphtarget_pars_vertex:Ef,morphtarget_vertex:Cf,normal_fragment_begin:Rf,normal_fragment_maps:Pf,normal_pars_fragment:If,normal_pars_vertex:Lf,normal_vertex:Df,normalmap_pars_fragment:Nf,clearcoat_normal_fragment_begin:Uf,clearcoat_normal_fragment_maps:Ff,clearcoat_pars_fragment:Of,iridescence_pars_fragment:Bf,opaque_fragment:zf,packing:Vf,premultiplied_alpha_fragment:kf,project_vertex:Gf,dithering_fragment:Hf,dithering_pars_fragment:Wf,roughnessmap_fragment:Xf,roughnessmap_pars_fragment:Yf,shadowmap_pars_fragment:qf,shadowmap_pars_vertex:Zf,shadowmap_vertex:Jf,shadowmask_pars_fragment:$f,skinbase_vertex:jf,skinning_pars_vertex:Kf,skinning_vertex:Qf,skinnormal_vertex:td,specularmap_fragment:ed,specularmap_pars_fragment:nd,tonemapping_fragment:id,tonemapping_pars_fragment:sd,transmission_fragment:rd,transmission_pars_fragment:od,uv_pars_fragment:ad,uv_pars_vertex:cd,uv_vertex:ld,worldpos_vertex:hd,background_vert:ud,background_frag:fd,backgroundCube_vert:dd,backgroundCube_frag:pd,cube_vert:md,cube_frag:gd,depth_vert:_d,depth_frag:xd,distance_vert:yd,distance_frag:vd,equirect_vert:Md,equirect_frag:bd,linedashed_vert:Sd,linedashed_frag:Ad,meshbasic_vert:wd,meshbasic_frag:Td,meshlambert_vert:Ed,meshlambert_frag:Cd,meshmatcap_vert:Rd,meshmatcap_frag:Pd,meshnormal_vert:Id,meshnormal_frag:Ld,meshphong_vert:Dd,meshphong_frag:Nd,meshphysical_vert:Ud,meshphysical_frag:Fd,meshtoon_vert:Od,meshtoon_frag:Bd,points_vert:zd,points_frag:Vd,shadow_vert:kd,shadow_frag:Gd,sprite_vert:Hd,sprite_frag:Wd},ft={common:{diffuse:{value:new Ft(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Pt},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Pt}},envmap:{envMap:{value:null},envMapRotation:{value:new Pt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Pt},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ft(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new Ft(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0},uvTransform:{value:new Pt}},sprite:{diffuse:{value:new Ft(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Pt},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0}}},_n={basic:{uniforms:Re([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Ot.meshbasic_vert,fragmentShader:Ot.meshbasic_frag},lambert:{uniforms:Re([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Ft(0)},envMapIntensity:{value:1}}]),vertexShader:Ot.meshlambert_vert,fragmentShader:Ot.meshlambert_frag},phong:{uniforms:Re([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Ft(0)},specular:{value:new Ft(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ot.meshphong_vert,fragmentShader:Ot.meshphong_frag},standard:{uniforms:Re([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new Ft(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag},toon:{uniforms:Re([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new Ft(0)}}]),vertexShader:Ot.meshtoon_vert,fragmentShader:Ot.meshtoon_frag},matcap:{uniforms:Re([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Ot.meshmatcap_vert,fragmentShader:Ot.meshmatcap_frag},points:{uniforms:Re([ft.points,ft.fog]),vertexShader:Ot.points_vert,fragmentShader:Ot.points_frag},dashed:{uniforms:Re([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ot.linedashed_vert,fragmentShader:Ot.linedashed_frag},depth:{uniforms:Re([ft.common,ft.displacementmap]),vertexShader:Ot.depth_vert,fragmentShader:Ot.depth_frag},normal:{uniforms:Re([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Ot.meshnormal_vert,fragmentShader:Ot.meshnormal_frag},sprite:{uniforms:Re([ft.sprite,ft.fog]),vertexShader:Ot.sprite_vert,fragmentShader:Ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ot.background_vert,fragmentShader:Ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Pt}},vertexShader:Ot.backgroundCube_vert,fragmentShader:Ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ot.cube_vert,fragmentShader:Ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ot.equirect_vert,fragmentShader:Ot.equirect_frag},distance:{uniforms:Re([ft.common,ft.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ot.distance_vert,fragmentShader:Ot.distance_frag},shadow:{uniforms:Re([ft.lights,ft.fog,{color:{value:new Ft(0)},opacity:{value:1}}]),vertexShader:Ot.shadow_vert,fragmentShader:Ot.shadow_frag}};_n.physical={uniforms:Re([_n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Pt},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Pt},sheen:{value:0},sheenColor:{value:new Ft(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Pt},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Pt},attenuationDistance:{value:0},attenuationColor:{value:new Ft(0)},specularColor:{value:new Ft(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Pt},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Pt}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag};var Mo={r:0,b:0,g:0},Xd=new ae,Wl=new Pt;Wl.set(-1,0,0,0,1,0,0,0,1);function Yd(i,t,e,n,s,r){let o=new Ft(0),a=s===!0?0:1,l,c,h=null,f=0,u=null;function d(S){let C=S.isScene===!0?S.background:null;if(C&&C.isTexture){let v=S.backgroundBlurriness>0;C=t.get(C,v)}return C}function p(S){let C=!1,v=d(S);v===null?g(o,a):v&&v.isColor&&(g(v,1),C=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?e.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||C)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(S,C){let v=d(C);v&&(v.isCubeTexture||v.mapping===us)?(c===void 0&&(c=new Se(new Di(1,1,1),new Ve({name:"BackgroundCubeMaterial",uniforms:ci(_n.backgroundCube.uniforms),vertexShader:_n.backgroundCube.vertexShader,fragmentShader:_n.backgroundCube.fragmentShader,side:Le,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=C.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Xd.makeRotationFromEuler(C.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Wl),c.material.toneMapped=Vt.getTransfer(v.colorSpace)!==Zt,(h!==v||f!==v.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=v,f=v.version,u=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Se(new fn(2,2),new Ve({name:"BackgroundMaterial",uniforms:ci(_n.background.uniforms),vertexShader:_n.background.vertexShader,fragmentShader:_n.background.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,l.material.toneMapped=Vt.getTransfer(v.colorSpace)!==Zt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||f!==v.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,f=v.version,u=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,C){S.getRGB(Mo,Da(i)),e.buffers.color.setClear(Mo.r,Mo.g,Mo.b,C,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,C=1){o.set(S),a=C,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,g(o,a)},render:p,addToRenderList:y,dispose:m}}function qd(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,o=!1;function a(L,N,J,$,W){let O=!1,Y=f(L,$,J,N);r!==Y&&(r=Y,c(r.object)),O=d(L,$,J,W),O&&p(L,$,J,W),W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,v(L,N,J,$),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function l(){return i.createVertexArray()}function c(L){return i.bindVertexArray(L)}function h(L){return i.deleteVertexArray(L)}function f(L,N,J,$){let W=$.wireframe===!0,O=n[N.id];O===void 0&&(O={},n[N.id]=O);let Y=L.isInstancedMesh===!0?L.id:0,Q=O[Y];Q===void 0&&(Q={},O[Y]=Q);let nt=Q[J.id];nt===void 0&&(nt={},Q[J.id]=nt);let lt=nt[W];return lt===void 0&&(lt=u(l()),nt[W]=lt),lt}function u(L){let N=[],J=[],$=[];for(let W=0;W<e;W++)N[W]=0,J[W]=0,$[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:J,attributeDivisors:$,object:L,attributes:{},index:null}}function d(L,N,J,$){let W=r.attributes,O=N.attributes,Y=0,Q=J.getAttributes();for(let nt in Q)if(Q[nt].location>=0){let ut=W[nt],gt=O[nt];if(gt===void 0&&(nt==="instanceMatrix"&&L.instanceMatrix&&(gt=L.instanceMatrix),nt==="instanceColor"&&L.instanceColor&&(gt=L.instanceColor)),ut===void 0||ut.attribute!==gt||gt&&ut.data!==gt.data)return!0;Y++}return r.attributesNum!==Y||r.index!==$}function p(L,N,J,$){let W={},O=N.attributes,Y=0,Q=J.getAttributes();for(let nt in Q)if(Q[nt].location>=0){let ut=O[nt];ut===void 0&&(nt==="instanceMatrix"&&L.instanceMatrix&&(ut=L.instanceMatrix),nt==="instanceColor"&&L.instanceColor&&(ut=L.instanceColor));let gt={};gt.attribute=ut,ut&&ut.data&&(gt.data=ut.data),W[nt]=gt,Y++}r.attributes=W,r.attributesNum=Y,r.index=$}function y(){let L=r.newAttributes;for(let N=0,J=L.length;N<J;N++)L[N]=0}function g(L){m(L,0)}function m(L,N){let J=r.newAttributes,$=r.enabledAttributes,W=r.attributeDivisors;J[L]=1,$[L]===0&&(i.enableVertexAttribArray(L),$[L]=1),W[L]!==N&&(i.vertexAttribDivisor(L,N),W[L]=N)}function S(){let L=r.newAttributes,N=r.enabledAttributes;for(let J=0,$=N.length;J<$;J++)N[J]!==L[J]&&(i.disableVertexAttribArray(J),N[J]=0)}function C(L,N,J,$,W,O,Y){Y===!0?i.vertexAttribIPointer(L,N,J,W,O):i.vertexAttribPointer(L,N,J,$,W,O)}function v(L,N,J,$){y();let W=$.attributes,O=J.getAttributes(),Y=N.defaultAttributeValues;for(let Q in O){let nt=O[Q];if(nt.location>=0){let lt=W[Q];if(lt===void 0&&(Q==="instanceMatrix"&&L.instanceMatrix&&(lt=L.instanceMatrix),Q==="instanceColor"&&L.instanceColor&&(lt=L.instanceColor)),lt!==void 0){let ut=lt.normalized,gt=lt.itemSize,zt=t.get(lt);if(zt===void 0)continue;let ee=zt.buffer,Ht=zt.type,j=zt.bytesPerElement,ct=Ht===i.INT||Ht===i.UNSIGNED_INT||lt.gpuType===Ur;if(lt.isInterleavedBufferAttribute){let rt=lt.data,Rt=rt.stride,It=lt.offset;if(rt.isInstancedInterleavedBuffer){for(let Tt=0;Tt<nt.locationSize;Tt++)m(nt.location+Tt,rt.meshPerAttribute);L.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Tt=0;Tt<nt.locationSize;Tt++)g(nt.location+Tt);i.bindBuffer(i.ARRAY_BUFFER,ee);for(let Tt=0;Tt<nt.locationSize;Tt++)C(nt.location+Tt,gt/nt.locationSize,Ht,ut,Rt*j,(It+gt/nt.locationSize*Tt)*j,ct)}else{if(lt.isInstancedBufferAttribute){for(let rt=0;rt<nt.locationSize;rt++)m(nt.location+rt,lt.meshPerAttribute);L.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let rt=0;rt<nt.locationSize;rt++)g(nt.location+rt);i.bindBuffer(i.ARRAY_BUFFER,ee);for(let rt=0;rt<nt.locationSize;rt++)C(nt.location+rt,gt/nt.locationSize,Ht,ut,gt*j,gt/nt.locationSize*rt*j,ct)}}else if(Y!==void 0){let ut=Y[Q];if(ut!==void 0)switch(ut.length){case 2:i.vertexAttrib2fv(nt.location,ut);break;case 3:i.vertexAttrib3fv(nt.location,ut);break;case 4:i.vertexAttrib4fv(nt.location,ut);break;default:i.vertexAttrib1fv(nt.location,ut)}}}}S()}function E(){w();for(let L in n){let N=n[L];for(let J in N){let $=N[J];for(let W in $){let O=$[W];for(let Y in O)h(O[Y].object),delete O[Y];delete $[W]}}delete n[L]}}function A(L){if(n[L.id]===void 0)return;let N=n[L.id];for(let J in N){let $=N[J];for(let W in $){let O=$[W];for(let Y in O)h(O[Y].object),delete O[Y];delete $[W]}}delete n[L.id]}function R(L){for(let N in n){let J=n[N];for(let $ in J){let W=J[$];if(W[L.id]===void 0)continue;let O=W[L.id];for(let Y in O)h(O[Y].object),delete O[Y];delete W[L.id]}}}function x(L){for(let N in n){let J=n[N],$=L.isInstancedMesh===!0?L.id:0,W=J[$];if(W!==void 0){for(let O in W){let Y=W[O];for(let Q in Y)h(Y[Q].object),delete Y[Q];delete W[O]}delete J[$],Object.keys(J).length===0&&delete n[N]}}}function w(){D(),o=!0,r!==s&&(r=s,c(r.object))}function D(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:w,resetDefaultState:D,dispose:E,releaseStatesOfGeometry:A,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:g,disableUnusedAttributes:S}}function Zd(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Jd(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==Ze&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let x=R===mn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Ne&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==en&&!x)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Et("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Et("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),C=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),A=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:y,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:S,maxVaryings:C,maxFragmentUniforms:v,maxSamples:E,samples:A}}function $d(i){let t=this,e=null,n=0,s=!1,r=!1,o=new an,a=new Pt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){let p=f.clippingPlanes,y=f.clipIntersection,g=f.clipShadows,m=i.get(f);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{let S=r?0:n,C=S*4,v=m.clippingState||null;l.value=v,v=h(p,u,C,d);for(let E=0;E!==C;++E)v[E]=e[E];m.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,p){let y=f!==null?f.length:0,g=null;if(y!==0){if(g=l.value,p!==!0||g===null){let m=d+y*4,S=u.matrixWorldInverse;a.getNormalMatrix(S),(g===null||g.length<m)&&(g=new Float32Array(m));for(let C=0,v=d;C!==y;++C,v+=4)o.copy(f[C]).applyMatrix4(S,a),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,g}}var Jn=4,Ml=[.125,.215,.35,.446,.526,.582],li=20,jd=256,vs=new Xn,bl=new Ft,Oa=null,Ba=0,za=0,Va=!1,Kd=new H,So=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=Kd}=r;Oa=this._renderer.getRenderTarget(),Ba=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Oa,Ba,za),this._renderer.xr.enabled=Va,t.scissorTest=!1,zi(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Yn||t.mapping===ai?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Oa=this._renderer.getRenderTarget(),Ba=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ue,minFilter:ue,generateMipmaps:!1,type:mn,format:Ze,colorSpace:Zi,depthBuffer:!1},s=Sl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sl(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Qd(r)),this._blurMaterial=ep(r,t,e),this._ggxMaterial=tp(r,t,e)}return s}_compileMaterial(t){let e=new Se(new Ye,t);this._renderer.compile(e,vs)}_sceneToCubeUV(t,e,n,s,r){let l=new Pe(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(bl),f.toneMapping=Ge,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Se(new Di,new es({name:"PMREM.Background",side:Le,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,g=y.material,m=!1,S=t.background;S?S.isColor&&(g.color.copy(S),t.background=null,m=!0):(g.color.copy(bl),m=!0);for(let C=0;C<6;C++){let v=C%3;v===0?(l.up.set(0,c[C],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[C],r.y,r.z)):v===1?(l.up.set(0,0,c[C]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[C],r.z)):(l.up.set(0,c[C],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[C]));let E=this._cubeSize;zi(s,v*E,C>2?E:0,E,E),f.setRenderTarget(s),m&&f.render(y,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=S}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Yn||t.mapping===ai;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Al());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;zi(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,vs)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=0+c*1.25,d=f*u,{_lodMax:p}=this,y=this._sizeLods[n],g=3*y*(n>p-Jn?n-p+Jn:0),m=4*(this._cubeSize-y);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=p-e,zi(r,g,m,3*y,2*y),s.setRenderTarget(r),s.render(a,vs),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,zi(t,g,m,3*y,2*y),s.setRenderTarget(t),s.render(a,vs)}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Ct("blur direction must be either latitudinal or longitudinal!");let h=3,f=this._lodMeshes[s];f.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*li-1),y=r/p,g=isFinite(r)?1+Math.floor(h*y):li;g>li&&Et(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${li}`);let m=[],S=0;for(let R=0;R<li;++R){let x=R/y,w=Math.exp(-x*x/2);m.push(w),R===0?S+=w:R<g&&(S+=2*w)}for(let R=0;R<m.length;R++)m[R]=m[R]/S;u.envMap.value=t.texture,u.samples.value=g,u.weights.value=m,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:C}=this;u.dTheta.value=p,u.mipInt.value=C-n;let v=this._sizeLods[s],E=3*v*(s>C-Jn?s-C+Jn:0),A=4*(this._cubeSize-v);zi(e,E,A,3*v,2*v),l.setRenderTarget(e),l.render(f,vs)}};function Qd(i){let t=[],e=[],n=[],s=i,r=i-Jn+1+Ml.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Jn?l=Ml[o-i+Jn-1]:o===0&&(l=0),e.push(l);let c=1/(a-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,p=6,y=3,g=2,m=1,S=new Float32Array(y*p*d),C=new Float32Array(g*p*d),v=new Float32Array(m*p*d);for(let A=0;A<d;A++){let R=A%3*2/3-1,x=A>2?0:-1,w=[R,x,0,R+2/3,x,0,R+2/3,x+1,0,R,x,0,R+2/3,x+1,0,R,x+1,0];S.set(w,y*p*A),C.set(u,g*p*A);let D=[A,A,A,A,A,A];v.set(D,m*p*A)}let E=new Ye;E.setAttribute("position",new Ie(S,y)),E.setAttribute("uv",new Ie(C,g)),E.setAttribute("faceIndex",new Ie(v,m)),n.push(new Se(E,null)),s>Jn&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Sl(i,t,e){let n=new ze(i,t,e);return n.texture.mapping=us,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function zi(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function tp(i,t,e){return new Ve({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:jd,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:To(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:dn,depthTest:!1,depthWrite:!1})}function ep(i,t,e){let n=new Float32Array(li),s=new H(0,1,0);return new Ve({name:"SphericalGaussianBlur",defines:{n:li,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:To(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:dn,depthTest:!1,depthWrite:!1})}function Al(){return new Ve({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:To(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:dn,depthTest:!1,depthWrite:!1})}function wl(){return new Ve({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:To(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:dn,depthTest:!1,depthWrite:!1})}function To(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Ao=class extends ze{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ns(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Di(5,5,5),r=new Ve({name:"CubemapFromEquirect",uniforms:ci(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Le,blending:dn});r.uniforms.tEquirect.value=e;let o=new Se(s,r),a=e.minFilter;return e.minFilter===pn&&(e.minFilter=ue),new Pr(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}};function np(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?o(u):r(u)}function r(u){if(u&&u.isTexture){let d=u.mapping;if(d===Lr||d===Dr)if(t.has(u)){let p=t.get(u).texture;return a(p,u.mapping)}else{let p=u.image;if(p&&p.height>0){let y=new Ao(p.height);return y.fromEquirectangularTexture(i,u),t.set(u,y),u.addEventListener("dispose",c),a(y.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let d=u.mapping,p=d===Lr||d===Dr,y=d===Yn||d===ai;if(p||y){let g=e.get(u),m=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new So(i)),g=p?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{let S=u.image;return p&&S&&S.height>0||y&&S&&l(S)?(n===null&&(n=new So(i)),g=p?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function a(u,d){return d===Lr?u.mapping=Yn:d===Dr&&(u.mapping=ai),u}function l(u){let d=0,p=6;for(let y=0;y<p;y++)u[y]!==void 0&&d++;return d===p}function c(u){let d=u.target;d.removeEventListener("dispose",c);let p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(u){let d=u.target;d.removeEventListener("dispose",h);let p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function ip(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&ni("WebGLRenderer: "+n+" extension not supported."),s}}}function sp(i,t,e,n){let s={},r=new WeakMap;function o(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",o),delete s[u.id];let d=r.get(u);d&&(t.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(f){let u=f.attributes;for(let d in u)t.update(u[d],i.ARRAY_BUFFER)}function c(f){let u=[],d=f.index,p=f.attributes.position,y=0;if(p===void 0)return;if(d!==null){let S=d.array;y=d.version;for(let C=0,v=S.length;C<v;C+=3){let E=S[C+0],A=S[C+1],R=S[C+2];u.push(E,A,A,R,R,E)}}else{let S=p.array;y=p.version;for(let C=0,v=S.length/3-1;C<v;C+=3){let E=C+0,A=C+1,R=C+2;u.push(E,A,A,R,R,E)}}let g=new(p.count>=65535?ts:Qi)(u,1);g.version=y;let m=r.get(f);m&&t.remove(m),r.set(f,g)}function h(f){let u=r.get(f);if(u){let d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function rp(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,u){i.drawElements(n,u,r,f*o),e.update(u,n,1)}function c(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*o,d),e.update(u,n,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let y=0;for(let g=0;g<d;g++)y+=u[g];e.update(y,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function op(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:Ct("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function ap(i,t,e){let n=new WeakMap,s=new se;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==f){let w=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",w)};u!==void 0&&u.texture.dispose();let d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],C=0;d===!0&&(C=1),p===!0&&(C=2),y===!0&&(C=3);let v=a.attributes.position.count*C,E=1;v>t.maxTextureSize&&(E=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let A=new Float32Array(v*E*4*f),R=new $i(A,v,E,f);R.type=en,R.needsUpdate=!0;let x=C*4;for(let D=0;D<f;D++){let L=g[D],N=m[D],J=S[D],$=v*E*4*D;for(let W=0;W<L.count;W++){let O=W*x;d===!0&&(s.fromBufferAttribute(L,W),A[$+O+0]=s.x,A[$+O+1]=s.y,A[$+O+2]=s.z,A[$+O+3]=0),p===!0&&(s.fromBufferAttribute(N,W),A[$+O+4]=s.x,A[$+O+5]=s.y,A[$+O+6]=s.z,A[$+O+7]=0),y===!0&&(s.fromBufferAttribute(J,W),A[$+O+8]=s.x,A[$+O+9]=s.y,A[$+O+10]=s.z,A[$+O+11]=J.itemSize===4?s.w:1)}}u={count:f,texture:R,size:new Gt(v,E)},n.set(a,u),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let y=0;y<c.length;y++)d+=c[y];let p=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function cp(i,t,e,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var lp={[ga]:"LINEAR_TONE_MAPPING",[_a]:"REINHARD_TONE_MAPPING",[xa]:"CINEON_TONE_MAPPING",[ya]:"ACES_FILMIC_TONE_MAPPING",[Ma]:"AGX_TONE_MAPPING",[ba]:"NEUTRAL_TONE_MAPPING",[va]:"CUSTOM_TONE_MAPPING"};function hp(i,t,e,n,s,r){let o=new ze(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new En(t,e):void 0}),a=new ze(t,e,{type:mn,depthBuffer:!1,stencilBuffer:!1}),l=new Ye;l.setAttribute("position",new Be([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Be([0,2,0,0,2,0],2));let c=new gr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Se(l,c),f=new Xn(-1,1,1,-1,0,1),u=null,d=null,p=!1,y,g=null,m=[],S=!1;this.setSize=function(C,v){o.setSize(C,v),a.setSize(C,v);for(let E=0;E<m.length;E++){let A=m[E];A.setSize&&A.setSize(C,v)}},this.setEffects=function(C){m=C,S=m.length>0&&m[0].isRenderPass===!0;let v=o.width,E=o.height;for(let A=0;A<m.length;A++){let R=m[A];R.setSize&&R.setSize(v,E)}},this.begin=function(C,v){if(p||C.toneMapping===Ge&&m.length===0)return!1;if(g=v,v!==null){let E=v.width,A=v.height;(o.width!==E||o.height!==A)&&this.setSize(E,A)}return S===!1&&C.setRenderTarget(o),y=C.toneMapping,C.toneMapping=Ge,!0},this.hasRenderPass=function(){return S},this.end=function(C,v){C.toneMapping=y,p=!0;let E=o,A=a;for(let R=0;R<m.length;R++){let x=m[R];if(x.enabled!==!1&&(x.render(C,A,E,v),x.needsSwap!==!1)){let w=E;E=A,A=w}}if(u!==C.outputColorSpace||d!==C.toneMapping){u=C.outputColorSpace,d=C.toneMapping,c.defines={},Vt.getTransfer(u)===Zt&&(c.defines.SRGB_TRANSFER="");let R=lp[d];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=E.texture,C.setRenderTarget(g),C.render(h,f),g=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),l.dispose(),c.dispose()}}var Xl=new be,Ha=new En(1,1),Yl=new $i,ql=new fr,Zl=new ns,Tl=[],El=[],Cl=new Float32Array(16),Rl=new Float32Array(9),Pl=new Float32Array(4);function ki(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Tl[s];if(r===void 0&&(r=new Float32Array(s),Tl[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function _e(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Eo(i,t){let e=El[t];e===void 0&&(e=new Int32Array(t),El[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function up(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function fp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2fv(this.addr,t),xe(e,t)}}function dp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;i.uniform3fv(this.addr,t),xe(e,t)}}function pp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4fv(this.addr,t),xe(e,t)}}function mp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Pl.set(n),i.uniformMatrix2fv(this.addr,!1,Pl),xe(e,n)}}function gp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Rl.set(n),i.uniformMatrix3fv(this.addr,!1,Rl),xe(e,n)}}function _p(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Cl.set(n),i.uniformMatrix4fv(this.addr,!1,Cl),xe(e,n)}}function xp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function yp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2iv(this.addr,t),xe(e,t)}}function vp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3iv(this.addr,t),xe(e,t)}}function Mp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4iv(this.addr,t),xe(e,t)}}function bp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Sp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2uiv(this.addr,t),xe(e,t)}}function Ap(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3uiv(this.addr,t),xe(e,t)}}function wp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4uiv(this.addr,t),xe(e,t)}}function Tp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ha.compareFunction=e.isReversedDepthBuffer()?vo:yo,r=Ha):r=Xl,e.setTexture2D(t||r,s)}function Ep(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ql,s)}function Cp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Zl,s)}function Rp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Yl,s)}function Pp(i){switch(i){case 5126:return up;case 35664:return fp;case 35665:return dp;case 35666:return pp;case 35674:return mp;case 35675:return gp;case 35676:return _p;case 5124:case 35670:return xp;case 35667:case 35671:return yp;case 35668:case 35672:return vp;case 35669:case 35673:return Mp;case 5125:return bp;case 36294:return Sp;case 36295:return Ap;case 36296:return wp;case 35678:case 36198:case 36298:case 36306:case 35682:return Tp;case 35679:case 36299:case 36307:return Ep;case 35680:case 36300:case 36308:case 36293:return Cp;case 36289:case 36303:case 36311:case 36292:return Rp}}function Ip(i,t){i.uniform1fv(this.addr,t)}function Lp(i,t){let e=ki(t,this.size,2);i.uniform2fv(this.addr,e)}function Dp(i,t){let e=ki(t,this.size,3);i.uniform3fv(this.addr,e)}function Np(i,t){let e=ki(t,this.size,4);i.uniform4fv(this.addr,e)}function Up(i,t){let e=ki(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Fp(i,t){let e=ki(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Op(i,t){let e=ki(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Bp(i,t){i.uniform1iv(this.addr,t)}function zp(i,t){i.uniform2iv(this.addr,t)}function Vp(i,t){i.uniform3iv(this.addr,t)}function kp(i,t){i.uniform4iv(this.addr,t)}function Gp(i,t){i.uniform1uiv(this.addr,t)}function Hp(i,t){i.uniform2uiv(this.addr,t)}function Wp(i,t){i.uniform3uiv(this.addr,t)}function Xp(i,t){i.uniform4uiv(this.addr,t)}function Yp(i,t,e){let n=this.cache,s=t.length,r=Eo(e,s);_e(n,r)||(i.uniform1iv(this.addr,r),xe(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Ha:o=Xl;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function qp(i,t,e){let n=this.cache,s=t.length,r=Eo(e,s);_e(n,r)||(i.uniform1iv(this.addr,r),xe(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||ql,r[o])}function Zp(i,t,e){let n=this.cache,s=t.length,r=Eo(e,s);_e(n,r)||(i.uniform1iv(this.addr,r),xe(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Zl,r[o])}function Jp(i,t,e){let n=this.cache,s=t.length,r=Eo(e,s);_e(n,r)||(i.uniform1iv(this.addr,r),xe(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Yl,r[o])}function $p(i){switch(i){case 5126:return Ip;case 35664:return Lp;case 35665:return Dp;case 35666:return Np;case 35674:return Up;case 35675:return Fp;case 35676:return Op;case 5124:case 35670:return Bp;case 35667:case 35671:return zp;case 35668:case 35672:return Vp;case 35669:case 35673:return kp;case 5125:return Gp;case 36294:return Hp;case 36295:return Wp;case 36296:return Xp;case 35678:case 36198:case 36298:case 36306:case 35682:return Yp;case 35679:case 36299:case 36307:return qp;case 35680:case 36300:case 36308:case 36293:return Zp;case 36289:case 36303:case 36311:case 36292:return Jp}}var Wa=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Pp(e.type)}},Xa=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=$p(e.type)}},Ya=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},ka=/(\w+)(\])?(\[|\.)?/g;function Il(i,t){i.seq.push(t),i.map[t.id]=t}function jp(i,t,e){let n=i.name,s=n.length;for(ka.lastIndex=0;;){let r=ka.exec(n),o=ka.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Il(e,c===void 0?new Wa(a,i,t):new Xa(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new Ya(a),Il(e,f)),e=f}}}var Vi=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);jp(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Ll(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Kp=37297,Qp=0;function tm(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Dl=new Pt;function em(i){Vt._getMatrix(Dl,Vt.workingColorSpace,i);let t=`mat3( ${Dl.elements.map(e=>e.toFixed(4))} )`;switch(Vt.getTransfer(i)){case Ji:return[t,"LinearTransferOETF"];case Zt:return[t,"sRGBTransferOETF"];default:return Et("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Nl(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+tm(i.getShaderSource(t),a)}else return r}function nm(i,t){let e=em(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var im={[ga]:"Linear",[_a]:"Reinhard",[xa]:"Cineon",[ya]:"ACESFilmic",[Ma]:"AgX",[ba]:"Neutral",[va]:"Custom"};function sm(i,t){let e=im[t];return e===void 0?(Et("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var bo=new H;function rm(){Vt.getLuminanceCoefficients(bo);let i=bo.x.toFixed(4),t=bo.y.toFixed(4),e=bo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function om(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(bs).join(`
`)}function am(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function cm(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function bs(i){return i!==""}function Ul(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Fl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var lm=/^[ \t]*#include +<([\w\d./]+)>/gm;function qa(i){return i.replace(lm,um)}var hm=new Map;function um(i,t){let e=Ot[t];if(e===void 0){let n=hm.get(t);if(n!==void 0)e=Ot[n],Et('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return qa(e)}var fm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ol(i){return i.replace(fm,dm)}function dm(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bl(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var pm={[oi]:"SHADOWMAP_TYPE_PCF",[Fi]:"SHADOWMAP_TYPE_VSM"};function mm(i){return pm[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var gm={[Yn]:"ENVMAP_TYPE_CUBE",[ai]:"ENVMAP_TYPE_CUBE",[us]:"ENVMAP_TYPE_CUBE_UV"};function _m(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":gm[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var xm={[ai]:"ENVMAP_MODE_REFRACTION"};function ym(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":xm[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var vm={[ma]:"ENVMAP_BLENDING_MULTIPLY",[il]:"ENVMAP_BLENDING_MIX",[sl]:"ENVMAP_BLENDING_ADD"};function Mm(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":vm[i.combine]||"ENVMAP_BLENDING_NONE"}function bm(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Sm(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=mm(e),c=_m(e),h=ym(e),f=Mm(e),u=bm(e),d=om(e),p=am(r),y=s.createProgram(),g,m,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(bs).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(bs).join(`
`),m.length>0&&(m+=`
`)):(g=[Bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bs).join(`
`),m=[Bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ge?"#define TONE_MAPPING":"",e.toneMapping!==Ge?Ot.tonemapping_pars_fragment:"",e.toneMapping!==Ge?sm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ot.colorspace_pars_fragment,nm("linearToOutputTexel",e.outputColorSpace),rm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(bs).join(`
`)),o=qa(o),o=Ul(o,e),o=Fl(o,e),a=qa(a),a=Ul(a,e),a=Fl(a,e),o=Ol(o),a=Ol(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===Ia?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ia?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let C=S+g+o,v=S+m+a,E=Ll(s,s.VERTEX_SHADER,C),A=Ll(s,s.FRAGMENT_SHADER,v);s.attachShader(y,E),s.attachShader(y,A),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function R(L){if(i.debug.checkShaderErrors){let N=s.getProgramInfoLog(y)||"",J=s.getShaderInfoLog(E)||"",$=s.getShaderInfoLog(A)||"",W=N.trim(),O=J.trim(),Y=$.trim(),Q=!0,nt=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,E,A);else{let lt=Nl(s,E,"vertex"),ut=Nl(s,A,"fragment");Ct("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+W+`
`+lt+`
`+ut)}else W!==""?Et("WebGLProgram: Program Info Log:",W):(O===""||Y==="")&&(nt=!1);nt&&(L.diagnostics={runnable:Q,programLog:W,vertexShader:{log:O,prefix:g},fragmentShader:{log:Y,prefix:m}})}s.deleteShader(E),s.deleteShader(A),x=new Vi(s,y),w=cm(s,y)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let D=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=s.getProgramParameter(y,Kp)),D},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Qp++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=E,this.fragmentShader=A,this}var Am=0,Za=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Ja(t),e.set(t,n)),n}},Ja=class{constructor(t){this.id=Am++,this.code=t,this.usedTimes=0}};function wm(i){return i===Zn||i===_s||i===xs}function Tm(i,t,e,n,s,r){let o=new ji,a=new Za,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer,u=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function y(x,w,D,L,N,J){let $=L.fog,W=N.geometry,O=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?L.environment:null,Y=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,Q=t.get(x.envMap||O,Y),nt=Q&&Q.mapping===us?Q.image.height:null,lt=d[x.type];x.precision!==null&&(u=n.getMaxPrecision(x.precision),u!==x.precision&&Et("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));let ut=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,gt=ut!==void 0?ut.length:0,zt=0;W.morphAttributes.position!==void 0&&(zt=1),W.morphAttributes.normal!==void 0&&(zt=2),W.morphAttributes.color!==void 0&&(zt=3);let ee,Ht,j,ct;if(lt){let vt=_n[lt];ee=vt.vertexShader,Ht=vt.fragmentShader}else{ee=x.vertexShader,Ht=x.fragmentShader;let vt=a.getVertexShaderStage(x),le=a.getFragmentShaderStage(x);a.update(x,vt,le),j=vt.id,ct=le.id}let rt=i.getRenderTarget(),Rt=i.state.buffers.depth.getReversed(),It=N.isInstancedMesh===!0,Tt=N.isBatchedMesh===!0,re=!!x.map,Nt=!!x.matcap,Xt=!!Q,Ut=!!x.aoMap,Wt=!!x.lightMap,ce=!!x.bumpMap&&x.wireframe===!1,fe=!!x.normalMap,oe=!!x.displacementMap,me=!!x.emissiveMap,Kt=!!x.metalnessMap,ie=!!x.roughnessMap,U=x.anisotropy>0,Ae=x.clearcoat>0,qt=x.dispersion>0,b=x.iridescence>0,_=x.sheen>0,B=x.transmission>0,z=U&&!!x.anisotropyMap,q=Ae&&!!x.clearcoatMap,ot=Ae&&!!x.clearcoatNormalMap,P=Ae&&!!x.clearcoatRoughnessMap,T=b&&!!x.iridescenceMap,V=b&&!!x.iridescenceThicknessMap,K=_&&!!x.sheenColorMap,st=_&&!!x.sheenRoughnessMap,tt=!!x.specularMap,it=!!x.specularColorMap,_t=!!x.specularIntensityMap,wt=B&&!!x.transmissionMap,Lt=B&&!!x.thicknessMap,I=!!x.gradientMap,at=!!x.alphaMap,Z=x.alphaTest>0,ht=!!x.alphaHash,mt=!!x.extensions,et=Ge;x.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(et=i.toneMapping);let bt={shaderID:lt,shaderType:x.type,shaderName:x.name,vertexShader:ee,fragmentShader:Ht,defines:x.defines,customVertexShaderID:j,customFragmentShaderID:ct,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:Tt,batchingColor:Tt&&N._colorsTexture!==null,instancing:It,instancingColor:It&&N.instanceColor!==null,instancingMorph:It&&N.morphTexture!==null,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Vt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:re,matcap:Nt,envMap:Xt,envMapMode:Xt&&Q.mapping,envMapCubeUVHeight:nt,aoMap:Ut,lightMap:Wt,bumpMap:ce,normalMap:fe,displacementMap:oe,emissiveMap:me,normalMapObjectSpace:fe&&x.normalMapType===al,normalMapTangentSpace:fe&&x.normalMapType===xo,packedNormalMap:fe&&x.normalMapType===xo&&wm(x.normalMap.format),metalnessMap:Kt,roughnessMap:ie,anisotropy:U,anisotropyMap:z,clearcoat:Ae,clearcoatMap:q,clearcoatNormalMap:ot,clearcoatRoughnessMap:P,dispersion:qt,iridescence:b,iridescenceMap:T,iridescenceThicknessMap:V,sheen:_,sheenColorMap:K,sheenRoughnessMap:st,specularMap:tt,specularColorMap:it,specularIntensityMap:_t,transmission:B,transmissionMap:wt,thicknessMap:Lt,gradientMap:I,opaque:x.transparent===!1&&x.blending===ii&&x.alphaToCoverage===!1,alphaMap:at,alphaTest:Z,alphaHash:ht,combine:x.combine,mapUv:re&&p(x.map.channel),aoMapUv:Ut&&p(x.aoMap.channel),lightMapUv:Wt&&p(x.lightMap.channel),bumpMapUv:ce&&p(x.bumpMap.channel),normalMapUv:fe&&p(x.normalMap.channel),displacementMapUv:oe&&p(x.displacementMap.channel),emissiveMapUv:me&&p(x.emissiveMap.channel),metalnessMapUv:Kt&&p(x.metalnessMap.channel),roughnessMapUv:ie&&p(x.roughnessMap.channel),anisotropyMapUv:z&&p(x.anisotropyMap.channel),clearcoatMapUv:q&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:ot&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:P&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:T&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:V&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:K&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:st&&p(x.sheenRoughnessMap.channel),specularMapUv:tt&&p(x.specularMap.channel),specularColorMapUv:it&&p(x.specularColorMap.channel),specularIntensityMapUv:_t&&p(x.specularIntensityMap.channel),transmissionMapUv:wt&&p(x.transmissionMap.channel),thicknessMapUv:Lt&&p(x.thicknessMap.channel),alphaMapUv:at&&p(x.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(fe||U),vertexNormals:!!W.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!W.attributes.uv&&(re||at),fog:!!$,useFog:x.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||W.attributes.normal===void 0&&fe===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Rt,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:W.attributes.position!==void 0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:zt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:J.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:et,decodeVideoTexture:re&&x.map.isVideoTexture===!0&&Vt.getTransfer(x.map.colorSpace)===Zt,decodeVideoTextureEmissive:me&&x.emissiveMap.isVideoTexture===!0&&Vt.getTransfer(x.emissiveMap.colorSpace)===Zt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===qe,flipSided:x.side===Le,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:mt&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&x.extensions.multiDraw===!0||Tt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return bt.vertexUv1s=l.has(1),bt.vertexUv2s=l.has(2),bt.vertexUv3s=l.has(3),l.clear(),bt}function g(x){let w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(let D in x.defines)w.push(D),w.push(x.defines[D]);return x.isRawShaderMaterial===!1&&(m(w,x),S(w,x),w.push(i.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function m(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function S(x,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function C(x){let w=d[x.type],D;if(w){let L=_n[w];D=yl.clone(L.uniforms)}else D=x.uniforms;return D}function v(x,w){let D=h.get(w);return D!==void 0?++D.usedTimes:(D=new Sm(i,w,x,s),c.push(D),h.set(w,D)),D}function E(x){if(--x.usedTimes===0){let w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function A(x){a.remove(x)}function R(){a.dispose()}return{getParameters:y,getProgramCacheKey:g,getUniforms:C,acquireProgram:v,releaseProgram:E,releaseShaderCache:A,programs:c,dispose:R}}function Em(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Cm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function zl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Vl(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function a(u,d,p,y,g,m){let S=i[t];return S===void 0?(S={id:u.id,object:u,geometry:d,material:p,materialVariant:o(u),groupOrder:y,renderOrder:u.renderOrder,z:g,group:m},i[t]=S):(S.id=u.id,S.object=u,S.geometry=d,S.material=p,S.materialVariant=o(u),S.groupOrder=y,S.renderOrder=u.renderOrder,S.z=g,S.group=m),t++,S}function l(u,d,p,y,g,m){let S=a(u,d,p,y,g,m);p.transmission>0?n.push(S):p.transparent===!0?s.push(S):e.push(S)}function c(u,d,p,y,g,m){let S=a(u,d,p,y,g,m);p.transmission>0?n.unshift(S):p.transparent===!0?s.unshift(S):e.unshift(S)}function h(u,d,p){e.length>1&&e.sort(u||Cm),n.length>1&&n.sort(d||zl),s.length>1&&s.sort(d||zl),p&&(e.reverse(),n.reverse(),s.reverse())}function f(){for(let u=t,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function Rm(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Vl,i.set(n,[o])):s>=r.length?(o=new Vl,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Pm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new H,color:new Ft};break;case"SpotLight":e={position:new H,direction:new H,color:new Ft,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new H,color:new Ft,distance:0,decay:0};break;case"HemisphereLight":e={direction:new H,skyColor:new Ft,groundColor:new Ft};break;case"RectAreaLight":e={color:new Ft,position:new H,halfWidth:new H,halfHeight:new H};break}return i[t.id]=e,e}}}function Im(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Lm=0;function Dm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Nm(i){let t=new Pm,e=Im(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new H);let s=new H,r=new ae,o=new ae;function a(c){let h=0,f=0,u=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let d=0,p=0,y=0,g=0,m=0,S=0,C=0,v=0,E=0,A=0,R=0;c.sort(Dm);for(let w=0,D=c.length;w<D;w++){let L=c[w],N=L.color,J=L.intensity,$=L.distance,W=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Zn?W=L.shadow.map.texture:W=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=N.r*J,f+=N.g*J,u+=N.b*J;else if(L.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(L.sh.coefficients[O],J);R++}else if(L.isDirectionalLight){let O=t.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Y=L.shadow,Q=e.get(L);Q.shadowIntensity=Y.intensity,Q.shadowBias=Y.bias,Q.shadowNormalBias=Y.normalBias,Q.shadowRadius=Y.radius,Q.shadowMapSize=Y.mapSize,n.directionalShadow[d]=Q,n.directionalShadowMap[d]=W,n.directionalShadowMatrix[d]=L.shadow.matrix,S++}n.directional[d]=O,d++}else if(L.isSpotLight){let O=t.get(L);O.position.setFromMatrixPosition(L.matrixWorld),O.color.copy(N).multiplyScalar(J),O.distance=$,O.coneCos=Math.cos(L.angle),O.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),O.decay=L.decay,n.spot[y]=O;let Y=L.shadow;if(L.map&&(n.spotLightMap[E]=L.map,E++,Y.updateMatrices(L),L.castShadow&&A++),n.spotLightMatrix[y]=Y.matrix,L.castShadow){let Q=e.get(L);Q.shadowIntensity=Y.intensity,Q.shadowBias=Y.bias,Q.shadowNormalBias=Y.normalBias,Q.shadowRadius=Y.radius,Q.shadowMapSize=Y.mapSize,n.spotShadow[y]=Q,n.spotShadowMap[y]=W,v++}y++}else if(L.isRectAreaLight){let O=t.get(L);O.color.copy(N).multiplyScalar(J),O.halfWidth.set(L.width*.5,0,0),O.halfHeight.set(0,L.height*.5,0),n.rectArea[g]=O,g++}else if(L.isPointLight){let O=t.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),O.distance=L.distance,O.decay=L.decay,L.castShadow){let Y=L.shadow,Q=e.get(L);Q.shadowIntensity=Y.intensity,Q.shadowBias=Y.bias,Q.shadowNormalBias=Y.normalBias,Q.shadowRadius=Y.radius,Q.shadowMapSize=Y.mapSize,Q.shadowCameraNear=Y.camera.near,Q.shadowCameraFar=Y.camera.far,n.pointShadow[p]=Q,n.pointShadowMap[p]=W,n.pointShadowMatrix[p]=L.shadow.matrix,C++}n.point[p]=O,p++}else if(L.isHemisphereLight){let O=t.get(L);O.skyColor.copy(L.color).multiplyScalar(J),O.groundColor.copy(L.groundColor).multiplyScalar(J),n.hemi[m]=O,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ft.LTC_FLOAT_1,n.rectAreaLTC2=ft.LTC_FLOAT_2):(n.rectAreaLTC1=ft.LTC_HALF_1,n.rectAreaLTC2=ft.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;let x=n.hash;(x.directionalLength!==d||x.pointLength!==p||x.spotLength!==y||x.rectAreaLength!==g||x.hemiLength!==m||x.numDirectionalShadows!==S||x.numPointShadows!==C||x.numSpotShadows!==v||x.numSpotMaps!==E||x.numLightProbes!==R)&&(n.directional.length=d,n.spot.length=y,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=C,n.pointShadowMap.length=C,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=C,n.spotLightMatrix.length=v+E-A,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,x.directionalLength=d,x.pointLength=p,x.spotLength=y,x.rectAreaLength=g,x.hemiLength=m,x.numDirectionalShadows=S,x.numPointShadows=C,x.numSpotShadows=v,x.numSpotMaps=E,x.numLightProbes=R,n.version=Lm++)}function l(c,h){let f=0,u=0,d=0,p=0,y=0,g=h.matrixWorldInverse;for(let m=0,S=c.length;m<S;m++){let C=c[m];if(C.isDirectionalLight){let v=n.directional[f];v.direction.setFromMatrixPosition(C.matrixWorld),s.setFromMatrixPosition(C.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),f++}else if(C.isSpotLight){let v=n.spot[d];v.position.setFromMatrixPosition(C.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(C.matrixWorld),s.setFromMatrixPosition(C.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),d++}else if(C.isRectAreaLight){let v=n.rectArea[p];v.position.setFromMatrixPosition(C.matrixWorld),v.position.applyMatrix4(g),o.identity(),r.copy(C.matrixWorld),r.premultiply(g),o.extractRotation(r),v.halfWidth.set(C.width*.5,0,0),v.halfHeight.set(0,C.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(C.isPointLight){let v=n.point[u];v.position.setFromMatrixPosition(C.matrixWorld),v.position.applyMatrix4(g),u++}else if(C.isHemisphereLight){let v=n.hemi[y];v.direction.setFromMatrixPosition(C.matrixWorld),v.direction.transformDirection(g),y++}}}return{setup:a,setupView:l,state:n}}function kl(i){let t=new Nm(i),e=[],n=[],s=[];function r(u){f.camera=u,e.length=0,n.length=0,s.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let f={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Um(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new kl(i),t.set(s,[a])):r>=o.length?(a=new kl(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Fm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Om=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Bm=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],zm=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],Gl=new ae,Ms=new H,Ga=new H;function Vm(i,t,e){let n=new Li,s=new Gt,r=new Gt,o=new se,a=new _r,l=new xr,c={},h=e.maxTextureSize,f={[wn]:Le,[Le]:wn,[qe]:qe},u=new Ve({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:Fm,fragmentShader:Om}),d=u.clone();d.defines.HORIZONTAL_PASS=1;let p=new Ye;p.setAttribute("position",new Ie(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Se(p,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=oi;let m=this.type;this.render=function(A,R,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;this.type===Bc&&(Et("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=oi);let w=i.getRenderTarget(),D=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),N=i.state;N.setBlending(dn),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let J=m!==this.type;J&&R.traverse(function($){$.material&&(Array.isArray($.material)?$.material.forEach(W=>W.needsUpdate=!0):$.material.needsUpdate=!0)});for(let $=0,W=A.length;$<W;$++){let O=A[$],Y=O.shadow;if(Y===void 0){Et("WebGLShadowMap:",O,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let Q=Y.getFrameExtents();s.multiply(Q),r.copy(Y.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,Y.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,Y.mapSize.y=r.y));let nt=i.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=nt,Y.map===null||J===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===Fi){if(O.isPointLight){Et("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new ze(s.x,s.y,{format:Zn,type:mn,minFilter:ue,magFilter:ue,generateMipmaps:!1}),Y.map.texture.name=O.name+".shadowMap",Y.map.depthTexture=new En(s.x,s.y,en),Y.map.depthTexture.name=O.name+".shadowMapDepth",Y.map.depthTexture.format=ln,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Me,Y.map.depthTexture.magFilter=Me}else O.isPointLight?(Y.map=new Ao(s.x),Y.map.depthTexture=new mr(s.x,tn)):(Y.map=new ze(s.x,s.y),Y.map.depthTexture=new En(s.x,s.y,tn)),Y.map.depthTexture.name=O.name+".shadowMap",Y.map.depthTexture.format=ln,this.type===oi?(Y.map.depthTexture.compareFunction=nt?vo:yo,Y.map.depthTexture.minFilter=ue,Y.map.depthTexture.magFilter=ue):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Me,Y.map.depthTexture.magFilter=Me);Y.camera.updateProjectionMatrix()}let lt=Y.map.isWebGLCubeRenderTarget?6:1;for(let ut=0;ut<lt;ut++){if(Y.map.isWebGLCubeRenderTarget)i.setRenderTarget(Y.map,ut),i.clear();else{ut===0&&(i.setRenderTarget(Y.map),i.clear());let gt=Y.getViewport(ut);o.set(r.x*gt.x,r.y*gt.y,r.x*gt.z,r.y*gt.w),N.viewport(o)}if(O.isPointLight){let gt=Y.camera,zt=Y.matrix,ee=O.distance||gt.far;ee!==gt.far&&(gt.far=ee,gt.updateProjectionMatrix()),Ms.setFromMatrixPosition(O.matrixWorld),gt.position.copy(Ms),Ga.copy(gt.position),Ga.add(Bm[ut]),gt.up.copy(zm[ut]),gt.lookAt(Ga),gt.updateMatrixWorld(),zt.makeTranslation(-Ms.x,-Ms.y,-Ms.z),Gl.multiplyMatrices(gt.projectionMatrix,gt.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Gl,gt.coordinateSystem,gt.reversedDepth)}else Y.updateMatrices(O);n=Y.getFrustum(),v(R,x,Y.camera,O,this.type)}Y.isPointLightShadow!==!0&&this.type===Fi&&S(Y,x),Y.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(w,D,L)};function S(A,R){let x=t.update(y);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ze(s.x,s.y,{format:Zn,type:mn})),u.uniforms.shadow_pass.value=A.map.depthTexture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(R,null,x,u,y,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(R,null,x,d,y,null)}function C(A,R,x,w){let D=null,L=x.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(L!==void 0)D=L;else if(D=x.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let N=D.uuid,J=R.uuid,$=c[N];$===void 0&&($={},c[N]=$);let W=$[J];W===void 0&&(W=D.clone(),$[J]=W,R.addEventListener("dispose",E)),D=W}if(D.visible=R.visible,D.wireframe=R.wireframe,w===Fi?D.side=R.shadowSide!==null?R.shadowSide:R.side:D.side=R.shadowSide!==null?R.shadowSide:f[R.side],D.alphaMap=R.alphaMap,D.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,D.map=R.map,D.clipShadows=R.clipShadows,D.clippingPlanes=R.clippingPlanes,D.clipIntersection=R.clipIntersection,D.displacementMap=R.displacementMap,D.displacementScale=R.displacementScale,D.displacementBias=R.displacementBias,D.wireframeLinewidth=R.wireframeLinewidth,D.linewidth=R.linewidth,x.isPointLight===!0&&D.isMeshDistanceMaterial===!0){let N=i.properties.get(D);N.light=x}return D}function v(A,R,x,w,D){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&D===Fi)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,A.matrixWorld);let J=t.update(A),$=A.material;if(Array.isArray($)){let W=J.groups;for(let O=0,Y=W.length;O<Y;O++){let Q=W[O],nt=$[Q.materialIndex];if(nt&&nt.visible){let lt=C(A,nt,w,D);A.onBeforeShadow(i,A,R,x,J,lt,Q),i.renderBufferDirect(x,null,J,lt,A,Q),A.onAfterShadow(i,A,R,x,J,lt,Q)}}}else if($.visible){let W=C(A,$,w,D);A.onBeforeShadow(i,A,R,x,J,W,null),i.renderBufferDirect(x,null,J,W,A,null),A.onAfterShadow(i,A,R,x,J,W,null)}}let N=A.children;for(let J=0,$=N.length;J<$;J++)v(N[J],R,x,w,D)}function E(A){A.target.removeEventListener("dispose",E);for(let x in c){let w=c[x],D=A.target.uuid;D in w&&(w[D].dispose(),delete w[D])}}}function km(i,t){function e(){let I=!1,at=new se,Z=null,ht=new se(0,0,0,0);return{setMask:function(mt){Z!==mt&&!I&&(i.colorMask(mt,mt,mt,mt),Z=mt)},setLocked:function(mt){I=mt},setClear:function(mt,et,bt,vt,le){le===!0&&(mt*=vt,et*=vt,bt*=vt),at.set(mt,et,bt,vt),ht.equals(at)===!1&&(i.clearColor(mt,et,bt,vt),ht.copy(at))},reset:function(){I=!1,Z=null,ht.set(-1,0,0,0)}}}function n(){let I=!1,at=!1,Z=null,ht=null,mt=null;return{setReversed:function(et){if(at!==et){let bt=t.get("EXT_clip_control");et?bt.clipControlEXT(bt.LOWER_LEFT_EXT,bt.ZERO_TO_ONE_EXT):bt.clipControlEXT(bt.LOWER_LEFT_EXT,bt.NEGATIVE_ONE_TO_ONE_EXT),at=et;let vt=mt;mt=null,this.setClear(vt)}},getReversed:function(){return at},setTest:function(et){et?rt(i.DEPTH_TEST):Rt(i.DEPTH_TEST)},setMask:function(et){Z!==et&&!I&&(i.depthMask(et),Z=et)},setFunc:function(et){if(at&&(et=_l[et]),ht!==et){switch(et){case Qs:i.depthFunc(i.NEVER);break;case tr:i.depthFunc(i.ALWAYS);break;case er:i.depthFunc(i.LESS);break;case si:i.depthFunc(i.LEQUAL);break;case nr:i.depthFunc(i.EQUAL);break;case ir:i.depthFunc(i.GEQUAL);break;case sr:i.depthFunc(i.GREATER);break;case rr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ht=et}},setLocked:function(et){I=et},setClear:function(et){mt!==et&&(mt=et,at&&(et=1-et),i.clearDepth(et))},reset:function(){I=!1,Z=null,ht=null,mt=null,at=!1}}}function s(){let I=!1,at=null,Z=null,ht=null,mt=null,et=null,bt=null,vt=null,le=null;return{setTest:function(Qt){I||(Qt?rt(i.STENCIL_TEST):Rt(i.STENCIL_TEST))},setMask:function(Qt){at!==Qt&&!I&&(i.stencilMask(Qt),at=Qt)},setFunc:function(Qt,nn,sn){(Z!==Qt||ht!==nn||mt!==sn)&&(i.stencilFunc(Qt,nn,sn),Z=Qt,ht=nn,mt=sn)},setOp:function(Qt,nn,sn){(et!==Qt||bt!==nn||vt!==sn)&&(i.stencilOp(Qt,nn,sn),et=Qt,bt=nn,vt=sn)},setLocked:function(Qt){I=Qt},setClear:function(Qt){le!==Qt&&(i.clearStencil(Qt),le=Qt)},reset:function(){I=!1,at=null,Z=null,ht=null,mt=null,et=null,bt=null,vt=null,le=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},f={},u={},d=new WeakMap,p=[],y=null,g=!1,m=null,S=null,C=null,v=null,E=null,A=null,R=null,x=new Ft(0,0,0),w=0,D=!1,L=null,N=null,J=null,$=null,W=null,O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,Q=0,nt=i.getParameter(i.VERSION);nt.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(nt)[1]),Y=Q>=1):nt.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(nt)[1]),Y=Q>=2);let lt=null,ut={},gt=i.getParameter(i.SCISSOR_BOX),zt=i.getParameter(i.VIEWPORT),ee=new se().fromArray(gt),Ht=new se().fromArray(zt);function j(I,at,Z,ht){let mt=new Uint8Array(4),et=i.createTexture();i.bindTexture(I,et),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let bt=0;bt<Z;bt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(at,0,i.RGBA,1,1,ht,0,i.RGBA,i.UNSIGNED_BYTE,mt):i.texImage2D(at+bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,mt);return et}let ct={};ct[i.TEXTURE_2D]=j(i.TEXTURE_2D,i.TEXTURE_2D,1),ct[i.TEXTURE_CUBE_MAP]=j(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ct[i.TEXTURE_2D_ARRAY]=j(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ct[i.TEXTURE_3D]=j(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),rt(i.DEPTH_TEST),o.setFunc(si),ce(!1),fe(ua),rt(i.CULL_FACE),Ut(dn);function rt(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function Rt(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function It(I,at){return u[I]!==at?(i.bindFramebuffer(I,at),u[I]=at,I===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=at),I===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=at),!0):!1}function Tt(I,at){let Z=p,ht=!1;if(I){Z=d.get(at),Z===void 0&&(Z=[],d.set(at,Z));let mt=I.textures;if(Z.length!==mt.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let et=0,bt=mt.length;et<bt;et++)Z[et]=i.COLOR_ATTACHMENT0+et;Z.length=mt.length,ht=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,ht=!0);ht&&i.drawBuffers(Z)}function re(I){return y!==I?(i.useProgram(I),y=I,!0):!1}let Nt={[Vn]:i.FUNC_ADD,[Vc]:i.FUNC_SUBTRACT,[kc]:i.FUNC_REVERSE_SUBTRACT};Nt[Gc]=i.MIN,Nt[Hc]=i.MAX;let Xt={[Wc]:i.ZERO,[Xc]:i.ONE,[Yc]:i.SRC_COLOR,[js]:i.SRC_ALPHA,[Kc]:i.SRC_ALPHA_SATURATE,[$c]:i.DST_COLOR,[Zc]:i.DST_ALPHA,[qc]:i.ONE_MINUS_SRC_COLOR,[Ks]:i.ONE_MINUS_SRC_ALPHA,[jc]:i.ONE_MINUS_DST_COLOR,[Jc]:i.ONE_MINUS_DST_ALPHA,[Qc]:i.CONSTANT_COLOR,[tl]:i.ONE_MINUS_CONSTANT_COLOR,[el]:i.CONSTANT_ALPHA,[nl]:i.ONE_MINUS_CONSTANT_ALPHA};function Ut(I,at,Z,ht,mt,et,bt,vt,le,Qt){if(I===dn){g===!0&&(Rt(i.BLEND),g=!1);return}if(g===!1&&(rt(i.BLEND),g=!0),I!==zc){if(I!==m||Qt!==D){if((S!==Vn||E!==Vn)&&(i.blendEquation(i.FUNC_ADD),S=Vn,E=Vn),Qt)switch(I){case ii:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case fa:i.blendFunc(i.ONE,i.ONE);break;case da:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pa:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ct("WebGLState: Invalid blending: ",I);break}else switch(I){case ii:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case fa:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case da:Ct("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pa:Ct("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ct("WebGLState: Invalid blending: ",I);break}C=null,v=null,A=null,R=null,x.set(0,0,0),w=0,m=I,D=Qt}return}mt=mt||at,et=et||Z,bt=bt||ht,(at!==S||mt!==E)&&(i.blendEquationSeparate(Nt[at],Nt[mt]),S=at,E=mt),(Z!==C||ht!==v||et!==A||bt!==R)&&(i.blendFuncSeparate(Xt[Z],Xt[ht],Xt[et],Xt[bt]),C=Z,v=ht,A=et,R=bt),(vt.equals(x)===!1||le!==w)&&(i.blendColor(vt.r,vt.g,vt.b,le),x.copy(vt),w=le),m=I,D=!1}function Wt(I,at){I.side===qe?Rt(i.CULL_FACE):rt(i.CULL_FACE);let Z=I.side===Le;at&&(Z=!Z),ce(Z),I.blending===ii&&I.transparent===!1?Ut(dn):Ut(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);let ht=I.stencilWrite;a.setTest(ht),ht&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),me(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):Rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function ce(I){L!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),L=I)}function fe(I){I!==Fc?(rt(i.CULL_FACE),I!==N&&(I===ua?i.cullFace(i.BACK):I===Oc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Rt(i.CULL_FACE),N=I}function oe(I){I!==J&&(Y&&i.lineWidth(I),J=I)}function me(I,at,Z){I?(rt(i.POLYGON_OFFSET_FILL),($!==at||W!==Z)&&($=at,W=Z,o.getReversed()&&(at=-at),i.polygonOffset(at,Z))):Rt(i.POLYGON_OFFSET_FILL)}function Kt(I){I?rt(i.SCISSOR_TEST):Rt(i.SCISSOR_TEST)}function ie(I){I===void 0&&(I=i.TEXTURE0+O-1),lt!==I&&(i.activeTexture(I),lt=I)}function U(I,at,Z){Z===void 0&&(lt===null?Z=i.TEXTURE0+O-1:Z=lt);let ht=ut[Z];ht===void 0&&(ht={type:void 0,texture:void 0},ut[Z]=ht),(ht.type!==I||ht.texture!==at)&&(lt!==Z&&(i.activeTexture(Z),lt=Z),i.bindTexture(I,at||ct[I]),ht.type=I,ht.texture=at)}function Ae(){let I=ut[lt];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function qt(){try{i.compressedTexImage2D(...arguments)}catch(I){Ct("WebGLState:",I)}}function b(){try{i.compressedTexImage3D(...arguments)}catch(I){Ct("WebGLState:",I)}}function _(){try{i.texSubImage2D(...arguments)}catch(I){Ct("WebGLState:",I)}}function B(){try{i.texSubImage3D(...arguments)}catch(I){Ct("WebGLState:",I)}}function z(){try{i.compressedTexSubImage2D(...arguments)}catch(I){Ct("WebGLState:",I)}}function q(){try{i.compressedTexSubImage3D(...arguments)}catch(I){Ct("WebGLState:",I)}}function ot(){try{i.texStorage2D(...arguments)}catch(I){Ct("WebGLState:",I)}}function P(){try{i.texStorage3D(...arguments)}catch(I){Ct("WebGLState:",I)}}function T(){try{i.texImage2D(...arguments)}catch(I){Ct("WebGLState:",I)}}function V(){try{i.texImage3D(...arguments)}catch(I){Ct("WebGLState:",I)}}function K(I){return f[I]!==void 0?f[I]:i.getParameter(I)}function st(I,at){f[I]!==at&&(i.pixelStorei(I,at),f[I]=at)}function tt(I){ee.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),ee.copy(I))}function it(I){Ht.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),Ht.copy(I))}function _t(I,at){let Z=c.get(at);Z===void 0&&(Z=new WeakMap,c.set(at,Z));let ht=Z.get(I);ht===void 0&&(ht=i.getUniformBlockIndex(at,I.name),Z.set(I,ht))}function wt(I,at){let ht=c.get(at).get(I);l.get(at)!==ht&&(i.uniformBlockBinding(at,ht,I.__bindingPointIndex),l.set(at,ht))}function Lt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},lt=null,ut={},u={},d=new WeakMap,p=[],y=null,g=!1,m=null,S=null,C=null,v=null,E=null,A=null,R=null,x=new Ft(0,0,0),w=0,D=!1,L=null,N=null,J=null,$=null,W=null,ee.set(0,0,i.canvas.width,i.canvas.height),Ht.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:rt,disable:Rt,bindFramebuffer:It,drawBuffers:Tt,useProgram:re,setBlending:Ut,setMaterial:Wt,setFlipSided:ce,setCullFace:fe,setLineWidth:oe,setPolygonOffset:me,setScissorTest:Kt,activeTexture:ie,bindTexture:U,unbindTexture:Ae,compressedTexImage2D:qt,compressedTexImage3D:b,texImage2D:T,texImage3D:V,pixelStorei:st,getParameter:K,updateUBOMapping:_t,uniformBlockBinding:wt,texStorage2D:ot,texStorage3D:P,texSubImage2D:_,texSubImage3D:B,compressedTexSubImage2D:z,compressedTexSubImage3D:q,scissor:tt,viewport:it,reset:Lt}}function Gm(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Gt,h=new WeakMap,f=new Set,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(b,_){return p?new OffscreenCanvas(b,_):Ei("canvas")}function g(b,_,B){let z=1,q=qt(b);if((q.width>B||q.height>B)&&(z=B/Math.max(q.width,q.height)),z<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){let ot=Math.floor(z*q.width),P=Math.floor(z*q.height);u===void 0&&(u=y(ot,P));let T=_?y(ot,P):u;return T.width=ot,T.height=P,T.getContext("2d").drawImage(b,0,0,ot,P),Et("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+ot+"x"+P+")."),T}else return"data"in b&&Et("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),b;return b}function m(b){return b.generateMipmaps}function S(b){i.generateMipmap(b)}function C(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(b,_,B,z,q,ot=!1){if(b!==null){if(i[b]!==void 0)return i[b];Et("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let P;z&&(P=t.get("EXT_texture_norm16"),P||Et("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let T=_;if(_===i.RED&&(B===i.FLOAT&&(T=i.R32F),B===i.HALF_FLOAT&&(T=i.R16F),B===i.UNSIGNED_BYTE&&(T=i.R8),B===i.UNSIGNED_SHORT&&P&&(T=P.R16_EXT),B===i.SHORT&&P&&(T=P.R16_SNORM_EXT)),_===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(T=i.R8UI),B===i.UNSIGNED_SHORT&&(T=i.R16UI),B===i.UNSIGNED_INT&&(T=i.R32UI),B===i.BYTE&&(T=i.R8I),B===i.SHORT&&(T=i.R16I),B===i.INT&&(T=i.R32I)),_===i.RG&&(B===i.FLOAT&&(T=i.RG32F),B===i.HALF_FLOAT&&(T=i.RG16F),B===i.UNSIGNED_BYTE&&(T=i.RG8),B===i.UNSIGNED_SHORT&&P&&(T=P.RG16_EXT),B===i.SHORT&&P&&(T=P.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(T=i.RG8UI),B===i.UNSIGNED_SHORT&&(T=i.RG16UI),B===i.UNSIGNED_INT&&(T=i.RG32UI),B===i.BYTE&&(T=i.RG8I),B===i.SHORT&&(T=i.RG16I),B===i.INT&&(T=i.RG32I)),_===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(T=i.RGB8UI),B===i.UNSIGNED_SHORT&&(T=i.RGB16UI),B===i.UNSIGNED_INT&&(T=i.RGB32UI),B===i.BYTE&&(T=i.RGB8I),B===i.SHORT&&(T=i.RGB16I),B===i.INT&&(T=i.RGB32I)),_===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(T=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(T=i.RGBA16UI),B===i.UNSIGNED_INT&&(T=i.RGBA32UI),B===i.BYTE&&(T=i.RGBA8I),B===i.SHORT&&(T=i.RGBA16I),B===i.INT&&(T=i.RGBA32I)),_===i.RGB&&(B===i.UNSIGNED_SHORT&&P&&(T=P.RGB16_EXT),B===i.SHORT&&P&&(T=P.RGB16_SNORM_EXT),B===i.UNSIGNED_INT_5_9_9_9_REV&&(T=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(T=i.R11F_G11F_B10F)),_===i.RGBA){let V=ot?Ji:Vt.getTransfer(q);B===i.FLOAT&&(T=i.RGBA32F),B===i.HALF_FLOAT&&(T=i.RGBA16F),B===i.UNSIGNED_BYTE&&(T=V===Zt?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT&&P&&(T=P.RGBA16_EXT),B===i.SHORT&&P&&(T=P.RGBA16_SNORM_EXT),B===i.UNSIGNED_SHORT_4_4_4_4&&(T=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(T=i.RGB5_A1)}return(T===i.R16F||T===i.R32F||T===i.RG16F||T===i.RG32F||T===i.RGBA16F||T===i.RGBA32F)&&t.get("EXT_color_buffer_float"),T}function E(b,_){let B;return b?_===null||_===tn||_===Bi?B=i.DEPTH24_STENCIL8:_===en?B=i.DEPTH32F_STENCIL8:_===Oi&&(B=i.DEPTH24_STENCIL8,Et("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===tn||_===Bi?B=i.DEPTH_COMPONENT24:_===en?B=i.DEPTH_COMPONENT32F:_===Oi&&(B=i.DEPTH_COMPONENT16),B}function A(b,_){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==Me&&b.minFilter!==ue?Math.log2(Math.max(_.width,_.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?_.mipmaps.length:1}function R(b){let _=b.target;_.removeEventListener("dispose",R),w(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&f.delete(_)}function x(b){let _=b.target;_.removeEventListener("dispose",x),L(_)}function w(b){let _=n.get(b);if(_.__webglInit===void 0)return;let B=b.source,z=d.get(B);if(z){let q=z[_.__cacheKey];q.usedTimes--,q.usedTimes===0&&D(b),Object.keys(z).length===0&&d.delete(B)}n.remove(b)}function D(b){let _=n.get(b);i.deleteTexture(_.__webglTexture);let B=b.source,z=d.get(B);delete z[_.__cacheKey],o.memory.textures--}function L(b){let _=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(_.__webglFramebuffer[z]))for(let q=0;q<_.__webglFramebuffer[z].length;q++)i.deleteFramebuffer(_.__webglFramebuffer[z][q]);else i.deleteFramebuffer(_.__webglFramebuffer[z]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[z])}else{if(Array.isArray(_.__webglFramebuffer))for(let z=0;z<_.__webglFramebuffer.length;z++)i.deleteFramebuffer(_.__webglFramebuffer[z]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let z=0;z<_.__webglColorRenderbuffer.length;z++)_.__webglColorRenderbuffer[z]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[z]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let B=b.textures;for(let z=0,q=B.length;z<q;z++){let ot=n.get(B[z]);ot.__webglTexture&&(i.deleteTexture(ot.__webglTexture),o.memory.textures--),n.remove(B[z])}n.remove(b)}let N=0;function J(){N=0}function $(){return N}function W(b){N=b}function O(){let b=N;return b>=s.maxTextures&&Et("WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),N+=1,b}function Y(b){let _=[];return _.push(b.wrapS),_.push(b.wrapT),_.push(b.wrapR||0),_.push(b.magFilter),_.push(b.minFilter),_.push(b.anisotropy),_.push(b.internalFormat),_.push(b.format),_.push(b.type),_.push(b.generateMipmaps),_.push(b.premultiplyAlpha),_.push(b.flipY),_.push(b.unpackAlignment),_.push(b.colorSpace),_.join()}function Q(b,_){let B=n.get(b);if(b.isVideoTexture&&U(b),b.isRenderTargetTexture===!1&&b.isExternalTexture!==!0&&b.version>0&&B.__version!==b.version){let z=b.image;if(z===null)Et("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Et("WebGLRenderer: Texture marked for update but image is incomplete");else{Rt(B,b,_);return}}else b.isExternalTexture&&(B.__webglTexture=b.sourceTexture?b.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+_)}function nt(b,_){let B=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&B.__version!==b.version){Rt(B,b,_);return}else b.isExternalTexture&&(B.__webglTexture=b.sourceTexture?b.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+_)}function lt(b,_){let B=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&B.__version!==b.version){Rt(B,b,_);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+_)}function ut(b,_){let B=n.get(b);if(b.isCubeDepthTexture!==!0&&b.version>0&&B.__version!==b.version){It(B,b,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+_)}let gt={[or]:i.REPEAT,[cn]:i.CLAMP_TO_EDGE,[ar]:i.MIRRORED_REPEAT},zt={[Me]:i.NEAREST,[rl]:i.NEAREST_MIPMAP_NEAREST,[fs]:i.NEAREST_MIPMAP_LINEAR,[ue]:i.LINEAR,[Nr]:i.LINEAR_MIPMAP_NEAREST,[pn]:i.LINEAR_MIPMAP_LINEAR},ee={[cl]:i.NEVER,[dl]:i.ALWAYS,[ll]:i.LESS,[yo]:i.LEQUAL,[hl]:i.EQUAL,[vo]:i.GEQUAL,[ul]:i.GREATER,[fl]:i.NOTEQUAL};function Ht(b,_){if(_.type===en&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===ue||_.magFilter===Nr||_.magFilter===fs||_.magFilter===pn||_.minFilter===ue||_.minFilter===Nr||_.minFilter===fs||_.minFilter===pn)&&Et("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,gt[_.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,gt[_.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,gt[_.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,zt[_.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,zt[_.minFilter]),_.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,ee[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Me||_.minFilter!==fs&&_.minFilter!==pn||_.type===en&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(b,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function j(b,_){let B=!1;b.__webglInit===void 0&&(b.__webglInit=!0,_.addEventListener("dispose",R));let z=_.source,q=d.get(z);q===void 0&&(q={},d.set(z,q));let ot=Y(_);if(ot!==b.__cacheKey){q[ot]===void 0&&(q[ot]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),q[ot].usedTimes++;let P=q[b.__cacheKey];P!==void 0&&(q[b.__cacheKey].usedTimes--,P.usedTimes===0&&D(_)),b.__cacheKey=ot,b.__webglTexture=q[ot].texture}return B}function ct(b,_,B){return Math.floor(Math.floor(b/B)/_)}function rt(b,_,B,z){let ot=b.updateRanges;if(ot.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,B,z,_.data);else{ot.sort((st,tt)=>st.start-tt.start);let P=0;for(let st=1;st<ot.length;st++){let tt=ot[P],it=ot[st],_t=tt.start+tt.count,wt=ct(it.start,_.width,4),Lt=ct(tt.start,_.width,4);it.start<=_t+1&&wt===Lt&&ct(it.start+it.count-1,_.width,4)===wt?tt.count=Math.max(tt.count,it.start+it.count-tt.start):(++P,ot[P]=it)}ot.length=P+1;let T=e.getParameter(i.UNPACK_ROW_LENGTH),V=e.getParameter(i.UNPACK_SKIP_PIXELS),K=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let st=0,tt=ot.length;st<tt;st++){let it=ot[st],_t=Math.floor(it.start/4),wt=Math.ceil(it.count/4),Lt=_t%_.width,I=Math.floor(_t/_.width),at=wt,Z=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Lt),e.pixelStorei(i.UNPACK_SKIP_ROWS,I),e.texSubImage2D(i.TEXTURE_2D,0,Lt,I,at,Z,B,z,_.data)}b.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,T),e.pixelStorei(i.UNPACK_SKIP_PIXELS,V),e.pixelStorei(i.UNPACK_SKIP_ROWS,K)}}function Rt(b,_,B){let z=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(z=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(z=i.TEXTURE_3D);let q=j(b,_),ot=_.source;e.bindTexture(z,b.__webglTexture,i.TEXTURE0+B);let P=n.get(ot);if(ot.version!==P.__version||q===!0){if(e.activeTexture(i.TEXTURE0+B),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let Z=Vt.getPrimaries(Vt.workingColorSpace),ht=_.colorSpace===Rn?null:Vt.getPrimaries(_.colorSpace),mt=_.colorSpace===Rn||Z===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt)}e.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let V=g(_.image,!1,s.maxTextureSize);V=Ae(_,V);let K=r.convert(_.format,_.colorSpace),st=r.convert(_.type),tt=v(_.internalFormat,K,st,_.normalized,_.colorSpace,_.isVideoTexture);Ht(z,_);let it,_t=_.mipmaps,wt=_.isVideoTexture!==!0,Lt=P.__version===void 0||q===!0,I=ot.dataReady,at=A(_,V);if(_.isDepthTexture)tt=E(_.format===qn,_.type),Lt&&(wt?e.texStorage2D(i.TEXTURE_2D,1,tt,V.width,V.height):e.texImage2D(i.TEXTURE_2D,0,tt,V.width,V.height,0,K,st,null));else if(_.isDataTexture)if(_t.length>0){wt&&Lt&&e.texStorage2D(i.TEXTURE_2D,at,tt,_t[0].width,_t[0].height);for(let Z=0,ht=_t.length;Z<ht;Z++)it=_t[Z],wt?I&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,it.width,it.height,K,st,it.data):e.texImage2D(i.TEXTURE_2D,Z,tt,it.width,it.height,0,K,st,it.data);_.generateMipmaps=!1}else wt?(Lt&&e.texStorage2D(i.TEXTURE_2D,at,tt,V.width,V.height),I&&rt(_,V,K,st)):e.texImage2D(i.TEXTURE_2D,0,tt,V.width,V.height,0,K,st,V.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){wt&&Lt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,at,tt,_t[0].width,_t[0].height,V.depth);for(let Z=0,ht=_t.length;Z<ht;Z++)if(it=_t[Z],_.format!==Ze)if(K!==null)if(wt){if(I)if(_.layerUpdates.size>0){let mt=Fa(it.width,it.height,_.format,_.type);for(let et of _.layerUpdates){let bt=it.data.subarray(et*mt/it.data.BYTES_PER_ELEMENT,(et+1)*mt/it.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,et,it.width,it.height,1,K,bt)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,it.width,it.height,V.depth,K,it.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,tt,it.width,it.height,V.depth,0,it.data,0,0);else Et("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else wt?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,it.width,it.height,V.depth,K,st,it.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Z,tt,it.width,it.height,V.depth,0,K,st,it.data)}else{wt&&Lt&&e.texStorage2D(i.TEXTURE_2D,at,tt,_t[0].width,_t[0].height);for(let Z=0,ht=_t.length;Z<ht;Z++)it=_t[Z],_.format!==Ze?K!==null?wt?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,it.width,it.height,K,it.data):e.compressedTexImage2D(i.TEXTURE_2D,Z,tt,it.width,it.height,0,it.data):Et("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):wt?I&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,it.width,it.height,K,st,it.data):e.texImage2D(i.TEXTURE_2D,Z,tt,it.width,it.height,0,K,st,it.data)}else if(_.isDataArrayTexture)if(wt){if(Lt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,at,tt,V.width,V.height,V.depth),I)if(_.layerUpdates.size>0){let Z=Fa(V.width,V.height,_.format,_.type);for(let ht of _.layerUpdates){let mt=V.data.subarray(ht*Z/V.data.BYTES_PER_ELEMENT,(ht+1)*Z/V.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ht,V.width,V.height,1,K,st,mt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,V.width,V.height,V.depth,K,st,V.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,tt,V.width,V.height,V.depth,0,K,st,V.data);else if(_.isData3DTexture)wt?(Lt&&e.texStorage3D(i.TEXTURE_3D,at,tt,V.width,V.height,V.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,V.width,V.height,V.depth,K,st,V.data)):e.texImage3D(i.TEXTURE_3D,0,tt,V.width,V.height,V.depth,0,K,st,V.data);else if(_.isFramebufferTexture){if(Lt)if(wt)e.texStorage2D(i.TEXTURE_2D,at,tt,V.width,V.height);else{let Z=V.width,ht=V.height;for(let mt=0;mt<at;mt++)e.texImage2D(i.TEXTURE_2D,mt,tt,Z,ht,0,K,st,null),Z>>=1,ht>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let Z=i.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),V.parentNode!==Z){Z.appendChild(V),f.add(_),Z.onpaint=ht=>{let mt=ht.changedElements;for(let et of f)mt.includes(et.image)&&(et.needsUpdate=!0)},Z.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,V);else{let mt=i.RGBA,et=i.RGBA,bt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,mt,et,bt,V)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(_t.length>0){if(wt&&Lt){let Z=qt(_t[0]);e.texStorage2D(i.TEXTURE_2D,at,tt,Z.width,Z.height)}for(let Z=0,ht=_t.length;Z<ht;Z++)it=_t[Z],wt?I&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,K,st,it):e.texImage2D(i.TEXTURE_2D,Z,tt,K,st,it);_.generateMipmaps=!1}else if(wt){if(Lt){let Z=qt(V);e.texStorage2D(i.TEXTURE_2D,at,tt,Z.width,Z.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,K,st,V)}else e.texImage2D(i.TEXTURE_2D,0,tt,K,st,V);m(_)&&S(z),P.__version=ot.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function It(b,_,B){if(_.image.length!==6)return;let z=j(b,_),q=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+B);let ot=n.get(q);if(q.version!==ot.__version||z===!0){e.activeTexture(i.TEXTURE0+B);let P=Vt.getPrimaries(Vt.workingColorSpace),T=_.colorSpace===Rn?null:Vt.getPrimaries(_.colorSpace),V=_.colorSpace===Rn||P===T?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,V);let K=_.isCompressedTexture||_.image[0].isCompressedTexture,st=_.image[0]&&_.image[0].isDataTexture,tt=[];for(let et=0;et<6;et++)!K&&!st?tt[et]=g(_.image[et],!0,s.maxCubemapSize):tt[et]=st?_.image[et].image:_.image[et],tt[et]=Ae(_,tt[et]);let it=tt[0],_t=r.convert(_.format,_.colorSpace),wt=r.convert(_.type),Lt=v(_.internalFormat,_t,wt,_.normalized,_.colorSpace),I=_.isVideoTexture!==!0,at=ot.__version===void 0||z===!0,Z=q.dataReady,ht=A(_,it);Ht(i.TEXTURE_CUBE_MAP,_);let mt;if(K){I&&at&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,Lt,it.width,it.height);for(let et=0;et<6;et++){mt=tt[et].mipmaps;for(let bt=0;bt<mt.length;bt++){let vt=mt[bt];_.format!==Ze?_t!==null?I?Z&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,bt,0,0,vt.width,vt.height,_t,vt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,bt,Lt,vt.width,vt.height,0,vt.data):Et("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?Z&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,bt,0,0,vt.width,vt.height,_t,wt,vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,bt,Lt,vt.width,vt.height,0,_t,wt,vt.data)}}}else{if(mt=_.mipmaps,I&&at){mt.length>0&&ht++;let et=qt(tt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,Lt,et.width,et.height)}for(let et=0;et<6;et++)if(st){I?Z&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,tt[et].width,tt[et].height,_t,wt,tt[et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Lt,tt[et].width,tt[et].height,0,_t,wt,tt[et].data);for(let bt=0;bt<mt.length;bt++){let le=mt[bt].image[et].image;I?Z&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,bt+1,0,0,le.width,le.height,_t,wt,le.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,bt+1,Lt,le.width,le.height,0,_t,wt,le.data)}}else{I?Z&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,_t,wt,tt[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Lt,_t,wt,tt[et]);for(let bt=0;bt<mt.length;bt++){let vt=mt[bt];I?Z&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,bt+1,0,0,_t,wt,vt.image[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,bt+1,Lt,_t,wt,vt.image[et])}}}m(_)&&S(i.TEXTURE_CUBE_MAP),ot.__version=q.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function Tt(b,_,B,z,q,ot){let P=r.convert(B.format,B.colorSpace),T=r.convert(B.type),V=v(B.internalFormat,P,T,B.normalized,B.colorSpace),K=n.get(_),st=n.get(B);if(st.__renderTarget=_,!K.__hasExternalTextures){let tt=Math.max(1,_.width>>ot),it=Math.max(1,_.height>>ot);q===i.TEXTURE_3D||q===i.TEXTURE_2D_ARRAY?e.texImage3D(q,ot,V,tt,it,_.depth,0,P,T,null):e.texImage2D(q,ot,V,tt,it,0,P,T,null)}e.bindFramebuffer(i.FRAMEBUFFER,b),ie(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,z,q,st.__webglTexture,0,Kt(_)):(q===i.TEXTURE_2D||q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,z,q,st.__webglTexture,ot),e.bindFramebuffer(i.FRAMEBUFFER,null)}function re(b,_,B){if(i.bindRenderbuffer(i.RENDERBUFFER,b),_.depthBuffer){let z=_.depthTexture,q=z&&z.isDepthTexture?z.type:null,ot=E(_.stencilBuffer,q),P=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ie(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Kt(_),ot,_.width,_.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,Kt(_),ot,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ot,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,P,i.RENDERBUFFER,b)}else{let z=_.textures;for(let q=0;q<z.length;q++){let ot=z[q],P=r.convert(ot.format,ot.colorSpace),T=r.convert(ot.type),V=v(ot.internalFormat,P,T,ot.normalized,ot.colorSpace);ie(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Kt(_),V,_.width,_.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,Kt(_),V,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,V,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Nt(b,_,B){let z=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,b),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let q=n.get(_.depthTexture);if(q.__renderTarget=_,(!q.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),z){if(q.__webglInit===void 0&&(q.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),q.__webglTexture===void 0){q.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Ht(i.TEXTURE_CUBE_MAP,_.depthTexture);let K=r.convert(_.depthTexture.format),st=r.convert(_.depthTexture.type),tt;_.depthTexture.format===ln?tt=i.DEPTH_COMPONENT24:_.depthTexture.format===qn&&(tt=i.DEPTH24_STENCIL8);for(let it=0;it<6;it++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,tt,_.width,_.height,0,K,st,null)}}else Q(_.depthTexture,0);let ot=q.__webglTexture,P=Kt(_),T=z?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,V=_.depthTexture.format===qn?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===ln)ie(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,T,ot,0,P):i.framebufferTexture2D(i.FRAMEBUFFER,V,T,ot,0);else if(_.depthTexture.format===qn)ie(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,T,ot,0,P):i.framebufferTexture2D(i.FRAMEBUFFER,V,T,ot,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Xt(b){let _=n.get(b),B=b.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==b.depthTexture){let z=b.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),z){let q=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,z.removeEventListener("dispose",q)};z.addEventListener("dispose",q),_.__depthDisposeCallback=q}_.__boundDepthTexture=z}if(b.depthTexture&&!_.__autoAllocateDepthBuffer)if(B)for(let z=0;z<6;z++)Nt(_.__webglFramebuffer[z],b,z);else{let z=b.texture.mipmaps;z&&z.length>0?Nt(_.__webglFramebuffer[0],b,0):Nt(_.__webglFramebuffer,b,0)}else if(B){_.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[z]),_.__webglDepthbuffer[z]===void 0)_.__webglDepthbuffer[z]=i.createRenderbuffer(),re(_.__webglDepthbuffer[z],b,!1);else{let q=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=_.__webglDepthbuffer[z];i.bindRenderbuffer(i.RENDERBUFFER,ot),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,ot)}}else{let z=b.texture.mipmaps;if(z&&z.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),re(_.__webglDepthbuffer,b,!1);else{let q=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ot),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,ot)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ut(b,_,B){let z=n.get(b);_!==void 0&&Tt(z.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Xt(b)}function Wt(b){let _=b.texture,B=n.get(b),z=n.get(_);b.addEventListener("dispose",x);let q=b.textures,ot=b.isWebGLCubeRenderTarget===!0,P=q.length>1;if(P||(z.__webglTexture===void 0&&(z.__webglTexture=i.createTexture()),z.__version=_.version,o.memory.textures++),ot){B.__webglFramebuffer=[];for(let T=0;T<6;T++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[T]=[];for(let V=0;V<_.mipmaps.length;V++)B.__webglFramebuffer[T][V]=i.createFramebuffer()}else B.__webglFramebuffer[T]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let T=0;T<_.mipmaps.length;T++)B.__webglFramebuffer[T]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(P)for(let T=0,V=q.length;T<V;T++){let K=n.get(q[T]);K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture(),o.memory.textures++)}if(b.samples>0&&ie(b)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let T=0;T<q.length;T++){let V=q[T];B.__webglColorRenderbuffer[T]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[T]);let K=r.convert(V.format,V.colorSpace),st=r.convert(V.type),tt=v(V.internalFormat,K,st,V.normalized,V.colorSpace,b.isXRRenderTarget===!0),it=Kt(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,it,tt,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+T,i.RENDERBUFFER,B.__webglColorRenderbuffer[T])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),re(B.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ot){e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture),Ht(i.TEXTURE_CUBE_MAP,_);for(let T=0;T<6;T++)if(_.mipmaps&&_.mipmaps.length>0)for(let V=0;V<_.mipmaps.length;V++)Tt(B.__webglFramebuffer[T][V],b,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+T,V);else Tt(B.__webglFramebuffer[T],b,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+T,0);m(_)&&S(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(P){for(let T=0,V=q.length;T<V;T++){let K=q[T],st=n.get(K),tt=i.TEXTURE_2D;(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(tt=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(tt,st.__webglTexture),Ht(tt,K),Tt(B.__webglFramebuffer,b,K,i.COLOR_ATTACHMENT0+T,tt,0),m(K)&&S(tt)}e.unbindTexture()}else{let T=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(T=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(T,z.__webglTexture),Ht(T,_),_.mipmaps&&_.mipmaps.length>0)for(let V=0;V<_.mipmaps.length;V++)Tt(B.__webglFramebuffer[V],b,_,i.COLOR_ATTACHMENT0,T,V);else Tt(B.__webglFramebuffer,b,_,i.COLOR_ATTACHMENT0,T,0);m(_)&&S(T),e.unbindTexture()}b.depthBuffer&&Xt(b)}function ce(b){let _=b.textures;for(let B=0,z=_.length;B<z;B++){let q=_[B];if(m(q)){let ot=C(b),P=n.get(q).__webglTexture;e.bindTexture(ot,P),S(ot),e.unbindTexture()}}}let fe=[],oe=[];function me(b){if(b.samples>0){if(ie(b)===!1){let _=b.textures,B=b.width,z=b.height,q=i.COLOR_BUFFER_BIT,ot=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,P=n.get(b),T=_.length>1;if(T)for(let K=0;K<_.length;K++)e.bindFramebuffer(i.FRAMEBUFFER,P.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,P.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,P.__webglMultisampledFramebuffer);let V=b.texture.mipmaps;V&&V.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,P.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,P.__webglFramebuffer);for(let K=0;K<_.length;K++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(q|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(q|=i.STENCIL_BUFFER_BIT)),T){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,P.__webglColorRenderbuffer[K]);let st=n.get(_[K]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,st,0)}i.blitFramebuffer(0,0,B,z,0,0,B,z,q,i.NEAREST),l===!0&&(fe.length=0,oe.length=0,fe.push(i.COLOR_ATTACHMENT0+K),b.depthBuffer&&b.resolveDepthBuffer===!1&&(fe.push(ot),oe.push(ot),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,oe)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,fe))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),T)for(let K=0;K<_.length;K++){e.bindFramebuffer(i.FRAMEBUFFER,P.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,P.__webglColorRenderbuffer[K]);let st=n.get(_[K]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,P.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.TEXTURE_2D,st,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,P.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){let _=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Kt(b){return Math.min(s.maxSamples,b.samples)}function ie(b){let _=n.get(b);return b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function U(b){let _=o.render.frame;h.get(b)!==_&&(h.set(b,_),b.update())}function Ae(b,_){let B=b.colorSpace,z=b.format,q=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||B!==Zi&&B!==Rn&&(Vt.getTransfer(B)===Zt?(z!==Ze||q!==Ne)&&Et("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ct("WebGLTextures: Unsupported texture color space:",B)),_}function qt(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=J,this.getTextureUnits=$,this.setTextureUnits=W,this.setTexture2D=Q,this.setTexture2DArray=nt,this.setTexture3D=lt,this.setTextureCube=ut,this.rebindTextures=Ut,this.setupRenderTarget=Wt,this.updateRenderTargetMipmap=ce,this.updateMultisampleRenderTarget=me,this.setupDepthRenderbuffer=Xt,this.setupFrameBufferTexture=Tt,this.useMultisampledRTT=ie,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Hm(i,t){function e(n,s=Rn){let r,o=Vt.getTransfer(s);if(n===Ne)return i.UNSIGNED_BYTE;if(n===Fr)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Or)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ta)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ea)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Aa)return i.BYTE;if(n===wa)return i.SHORT;if(n===Oi)return i.UNSIGNED_SHORT;if(n===Ur)return i.INT;if(n===tn)return i.UNSIGNED_INT;if(n===en)return i.FLOAT;if(n===mn)return i.HALF_FLOAT;if(n===Ca)return i.ALPHA;if(n===Ra)return i.RGB;if(n===Ze)return i.RGBA;if(n===ln)return i.DEPTH_COMPONENT;if(n===qn)return i.DEPTH_STENCIL;if(n===Pa)return i.RED;if(n===Br)return i.RED_INTEGER;if(n===Zn)return i.RG;if(n===zr)return i.RG_INTEGER;if(n===Vr)return i.RGBA_INTEGER;if(n===ds||n===ps||n===ms||n===gs)if(o===Zt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ds)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ps)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ms)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===gs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ds)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ps)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ms)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===gs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===kr||n===Gr||n===Hr||n===Wr)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===kr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Gr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Hr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Wr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Xr||n===Yr||n===qr||n===Zr||n===Jr||n===_s||n===$r)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Xr||n===Yr)return o===Zt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===qr)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Zr)return r.COMPRESSED_R11_EAC;if(n===Jr)return r.COMPRESSED_SIGNED_R11_EAC;if(n===_s)return r.COMPRESSED_RG11_EAC;if(n===$r)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===jr||n===Kr||n===Qr||n===to||n===eo||n===no||n===io||n===so||n===ro||n===oo||n===ao||n===co||n===lo||n===ho)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===jr)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Kr)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Qr)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===to)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===eo)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===no)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===io)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===so)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ro)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===oo)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ao)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===co)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===lo)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ho)return o===Zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===uo||n===fo||n===po)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===uo)return o===Zt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===fo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===po)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===mo||n===go||n===xs||n===_o)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===mo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===go)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===xs)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_o)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Wm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xm=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,$a=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new is(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ve({vertexShader:Wm,fragmentShader:Xm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Se(new fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ja=class extends hn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,p=null,y=typeof XRWebGLBinding<"u",g=new $a,m={},S=e.getContextAttributes(),C=null,v=null,E=[],A=[],R=new Gt,x=null,w=new Pe;w.viewport=new se;let D=new Pe;D.viewport=new se;let L=[w,D],N=new Ir,J=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ct=E[j];return ct===void 0&&(ct=new Pi,E[j]=ct),ct.getTargetRaySpace()},this.getControllerGrip=function(j){let ct=E[j];return ct===void 0&&(ct=new Pi,E[j]=ct),ct.getGripSpace()},this.getHand=function(j){let ct=E[j];return ct===void 0&&(ct=new Pi,E[j]=ct),ct.getHandSpace()};function W(j){let ct=A.indexOf(j.inputSource);if(ct===-1)return;let rt=E[ct];rt!==void 0&&(rt.update(j.inputSource,j.frame,c||o),rt.dispatchEvent({type:j.type,data:j.inputSource}))}function O(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",Y);for(let j=0;j<E.length;j++){let ct=A[j];ct!==null&&(A[j]=null,E[j].disconnect(ct))}J=null,$=null,g.reset();for(let j in m)delete m[j];t.setRenderTarget(C),d=null,u=null,f=null,s=null,v=null,Ht.stop(),n.isPresenting=!1,t.setPixelRatio(x),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&Et("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&Et("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&y&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(C=t.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",O),s.addEventListener("inputsourceschange",Y),S.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let rt=null,Rt=null,It=null;S.depth&&(It=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=S.stencil?qn:ln,Rt=S.stencil?Bi:tn);let Tt={colorFormat:e.RGBA8,depthFormat:It,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Tt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),v=new ze(u.textureWidth,u.textureHeight,{format:Ze,type:Ne,depthTexture:new En(u.textureWidth,u.textureHeight,Rt,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let rt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,rt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new ze(d.framebufferWidth,d.framebufferHeight,{format:Ze,type:Ne,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ht.setContext(s),Ht.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Y(j){for(let ct=0;ct<j.removed.length;ct++){let rt=j.removed[ct],Rt=A.indexOf(rt);Rt>=0&&(A[Rt]=null,E[Rt].disconnect(rt))}for(let ct=0;ct<j.added.length;ct++){let rt=j.added[ct],Rt=A.indexOf(rt);if(Rt===-1){for(let Tt=0;Tt<E.length;Tt++)if(Tt>=A.length){A.push(rt),Rt=Tt;break}else if(A[Tt]===null){A[Tt]=rt,Rt=Tt;break}if(Rt===-1)break}let It=E[Rt];It&&It.connect(rt)}}let Q=new H,nt=new H;function lt(j,ct,rt){Q.setFromMatrixPosition(ct.matrixWorld),nt.setFromMatrixPosition(rt.matrixWorld);let Rt=Q.distanceTo(nt),It=ct.projectionMatrix.elements,Tt=rt.projectionMatrix.elements,re=It[14]/(It[10]-1),Nt=It[14]/(It[10]+1),Xt=(It[9]+1)/It[5],Ut=(It[9]-1)/It[5],Wt=(It[8]-1)/It[0],ce=(Tt[8]+1)/Tt[0],fe=re*Wt,oe=re*ce,me=Rt/(-Wt+ce),Kt=me*-Wt;if(ct.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Kt),j.translateZ(me),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),It[10]===-1)j.projectionMatrix.copy(ct.projectionMatrix),j.projectionMatrixInverse.copy(ct.projectionMatrixInverse);else{let ie=re+me,U=Nt+me,Ae=fe-Kt,qt=oe+(Rt-Kt),b=Xt*Nt/U*ie,_=Ut*Nt/U*ie;j.projectionMatrix.makePerspective(Ae,qt,b,_,ie,U),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function ut(j,ct){ct===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ct.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let ct=j.near,rt=j.far;g.texture!==null&&(g.depthNear>0&&(ct=g.depthNear),g.depthFar>0&&(rt=g.depthFar)),N.near=D.near=w.near=ct,N.far=D.far=w.far=rt,(J!==N.near||$!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),J=N.near,$=N.far),N.layers.mask=j.layers.mask|6,w.layers.mask=N.layers.mask&-5,D.layers.mask=N.layers.mask&-3;let Rt=j.parent,It=N.cameras;ut(N,Rt);for(let Tt=0;Tt<It.length;Tt++)ut(It[Tt],Rt);It.length===2?lt(N,w,D):N.projectionMatrix.copy(w.projectionMatrix),gt(j,N,Rt)};function gt(j,ct,rt){rt===null?j.matrix.copy(ct.matrixWorld):(j.matrix.copy(rt.matrixWorld),j.matrix.invert(),j.matrix.multiply(ct.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ct.projectionMatrix),j.projectionMatrixInverse.copy(ct.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=lr*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(j){l=j,u!==null&&(u.fixedFoveation=j),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=j)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(j){return m[j]};let zt=null;function ee(j,ct){if(h=ct.getViewerPose(c||o),p=ct,h!==null){let rt=h.views;d!==null&&(t.setRenderTargetFramebuffer(v,d.framebuffer),t.setRenderTarget(v));let Rt=!1;rt.length!==N.cameras.length&&(N.cameras.length=0,Rt=!0);for(let Nt=0;Nt<rt.length;Nt++){let Xt=rt[Nt],Ut=null;if(d!==null)Ut=d.getViewport(Xt);else{let ce=f.getViewSubImage(u,Xt);Ut=ce.viewport,Nt===0&&(t.setRenderTargetTextures(v,ce.colorTexture,ce.depthStencilTexture),t.setRenderTarget(v))}let Wt=L[Nt];Wt===void 0&&(Wt=new Pe,Wt.layers.enable(Nt),Wt.viewport=new se,L[Nt]=Wt),Wt.matrix.fromArray(Xt.transform.matrix),Wt.matrix.decompose(Wt.position,Wt.quaternion,Wt.scale),Wt.projectionMatrix.fromArray(Xt.projectionMatrix),Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(),Wt.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),Nt===0&&(N.matrix.copy(Wt.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Rt===!0&&N.cameras.push(Wt)}let It=s.enabledFeatures;if(It&&It.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){f=n.getBinding();let Nt=f.getDepthInformation(rt[0]);Nt&&Nt.isValid&&Nt.texture&&g.init(Nt,s.renderState)}if(It&&It.includes("camera-access")&&y){t.state.unbindTexture(),f=n.getBinding();for(let Nt=0;Nt<rt.length;Nt++){let Xt=rt[Nt].camera;if(Xt){let Ut=m[Xt];Ut||(Ut=new is,m[Xt]=Ut);let Wt=f.getCameraImage(Xt);Ut.sourceTexture=Wt}}}}for(let rt=0;rt<E.length;rt++){let Rt=A[rt],It=E[rt];Rt!==null&&It!==void 0&&It.update(Rt,ct,c||o)}zt&&zt(j,ct),ct.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ct}),p=null}let Ht=new Hl;Ht.setAnimationLoop(ee),this.setAnimationLoop=function(j){zt=j},this.dispose=function(){}}},Ym=new ae,Jl=new Pt;Jl.set(-1,0,0,0,1,0,0,0,1);function qm(i,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Da(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,S,C,v){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),f(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),u(g,m),m.isMeshPhysicalMaterial&&d(g,m,v)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),y(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,S,C):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Le&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Le&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let S=t.get(m),C=S.envMap,v=S.envMapRotation;C&&(g.envMap.value=C,g.envMapRotation.value.setFromMatrix4(Ym.makeRotationFromEuler(v)).transpose(),C.isCubeTexture&&C.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Jl),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,S,C){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*S,g.scale.value=C*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function u(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function d(g,m,S){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Le&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function y(g,m){let S=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Zm(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,E){let A=E.program;n.uniformBlockBinding(v,A)}function c(v,E){let A=s[v.id];A===void 0&&(g(v),A=h(v),s[v.id]=A,v.addEventListener("dispose",S));let R=E.program;n.updateUBOMapping(v,R);let x=t.render.frame;r[v.id]!==x&&(u(v),r[v.id]=x)}function h(v){let E=f();v.__bindingPointIndex=E;let A=i.createBuffer(),R=v.__size,x=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,A),i.bufferData(i.UNIFORM_BUFFER,R,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,A),A}function f(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return Ct("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){let E=s[v.id],A=v.uniforms,R=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let x=0,w=A.length;x<w;x++){let D=A[x];if(Array.isArray(D))for(let L=0,N=D.length;L<N;L++)d(D[L],x,L,R);else d(D,x,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,E,A,R){if(y(v,E,A,R)===!0){let x=v.__offset,w=v.value;if(Array.isArray(w)){let D=0;for(let L=0;L<w.length;L++){let N=w[L],J=m(N);p(N,v.__data,D),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(D+=J.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(w,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,v.__data)}}function p(v,E,A){typeof v=="number"||typeof v=="boolean"?E[0]=v:v.isMatrix3?(E[0]=v.elements[0],E[1]=v.elements[1],E[2]=v.elements[2],E[3]=0,E[4]=v.elements[3],E[5]=v.elements[4],E[6]=v.elements[5],E[7]=0,E[8]=v.elements[6],E[9]=v.elements[7],E[10]=v.elements[8],E[11]=0):ArrayBuffer.isView(v)?E.set(new v.constructor(v.buffer,v.byteOffset,E.length)):v.toArray(E,A)}function y(v,E,A,R){let x=v.value,w=E+"_"+A;if(R[w]===void 0)return typeof x=="number"||typeof x=="boolean"?R[w]=x:ArrayBuffer.isView(x)?R[w]=x.slice():R[w]=x.clone(),!0;{let D=R[w];if(typeof x=="number"||typeof x=="boolean"){if(D!==x)return R[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(D.equals(x)===!1)return D.copy(x),!0}}return!1}function g(v){let E=v.uniforms,A=0,R=16;for(let w=0,D=E.length;w<D;w++){let L=Array.isArray(E[w])?E[w]:[E[w]];for(let N=0,J=L.length;N<J;N++){let $=L[N],W=Array.isArray($.value)?$.value:[$.value];for(let O=0,Y=W.length;O<Y;O++){let Q=W[O],nt=m(Q),lt=A%R,ut=lt%nt.boundary,gt=lt+ut;A+=ut,gt!==0&&R-gt<nt.storage&&(A+=R-gt),$.__data=new Float32Array(nt.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=A,A+=nt.storage}}}let x=A%R;return x>0&&(A+=R-x),v.__size=A,v.__cache={},this}function m(v){let E={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(E.boundary=4,E.storage=4):v.isVector2?(E.boundary=8,E.storage=8):v.isVector3||v.isColor?(E.boundary=16,E.storage=12):v.isVector4?(E.boundary=16,E.storage=16):v.isMatrix3?(E.boundary=48,E.storage=48):v.isMatrix4?(E.boundary=64,E.storage=64):v.isTexture?Et("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(E.boundary=16,E.storage=v.byteLength):Et("WebGLRenderer: Unsupported uniform value type.",v),E}function S(v){let E=v.target;E.removeEventListener("dispose",S);let A=o.indexOf(E.__bindingPointIndex);o.splice(A,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function C(){for(let v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:C}}var Jm=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),gn=null;function $m(){return gn===null&&(gn=new pr(Jm,16,16,Zn,mn),gn.name="DFG_LUT",gn.minFilter=ue,gn.magFilter=ue,gn.wrapS=cn,gn.wrapT=cn,gn.generateMipmaps=!1,gn.needsUpdate=!0),gn}var wo=class{constructor(t={}){let{canvas:e=pl(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Ne}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let y=d,g=new Set([Vr,zr,Br]),m=new Set([Ne,tn,Oi,Bi,Fr,Or]),S=new Uint32Array(4),C=new Int32Array(4),v=new H,E=null,A=null,R=[],x=[],w=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ge,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let D=this,L=!1,N=null,J=null,$=null,W=null;this._outputColorSpace=ve;let O=0,Y=0,Q=null,nt=-1,lt=null,ut=new se,gt=new se,zt=null,ee=new Ft(0),Ht=0,j=e.width,ct=e.height,rt=1,Rt=null,It=null,Tt=new se(0,0,j,ct),re=new se(0,0,j,ct),Nt=!1,Xt=new Li,Ut=!1,Wt=!1,ce=new ae,fe=new H,oe=new se,me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Kt=!1;function ie(){return Q===null?rt:1}let U=n;function Ae(M,F){return e.getContext(M,F)}try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"185"}`),e.addEventListener("webglcontextlost",le,!1),e.addEventListener("webglcontextrestored",Qt,!1),e.addEventListener("webglcontextcreationerror",nn,!1),U===null){let F="webgl2";if(U=Ae(F,M),U===null)throw Ae(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(M){throw Ct("WebGLRenderer: "+M.message),M}let qt,b,_,B,z,q,ot,P,T,V,K,st,tt,it,_t,wt,Lt,I,at,Z,ht,mt,et;function bt(){qt=new ip(U),qt.init(),ht=new Hm(U,qt),b=new Jd(U,qt,t,ht),_=new km(U,qt),b.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),J=U.createFramebuffer(),$=U.createFramebuffer(),W=U.createFramebuffer(),B=new op(U),z=new Em,q=new Gm(U,qt,_,z,b,ht,B),ot=new np(D),P=new lu(U),mt=new qd(U,P),T=new sp(U,P,B,mt),V=new cp(U,T,P,mt,B),I=new ap(U,b,q),_t=new $d(z),K=new Tm(D,ot,qt,b,mt,_t),st=new qm(D,z),tt=new Rm,it=new Um(qt),Lt=new Yd(D,ot,_,V,p,l),wt=new Vm(D,V,b),et=new Zm(U,B,b,_),at=new Zd(U,qt,B),Z=new rp(U,qt,B),B.programs=K.programs,D.capabilities=b,D.extensions=qt,D.properties=z,D.renderLists=tt,D.shadowMap=wt,D.state=_,D.info=B}bt(),y!==Ne&&(w=new hp(y,e.width,e.height,a,s,r));let vt=new ja(D,U);this.xr=vt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let M=qt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=qt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return rt},this.setPixelRatio=function(M){M!==void 0&&(rt=M,this.setSize(j,ct,!1))},this.getSize=function(M){return M.set(j,ct)},this.setSize=function(M,F,X=!0){if(vt.isPresenting){Et("WebGLRenderer: Can't change size while VR device is presenting.");return}j=M,ct=F,e.width=Math.floor(M*rt),e.height=Math.floor(F*rt),X===!0&&(e.style.width=M+"px",e.style.height=F+"px"),w!==null&&w.setSize(e.width,e.height),this.setViewport(0,0,M,F)},this.getDrawingBufferSize=function(M){return M.set(j*rt,ct*rt).floor()},this.setDrawingBufferSize=function(M,F,X){j=M,ct=F,rt=X,e.width=Math.floor(M*X),e.height=Math.floor(F*X),this.setViewport(0,0,M,F)},this.setEffects=function(M){if(y===Ne){Ct("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let F=0;F<M.length;F++)if(M[F].isOutputPass===!0){Et("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ut)},this.getViewport=function(M){return M.copy(Tt)},this.setViewport=function(M,F,X,k){M.isVector4?Tt.set(M.x,M.y,M.z,M.w):Tt.set(M,F,X,k),_.viewport(ut.copy(Tt).multiplyScalar(rt).round())},this.getScissor=function(M){return M.copy(re)},this.setScissor=function(M,F,X,k){M.isVector4?re.set(M.x,M.y,M.z,M.w):re.set(M,F,X,k),_.scissor(gt.copy(re).multiplyScalar(rt).round())},this.getScissorTest=function(){return Nt},this.setScissorTest=function(M){_.setScissorTest(Nt=M)},this.setOpaqueSort=function(M){Rt=M},this.setTransparentSort=function(M){It=M},this.getClearColor=function(M){return M.copy(Lt.getClearColor())},this.setClearColor=function(){Lt.setClearColor(...arguments)},this.getClearAlpha=function(){return Lt.getClearAlpha()},this.setClearAlpha=function(){Lt.setClearAlpha(...arguments)},this.clear=function(M=!0,F=!0,X=!0){let k=0;if(M){let G=!1;if(Q!==null){let pt=Q.texture.format;G=g.has(pt)}if(G){let pt=Q.texture.type,yt=m.has(pt),dt=Lt.getClearColor(),Mt=Lt.getClearAlpha(),St=dt.r,Dt=dt.g,Bt=dt.b;yt?(S[0]=St,S[1]=Dt,S[2]=Bt,S[3]=Mt,U.clearBufferuiv(U.COLOR,0,S)):(C[0]=St,C[1]=Dt,C[2]=Bt,C[3]=Mt,U.clearBufferiv(U.COLOR,0,C))}else k|=U.COLOR_BUFFER_BIT}F&&(k|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(k|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&U.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),N=M},this.dispose=function(){e.removeEventListener("webglcontextlost",le,!1),e.removeEventListener("webglcontextrestored",Qt,!1),e.removeEventListener("webglcontextcreationerror",nn,!1),Lt.dispose(),tt.dispose(),it.dispose(),z.dispose(),ot.dispose(),V.dispose(),mt.dispose(),et.dispose(),K.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",rc),vt.removeEventListener("sessionend",oc),$n.stop()};function le(M){M.preventDefault(),La("WebGLRenderer: Context Lost."),L=!0}function Qt(){La("WebGLRenderer: Context Restored."),L=!1;let M=B.autoReset,F=wt.enabled,X=wt.autoUpdate,k=wt.needsUpdate,G=wt.type;bt(),B.autoReset=M,wt.enabled=F,wt.autoUpdate=X,wt.needsUpdate=k,wt.type=G}function nn(M){Ct("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function sn(M){let F=M.target;F.removeEventListener("dispose",sn),ch(F)}function ch(M){lh(M),z.remove(M)}function lh(M){let F=z.get(M).programs;F!==void 0&&(F.forEach(function(X){K.releaseProgram(X)}),M.isShaderMaterial&&K.releaseShaderCache(M))}this.renderBufferDirect=function(M,F,X,k,G,pt){F===null&&(F=me);let yt=G.isMesh&&G.matrixWorld.determinantAffine()<0,dt=fh(M,F,X,k,G);_.setMaterial(k,yt);let Mt=X.index,St=1;if(k.wireframe===!0){if(Mt=T.getWireframeAttribute(X),Mt===void 0)return;St=2}let Dt=X.drawRange,Bt=X.attributes.position,At=Dt.start*St,Jt=(Dt.start+Dt.count)*St;pt!==null&&(At=Math.max(At,pt.start*St),Jt=Math.min(Jt,(pt.start+pt.count)*St)),Mt!==null?(At=Math.max(At,0),Jt=Math.min(Jt,Mt.count)):Bt!=null&&(At=Math.max(At,0),Jt=Math.min(Jt,Bt.count));let de=Jt-At;if(de<0||de===1/0)return;mt.setup(G,k,dt,X,Mt);let he,$t=at;if(Mt!==null&&(he=P.get(Mt),$t=Z,$t.setIndex(he)),G.isMesh)k.wireframe===!0?(_.setLineWidth(k.wireframeLinewidth*ie()),$t.setMode(U.LINES)):$t.setMode(U.TRIANGLES);else if(G.isLine){let we=k.linewidth;we===void 0&&(we=1),_.setLineWidth(we*ie()),G.isLineSegments?$t.setMode(U.LINES):G.isLineLoop?$t.setMode(U.LINE_LOOP):$t.setMode(U.LINE_STRIP)}else G.isPoints?$t.setMode(U.POINTS):G.isSprite&&$t.setMode(U.TRIANGLES);if(G.isBatchedMesh)if(qt.get("WEBGL_multi_draw"))$t.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let we=G._multiDrawStarts,xt=G._multiDrawCounts,Ue=G._multiDrawCount,Yt=Mt?P.get(Mt).bytesPerElement:1,We=z.get(k).currentProgram.getUniforms();for(let rn=0;rn<Ue;rn++)We.setValue(U,"_gl_DrawID",rn),$t.render(we[rn]/Yt,xt[rn])}else if(G.isInstancedMesh)$t.renderInstances(At,de,G.count);else if(X.isInstancedBufferGeometry){let we=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,xt=Math.min(X.instanceCount,we);$t.renderInstances(At,de,xt)}else $t.render(At,de)};function sc(M,F,X){M.transparent===!0&&M.side===qe&&M.forceSinglePass===!1?(M.side=Le,M.needsUpdate=!0,Es(M,F,X),M.side=wn,M.needsUpdate=!0,Es(M,F,X),M.side=qe):Es(M,F,X)}this.compile=function(M,F,X=null){X===null&&(X=M),A=it.get(X),A.init(F),x.push(A),X.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(A.pushLight(G),G.castShadow&&A.pushShadow(G))}),M!==X&&M.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(A.pushLight(G),G.castShadow&&A.pushShadow(G))}),A.setupLights();let k=new Set;return M.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let pt=G.material;if(pt)if(Array.isArray(pt))for(let yt=0;yt<pt.length;yt++){let dt=pt[yt];sc(dt,X,G),k.add(dt)}else sc(pt,X,G),k.add(pt)}),A=x.pop(),k},this.compileAsync=function(M,F,X=null){let k=this.compile(M,F,X);return new Promise(G=>{function pt(){if(k.forEach(function(yt){z.get(yt).currentProgram.isReady()&&k.delete(yt)}),k.size===0){G(M);return}setTimeout(pt,10)}qt.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let Ro=null;function hh(M){Ro&&Ro(M)}function rc(){$n.stop()}function oc(){$n.start()}let $n=new Hl;$n.setAnimationLoop(hh),typeof self<"u"&&$n.setContext(self),this.setAnimationLoop=function(M){Ro=M,vt.setAnimationLoop(M),M===null?$n.stop():$n.start()},vt.addEventListener("sessionstart",rc),vt.addEventListener("sessionend",oc),this.render=function(M,F){if(F!==void 0&&F.isCamera!==!0){Ct("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;N!==null&&N.renderStart(M,F);let X=vt.enabled===!0&&vt.isPresenting===!0,k=w!==null&&(Q===null||X)&&w.begin(D,Q);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(F),F=vt.getCamera()),M.isScene===!0&&M.onBeforeRender(D,M,F,Q),A=it.get(M,x.length),A.init(F),A.state.textureUnits=q.getTextureUnits(),x.push(A),ce.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Xt.setFromProjectionMatrix(ce,Ke,F.reversedDepth),Wt=this.localClippingEnabled,Ut=_t.init(this.clippingPlanes,Wt),E=tt.get(M,R.length),E.init(),R.push(E),vt.enabled===!0&&vt.isPresenting===!0){let yt=D.xr.getDepthSensingMesh();yt!==null&&Po(yt,F,-1/0,D.sortObjects)}Po(M,F,0,D.sortObjects),E.finish(),D.sortObjects===!0&&E.sort(Rt,It,F.reversedDepth),Kt=vt.enabled===!1||vt.isPresenting===!1||vt.hasDepthSensing()===!1,Kt&&Lt.addToRenderList(E,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ut===!0&&_t.beginShadows();let G=A.state.shadowsArray;if(wt.render(G,M,F),Ut===!0&&_t.endShadows(),(k&&w.hasRenderPass())===!1){let yt=E.opaque,dt=E.transmissive;if(A.setupLights(),F.isArrayCamera){let Mt=F.cameras;if(dt.length>0)for(let St=0,Dt=Mt.length;St<Dt;St++){let Bt=Mt[St];cc(yt,dt,M,Bt)}Kt&&Lt.render(M);for(let St=0,Dt=Mt.length;St<Dt;St++){let Bt=Mt[St];ac(E,M,Bt,Bt.viewport)}}else dt.length>0&&cc(yt,dt,M,F),Kt&&Lt.render(M),ac(E,M,F)}Q!==null&&Y===0&&(q.updateMultisampleRenderTarget(Q),q.updateRenderTargetMipmap(Q)),k&&w.end(D),M.isScene===!0&&M.onAfterRender(D,M,F),mt.resetDefaultState(),nt=-1,lt=null,x.pop(),x.length>0?(A=x[x.length-1],q.setTextureUnits(A.state.textureUnits),Ut===!0&&_t.setGlobalState(D.clippingPlanes,A.state.camera)):A=null,R.pop(),R.length>0?E=R[R.length-1]:E=null,N!==null&&N.renderEnd()};function Po(M,F,X,k){if(M.visible===!1)return;if(M.layers.test(F.layers)){if(M.isGroup)X=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(F);else if(M.isLightProbeGrid)A.pushLightProbeGrid(M);else if(M.isLight)A.pushLight(M),M.castShadow&&A.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Xt.intersectsSprite(M)){k&&oe.setFromMatrixPosition(M.matrixWorld).applyMatrix4(ce);let yt=V.update(M),dt=M.material;dt.visible&&E.push(M,yt,dt,X,oe.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Xt.intersectsObject(M))){let yt=V.update(M),dt=M.material;if(k&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),oe.copy(M.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),oe.copy(yt.boundingSphere.center)),oe.applyMatrix4(M.matrixWorld).applyMatrix4(ce)),Array.isArray(dt)){let Mt=yt.groups;for(let St=0,Dt=Mt.length;St<Dt;St++){let Bt=Mt[St],At=dt[Bt.materialIndex];At&&At.visible&&E.push(M,yt,At,X,oe.z,Bt)}}else dt.visible&&E.push(M,yt,dt,X,oe.z,null)}}let pt=M.children;for(let yt=0,dt=pt.length;yt<dt;yt++)Po(pt[yt],F,X,k)}function ac(M,F,X,k){let{opaque:G,transmissive:pt,transparent:yt}=M;A.setupLightsView(X),Ut===!0&&_t.setGlobalState(D.clippingPlanes,X),k&&_.viewport(ut.copy(k)),G.length>0&&Ts(G,F,X),pt.length>0&&Ts(pt,F,X),yt.length>0&&Ts(yt,F,X),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function cc(M,F,X,k){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[k.id]===void 0){let At=qt.has("EXT_color_buffer_half_float")||qt.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[k.id]=new ze(1,1,{generateMipmaps:!0,type:At?mn:Ne,minFilter:pn,samples:Math.max(4,b.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Vt.workingColorSpace})}let pt=A.state.transmissionRenderTarget[k.id],yt=k.viewport||ut;pt.setSize(yt.z*D.transmissionResolutionScale,yt.w*D.transmissionResolutionScale);let dt=D.getRenderTarget(),Mt=D.getActiveCubeFace(),St=D.getActiveMipmapLevel();D.setRenderTarget(pt),D.getClearColor(ee),Ht=D.getClearAlpha(),Ht<1&&D.setClearColor(16777215,.5),D.clear(),Kt&&Lt.render(X);let Dt=D.toneMapping;D.toneMapping=Ge;let Bt=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),A.setupLightsView(k),Ut===!0&&_t.setGlobalState(D.clippingPlanes,k),Ts(M,X,k),q.updateMultisampleRenderTarget(pt),q.updateRenderTargetMipmap(pt),qt.has("WEBGL_multisampled_render_to_texture")===!1){let At=!1;for(let Jt=0,de=F.length;Jt<de;Jt++){let he=F[Jt],{object:$t,geometry:we,material:xt,group:Ue}=he;if(xt.side===qe&&$t.layers.test(k.layers)){let Yt=xt.side;xt.side=Le,xt.needsUpdate=!0,lc($t,X,k,we,xt,Ue),xt.side=Yt,xt.needsUpdate=!0,At=!0}}At===!0&&(q.updateMultisampleRenderTarget(pt),q.updateRenderTargetMipmap(pt))}D.setRenderTarget(dt,Mt,St),D.setClearColor(ee,Ht),Bt!==void 0&&(k.viewport=Bt),D.toneMapping=Dt}function Ts(M,F,X){let k=F.isScene===!0?F.overrideMaterial:null;for(let G=0,pt=M.length;G<pt;G++){let yt=M[G],{object:dt,geometry:Mt,group:St}=yt,Dt=yt.material;Dt.allowOverride===!0&&k!==null&&(Dt=k),dt.layers.test(X.layers)&&lc(dt,F,X,Mt,Dt,St)}}function lc(M,F,X,k,G,pt){M.onBeforeRender(D,F,X,k,G,pt),M.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),G.onBeforeRender(D,F,X,k,M,pt),G.transparent===!0&&G.side===qe&&G.forceSinglePass===!1?(G.side=Le,G.needsUpdate=!0,D.renderBufferDirect(X,F,k,G,M,pt),G.side=wn,G.needsUpdate=!0,D.renderBufferDirect(X,F,k,G,M,pt),G.side=qe):D.renderBufferDirect(X,F,k,G,M,pt),M.onAfterRender(D,F,X,k,G,pt)}function Es(M,F,X){F.isScene!==!0&&(F=me);let k=z.get(M),G=A.state.lights,pt=A.state.shadowsArray,yt=G.state.version,dt=K.getParameters(M,G.state,pt,F,X,A.state.lightProbeGridArray),Mt=K.getProgramCacheKey(dt),St=k.programs;k.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?F.environment:null,k.fog=F.fog;let Dt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;k.envMap=ot.get(M.envMap||k.environment,Dt),k.envMapRotation=k.environment!==null&&M.envMap===null?F.environmentRotation:M.envMapRotation,St===void 0&&(M.addEventListener("dispose",sn),St=new Map,k.programs=St);let Bt=St.get(Mt);if(Bt!==void 0){if(k.currentProgram===Bt&&k.lightsStateVersion===yt)return uc(M,dt),Bt}else dt.uniforms=K.getUniforms(M),N!==null&&M.isNodeMaterial&&N.build(M,X,dt),M.onBeforeCompile(dt,D),Bt=K.acquireProgram(dt,Mt),St.set(Mt,Bt),k.uniforms=dt.uniforms;let At=k.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(At.clippingPlanes=_t.uniform),uc(M,dt),k.needsLights=ph(M),k.lightsStateVersion=yt,k.needsLights&&(At.ambientLightColor.value=G.state.ambient,At.lightProbe.value=G.state.probe,At.directionalLights.value=G.state.directional,At.directionalLightShadows.value=G.state.directionalShadow,At.spotLights.value=G.state.spot,At.spotLightShadows.value=G.state.spotShadow,At.rectAreaLights.value=G.state.rectArea,At.ltc_1.value=G.state.rectAreaLTC1,At.ltc_2.value=G.state.rectAreaLTC2,At.pointLights.value=G.state.point,At.pointLightShadows.value=G.state.pointShadow,At.hemisphereLights.value=G.state.hemi,At.directionalShadowMatrix.value=G.state.directionalShadowMatrix,At.spotLightMatrix.value=G.state.spotLightMatrix,At.spotLightMap.value=G.state.spotLightMap,At.pointShadowMatrix.value=G.state.pointShadowMatrix),k.lightProbeGrid=A.state.lightProbeGridArray.length>0,k.currentProgram=Bt,k.uniformsList=null,Bt}function hc(M){if(M.uniformsList===null){let F=M.currentProgram.getUniforms();M.uniformsList=Vi.seqWithValue(F.seq,M.uniforms)}return M.uniformsList}function uc(M,F){let X=z.get(M);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.batchingColor=F.batchingColor,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.instancingMorph=F.instancingMorph,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function uh(M,F){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(F.matrixWorld);for(let X=0,k=M.length;X<k;X++){let G=M[X];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function fh(M,F,X,k,G){F.isScene!==!0&&(F=me),q.resetTextureUnits();let pt=F.fog,yt=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?F.environment:null,dt=Q===null?D.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Vt.workingColorSpace,Mt=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,St=ot.get(k.envMap||yt,Mt),Dt=k.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Bt=!!X.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),At=!!X.morphAttributes.position,Jt=!!X.morphAttributes.normal,de=!!X.morphAttributes.color,he=Ge;k.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(he=D.toneMapping);let $t=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,we=$t!==void 0?$t.length:0,xt=z.get(k),Ue=A.state.lights;if(Ut===!0&&(Wt===!0||M!==lt)){let te=M===lt&&k.id===nt;_t.setState(k,M,te)}let Yt=!1;k.version===xt.__version?(xt.needsLights&&xt.lightsStateVersion!==Ue.state.version||xt.outputColorSpace!==dt||G.isBatchedMesh&&xt.batching===!1||!G.isBatchedMesh&&xt.batching===!0||G.isBatchedMesh&&xt.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&xt.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&xt.instancing===!1||!G.isInstancedMesh&&xt.instancing===!0||G.isSkinnedMesh&&xt.skinning===!1||!G.isSkinnedMesh&&xt.skinning===!0||G.isInstancedMesh&&xt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&xt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&xt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&xt.instancingMorph===!1&&G.morphTexture!==null||xt.envMap!==St||k.fog===!0&&xt.fog!==pt||xt.numClippingPlanes!==void 0&&(xt.numClippingPlanes!==_t.numPlanes||xt.numIntersection!==_t.numIntersection)||xt.vertexAlphas!==Dt||xt.vertexTangents!==Bt||xt.morphTargets!==At||xt.morphNormals!==Jt||xt.morphColors!==de||xt.toneMapping!==he||xt.morphTargetsCount!==we||!!xt.lightProbeGrid!=A.state.lightProbeGridArray.length>0)&&(Yt=!0):(Yt=!0,xt.__version=k.version);let We=xt.currentProgram;Yt===!0&&(We=Es(k,F,G),N&&k.isNodeMaterial&&N.onUpdateProgram(k,We,xt));let rn=!1,Pn=!1,hi=!1,jt=We.getUniforms(),pe=xt.uniforms;if(_.useProgram(We.program)&&(rn=!0,Pn=!0,hi=!0),k.id!==nt&&(nt=k.id,Pn=!0),xt.needsLights){let te=uh(A.state.lightProbeGridArray,G);xt.lightProbeGrid!==te&&(xt.lightProbeGrid=te,Pn=!0)}if(rn||lt!==M){_.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),jt.setValue(U,"projectionMatrix",M.projectionMatrix),jt.setValue(U,"viewMatrix",M.matrixWorldInverse);let Ln=jt.map.cameraPosition;Ln!==void 0&&Ln.setValue(U,fe.setFromMatrixPosition(M.matrixWorld)),b.logarithmicDepthBuffer&&jt.setValue(U,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&jt.setValue(U,"isOrthographic",M.isOrthographicCamera===!0),lt!==M&&(lt=M,Pn=!0,hi=!0)}if(xt.needsLights&&(Ue.state.directionalShadowMap.length>0&&jt.setValue(U,"directionalShadowMap",Ue.state.directionalShadowMap,q),Ue.state.spotShadowMap.length>0&&jt.setValue(U,"spotShadowMap",Ue.state.spotShadowMap,q),Ue.state.pointShadowMap.length>0&&jt.setValue(U,"pointShadowMap",Ue.state.pointShadowMap,q)),G.isSkinnedMesh){jt.setOptional(U,G,"bindMatrix"),jt.setOptional(U,G,"bindMatrixInverse");let te=G.skeleton;te&&(te.boneTexture===null&&te.computeBoneTexture(),jt.setValue(U,"boneTexture",te.boneTexture,q))}G.isBatchedMesh&&(jt.setOptional(U,G,"batchingTexture"),jt.setValue(U,"batchingTexture",G._matricesTexture,q),jt.setOptional(U,G,"batchingIdTexture"),jt.setValue(U,"batchingIdTexture",G._indirectTexture,q),jt.setOptional(U,G,"batchingColorTexture"),G._colorsTexture!==null&&jt.setValue(U,"batchingColorTexture",G._colorsTexture,q));let In=X.morphAttributes;if((In.position!==void 0||In.normal!==void 0||In.color!==void 0)&&I.update(G,X,We),(Pn||xt.receiveShadow!==G.receiveShadow)&&(xt.receiveShadow=G.receiveShadow,jt.setValue(U,"receiveShadow",G.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&F.environment!==null&&(pe.envMapIntensity.value=F.environmentIntensity),pe.dfgLUT!==void 0&&(pe.dfgLUT.value=$m()),Pn){if(jt.setValue(U,"toneMappingExposure",D.toneMappingExposure),xt.needsLights&&dh(pe,hi),pt&&k.fog===!0&&st.refreshFogUniforms(pe,pt),st.refreshMaterialUniforms(pe,k,rt,ct,A.state.transmissionRenderTarget[M.id]),xt.needsLights&&xt.lightProbeGrid){let te=xt.lightProbeGrid;pe.probesSH.value=te.texture,pe.probesMin.value.copy(te.boundingBox.min),pe.probesMax.value.copy(te.boundingBox.max),pe.probesResolution.value.copy(te.resolution)}Vi.upload(U,hc(xt),pe,q)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Vi.upload(U,hc(xt),pe,q),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&jt.setValue(U,"center",G.center),jt.setValue(U,"modelViewMatrix",G.modelViewMatrix),jt.setValue(U,"normalMatrix",G.normalMatrix),jt.setValue(U,"modelMatrix",G.matrixWorld),k.uniformsGroups!==void 0){let te=k.uniformsGroups;for(let Ln=0,ui=te.length;Ln<ui;Ln++){let fc=te[Ln];et.update(fc,We),et.bind(fc,We)}}return We}function dh(M,F){M.ambientLightColor.needsUpdate=F,M.lightProbe.needsUpdate=F,M.directionalLights.needsUpdate=F,M.directionalLightShadows.needsUpdate=F,M.pointLights.needsUpdate=F,M.pointLightShadows.needsUpdate=F,M.spotLights.needsUpdate=F,M.spotLightShadows.needsUpdate=F,M.rectAreaLights.needsUpdate=F,M.hemisphereLights.needsUpdate=F}function ph(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(M,F,X){let k=z.get(M);k.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),z.get(M.texture).__webglTexture=F,z.get(M.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:X,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,F){let X=z.get(M);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(M,F=0,X=0){Q=M,O=F,Y=X;let k=null,G=!1,pt=!1;if(M){let dt=z.get(M);if(dt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(U.FRAMEBUFFER,dt.__webglFramebuffer),ut.copy(M.viewport),gt.copy(M.scissor),zt=M.scissorTest,_.viewport(ut),_.scissor(gt),_.setScissorTest(zt),nt=-1;return}else if(dt.__webglFramebuffer===void 0)q.setupRenderTarget(M);else if(dt.__hasExternalTextures)q.rebindTextures(M,z.get(M.texture).__webglTexture,z.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Dt=M.depthTexture;if(dt.__boundDepthTexture!==Dt){if(Dt!==null&&z.has(Dt)&&(M.width!==Dt.image.width||M.height!==Dt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(M)}}let Mt=M.texture;(Mt.isData3DTexture||Mt.isDataArrayTexture||Mt.isCompressedArrayTexture)&&(pt=!0);let St=z.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(St[F])?k=St[F][X]:k=St[F],G=!0):M.samples>0&&q.useMultisampledRTT(M)===!1?k=z.get(M).__webglMultisampledFramebuffer:Array.isArray(St)?k=St[X]:k=St,ut.copy(M.viewport),gt.copy(M.scissor),zt=M.scissorTest}else ut.copy(Tt).multiplyScalar(rt).floor(),gt.copy(re).multiplyScalar(rt).floor(),zt=Nt;if(X!==0&&(k=J),_.bindFramebuffer(U.FRAMEBUFFER,k)&&_.drawBuffers(M,k),_.viewport(ut),_.scissor(gt),_.setScissorTest(zt),G){let dt=z.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,dt.__webglTexture,X)}else if(pt){let dt=F;for(let Mt=0;Mt<M.textures.length;Mt++){let St=z.get(M.textures[Mt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Mt,St.__webglTexture,X,dt)}}else if(M!==null&&X!==0){let dt=z.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,dt.__webglTexture,X)}nt=-1},this.readRenderTargetPixels=function(M,F,X,k,G,pt,yt,dt=0){if(!(M&&M.isWebGLRenderTarget)){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Mt=z.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&yt!==void 0&&(Mt=Mt[yt]),Mt){_.bindFramebuffer(U.FRAMEBUFFER,Mt);try{let St=M.textures[dt],Dt=St.format,Bt=St.type;if(M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+dt),!b.textureFormatReadable(Dt)){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!b.textureTypeReadable(Bt)){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=M.width-k&&X>=0&&X<=M.height-G&&U.readPixels(F,X,k,G,ht.convert(Dt),ht.convert(Bt),pt)}finally{let St=Q!==null?z.get(Q).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,St)}}},this.readRenderTargetPixelsAsync=async function(M,F,X,k,G,pt,yt,dt=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Mt=z.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&yt!==void 0&&(Mt=Mt[yt]),Mt)if(F>=0&&F<=M.width-k&&X>=0&&X<=M.height-G){_.bindFramebuffer(U.FRAMEBUFFER,Mt);let St=M.textures[dt],Dt=St.format,Bt=St.type;if(M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+dt),!b.textureFormatReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!b.textureTypeReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let At=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,At),U.bufferData(U.PIXEL_PACK_BUFFER,pt.byteLength,U.STREAM_READ),U.readPixels(F,X,k,G,ht.convert(Dt),ht.convert(Bt),0);let Jt=Q!==null?z.get(Q).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,Jt);let de=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await gl(U,de,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,At),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,pt),U.deleteBuffer(At),U.deleteSync(de),pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,F=null,X=0){let k=Math.pow(2,-X),G=Math.floor(M.image.width*k),pt=Math.floor(M.image.height*k),yt=F!==null?F.x:0,dt=F!==null?F.y:0;q.setTexture2D(M,0),U.copyTexSubImage2D(U.TEXTURE_2D,X,0,0,yt,dt,G,pt),_.unbindTexture()},this.copyTextureToTexture=function(M,F,X=null,k=null,G=0,pt=0){let yt,dt,Mt,St,Dt,Bt,At,Jt,de,he=M.isCompressedTexture?M.mipmaps[pt]:M.image;if(X!==null)yt=X.max.x-X.min.x,dt=X.max.y-X.min.y,Mt=X.isBox3?X.max.z-X.min.z:1,St=X.min.x,Dt=X.min.y,Bt=X.isBox3?X.min.z:0;else{let pe=Math.pow(2,-G);yt=Math.floor(he.width*pe),dt=Math.floor(he.height*pe),M.isDataArrayTexture?Mt=he.depth:M.isData3DTexture?Mt=Math.floor(he.depth*pe):Mt=1,St=0,Dt=0,Bt=0}k!==null?(At=k.x,Jt=k.y,de=k.z):(At=0,Jt=0,de=0);let $t=ht.convert(F.format),we=ht.convert(F.type),xt;F.isData3DTexture?(q.setTexture3D(F,0),xt=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(q.setTexture2DArray(F,0),xt=U.TEXTURE_2D_ARRAY):(q.setTexture2D(F,0),xt=U.TEXTURE_2D),_.activeTexture(U.TEXTURE0),_.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),_.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),_.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);let Ue=_.getParameter(U.UNPACK_ROW_LENGTH),Yt=_.getParameter(U.UNPACK_IMAGE_HEIGHT),We=_.getParameter(U.UNPACK_SKIP_PIXELS),rn=_.getParameter(U.UNPACK_SKIP_ROWS),Pn=_.getParameter(U.UNPACK_SKIP_IMAGES);_.pixelStorei(U.UNPACK_ROW_LENGTH,he.width),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,he.height),_.pixelStorei(U.UNPACK_SKIP_PIXELS,St),_.pixelStorei(U.UNPACK_SKIP_ROWS,Dt),_.pixelStorei(U.UNPACK_SKIP_IMAGES,Bt);let hi=M.isDataArrayTexture||M.isData3DTexture,jt=F.isDataArrayTexture||F.isData3DTexture;if(M.isDepthTexture){let pe=z.get(M),In=z.get(F),te=z.get(pe.__renderTarget),Ln=z.get(In.__renderTarget);_.bindFramebuffer(U.READ_FRAMEBUFFER,te.__webglFramebuffer),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ln.__webglFramebuffer);for(let ui=0;ui<Mt;ui++)hi&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,z.get(M).__webglTexture,G,Bt+ui),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,z.get(F).__webglTexture,pt,de+ui)),U.blitFramebuffer(St,Dt,yt,dt,At,Jt,yt,dt,U.DEPTH_BUFFER_BIT,U.NEAREST);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(G!==0||M.isRenderTargetTexture||z.has(M)){let pe=z.get(M),In=z.get(F);_.bindFramebuffer(U.READ_FRAMEBUFFER,$),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,W);for(let te=0;te<Mt;te++)hi?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,pe.__webglTexture,G,Bt+te):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,pe.__webglTexture,G),jt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,In.__webglTexture,pt,de+te):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,In.__webglTexture,pt),G!==0?U.blitFramebuffer(St,Dt,yt,dt,At,Jt,yt,dt,U.COLOR_BUFFER_BIT,U.NEAREST):jt?U.copyTexSubImage3D(xt,pt,At,Jt,de+te,St,Dt,yt,dt):U.copyTexSubImage2D(xt,pt,At,Jt,St,Dt,yt,dt);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else jt?M.isDataTexture||M.isData3DTexture?U.texSubImage3D(xt,pt,At,Jt,de,yt,dt,Mt,$t,we,he.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(xt,pt,At,Jt,de,yt,dt,Mt,$t,he.data):U.texSubImage3D(xt,pt,At,Jt,de,yt,dt,Mt,$t,we,he):M.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,pt,At,Jt,yt,dt,$t,we,he.data):M.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,pt,At,Jt,he.width,he.height,$t,he.data):U.texSubImage2D(U.TEXTURE_2D,pt,At,Jt,yt,dt,$t,we,he);_.pixelStorei(U.UNPACK_ROW_LENGTH,Ue),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Yt),_.pixelStorei(U.UNPACK_SKIP_PIXELS,We),_.pixelStorei(U.UNPACK_SKIP_ROWS,rn),_.pixelStorei(U.UNPACK_SKIP_IMAGES,Pn),pt===0&&F.generateMipmaps&&U.generateMipmap(xt),_.unbindTexture()},this.initRenderTarget=function(M){z.get(M).__webglFramebuffer===void 0&&q.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?q.setTextureCube(M,0):M.isData3DTexture?q.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?q.setTexture2DArray(M,0):q.setTexture2D(M,0),_.unbindTexture()},this.resetState=function(){O=0,Y=0,Q=null,_.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ke}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Vt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Vt._getUnpackColorSpace()}};function Kl(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new Ye,c=0;for(let h=0;h<i.length;++h){let f=i[h],u=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0,f=[];for(let u=0;u<i.length;++u){let d=i[u].index;for(let p=0;p<d.count;++p)f.push(d.getX(p)+h);h+=i[u].attributes.position.count}l.setIndex(f)}for(let h in r){let f=jl(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(let h in o){let f=o[h][0].length;if(f!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<f;++u){let d=[];for(let y=0;y<o[h].length;++y)d.push(o[h][y][u]);let p=jl(d);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function jl(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Ie(o,e,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let f=l/e;for(let u=0,d=h.count;u<d;u++)for(let p=0;p<e;p++){let y=h.getComponent(u,p);a.setComponent(u+f,p,y)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var He=pc(Qa(),1),ws=pc(Qa(),1),tc=class extends ws.UserDefined{constructor(t=ws.ModConstant.Y,e=ws.ModConstant.X,n=.5,s=.5,r=.5){super(),this.elevationAxis=t,this.alongAxis=e,this.effectRange=n,this.effectMid=s,this.elevationHeight=r,this.intensity=1,this.renderVector=this._renderVector}_renderVector(t,e,n){let s=t.getRatio(this.alongAxis),r=t.getValue(this.elevationAxis);if(s<=this.effectRange){s/=this.effectRange;let o=0;s<this.effectMid?(s=s/this.effectMid,o=Math.sqrt(1-Math.pow(s,2)+s*2-1)):(s=(s-this.effectMid)/(1-this.effectMid),o=(Math.cos(s*Math.PI)- -1)/2),t.setValue(this.elevationAxis,r+o*this.elevationHeight*this.intensity)}}},Ql=i=>{for(var t=i.attributes.uv,e=0;e<t.count;e++){var n=t.getX(e),s=t.getY(e);t.setXY(e,1-n,s)}return i},As=new Cn({color:"#ffffff"}),ec=class extends Se{constructor(t=10){super();let e=new Se(Kl([Ql(new fn(1,1,t,t)),Ql(new fn(1,1,t,t).rotateY(Math.PI))],!0),[As,As]);e.castShadow=!0,e.receiveShadow=!0,e.rotateX(Math.PI/2),e.position.x=.5,this.scale.z=-1,this.add(e),this.page=e,this.modifiers=new He.ModifierStack(e),this.bend=new He.Bend(0,0,0),this.bend.constraint=He.ModConstant.LEFT,this.twist=new He.Twist(0),this.twist.vector=new He.Vector3(2,0,0),this.twist.center=new He.Vector3(-.5,0,0),this.pageCurve=new tc(He.ModConstant.Z,He.ModConstant.X,.812,.325,.054),this.modifiers.addModifier(this.pageCurve),this.modifiers.addModifier(this.bend),this.modifiers.addModifier(this.twist)}setPageMaterial(t,e){this.page.material[e]=t}flip(t,e,n=1){this.rotation.z=Math.PI*t,this.bend.force=Math.min(-Math.sin(this.rotation.z)/2,-1e-4)*e,this.twist.angle=Math.sin(this.rotation.z)/10,this.pageCurve.intensity=(-1+2*t)*(-Math.sin(this.rotation.z)+1)*n,this.modifiers.apply()}disposeMaterial(t){let e=this.page.material[t];e!==As&&e.dispose()}reset(){this.setPageMaterial(As,0),this.setPageMaterial(As,1)}dispose(t=!1){t&&(this.disposeMaterial(0),this.disposeMaterial(1)),this.page.geometry.dispose(),this.modifiers.destroy()}},th=(function(){var i;return()=>{if(!i){let t=document.createElement("canvas");t.width=256,t.height=256;let e=t.getContext("2d"),n=e.createLinearGradient(0,0,t.width,0);n.addColorStop(0,"black"),n.addColorStop(.1,"white"),e.fillStyle=n,e.fillRect(0,0,t.width,t.height),i=new ri(t),t.remove()}return i}})(),Co=class extends Se{constructor(t){super(),this.pages=[],this.pool=[],this._url2Loader=new Map,this._currentProgress=0,this._flipDuration=t?.flipDuration||1,this._ySpacing=t?.yBetweenPages||.001,this._pageSubdivisions=t?.pageSubdivisions||20,this.currentPage=0}[Symbol.iterator](){let t=0;return{next:()=>t<this.pages.length?{value:this.pages[t++],done:!1}:{value:null,done:!0}}}setPages(t){for(t.length%2!==0&&t.push("");this.pages.length;){let n=this.pages.pop();n.reset(),this.pool.push(n),this.remove(n)}let e=Promise.resolve();for(let n=0;n<t.length;n+=2){let s=t[n],r=t[n+1],o=this.pool.pop();o||(o=new ec(this._pageSubdivisions)),this.add(o),o.position.y=-this._ySpacing*this.pages.length,this.pages.push(o),o.name=`Page#${this.pages.length}`,e=e.then(this.loadPages(s,r,o))}this.currentPage>this.pages.length*2-1&&(this._currentPage=this.pages.length*2-1,this._currentProgress=this.pages.length),this.flipPages()}get totalPages(){return this.pages.length*2}loadPages(t,e,n){return()=>Promise.all([this.loadPage(t,1,n),this.loadPage(e,0,n)])}loadPage(t,e,n){if(!t||t===""){let r=new Cn({color:"white",roughness:.2,aoMapIntensity:.7,aoMap:e==1?th():null});return n.setPageMaterial(r,e),Promise.resolve()}if(t instanceof Qe)return n.setPageMaterial(t,e),Promise.resolve();if(t instanceof be)return n.setPageMaterial(this.textureToMaterial(t,e),e),Promise.resolve();let s=t;return this._url2Loader.has(s)||this._url2Loader.set(s,new Promise((r,o)=>{new os().load(t,a=>{r(this.textureToMaterial(a,e))},void 0,a=>{r(null)})})),this._url2Loader.get(s).then(r=>{n.setPageMaterial(r,e)})}textureToMaterial(t,e){return t.magFilter=ue,t.minFilter=ue,t.generateMipmaps=!1,t.colorSpace=ve,new Cn({color:"white",map:t,roughness:.2,aoMapIntensity:.7,aoMap:e==1?th():null,toneMapped:!1})}get currentPage(){return this._currentPage}set currentPage(t){let e=Math.ceil(t/2),n=e-this._currentProgress;this._stepSize=n/this._flipDuration,this._flipDirection=this._stepSize>0?1:-1,this._currentPage=Math.ceil(t),this._goalProgress=e,this.flipPages()}get progress(){return this._currentProgress}set progress(t){let e=this._currentProgress;this._currentProgress=Math.max(0,Math.min(t,this.pages.length)),this._currentPage=Math.floor(this._currentProgress*2),this._stepSize=0,this._flipDirection=this._currentProgress>e?1:-1,this.flipPages()}animate(t){this._stepSize!=0&&(this._currentProgress+=this._stepSize*t,(this._stepSize>0&&this._currentProgress>this._goalProgress||this._stepSize<0&&this._currentProgress<this._goalProgress)&&(this._currentProgress=this._goalProgress,this._stepSize=0),this.flipPages())}flipPage(t){var e=this.pages.indexOf(t);if(e<0)throw new ReferenceError("I don't own that page! Not mine!");let n=e*2,s=n+1;this.currentPage=this._currentPage<=n?s:n}nextPage(){this.currentPage=Math.min(Math.ceil(this.currentPage/2)+1,this.pages.length)*2}previousPage(){this.currentPage=Math.max(Math.ceil(this.currentPage/2)-1,0)*2}flipPages(){let t=this.pages.length,e=this._currentProgress%1,n=Math.floor(this._currentProgress);for(let r=0;r<t;r++){let o=this.pages[r],a=n<r?0:n>r?1:e,l=a<.5?0:(a-.5)/.5,c=-this._ySpacing*(t-r),h=-this._ySpacing*r,f=this._currentProgress<1?e:this._currentProgress>=t?0:this._currentProgress>=t-1?1-e:1;o.flip(a,this._flipDirection,f),o.position.y=h+l*(c-h)}let s=n==0?-.5+.5*e:n==t-1?.5*e:n==t?.5:0;this.position.x=s*this.scale.x}dispose(){for(;this.pages.length;){let t=this.pages.pop();this.remove(t)}for(;this.pool.length;)this.pool.pop().dispose(!0);this._url2Loader.forEach(t=>t.then(e=>e.dispose())),this._url2Loader.clear()}};function eh(i,t,e,n){return t<=0?0:i<=0?1:i>=t||e<n?-1:1}function nc(i,t,e,n=0){let s=Math.max(1,e),r=t===1?-i:i;return Math.max(0,Math.min(1,n+r/s))}function nh(i,t){return i>=.32||t<=280&&i>=.12}function ic(i,t){return i?.pointerId===t}function ih({sheet:i,maxSheet:t,pointerX:e,pointerY:n,centerX:s,centerY:r,pageWidth:o,pageHeight:a,edgeZone:l}){if(t<=0||Math.abs(n-r)>a/2)return 0;let c,h;return i<=0?(c=1,h=s+o/2):i>=t?(c=-1,h=s-o/2):e<s?(c=-1,h=s-o):(c=1,h=s+o),Math.abs(e-h)<=l?c:0}function sh(i,t,e,n){if(n<=0||t!==1&&t!==-1||t===1&&i>=n||t===-1&&i<=0)return null;let s=Math.max(0,Math.min(1,e)),r=i+t*s,o=t===1?i:i-1,a=t===1?s:1-s,l=r-Math.floor(r),c=1;return r<1?c=l:r>=n?c=0:r>=n-1&&(c=1-l),{progress:r,sheetIndex:o,pageProgress:a,curveIntensity:c}}function rh({sheet:i,maxSheet:t,pointerX:e,pointerY:n,centerX:s,centerY:r,pageWidth:o,pageHeight:a}){let l=i<=0||i>=t?o/2:o;return Math.abs(e-s)<=l&&Math.abs(n-r)<=a/2}var jm=1.5,oh=1024,Km=16,Qm=4,tg=180,eg=6,ng={shadowOpacity:.18,hemiSky:"#ffffff",hemiGround:"#e9e9e6"};function ah({container:i,ratio:t,theme:e=ng,reducedMotion:n=!1,onStatus:s=()=>{},onPhotoTap:r=()=>{},onPhotoFrameStart:o=()=>{},onPhotoFrameMove:a=()=>{},onPhotoFrameEnd:l=()=>{}}){let c=document.createElement("canvas");c.className="memory-album-3d-canvas",i.appendChild(c);let h=n?.001:.78,f=new Ki;f.background=null;let u=new Xn(-1,1,1,-1,.1,20);u.position.set(0,5,0),u.up.set(0,0,-1),u.lookAt(0,0,0);let d;try{d=new wo({canvas:c,antialias:!0,alpha:!0})}catch(P){throw c.remove(),P}d.outputColorSpace=ve,d.toneMapping=Ge,d.shadowMap.enabled=!0,d.shadowMap.type=oi;let p=new as(e.hemiSky,e.hemiGround,.9);f.add(p);let y=new hs("#ffffff",2.68);y.position.set(-3.4,5.6,.06),y.castShadow=!0,y.shadow.mapSize.set(oh,oh),y.shadow.camera.near=.1,y.shadow.camera.far=14,y.shadow.camera.left=-3,y.shadow.camera.right=3,y.shadow.camera.top=3,y.shadow.camera.bottom=-3,y.shadow.bias=-.0015,y.shadow.normalBias=.02,y.shadow.radius=6,f.add(y);let g=new ls("#ffffff",.45,8,2);g.position.set(2.5,1.8,-2.4),f.add(g);let m=new ss({opacity:e.shadowOpacity??.18}),S=new Se(new fn(18,18),m);S.rotation.x=-Math.PI/2,S.position.y=-.035,S.receiveShadow=!0,f.add(S);let C=new Sn;f.add(C);let v=new Co({flipDuration:h,yBetweenPages:.0012,pageSubdivisions:Km});v.traverse(P=>{P.isMesh&&(P.castShadow=!0,P.receiveShadow=!0)}),C.add(v);let E=t,A=[],R=[],x=!1,w=!1,D="",L=0,N=null,J=.055,$=28,W=5e-4,O={baseSheet:null,direction:0,amount:0,target:0},Y=new WeakSet,Q=new Set,nt=null,lt=performance.now(),ut=null,gt=[];function zt(P){gt.push({time:performance.now(),...P,progress:v.progress,target:v.currentPage,pointer:N?{dragging:N.dragging,framing:N.framing}:null}),gt.length>360&&gt.shift()}function ee(P=null){let T=new Cn({color:P?"#ffffff":"#f4efe4",map:P,roughness:.88,metalness:0,toneMapped:!0});return T.shadowSide=qe,T}function Ht(P){let T=new ri(P);return T.colorSpace=ve,T.anisotropy=Math.min(Qm,d.capabilities.getMaxAnisotropy()),T.generateMipmaps=!0,T.minFilter=pn,T.magFilter=ue,T.needsUpdate=!0,T}function j(){for(let P of R)!P||P===ct||(P.map?.dispose(),P.dispose());R=[]}let ct=ee();function rt(){for(let P of v){if(Y.has(P))continue;let T=P.flip.bind(P),V=Number.NaN,K=Number.NaN,st=Number.NaN;P.flip=(tt,it,_t=1)=>{tt===V&&(tt===0||tt===1)&&!(_t===0&&st!==0)||tt===V&&it===K&&_t===st||(V=tt,K=it,st=_t,T(tt,it,_t),Q.add(P))},Y.add(P)}}function Rt(){for(let P of v)P.page.geometry.computeVertexNormals();Q.clear()}function It(){for(let P of Q)P.page.geometry.computeVertexNormals();Q.clear()}async function Tt(P){if(!w){j(),A=P.slice(),R=A.map(T=>!T||!T.canvas?ct:ee(Ht(T.canvas))),v.scale.x=E,v.setPages(R),rt();for(let T of v)if(T.pageCurve&&(T.pageCurve.elevationHeight=.006),T.twist){let V=T.twist;T.twist={get angle(){return V.angle},set angle(K){V.angle=K*.4},vector:V.vector,center:V.center}}v.progress=0,Rt();for(let T=0;T<R.length;T+=1)await Promise.resolve();w||(v.traverse(T=>{T.isMesh&&(T.castShadow=!0,T.receiveShadow=!0)}),x=!0,D="",oe(),z())}}function re(P,T){if(w||!R[P]||R[P]===ct)return;let V=Ht(T),K=R[P];K.map?.dispose(),K.map=V,K.needsUpdate=!0,z()}function Nt(){let P=c.getBoundingClientRect(),T=P.width/Math.max(.001,u.right-u.left),V=P.top+(u.top-0)/(u.top-u.bottom)*P.height;return{centerX:P.left+P.width/2,centerY:V,pageWidth:E*T,pageHeight:T}}function Xt(P=!1){if(O.baseSheet!==null){if(O.target=0,!P){z();return}v.progress=O.baseSheet,O.baseSheet=null,O.direction=0,O.amount=0,z()}}function Ut(){return O.baseSheet===null&&Math.abs(v.progress-v.currentPage/2)>1e-7}function Wt(P){if(n||!x||N||Ut()||P.pointerType==="touch")return;let T=O.baseSheet!==null,V=T?O.baseSheet:Math.round(v.progress);if(!T&&Math.abs(v.progress-V)>=.001)return;let K=Nt(),st=Math.ceil(v.totalPages/2),tt=ih({sheet:V,maxSheet:st,pointerX:P.clientX,pointerY:P.clientY,edgeZone:$,...K});if(tt===0){Xt();return}T&&O.direction!==tt&&Xt(!0),O.baseSheet=V,O.direction=tt,O.target=J,z()}function ce(P){if(O.baseSheet===null)return!1;let T=O.target>O.amount?18:14,V=1-Math.exp(-T*P);if(O.amount+=(O.target-O.amount)*V,Math.abs(O.target-O.amount)<W&&(O.amount=O.target),O.target===0&&O.amount===0)return v.progress=O.baseSheet,O.baseSheet=null,O.direction=0,O.amount=0,!1;let K=Math.ceil(v.totalPages/2),st=sh(O.baseSheet,O.direction,O.amount,K);if(!st)return Xt(!0),!1;if(O.target>0&&O.amount===O.target&&Math.abs(v.progress-st.progress)<W)return v.progress!==st.progress&&(v.progress=st.progress),!1;if(v.progress=st.progress,O.target===0){let tt=0;for(let it of v){if(tt===st.sheetIndex){it.flip(st.pageProgress,O.direction,st.curveIntensity);break}tt+=1}}return O.amount!==O.target}function fe(){if(O.baseSheet===null||O.target===0)return null;let P={sheet:O.baseSheet,direction:O.direction,fraction:O.amount};return O.baseSheet=null,O.direction=0,O.amount=0,O.target=0,P}function oe(){if(!x)return;let P=Ut();!P&&!N?.dragging&&(L=O.baseSheet===null?Math.round(v.currentPage||0):O.baseSheet*2);let T=v.totalPages||A.length,V=Math.min(L,T),K=`${V}:${T}:${P}`;K!==D&&(D=K,V<=0?s({state:"cover",spread:0,totalSpreads:Math.ceil(T/2)-1,turning:P}):V>=T?s({state:"back",spread:Math.ceil(T/2)-1,totalSpreads:Math.ceil(T/2)-1,turning:P}):s({state:"spread",spread:Math.ceil(V/2),totalSpreads:Math.ceil(T/2)-1,turning:P}))}function me(){O.baseSheet=null,O.direction=0,O.amount=0,O.target=0}function Kt(){zt({type:"next-command",blocked:!x||Ut()}),!(!x||Ut()||v.currentPage>=v.totalPages)&&(me(),U(1),oe(),z())}function ie(){zt({type:"previous-command",blocked:!x||Ut()}),!(!x||Ut()||v.currentPage<=0)&&(me(),U(-1),oe(),z())}function U(P){let T=v.flipPages;v.flipPages=()=>{};try{P>0?v.nextPage():v.previousPage()}finally{v.flipPages=T}}function Ae(P){return{left:P>0?2*P-1:-1,right:P<Math.ceil(v.totalPages/2)?2*P:-1}}function qt(P,T){if(!x)return null;let V=Math.round(v.progress);if(Math.abs(v.progress-V)>=.001)return null;let K=Ae(V);if(K.left<0&&K.right<0)return null;let st=Nt(),tt=P<st.centerX,it=tt?K.left:K.right;if(it<0||it>=A.length)return null;let _t=A[it]?.rects||[];if(!_t.length)return null;let wt=tt?st.centerX-st.pageWidth:st.centerX,Lt=st.centerY-st.pageHeight/2,I=(P-wt)/st.pageWidth,at=(T-Lt)/st.pageHeight;if(I<0||I>1||at<0||at>1)return null;for(let Z of _t)if(I>=Z.x&&I<=Z.x+Z.w&&at>=Z.y&&at<=Z.y+Z.h)return{pageIndex:it,photoIndex:Z.photoIndex,rect:Z,u:I,v:at};return null}c.addEventListener("pointerdown",P=>{if(!P.isPrimary||!x||w||Ut())return;let T=fe();T||Xt(!0);let V=Nt(),K=T?.sheet??Math.round(v.progress),st=Math.ceil(v.totalPages/2),tt=T!==null||Math.abs(v.progress-K)<.001,it=rh({sheet:K,maxSheet:st,pointerX:P.clientX,pointerY:P.clientY,...V});if(N={pointerId:P.pointerId,x:P.clientX,y:P.clientY,time:performance.now(),sheet:K,maxSheet:st,pageWidth:V.pageWidth,direction:T?.direction??eh(K,st,P.clientX,V.centerX),dragReady:tt&&it,dragging:!1,startFraction:T?.fraction??0,fraction:T?.fraction??0,pendingFraction:null,longPressTimer:null,framing:!1,framePhoto:null,frameBaseX:P.clientX,frameBaseY:P.clientY},tt){let _t=qt(P.clientX,P.clientY);_t&&(N.dragReady=!1,N.framePhoto=_t,N.longPressTimer=setTimeout(()=>{N!==null&&!N.dragging&&(N.framing=!0,o(N.framePhoto))},tg))}c.setPointerCapture?.(P.pointerId)}),c.addEventListener("pointermove",P=>{let T=N;if(!T||T.pointerId!==P.pointerId||w)return;if(T.framePhoto&&!T.framing&&T.longPressTimer!==null&&Math.hypot(P.clientX-T.x,P.clientY-T.y)>eg&&(clearTimeout(T.longPressTimer),T.longPressTimer=null,T.framing=!0,o(T.framePhoto)),T.framing){P.preventDefault();let tt=Nt();a({...T.framePhoto,dx:P.clientX-T.frameBaseX,dy:P.clientY-T.frameBaseY,pageWidth:tt.pageWidth,pageHeight:tt.pageHeight});return}if(!T.dragReady||!x)return;let V=P.clientX-T.x,K=P.clientY-T.y;if(!T.dragging){if(Math.abs(V)<6)return;if(Math.abs(K)>Math.abs(V)*1.15){T.dragReady=!1;return}}let st=nc(V,T.direction,T.pageWidth,T.startFraction);!T.dragging&&st===0||(T.dragging=!0,T.fraction=st,T.pendingFraction=st,P.preventDefault(),z())});function b(P){let T=N;return T.longPressTimer!==null&&(clearTimeout(T.longPressTimer),T.longPressTimer=null),T.framing?(N=null,P&&l(T.framePhoto),!0):!1}c.addEventListener("pointerup",P=>{let T=N;if(!ic(T,P.pointerId))return;if(b(!0)){c.hasPointerCapture?.(P.pointerId)&&c.releasePointerCapture(P.pointerId);return}if(N=null,c.hasPointerCapture?.(P.pointerId)&&c.releasePointerCapture(P.pointerId),!x)return;if(T.dragging){T.fraction=nc(P.clientX-T.x,T.direction,T.pageWidth,T.startFraction);let tt=performance.now()-T.time,it=nh(T.fraction,tt),_t=T.sheet+(it?T.direction:0);v.currentPage=_t*2,z();return}let V=P.clientX-T.x,K=P.clientY-T.y,st=performance.now()-T.time;if(T.framePhoto){st<500&&Math.abs(V)<6&&Math.abs(K)<6&&r(T.framePhoto);return}Math.abs(V)>36&&Math.abs(V)>Math.abs(K)?V<0?Kt():ie():st<500&&Math.abs(K)<20?P.clientX<c.getBoundingClientRect().left+c.getBoundingClientRect().width/2?ie():Kt():T.startFraction>0&&(v.currentPage=T.sheet*2,z())}),c.addEventListener("pointercancel",P=>{ic(N,P.pointerId)&&(b(!1),v.currentPage=N.sheet*2,N=null,z())}),c.addEventListener("pointerleave",()=>{N||Xt()});function _(){if(w)return;let P=i.clientWidth,T=i.clientHeight;if(!P||!T)return;let V=P/Math.max(1,T),K=E*2,st=P<620?1.08:1.025,tt=Math.max(1.04,K*st/V);u.top=tt*.51,u.bottom=-tt*.49,u.left=-tt*V/2,u.right=tt*V/2,d.setPixelRatio(Math.min(window.devicePixelRatio,jm)),d.setSize(P,T,!1),u.updateProjectionMatrix(),z()}typeof ResizeObserver=="function"&&(ut=new ResizeObserver(()=>_()),ut.observe(i)),window.addEventListener("resize",_),_();function B(){let P=N;return P?.dragging?(P.pendingFraction===null||(v.progress=P.sheet+P.direction*P.pendingFraction,P.pendingFraction=null),!0):!1}function z(){w||nt!==null||(lt=performance.now(),nt=requestAnimationFrame(ot))}function q(){(w||nt===null)&&(nt=requestAnimationFrame(ot))}function ot(){nt=null;let P=performance.now(),T=Math.max(0,Math.min((P-lt)/1e3,.04));lt=P;let V=v.progress,K=B();K||v.animate(T);let st=ce(T);It(),oe(),d.render(f,u),(K||Ut()||V!==v.progress)&&zt({type:"frame",delta:T,bookX:v.position.x,angles:Array.from(v,it=>it.rotation.z),curves:Array.from(v,it=>[it.bend.force,it.twist.angle,it.pageCurve.intensity])});let tt=Math.abs(V-v.progress)>1e-7;(st||!K&&(tt||Ut()))&&q()}return z(),{setPages:Tt,refreshPage:re,nextPage:Kt,previousPage:ie,resize:_,requestRender:z,isReady:()=>x,recordInput:zt,getTurnDiagnostics:()=>({build:"20261003-monotonic-clock",browser:navigator.userAgent,faces:A.length,trace:gt.slice()}),setTheme(P){m.opacity=P.shadowOpacity??.18,p.color=new Ft(P.hemiSky??"#ffffff"),p.groundColor=new Ft(P.hemiGround??"#e9e9e6"),z()},dispose(){w=!0,N?.longPressTimer!==null&&N&&clearTimeout(N.longPressTimer),N=null,nt!==null&&cancelAnimationFrame(nt),nt=null,ut?.disconnect(),window.removeEventListener("resize",_),j(),ct.dispose(),v.dispose(),S.geometry.dispose(),m.dispose(),d.dispose(),c.remove()}}}return bh(ig);})();
