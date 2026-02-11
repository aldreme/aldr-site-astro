import{c as a}from"./createLucideIcon.BLdZ-9EA.js";/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],x=a("ChevronDown",p);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],C=a("Plus",v);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]],M=a("Trash2",k),P="modulepreload",w=function(l){return"/"+l},h={},N=function(m,c,E){let i=Promise.resolve();if(c&&c.length>0){let r=function(e){return Promise.all(e.map(o=>Promise.resolve(o).then(s=>({status:"fulfilled",value:s}),s=>({status:"rejected",reason:s}))))};document.getElementsByTagName("link");const t=document.querySelector("meta[property=csp-nonce]"),d=t?.nonce||t?.getAttribute("nonce");i=r(c.map(e=>{if(e=w(e),e in h)return;h[e]=!0;const o=e.endsWith(".css"),s=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${s}`))return;const n=document.createElement("link");if(n.rel=o?"stylesheet":P,o||(n.as="script"),n.crossOrigin="",n.href=e,d&&n.setAttribute("nonce",d),document.head.appendChild(n),o)return new Promise((f,y)=>{n.addEventListener("load",f),n.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${e}`)))})}))}function u(r){const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=r,window.dispatchEvent(t),!t.defaultPrevented)throw r}return i.then(r=>{for(const t of r||[])t.status==="rejected"&&u(t.reason);return m().catch(u)})};export{x as C,C as P,M as T,N as _};
