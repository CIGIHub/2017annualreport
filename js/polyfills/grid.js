(function(){var b=function(){};var a=(window.console=window.console||{});if(!a.log){a.log=b}if(!a.warn){a.warn=b}}());(function(){var g=document.styleSheets;var e=[];var a=[];var d=/(^|\s)(?:\w+)/g;var f=/\.[\w\d_-]+/g;var c=/#[\w\d_-]+/g;var b=CSSAnalyzer={specificity:function(h){var j=h.match(d);var l=j?j.length:0;j=h.match(f);var k=j?j.length:0;j=h.match(c);var i=j?j.length:0;return l+10*k+100*i},sortSpecificity:function(i,h){if(i.specificity<h.specificity){return -1}else{if(i.specificity>h.specificity){return 1}else{return 0}}},each:function(i,j){for(var h in i){if(i.hasOwnProperty(h)){j.call(i,h,i[h])}}},indexOf:function(m,k){if(m==null){return -1}var j=0,h=m.length;for(;j<h;j++){if(m[j]===k){return j}}return -1},trim:function(h){return(h==null)?"":"".trim.call(h)},clean:function(h){if(typeof h!=="string"){return""}h=h.replace(/\/\*((?:[^\*]|\*[^\/])*)\*\//g,"");h=h.replace(/\n/g,"");h=h.replace(/\r/g,"");h=h.replace(/\@import[^;]*;/g,"");return h},textToObj:function(p,q){p=b.clean(p);var k=p.split(/({[^{}]*})/);if(k[k.length-1].indexOf("}")==-1){k.pop()}var m=[];var h=false;var r;var n=0;var o;var l=0;while(l<k.length){if(l%2===0){var j=b.trim(k[l]);if(h){if(j.indexOf("}")!=-1){j=j.substr(1);k[l]=j;o=k.splice(n,l-n);o.shift();o.unshift(r[1]);m[m.length-1].attributes=b.textToObj(o.join(""),q);h=false;l=n;continue}}else{if(j.indexOf("{")!=-1){r=j.split("{");j=b.trim(r[0]);h=true;n=l}if(j!==""){m.push({selector:j})}}}else{if(!h){m[m.length-1].attributes=b.textAttrToObj(k[l].substr(1,k[l].length-2),q)}}l++}return m},textAttrToObj:function(q,r){q=b.clean(q);if(!q){return{}}var j;q=q.replace(/url\(([^)]+)\)/g,function(i){return i.replace(/;/g,"[CSSAnalyzer]")});j=q.split(/(:[^;]*;?)/);j.pop();var k={};for(var n=0,m=j.length;n<m;n++){if(n%2==1){var p=b.trim(j[n-1]);var o=j[n];var h=b.trim(o.substr(1).replace(";","").replace(/url\(([^)]+)\)/g,function(i){return i.replace(/\[CSSAnalyzer\]/g,";")}));if(!r||r&&r(p,h)){k[p]=h}}}return k},objToText:function(j,i,h){var k="";i=i||false;h=h||1;j.forEach(function(l){if(i){k+=Array(h).join("  ")}k+=l.selector+"{";if(Array.isArray(l.attributes)){if(i){k+="\r\n"+Array(h).join("  ")}k+=b.objToText(l.attributes,i,h+1)}else{b.each(l.attributes,function(n,m){if(i){k+="\r\n"+Array(h+1).join("  ")}k+=n+":"+m+";"});if(i){k+="\r\n"+Array(h).join("  ")}}k+="}";if(i){k+="\r\n"}});return k},objToTextAttr:function(j,i,h){var k="";i=i||false;h=h||1;b.each(j,function(m,l){if(i){k+="\r\n"+Array(h+1).join("  ")}k+=m+":"+l+";"});return k},findDefinedSelectors:function(m){var l;if((l=e.indexOf(m))!==-1){return a[l].slice(0)}var k=[];for(var h=0,j=g.length;h<j;h++){var p=g[h].cssRules;if(p){for(var l=0,o=p.length;l<o;l++){try{if(b.indexOf(document.querySelectorAll(p[l].selectorText),m)!==-1){k.push({selector:p[l].selectorText,specificity:b.specificity(p[l].selectorText)})}}catch(n){}}}}k.sort(b.sortSpecificity);e.push(m);a.push(k);return k.slice(0)}}})();(function(h){var e,j,c,a,i;if(h.gridLayout){return}h.support.gridLayout=document.createElement("div").style.msGridRowAlign==="";if(h.support.gridLayout||(document.documentMode&&document.documentMode<=8)){h.fn.gridLayout=function m(){return this};h.gridLayout=h.noop();return}e=Function.prototype.bind.call(console.log,console);j=Function.prototype.bind.call(console.warn,console);c=[];a=[];i=[];h.expr[":"]["has-style"]=h.expr.createPseudo(function(o){return function(t){var s=CSSAnalyzer.textAttrToObj(h(t).attr("style"),d);var q=CSSAnalyzer.textAttrToObj(o,d);for(var r in s){var v=s[r];for(var p in q){var u=q[p];if(r==p&&v==u){return true}}}}});h.gridLayout=function m(o){if(o=="clearCache"){cacheFindDefinedSelectorsKey=[];cacheFindDefinedSelectors=[];a=[];i=[]}else{return c}};function d(p,o){return !(p=="display"&&o!="-ms-grid")}function n(p,o){return h(p.selector).parents().length-h(o.selector).parents().length}function l(r,p){for(var o=0;o<r.length;o++){var q=r[o];if(h(q.selector).is(p)){return q}}}function g(o){return f(o)}function f(o){o=parseInt(o,10)||1;return Math.max(o,1)}function b(o){return/^(\d+(\.\d+)?(fr|px)|auto)$/.test(o)}function k(o){return o.reduce(function(q,p){return parseFloat(q)+parseFloat(p)},0)}jQuery(function(v){v.fn.gridLayout=function(G){return this.each(function(){var I=this;if(G=="refresh"){var K=l(c,this);if(K){if(!K.hasInit){E(B,K)}s(K.tracks);var J=true;if(v(K.selector).data("recent-height")){var H=v(K.selector).data("recent-height");if(parseFloat(v(K.selector).outerHeight())!=H){J=false;v(K.selector).each(function(){var M=v(this);var L=p(B,M,CSSAnalyzer.textAttrToObj(M.data("old-style"),d));var N=CSSAnalyzer.textAttrToObj(v(this).attr("style"),d);if(L.height&&!N.height){N.height=L.height}v(this).data("old-style",CSSAnalyzer.objToTextAttr(N))})}}C(I,K)}}else{if(typeof G==="object"){if(G.resize){v(I).on("gridlayoutresize",function(){G.resize.call(I)})}}}})};var w=v("style").map(function(){return v(this).html()}).get().join("");var B=CSSAnalyzer.textToObj(w,d);c=o(B);v('[style]:has-style("display:-ms-grid"), [data-ms-grid]').each(function(){var G=CSSAnalyzer.textAttrToObj(v(this).attr("style"),d);if(!G.display){G.display="-ms-grid"}c.push({selector:this,attributes:G,tracks:t(this,G)})});c.sort(n);v.each(c,function(G,H){E(B,H);C(v(H.selector),H)});var r;function u(){v.each(c,function(G,H){v(H.selector).gridLayout("refresh").trigger("gridlayoutresize")})}function x(){return v(document).height()>v(window).height()}v(window).on("resize",function(H,I){var G=this;clearTimeout(r);r=setTimeout(function(){var J=false;if(x()){J=true}u();if(!x()&&J){v(G).trigger("resize")}},100)});function C(M,N){var K=v(N.selector);var G=K.children();var J=K.outerHeight();var I=y(N.tracks,1,1,N.tracks.length,N.tracks[0].length);K.css({position:"relative"});G.css({position:"absolute"});K.css({width:(N.attributes.display=="-ms-grid")?"auto":I.x,height:I.y});G.css({top:0,left:0,width:N.tracks[0][0].x,height:N.tracks[0][0].y}).each(function(R,S){var O=v(this);var Q=p(B,O,CSSAnalyzer.textAttrToObj(O.data("old-style"),d));var X=g(Q["-ms-grid-row"]);var P=g(Q["-ms-grid-column"]);var V=g(Q["-ms-grid-column-span"]);var T=g(Q["-ms-grid-row-span"]);var W=y(N.tracks,X,P,T,V);var U=y(N.tracks,1,1,X-1,P-1);v(this).css({width:W.x})});q(K.outerWidth(),N.tracks);var H=CSSAnalyzer.textAttrToObj(v(N.selector).data("old-style"),d);if(H.height&&/^\d+(\.\d+)?px$/.test(H.height)){var L=F(parseFloat(H.height),N.tracks);v(N.selector).css({height:L});v(N.selector).data("recent-height",L)}else{var L=z(v(N.selector).outerHeight(),N.tracks);v(N.selector).css({height:L});v(N.selector).data("recent-height",L)}v(N.selector).children().each(function(R,S){var O=v(this);var Q=p(B,O,CSSAnalyzer.textAttrToObj(O.data("old-style"),d));var X=g(Q["-ms-grid-row"]);var P=g(Q["-ms-grid-column"]);var V=g(Q["-ms-grid-column-span"]);var T=g(Q["-ms-grid-row-span"]);var W=y(N.tracks,X,P,T,V);var U=y(N.tracks,1,1,X-1,P-1);v(this).css({top:U.y,left:U.x,width:W.x,height:W.y})})}function s(G){for(var H=0;H<G.length;H++){for(var I=0;I<G[H].length;I++){if(G[H][I].frX){if(b(G[H][I].frX)){G[H][I].x=G[H][I].frX;delete G[H][I].frX}else{j("Invalid value have been inserted to the grid layout. In track index: "+H+", "+I+". Value: "+G[H][I].frX)}}if(G[H][I].frY){if(b(G[H][I].frY)){G[H][I].y=G[H][I].frY;delete G[H][I].frY}else{j("Invalid value have been inserted to the grid layout. In track index: "+H+", "+I+". Value: "+G[H][I].frY)}}}}}function o(H){var G=[];v.each(H,function(I,J){if(J.attributes){if(J.attributes.display=="-ms-grid"){G.push({selector:J.selector,attributes:J.attributes,tracks:t(J.selector,J.attributes)})}}});return G}function t(G,I){var K=I["-ms-grid-columns"]||"auto";var J=I["-ms-grid-rows"]||"auto";K=K.toLowerCase().split(" ");J=J.toLowerCase().split(" ");v(G).children().each(function(O,R){var M=v(this);var L=p(B,M,CSSAnalyzer.textAttrToObj(M.attr("style"),d));var S=g(L["-ms-grid-row"]);var Q=g(L["-ms-grid-column"]);var N=g(L["-ms-grid-column-span"]);var P=g(L["-ms-grid-row-span"]);if(K.length<Q){K[Q]="auto"}if(K.length<(Q-1)+N){K[(Q-1)+N]="auto"}if(J.length<S){J[S]="auto"}if(J.length<(S-1)+P){J[(S-1)+P]="auto"}});var H=[];v.each(J,function(L,M){H[L]=[];v.each(K,function(O,N){H[L][O]={x:(typeof N!=="undefined"&&b(N))?N:"auto",y:(typeof M!=="undefined"&&b(M))?M:"auto"}})});v(G).children().each(function(N,P){var M=v(this);var L=p(B,M,CSSAnalyzer.textAttrToObj(M.attr("style"),d));var Q=g(L["-ms-grid-row"]);var O=g(L["-ms-grid-column"]);if(H[Q-1][O-1].item){H[Q-1][O-1].item=H[Q-1][O-1].item.add(M)}else{H[Q-1][O-1].item=M}});return H}function E(I,J){var H=v(J.selector);var G=H.children();H.each(function(){if(!v(this).data("old-style")){var L=v(this);var K=p(I,L,CSSAnalyzer.textAttrToObj(L.data("old-style"),d));var M=CSSAnalyzer.textAttrToObj(v(this).attr("style"),d);if(K.width&&!M.width){M.width=K.width}if(K.height&&!M.height){M.height=K.height}v(this).data("old-style",CSSAnalyzer.objToTextAttr(M))}});G.each(function(){if(!v(this).data("old-style")){v(this).data("old-style",v(this).attr("style"))}});H.css({"box-sizing":"border-box"});G.css({"box-sizing":"border-box"});J.hasInit=true}function A(G){var H=G.style.display;G.style.display="none";G.offsetWidth;G.style.display=H}function q(I,N){var Q=[];var M=[];for(var P=0;P<N[0].length;P++){var L=[0];var J=[0];for(var G=0;G<N.length;G++){var K=0;if(N[G][P].x.indexOf("fr")!==-1){var T=parseFloat(N[G][P].x);if(N[G][P].item){N[G][P].item.width("auto");K=Math.max.apply(Math,N[G][P].item.map(function(){return v(this).outerWidth(true)}).get())}L.push(K/T)}else{if(N[G][P].x.indexOf("auto")!==-1){if(N[G][P].item){N[G][P].item.width("auto");A(N[G][P].item[0]);K=Math.max.apply(Math,N[G][P].item.map(function(){return v(this).outerWidth(true)}).get())}J.push(K)}}}Q[P]=Math.max.apply(Math,L);M[P]=Math.max.apply(Math,J)}var R=Math.max.apply(Math,Q);var H=[];var S=I;for(var P=0;P<N[0].length;P++){if(N[0][P].x.indexOf("fr")!==-1){var T=parseFloat(N[0][P].x);H.push(T)}else{if(N[0][P].x.indexOf("px")!==-1){S-=parseFloat(N[0][P].x)}}}S-=k(M);var O=k(H);for(var G=0;G<N.length;G++){for(var P=0;P<N[0].length;P++){if(N[G][P].x.indexOf("fr")!==-1){N[G][P].frX=N[G][P].x;if(S>0){N[G][P].x=""+S/(O/parseFloat(N[G][P].x))}else{N[G][P].x=""+0}}else{if(N[G][P].x.indexOf("auto")!==-1){N[G][P].frX=N[G][P].x;N[G][P].x=""+M[P]}}}}return(S<0)?I+Math.abs(S):I}function F(S,M){var K=[];var T=[];for(var H=0;H<M.length;H++){var Q=[0];var L=[0];for(var O=0;O<M[0].length;O++){var G=0;if(M[H][O].y.indexOf("fr")!==-1){var R=parseFloat(M[H][O].y);if(M[H][O].item){M[H][O].item.height("auto");G=Math.max.apply(Math,M[H][O].item.map(function(){return v(this).outerHeight(true)}).get())}Q.push(G/R)}else{if(M[H][O].y.indexOf("auto")!==-1){if(M[H][O].item){M[H][O].item.height("auto");A(M[H][O].item[0]);G=Math.max.apply(Math,M[H][O].item.map(function(){return v(this).outerHeight(true)}).get())}L.push(G)}}}K[H]=Math.max.apply(Math,Q);T[H]=Math.max.apply(Math,L)}var J=Math.max.apply(Math,K);var I=[];var P=S;for(var H=0;H<M.length;H++){if(M[H][0].y.indexOf("fr")!==-1){var R=parseFloat(M[H][0].y);I.push(R)}else{if(M[H][0].y.indexOf("px")!==-1){P-=parseFloat(M[H][0].y)}}}P-=k(T);var N=k(I);for(var O=0;O<M[0].length;O++){for(var H=0;H<M.length;H++){if(M[H][O].y.indexOf("fr")!==-1){M[H][O].frY=M[H][O].y;if(P>0){M[H][O].y=""+P/(N/parseFloat(M[H][O].y))}else{M[H][O].y=""+0}}else{if(M[H][O].y.indexOf("auto")!==-1){M[H][O].frY=M[H][O].y;M[H][O].y=""+T[H]}}}}return(P<0)?S+Math.abs(P):S}function z(U,N){var K=[];var V=[];for(var H=0;H<N.length;H++){var S=[0];var L=[0];for(var Q=0;Q<N[0].length;Q++){var G=0;if(N[H][Q].y.indexOf("fr")!==-1){var T=parseFloat(N[H][Q].y);if(N[H][Q].item){N[H][Q].item.height("auto");G=Math.max.apply(Math,N[H][Q].item.map(function(){return v(this).outerHeight(true)}).get())}S.push(G/T)}else{if(N[H][Q].y.indexOf("auto")!==-1){if(N[H][Q].item){N[H][Q].item.height("auto");A(N[H][Q].item[0]);G=Math.max.apply(Math,N[H][Q].item.map(function(){return v(this).outerHeight(true)}).get())}L.push(G)}}}K[H]=Math.max.apply(Math,S);V[H]=Math.max.apply(Math,L)}var J=Math.max.apply(Math,K);var I=[];var P=U;var R=0;var M=0;for(var H=0;H<N.length;H++){if(N[H][0].y.indexOf("fr")!==-1){var T=parseFloat(N[H][0].y);I.push(T);R+=J*T}else{if(N[H][0].y.indexOf("px")!==-1){P-=parseFloat(N[H][0].y)}else{if(N[H][0].y.indexOf("auto")!==-1){M+=V[H]}}}}P+=R;var O=k(I);for(var Q=0;Q<N[0].length;Q++){for(var H=0;H<N.length;H++){if(N[H][Q].y.indexOf("fr")!==-1){N[H][Q].frY=N[H][Q].y;N[H][Q].y=""+P/(O/parseFloat(N[H][Q].y))}else{if(N[H][Q].y.indexOf("auto")!==-1){N[H][Q].frY=N[H][Q].y;N[H][Q].y=""+V[H]}}}}return U+R+M}function p(L,K,G){G=G||{};var J;if((J=a.indexOf(K.get(0)))!==-1){return v.extend(true,{},i[J],G)}var I=CSSAnalyzer.findDefinedSelectors(K.get(0));var H=D(L,I);a.push(K.get(0));i.push(H);return v.extend(true,{},H,G)}function D(I,G){var H={};v.each(G,function(K,J){v.each(I,function(L,M){if(M.selector==J.selector){v.extend(true,H,M.attributes)}})});return H}function y(G,M,J,I,H){M--;J--;var L={x:0,y:0};for(var K=0;K<I;K++){if(/^\d+(\.\d+)?(px)?$/.test(G[M+K][J].y)){L.y+=parseFloat(G[M+K][J].y)}}for(var N=0;N<H;N++){if(/^\d+(\.\d+)?(px)?$/.test(G[M][J+N].x)){L.x+=parseFloat(G[M][J+N].x)}}return L}})})(jQuery);s