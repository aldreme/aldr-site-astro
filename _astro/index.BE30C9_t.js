function Y(l,v){for(var h=0;h<v.length;h++){const y=v[h];if(typeof y!="string"&&!Array.isArray(y)){for(const d in y)if(d!=="default"&&!(d in l)){const m=Object.getOwnPropertyDescriptor(y,d);m&&Object.defineProperty(l,d,m.get?m:{enumerable:!0,get:()=>y[d]})}}}return Object.freeze(Object.defineProperty(l,Symbol.toStringTag,{value:"Module"}))}function Z(l){return l&&l.__esModule&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l}var j={exports:{}},r={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var M;function ee(){if(M)return r;M=1;var l=Symbol.for("react.element"),v=Symbol.for("react.portal"),h=Symbol.for("react.fragment"),y=Symbol.for("react.strict_mode"),d=Symbol.for("react.profiler"),m=Symbol.for("react.provider"),N=Symbol.for("react.context"),z=Symbol.for("react.forward_ref"),B=Symbol.for("react.suspense"),H=Symbol.for("react.memo"),W=Symbol.for("react.lazy"),C=Symbol.iterator;function G(e){return e===null||typeof e!="object"?null:(e=C&&e[C]||e["@@iterator"],typeof e=="function"?e:null)}var O={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},P=Object.assign,x={};function _(e,t,n){this.props=e,this.context=t,this.refs=x,this.updater=n||O}_.prototype.isReactComponent={},_.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},_.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function I(){}I.prototype=_.prototype;function E(e,t,n){this.props=e,this.context=t,this.refs=x,this.updater=n||O}var k=E.prototype=new I;k.constructor=E,P(k,_.prototype),k.isPureReactComponent=!0;var q=Array.isArray,A=Object.prototype.hasOwnProperty,w={current:null},D={key:!0,ref:!0,__self:!0,__source:!0};function T(e,t,n){var o,u={},i=null,s=null;if(t!=null)for(o in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(i=""+t.key),t)A.call(t,o)&&!D.hasOwnProperty(o)&&(u[o]=t[o]);var f=arguments.length-2;if(f===1)u.children=n;else if(1<f){for(var c=Array(f),p=0;p<f;p++)c[p]=arguments[p+2];u.children=c}if(e&&e.defaultProps)for(o in f=e.defaultProps,f)u[o]===void 0&&(u[o]=f[o]);return{$$typeof:l,type:e,key:i,ref:s,props:u,_owner:w.current}}function J(e,t){return{$$typeof:l,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function g(e){return typeof e=="object"&&e!==null&&e.$$typeof===l}function K(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var V=/\/+/g;function $(e,t){return typeof e=="object"&&e!==null&&e.key!=null?K(""+e.key):t.toString(36)}function S(e,t,n,o,u){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(i){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case l:case v:s=!0}}if(s)return s=e,u=u(s),e=o===""?"."+$(s,0):o,q(u)?(n="",e!=null&&(n=e.replace(V,"$&/")+"/"),S(u,t,n,"",function(p){return p})):u!=null&&(g(u)&&(u=J(u,n+(!u.key||s&&s.key===u.key?"":(""+u.key).replace(V,"$&/")+"/")+e)),t.push(u)),1;if(s=0,o=o===""?".":o+":",q(e))for(var f=0;f<e.length;f++){i=e[f];var c=o+$(i,f);s+=S(i,t,n,c,u)}else if(c=G(e),typeof c=="function")for(e=c.call(e),f=0;!(i=e.next()).done;)i=i.value,c=o+$(i,f++),s+=S(i,t,n,c,u);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function R(e,t,n){if(e==null)return e;var o=[],u=0;return S(e,o,"","",function(i){return t.call(n,i,u++)}),o}function Q(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var a={current:null},b={transition:null},X={ReactCurrentDispatcher:a,ReactCurrentBatchConfig:b,ReactCurrentOwner:w};function F(){throw Error("act(...) is not supported in production builds of React.")}return r.Children={map:R,forEach:function(e,t,n){R(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return R(e,function(){t++}),t},toArray:function(e){return R(e,function(t){return t})||[]},only:function(e){if(!g(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},r.Component=_,r.Fragment=h,r.Profiler=d,r.PureComponent=E,r.StrictMode=y,r.Suspense=B,r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=X,r.act=F,r.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=P({},e.props),u=e.key,i=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,s=w.current),t.key!==void 0&&(u=""+t.key),e.type&&e.type.defaultProps)var f=e.type.defaultProps;for(c in t)A.call(t,c)&&!D.hasOwnProperty(c)&&(o[c]=t[c]===void 0&&f!==void 0?f[c]:t[c])}var c=arguments.length-2;if(c===1)o.children=n;else if(1<c){f=Array(c);for(var p=0;p<c;p++)f[p]=arguments[p+2];o.children=f}return{$$typeof:l,type:e.type,key:u,ref:i,props:o,_owner:s}},r.createContext=function(e){return e={$$typeof:N,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:m,_context:e},e.Consumer=e},r.createElement=T,r.createFactory=function(e){var t=T.bind(null,e);return t.type=e,t},r.createRef=function(){return{current:null}},r.forwardRef=function(e){return{$$typeof:z,render:e}},r.isValidElement=g,r.lazy=function(e){return{$$typeof:W,_payload:{_status:-1,_result:e},_init:Q}},r.memo=function(e,t){return{$$typeof:H,type:e,compare:t===void 0?null:t}},r.startTransition=function(e){var t=b.transition;b.transition={};try{e()}finally{b.transition=t}},r.unstable_act=F,r.useCallback=function(e,t){return a.current.useCallback(e,t)},r.useContext=function(e){return a.current.useContext(e)},r.useDebugValue=function(){},r.useDeferredValue=function(e){return a.current.useDeferredValue(e)},r.useEffect=function(e,t){return a.current.useEffect(e,t)},r.useId=function(){return a.current.useId()},r.useImperativeHandle=function(e,t,n){return a.current.useImperativeHandle(e,t,n)},r.useInsertionEffect=function(e,t){return a.current.useInsertionEffect(e,t)},r.useLayoutEffect=function(e,t){return a.current.useLayoutEffect(e,t)},r.useMemo=function(e,t){return a.current.useMemo(e,t)},r.useReducer=function(e,t,n){return a.current.useReducer(e,t,n)},r.useRef=function(e){return a.current.useRef(e)},r.useState=function(e){return a.current.useState(e)},r.useSyncExternalStore=function(e,t,n){return a.current.useSyncExternalStore(e,t,n)},r.useTransition=function(){return a.current.useTransition()},r.version="18.3.1",r}var U;function te(){return U||(U=1,j.exports=ee()),j.exports}var L=te();const re=Z(L),ne=Y({__proto__:null,default:re},[L]);export{ne as R,te as a,Z as g,L as r};
