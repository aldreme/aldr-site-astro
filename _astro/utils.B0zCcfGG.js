import{a as Ce}from"./index.Cs2mXJDt.js";var Z={exports:{}},$={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ue;function Se(){if(ue)return $;ue=1;var e=Ce(),s=Symbol.for("react.element"),n=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,l=e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function a(u,i,m){var f,x={},z=null,S=null;m!==void 0&&(z=""+m),i.key!==void 0&&(z=""+i.key),i.ref!==void 0&&(S=i.ref);for(f in i)r.call(i,f)&&!c.hasOwnProperty(f)&&(x[f]=i[f]);if(u&&u.defaultProps)for(f in i=u.defaultProps,i)x[f]===void 0&&(x[f]=i[f]);return{$$typeof:s,type:u,key:z,ref:S,props:x,_owner:l.current}}return $.Fragment=n,$.jsx=a,$.jsxs=a,$}var pe;function Me(){return pe||(pe=1,Z.exports=Se()),Z.exports}var hr=Me();function ge(e){var s,n,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var l=e.length;for(s=0;s<l;s++)e[s]&&(n=ge(e[s]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}function Ae(){for(var e,s,n=0,r="",l=arguments.length;n<l;n++)(e=arguments[n])&&(s=ge(e))&&(r&&(r+=" "),r+=s);return r}const ne="-",Ie=e=>{const s=_e(e),{conflictingClassGroups:n,conflictingClassGroupModifiers:r}=e;return{getClassGroupId:a=>{const u=a.split(ne);return u[0]===""&&u.length!==1&&u.shift(),he(u,s)||Pe(a)},getConflictingClassGroupIds:(a,u)=>{const i=n[a]||[];return u&&r[a]?[...i,...r[a]]:i}}},he=(e,s)=>{if(e.length===0)return s.classGroupId;const n=e[0],r=s.nextPart.get(n),l=r?he(e.slice(1),r):void 0;if(l)return l;if(s.validators.length===0)return;const c=e.join(ne);return s.validators.find(({validator:a})=>a(c))?.classGroupId},be=/^\[(.+)\]$/,Pe=e=>{if(be.test(e)){const s=be.exec(e)[1],n=s?.substring(0,s.indexOf(":"));if(n)return"arbitrary.."+n}},_e=e=>{const{theme:s,classGroups:n}=e,r={nextPart:new Map,validators:[]};for(const l in n)re(n[l],r,l,s);return r},re=(e,s,n,r)=>{e.forEach(l=>{if(typeof l=="string"){const c=l===""?s:fe(s,l);c.classGroupId=n;return}if(typeof l=="function"){if(Ge(l)){re(l(r),s,n,r);return}s.validators.push({validator:l,classGroupId:n});return}Object.entries(l).forEach(([c,a])=>{re(a,fe(s,c),n,r)})})},fe=(e,s)=>{let n=e;return s.split(ne).forEach(r=>{n.nextPart.has(r)||n.nextPart.set(r,{nextPart:new Map,validators:[]}),n=n.nextPart.get(r)}),n},Ge=e=>e.isThemeGetter,Ee=e=>{if(e<1)return{get:()=>{},set:()=>{}};let s=0,n=new Map,r=new Map;const l=(c,a)=>{n.set(c,a),s++,s>e&&(s=0,r=n,n=new Map)};return{get(c){let a=n.get(c);if(a!==void 0)return a;if((a=r.get(c))!==void 0)return l(c,a),a},set(c,a){n.has(c)?n.set(c,a):l(c,a)}}},te="!",oe=":",Te=oe.length,Le=e=>{const{prefix:s,experimentalParseClassName:n}=e;let r=l=>{const c=[];let a=0,u=0,i=0,m;for(let v=0;v<l.length;v++){let k=l[v];if(a===0&&u===0){if(k===oe){c.push(l.slice(i,v)),i=v+Te;continue}if(k==="/"){m=v;continue}}k==="["?a++:k==="]"?a--:k==="("?u++:k===")"&&u--}const f=c.length===0?l:l.substring(i),x=Ne(f),z=x!==f,S=m&&m>i?m-i:void 0;return{modifiers:c,hasImportantModifier:z,baseClassName:x,maybePostfixModifierPosition:S}};if(s){const l=s+oe,c=r;r=a=>a.startsWith(l)?c(a.substring(l.length)):{isExternal:!0,modifiers:[],hasImportantModifier:!1,baseClassName:a,maybePostfixModifierPosition:void 0}}if(n){const l=r;r=c=>n({className:c,parseClassName:l})}return r},Ne=e=>e.endsWith(te)?e.substring(0,e.length-1):e.startsWith(te)?e.substring(1):e,Oe=e=>{const s=Object.fromEntries(e.orderSensitiveModifiers.map(r=>[r,!0]));return r=>{if(r.length<=1)return r;const l=[];let c=[];return r.forEach(a=>{a[0]==="["||s[a]?(l.push(...c.sort(),a),c=[]):c.push(a)}),l.push(...c.sort()),l}},je=e=>({cache:Ee(e.cacheSize),parseClassName:Le(e),sortModifiers:Oe(e),...Ie(e)}),Ve=/\s+/,Fe=(e,s)=>{const{parseClassName:n,getClassGroupId:r,getConflictingClassGroupIds:l,sortModifiers:c}=s,a=[],u=e.trim().split(Ve);let i="";for(let m=u.length-1;m>=0;m-=1){const f=u[m],{isExternal:x,modifiers:z,hasImportantModifier:S,baseClassName:v,maybePostfixModifierPosition:k}=n(f);if(x){i=f+(i.length>0?" "+i:i);continue}let G=!!k,A=r(G?v.substring(0,k):v);if(!A){if(!G){i=f+(i.length>0?" "+i:i);continue}if(A=r(v),!A){i=f+(i.length>0?" "+i:i);continue}G=!1}const V=c(z).join(":"),F=S?V+te:V,E=F+A;if(a.includes(E))continue;a.push(E);const T=l(A,G);for(let y=0;y<T.length;++y){const B=T[y];a.push(F+B)}i=f+(i.length>0?" "+i:i)}return i};function $e(){let e=0,s,n,r="";for(;e<arguments.length;)(s=arguments[e++])&&(n=xe(s))&&(r&&(r+=" "),r+=n);return r}const xe=e=>{if(typeof e=="string")return e;let s,n="";for(let r=0;r<e.length;r++)e[r]&&(s=xe(e[r]))&&(n&&(n+=" "),n+=s);return n};function Be(e,...s){let n,r,l,c=a;function a(i){const m=s.reduce((f,x)=>x(f),e());return n=je(m),r=n.cache.get,l=n.cache.set,c=u,u(i)}function u(i){const m=r(i);if(m)return m;const f=Fe(i,n);return l(i,f),f}return function(){return c($e.apply(null,arguments))}}const g=e=>{const s=n=>n[e]||[];return s.isThemeGetter=!0,s},ye=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,we=/^\((?:(\w[\w-]*):)?(.+)\)$/i,qe=/^\d+\/\d+$/,Ue=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,We=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,Je=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,De=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,He=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,N=e=>qe.test(e),d=e=>!!e&&!Number.isNaN(Number(e)),P=e=>!!e&&Number.isInteger(Number(e)),me=e=>e.endsWith("%")&&d(e.slice(0,-1)),M=e=>Ue.test(e),Xe=()=>!0,Ye=e=>We.test(e)&&!Je.test(e),se=()=>!1,Ke=e=>De.test(e),Qe=e=>He.test(e),Ze=e=>!t(e)&&!o(e),er=e=>O(e,ze,se),t=e=>ye.test(e),_=e=>O(e,Re,Ye),ee=e=>O(e,ur,d),rr=e=>O(e,ve,se),tr=e=>O(e,ke,Qe),or=e=>O(e,se,Ke),o=e=>we.test(e),H=e=>j(e,Re),nr=e=>j(e,pr),sr=e=>j(e,ve),ir=e=>j(e,ze),lr=e=>j(e,ke),ar=e=>j(e,br,!0),O=(e,s,n)=>{const r=ye.exec(e);return r?r[1]?s(r[1]):n(r[2]):!1},j=(e,s,n=!1)=>{const r=we.exec(e);return r?r[1]?s(r[1]):n:!1},ve=e=>e==="position",cr=new Set(["image","url"]),ke=e=>cr.has(e),dr=new Set(["length","size","percentage"]),ze=e=>dr.has(e),Re=e=>e==="length",ur=e=>e==="number",pr=e=>e==="family-name",br=e=>e==="shadow",fr=()=>{const e=g("color"),s=g("font"),n=g("text"),r=g("font-weight"),l=g("tracking"),c=g("leading"),a=g("breakpoint"),u=g("container"),i=g("spacing"),m=g("radius"),f=g("shadow"),x=g("inset-shadow"),z=g("drop-shadow"),S=g("blur"),v=g("perspective"),k=g("aspect"),G=g("ease"),A=g("animate"),V=()=>["auto","avoid","all","avoid-page","page","left","right","column"],F=()=>["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top"],E=()=>["auto","hidden","clip","visible","scroll"],T=()=>["auto","contain","none"],y=()=>[N,"px","full","auto",o,t,i],B=()=>[P,"none","subgrid",o,t],ie=()=>["auto",{span:["full",P,o,t]},o,t],q=()=>[P,"auto",o,t],le=()=>["auto","min","max","fr",o,t],X=()=>[o,t,i],Y=()=>["start","end","center","between","around","evenly","stretch","baseline"],L=()=>["start","end","center","stretch"],p=()=>[o,t,i],R=()=>["px",...p()],C=()=>["px","auto",...p()],I=()=>[N,"auto","px","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",o,t,i],b=()=>[e,o,t],K=()=>[me,_],h=()=>["","none","full",m,o,t],w=()=>["",d,H,_],U=()=>["solid","dashed","dotted","double"],ae=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],ce=()=>["","none",S,o,t],de=()=>["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left",o,t],W=()=>["none",d,o,t],J=()=>["none",d,o,t],Q=()=>[d,o,t],D=()=>[N,"full","px",o,t,i];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[M],breakpoint:[M],color:[Xe],container:[M],"drop-shadow":[M],ease:["in","out","in-out"],font:[Ze],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[M],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[M],shadow:[M],spacing:[d],text:[M],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",N,t,o,k]}],container:["container"],columns:[{columns:[d,t,o,u]}],"break-after":[{"break-after":V()}],"break-before":[{"break-before":V()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:[...F(),t,o]}],overflow:[{overflow:E()}],"overflow-x":[{"overflow-x":E()}],"overflow-y":[{"overflow-y":E()}],overscroll:[{overscroll:T()}],"overscroll-x":[{"overscroll-x":T()}],"overscroll-y":[{"overscroll-y":T()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:y()}],"inset-x":[{"inset-x":y()}],"inset-y":[{"inset-y":y()}],start:[{start:y()}],end:[{end:y()}],top:[{top:y()}],right:[{right:y()}],bottom:[{bottom:y()}],left:[{left:y()}],visibility:["visible","invisible","collapse"],z:[{z:[P,"auto",o,t]}],basis:[{basis:[N,"full","auto",o,t,u,i]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[d,N,"auto","initial","none",t]}],grow:[{grow:["",d,o,t]}],shrink:[{shrink:["",d,o,t]}],order:[{order:[P,"first","last","none",o,t]}],"grid-cols":[{"grid-cols":B()}],"col-start-end":[{col:ie()}],"col-start":[{"col-start":q()}],"col-end":[{"col-end":q()}],"grid-rows":[{"grid-rows":B()}],"row-start-end":[{row:ie()}],"row-start":[{"row-start":q()}],"row-end":[{"row-end":q()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":le()}],"auto-rows":[{"auto-rows":le()}],gap:[{gap:X()}],"gap-x":[{"gap-x":X()}],"gap-y":[{"gap-y":X()}],"justify-content":[{justify:[...Y(),"normal"]}],"justify-items":[{"justify-items":[...L(),"normal"]}],"justify-self":[{"justify-self":["auto",...L()]}],"align-content":[{content:["normal",...Y()]}],"align-items":[{items:[...L(),"baseline"]}],"align-self":[{self:["auto",...L(),"baseline"]}],"place-content":[{"place-content":Y()}],"place-items":[{"place-items":[...L(),"baseline"]}],"place-self":[{"place-self":["auto",...L()]}],p:[{p:R()}],px:[{px:R()}],py:[{py:R()}],ps:[{ps:R()}],pe:[{pe:R()}],pt:[{pt:R()}],pr:[{pr:R()}],pb:[{pb:R()}],pl:[{pl:R()}],m:[{m:C()}],mx:[{mx:C()}],my:[{my:C()}],ms:[{ms:C()}],me:[{me:C()}],mt:[{mt:C()}],mr:[{mr:C()}],mb:[{mb:C()}],ml:[{ml:C()}],"space-x":[{"space-x":p()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":p()}],"space-y-reverse":["space-y-reverse"],size:[{size:I()}],w:[{w:[u,"screen",...I()]}],"min-w":[{"min-w":[u,"screen","none",...I()]}],"max-w":[{"max-w":[u,"screen","none","prose",{screen:[a]},...I()]}],h:[{h:["screen",...I()]}],"min-h":[{"min-h":["screen","none",...I()]}],"max-h":[{"max-h":["screen",...I()]}],"font-size":[{text:["base",n,H,_]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[r,o,ee]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",me,t]}],"font-family":[{font:[nr,t,s]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[l,o,t]}],"line-clamp":[{"line-clamp":[d,"none",o,ee]}],leading:[{leading:[o,t,c,i]}],"list-image":[{"list-image":["none",o,t]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",o,t]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:b()}],"text-color":[{text:b()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...U(),"wavy"]}],"text-decoration-thickness":[{decoration:[d,"from-font","auto",o,_]}],"text-decoration-color":[{decoration:b()}],"underline-offset":[{"underline-offset":[d,"auto",o,t]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:["px",...p()]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",o,t]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",o,t]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:[...F(),sr,rr]}],"bg-repeat":[{bg:["no-repeat",{repeat:["","x","y","space","round"]}]}],"bg-size":[{bg:["auto","cover","contain",ir,er]}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},P,o,t],radial:["",o,t],conic:[P,o,t]},lr,tr]}],"bg-color":[{bg:b()}],"gradient-from-pos":[{from:K()}],"gradient-via-pos":[{via:K()}],"gradient-to-pos":[{to:K()}],"gradient-from":[{from:b()}],"gradient-via":[{via:b()}],"gradient-to":[{to:b()}],rounded:[{rounded:h()}],"rounded-s":[{"rounded-s":h()}],"rounded-e":[{"rounded-e":h()}],"rounded-t":[{"rounded-t":h()}],"rounded-r":[{"rounded-r":h()}],"rounded-b":[{"rounded-b":h()}],"rounded-l":[{"rounded-l":h()}],"rounded-ss":[{"rounded-ss":h()}],"rounded-se":[{"rounded-se":h()}],"rounded-ee":[{"rounded-ee":h()}],"rounded-es":[{"rounded-es":h()}],"rounded-tl":[{"rounded-tl":h()}],"rounded-tr":[{"rounded-tr":h()}],"rounded-br":[{"rounded-br":h()}],"rounded-bl":[{"rounded-bl":h()}],"border-w":[{border:w()}],"border-w-x":[{"border-x":w()}],"border-w-y":[{"border-y":w()}],"border-w-s":[{"border-s":w()}],"border-w-e":[{"border-e":w()}],"border-w-t":[{"border-t":w()}],"border-w-r":[{"border-r":w()}],"border-w-b":[{"border-b":w()}],"border-w-l":[{"border-l":w()}],"divide-x":[{"divide-x":w()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":w()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...U(),"hidden","none"]}],"divide-style":[{divide:[...U(),"hidden","none"]}],"border-color":[{border:b()}],"border-color-x":[{"border-x":b()}],"border-color-y":[{"border-y":b()}],"border-color-s":[{"border-s":b()}],"border-color-e":[{"border-e":b()}],"border-color-t":[{"border-t":b()}],"border-color-r":[{"border-r":b()}],"border-color-b":[{"border-b":b()}],"border-color-l":[{"border-l":b()}],"divide-color":[{divide:b()}],"outline-style":[{outline:[...U(),"none","hidden"]}],"outline-offset":[{"outline-offset":[d,o,t]}],"outline-w":[{outline:["",d,H,_]}],"outline-color":[{outline:[e]}],shadow:[{shadow:["","none",f,ar,or]}],"shadow-color":[{shadow:b()}],"inset-shadow":[{"inset-shadow":["none",o,t,x]}],"inset-shadow-color":[{"inset-shadow":b()}],"ring-w":[{ring:w()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:b()}],"ring-offset-w":[{"ring-offset":[d,_]}],"ring-offset-color":[{"ring-offset":b()}],"inset-ring-w":[{"inset-ring":w()}],"inset-ring-color":[{"inset-ring":b()}],opacity:[{opacity:[d,o,t]}],"mix-blend":[{"mix-blend":[...ae(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":ae()}],filter:[{filter:["","none",o,t]}],blur:[{blur:ce()}],brightness:[{brightness:[d,o,t]}],contrast:[{contrast:[d,o,t]}],"drop-shadow":[{"drop-shadow":["","none",z,o,t]}],grayscale:[{grayscale:["",d,o,t]}],"hue-rotate":[{"hue-rotate":[d,o,t]}],invert:[{invert:["",d,o,t]}],saturate:[{saturate:[d,o,t]}],sepia:[{sepia:["",d,o,t]}],"backdrop-filter":[{"backdrop-filter":["","none",o,t]}],"backdrop-blur":[{"backdrop-blur":ce()}],"backdrop-brightness":[{"backdrop-brightness":[d,o,t]}],"backdrop-contrast":[{"backdrop-contrast":[d,o,t]}],"backdrop-grayscale":[{"backdrop-grayscale":["",d,o,t]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[d,o,t]}],"backdrop-invert":[{"backdrop-invert":["",d,o,t]}],"backdrop-opacity":[{"backdrop-opacity":[d,o,t]}],"backdrop-saturate":[{"backdrop-saturate":[d,o,t]}],"backdrop-sepia":[{"backdrop-sepia":["",d,o,t]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":p()}],"border-spacing-x":[{"border-spacing-x":p()}],"border-spacing-y":[{"border-spacing-y":p()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",o,t]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[d,"initial",o,t]}],ease:[{ease:["linear","initial",G,o,t]}],delay:[{delay:[d,o,t]}],animate:[{animate:["none",A,o,t]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[v,o,t]}],"perspective-origin":[{"perspective-origin":de()}],rotate:[{rotate:W()}],"rotate-x":[{"rotate-x":W()}],"rotate-y":[{"rotate-y":W()}],"rotate-z":[{"rotate-z":W()}],scale:[{scale:J()}],"scale-x":[{"scale-x":J()}],"scale-y":[{"scale-y":J()}],"scale-z":[{"scale-z":J()}],"scale-3d":["scale-3d"],skew:[{skew:Q()}],"skew-x":[{"skew-x":Q()}],"skew-y":[{"skew-y":Q()}],transform:[{transform:[o,t,"","none","gpu","cpu"]}],"transform-origin":[{origin:de()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:D()}],"translate-x":[{"translate-x":D()}],"translate-y":[{"translate-y":D()}],"translate-z":[{"translate-z":D()}],"translate-none":["translate-none"],accent:[{accent:b()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:b()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",o,t]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":p()}],"scroll-mx":[{"scroll-mx":p()}],"scroll-my":[{"scroll-my":p()}],"scroll-ms":[{"scroll-ms":p()}],"scroll-me":[{"scroll-me":p()}],"scroll-mt":[{"scroll-mt":p()}],"scroll-mr":[{"scroll-mr":p()}],"scroll-mb":[{"scroll-mb":p()}],"scroll-ml":[{"scroll-ml":p()}],"scroll-p":[{"scroll-p":p()}],"scroll-px":[{"scroll-px":p()}],"scroll-py":[{"scroll-py":p()}],"scroll-ps":[{"scroll-ps":p()}],"scroll-pe":[{"scroll-pe":p()}],"scroll-pt":[{"scroll-pt":p()}],"scroll-pr":[{"scroll-pr":p()}],"scroll-pb":[{"scroll-pb":p()}],"scroll-pl":[{"scroll-pl":p()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",o,t]}],fill:[{fill:["none",...b()]}],"stroke-w":[{stroke:[d,H,_,ee]}],stroke:[{stroke:["none",...b()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["before","after","placeholder","file","marker","selection","first-line","first-letter","backdrop","*","**"]}},mr=Be(fr);function xr(...e){return mr(Ae(e))}export{Ae as a,xr as c,hr as j};
