(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{128:function(t,e,n){t.exports=n(140)},135:function(t,e,n){},139:function(t,e,n){},140:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),s=n(16),o=n.n(s),i=(n(133),n(29)),c=n.n(i),l=n(69),u=n(64),d=n(70),h=n(18),p=n(19),f=n(21),m=n(20),v=n(6),y=n(8),g=n(67),C=n(65),b=(n(135),[]),w=[],O=[],j=[],k=v.h,E=20,x=20,S=30,L=50,R=960-L-x,I=500-E-S,P=function(t){Object(f.a)(n,t);var e=Object(m.a)(n);function n(t){var a;return Object(h.a)(this,n),(a=e.call(this,t)).parseTime=v.j("%m/%e/%y"),a.myRef=r.a.createRef(),a.state={covidCases:[],selectedCountries:[],listOfCountries:[],firstCountrySelected:!1,selectedCountryIndex:0,dataLoaded:!1},a}return Object(p.a)(n,[{key:"drawChart",value:function(){v.i(".mainGraph").remove();var t=v.i(".graphContainer").append("svg").attr("width",R+L+x).attr("height",I+E+S).attr("class","mainGraph"),e=v.g().range([0,R]),n=v.f().range([I,0]),a=v.d().x((function(t){return e(t.date)})).y((function(t){return n(t.cases)}));e.domain(v.c(w)),n.domain([0,v.e(O)]),(t=t.append("g").attr("transform","translate("+L+","+E+")")).append("g").attr("transform","translate(0,"+I+")").call(v.a(e)),this.yAxis=t.append("g").call(v.b(n)),t.selectAll(".countryPath").data(j).enter().append("g").attr("class","countryPath").append("path").attr("class","line").attr("d",a).style("stroke-width","2px").style("stroke",(function(t,e){return k[e]})).attr("fill","none")}},{key:"selectCountries",value:function(t){var e=this;this.state.selectedCountries.push(this.state.listOfCountries[t]),this.state.covidCases.forEach((function(n){n.hasOwnProperty(e.state.listOfCountries[t])&&b.push(n[e.state.listOfCountries[t]])}));for(var n=0;n<b.length;n++)for(var a=[],r=0,s=Object.entries(b[n]);r<s.length;r++){var o=Object(d.a)(s[r],2),i=o[0],c=o[1];i=this.parseTime(i),w.push(i),O.push(c);var l={date:i,cases:c};a.push(l)}j.push(a),this.drawChart()}},{key:"componentDidMount",value:function(){var t=Object(u.a)(c.a.mark((function t(){var e=this;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("https://arcane-plains-12569.herokuapp.com/download").then((function(t){return t.json()})).then((function(t){var n=new Set(t[0]),a=Object(l.a)(n);e.setState({covidCases:t[1],listOfCountries:a,dataLoaded:!0})}));case 2:v.i(this.myRef.current).append("svg").style("border-style","solid").style("border-width","1px").attr("width",R+L+x).attr("height",I+E+S).attr("class","graphContainer");case 3:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){return r.a.createElement("div",{id:"graph",ref:this.myRef},this.state.dataLoaded?console.log("success"):r.a.createElement(C.a,{id:"spinner",animation:"border",role:"status"},r.a.createElement("span",{className:"sr-only"},"Loading...")),r.a.createElement(g.a,{id:"dropdown-basic-button",onSelect:this.selectCountries.bind(this),title:"Country"},this.state.listOfCountries.map((function(t,e){return r.a.createElement(y.a.Item,{key:e,eventKey:e},t)}))))}}]),n}(r.a.Component),A=function(t){Object(f.a)(n,t);var e=Object(m.a)(n);function n(){return Object(h.a)(this,n),e.apply(this,arguments)}return Object(p.a)(n,[{key:"render",value:function(){return r.a.createElement("h3",null,"Select the country to display Covid-19 growth")}}]),n}(r.a.Component);var B=function(){return r.a.createElement("div",null,r.a.createElement(A,null),r.a.createElement(P,null))};n(139),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(B,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[128,1,2]]]);
//# sourceMappingURL=main.4a5237f2.chunk.js.map