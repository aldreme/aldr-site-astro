import{r as l,$ as h}from"./index.CoYfe95O.js";import{j as y}from"./utils.BouMpMu2.js";function m(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function C(...e){return t=>{let r=!1;const i=e.map(n=>{const o=m(n,t);return!r&&typeof o=="function"&&(r=!0),o});if(r)return()=>{for(let n=0;n<i.length;n++){const o=i[n];typeof o=="function"?o():m(e[n],null)}}}}function O(...e){return l.useCallback(C(...e),e)}var b=Symbol.for("react.lazy"),f=h[" use ".trim().toString()];function S(e){return typeof e=="object"&&e!==null&&"then"in e}function g(e){return e!=null&&typeof e=="object"&&"$$typeof"in e&&e.$$typeof===b&&"_payload"in e&&S(e._payload)}function R(e){const t=w(e),r=l.forwardRef((i,n)=>{let{children:o,...a}=i;g(o)&&typeof f=="function"&&(o=f(o._payload));const s=l.Children.toArray(o),c=s.find($);if(c){const u=c.props.children,p=s.map(d=>d===c?l.Children.count(u)>1?l.Children.only(null):l.isValidElement(u)?u.props.children:null:d);return y.jsx(t,{...a,ref:n,children:l.isValidElement(u)?l.cloneElement(u,void 0,p):null})}return y.jsx(t,{...a,ref:n,children:o})});return r.displayName=`${e}.Slot`,r}var P=R("Slot");function w(e){const t=l.forwardRef((r,i)=>{let{children:n,...o}=r;if(g(n)&&typeof f=="function"&&(n=f(n._payload)),l.isValidElement(n)){const a=A(n),s=j(o,n.props);return n.type!==l.Fragment&&(s.ref=i?C(i,a):a),l.cloneElement(n,s)}return l.Children.count(n)>1?l.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var x=Symbol("radix.slottable");function $(e){return l.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===x}function j(e,t){const r={...t};for(const i in t){const n=e[i],o=t[i];/^on[A-Z]/.test(i)?n&&o?r[i]=(...s)=>{const c=o(...s);return n(...s),c}:n&&(r[i]=n):i==="style"?r[i]={...n,...o}:i==="className"&&(r[i]=[n,o].filter(Boolean).join(" "))}return{...e,...r}}function A(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,r=t&&"isReactWarning"in t&&t.isReactWarning;return r?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,r=t&&"isReactWarning"in t&&t.isReactWarning,r?e.props.ref:e.props.ref||e.ref)}/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),E=(...e)=>e.filter((t,r,i)=>!!t&&t.trim()!==""&&i.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var L={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=l.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:i,className:n="",children:o,iconNode:a,...s},c)=>l.createElement("svg",{ref:c,...L,width:t,height:t,stroke:e,strokeWidth:i?Number(r)*24/Number(t):r,className:E("lucide",n),...s},[...a.map(([u,p])=>l.createElement(u,p)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=(e,t)=>{const r=l.forwardRef(({className:i,...n},o)=>l.createElement(v,{ref:o,iconNode:t,className:E(`lucide-${_(e)}`,i),...n}));return r.displayName=`${e}`,r};export{P as S,R as a,C as b,N as c,O as u};
