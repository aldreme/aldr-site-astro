import{r as s}from"./index.Cs2mXJDt.js";import{j as u}from"./utils.CtB8oukX.js";function p(e,r){if(typeof e=="function")return e(r);e!=null&&(e.current=r)}function d(...e){return r=>{let n=!1;const t=e.map(o=>{const l=p(o,r);return!n&&typeof l=="function"&&(n=!0),l});if(n)return()=>{for(let o=0;o<t.length;o++){const l=t[o];typeof l=="function"?l():p(e[o],null)}}}}function S(...e){return s.useCallback(d(...e),e)}var y=s.forwardRef((e,r)=>{const{children:n,...t}=e,o=s.Children.toArray(n),l=o.find(w);if(l){const i=l.props.children,a=o.map(c=>c===l?s.Children.count(i)>1?s.Children.only(null):s.isValidElement(i)?i.props.children:null:c);return u.jsx(f,{...t,ref:r,children:s.isValidElement(i)?s.cloneElement(i,void 0,a):null})}return u.jsx(f,{...t,ref:r,children:n})});y.displayName="Slot";var f=s.forwardRef((e,r)=>{const{children:n,...t}=e;if(s.isValidElement(n)){const o=R(n),l=E(t,n.props);return n.type!==s.Fragment&&(l.ref=r?d(r,o):o),s.cloneElement(n,l)}return s.Children.count(n)>1?s.Children.only(null):null});f.displayName="SlotClone";var C=({children:e})=>u.jsx(u.Fragment,{children:e});function w(e){return s.isValidElement(e)&&e.type===C}function E(e,r){const n={...r};for(const t in r){const o=e[t],l=r[t];/^on[A-Z]/.test(t)?o&&l?n[t]=(...a)=>{l(...a),o(...a)}:o&&(n[t]=o):t==="style"?n[t]={...o,...l}:t==="className"&&(n[t]=[o,l].filter(Boolean).join(" "))}return{...e,...n}}function R(e){let r=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,n=r&&"isReactWarning"in r&&r.isReactWarning;return n?e.ref:(r=Object.getOwnPropertyDescriptor(e,"ref")?.get,n=r&&"isReactWarning"in r&&r.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),m=(...e)=>e.filter((r,n,t)=>!!r&&r.trim()!==""&&t.indexOf(r)===n).join(" ").trim();/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var j={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=s.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:n=2,absoluteStrokeWidth:t,className:o="",children:l,iconNode:i,...a},c)=>s.createElement("svg",{ref:c,...j,width:r,height:r,stroke:e,strokeWidth:t?Number(n)*24/Number(r):n,className:m("lucide",o),...a},[...i.map(([g,h])=>s.createElement(g,h)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=(e,r)=>{const n=s.forwardRef(({className:t,...o},l)=>s.createElement(x,{ref:l,iconNode:r,className:m(`lucide-${b(e)}`,t),...o}));return n.displayName=`${e}`,n};export{y as S,k as c,S as u};
