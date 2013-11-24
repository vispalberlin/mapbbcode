/*
 JavaScript library for [map] BBCode parsing, displaying and editing.
 Version 1.1.2-dev
 https://github.com/MapBBCode/mapbbcode
 (c) 2013, Ilya Zverev
 Licensed WTFPL.
*/
!function(window,document,undefined){L=window.L,L.StaticLayerSwitcher=L.Control.extend({includes:L.Mixin.Events,options:{position:"topright",editable:!1,bgColor:"white",selectedColor:"#ddd",maxLayers:7},initialize:function(t,e){if(L.setOptions(this,e),this._layers=[],this._selected=0,t)if("push"in t&&"splice"in t)for(var i=0;i<t.length;i++)this.addLayer(t[i]);else for(var o in t)this.addLayer(o,t[o])},getLayers:function(){for(var t=[],e=0;e<this._layers.length;e++)t.push(this._layers[e].layer);return t},getLayerIds:function(){for(var t=[],e=0;e<this._layers.length;e++)t.push(this._layers[e].id);return t},getSelectedLayer:function(){return this._layers.length>0&&this._selected<this._layers.length?this._layers[this._selected].layer:null},getSelectedLayerId:function(){return this._layers.length>0&&this._selected<this._layers.length?this._layers[this._selected].id:""},updateId:function(t,e){var i=this._findLayer(t),o=i>=0&&this._layers[i];if(o&&o.id!==e){if(o.id=e,o.fromList){var n=this._map&&this._map.hasLayer(t),s=window.layerList.getLeafletLayer(e);n&&this._map.removeLayer(t),s?(o.layer=s,n&&this._map.addLayer(s)):this._layers.splice(i,1)}return this._update(),t}return null},addLayer:function(t,e){if(!(this._layers.length>=this.options.maxLayers)){var i=e||window.layerList&&window.layerList.getLeafletLayer(t);if(i){this._layers.push({id:t,layer:i,fromList:!e});var o=this._findFirstOSMLayer();if(o>0){var n=this._layers[o];this._layers[o]=this._layers[0],this._layers[0]=n}return this._update(),this.fire("layerschanged",{layers:this.getLayerIds()}),1==this._layers.length&&this.fire("selectionchanged",{selected:this.getSelectedLayer(),selectedId:this.getSelectedLayerId()}),e}return null}},removeLayer:function(t){var e=this._findLayer(t);if(e>=0){var i=this._selected==e;if(i&&this._map.removeLayer(t),this._layers.splice(e,1),0===e){var o=this._findFirstOSMLayer();if(o>0){var n=this._layers[o];this._layers[o]=this._layers[0],this._layers[0]=n}}return this._selected>=this._layers.length&&(this._selected=this._layers.length-1),this._update(),this.fire("layerschanged",{layers:this.getLayerIds()}),i&&this.fire("selectionchanged",{selected:this.getSelectedLayer(),selectedId:this.getSelectedLayerId()}),t}return null},moveLayer:function(t,e){var i=this._findLayer(t),o=e?i+1:i-1;if(i>=0&&o>=0&&o<this._layers.length){if(1==i+o&&window.layerList&&!window.layerList.isOpenStreetMapLayer(this._layers[1].layer)){var n=this._findFirstOSMLayer(1);if(!(0===i&&n>1))return;o=n}var s=this._layers[i];this._layers[i]=this._layers[o],this._layers[o]=s,i==this._selected?this._selected=o:o==this._selected&&(this._selected=i),this._update(),this.fire("layerschanged",{layers:this.getLayerIds()})}},_findFirstOSMLayer:function(t){if(!window.layerList)return t||0;for(var e=t||0;e<this._layers.length&&!window.layerList.isOpenStreetMapLayer(this._layers[e].layer);)e++;return e>=this._layers.length&&(e=-1),e},_findLayer:function(t){for(var e=0;e<this._layers.length;e++)if(this._layers[e].layer===t)return e;return-1},onAdd:function(t){var e=L.DomUtil.create("div","leaflet-bar");return L.Browser.touch?L.DomEvent.on(e,"click",L.DomEvent.stopPropagation):(L.DomEvent.disableClickPropagation(e),L.DomEvent.on(e,"mousewheel",L.DomEvent.stopPropagation)),this._map=t,this._container=e,this._update(),e},_createItem:function(t){var e=document.createElement("div");e.style.backgroundColor=this.options.bgColor,this._addHoverStyle(e,"backgroundColor",this.options.selectedColor),e.style.padding="4px 10px",e.style.color="black",e.style.cursor="default";var i=t.id.indexOf(":")<0||!t.fromList?t.id:t.id.substring(0,t.id.indexOf(":"));return e.appendChild(document.createTextNode(i)),this.options.editable&&e.appendChild(this._createLayerControls(t.layer)),L.DomEvent.on(e,"click",function(){var e=this._findLayer(t.layer);this._selected!=e&&(this._selected=e,this._update(),this.fire("selectionchanged",{selected:this.getSelectedLayer(),selectedId:this.getSelectedLayerId()}))},this),e},_createLayerControls:function(t){var e=document.createElement("span");e.innerHTML="&utrif;",e.style.cursor="pointer",this._addHoverStyle(e,"color","#aaa"),L.DomEvent.on(e,"click",function(){this.moveLayer(t,!1)},this);var i=document.createElement("span");i.innerHTML="&dtrif;",i.style.cursor="pointer",i.style.marginLeft="6px",this._addHoverStyle(i,"color","#aaa"),L.DomEvent.on(i,"click",function(){this.moveLayer(t,!0)},this);var o=document.createElement("span");o.innerHTML="&Cross;",o.style.cursor="pointer",o.style.marginLeft="6px",this._addHoverStyle(o,"color","#aaa"),L.DomEvent.on(o,"click",function(){this.removeLayer(t)},this);var n=document.createElement("span");return n.style.fontSize="12pt",n.style.marginLeft="12px",n.appendChild(e),n.appendChild(i),n.appendChild(o),L.DomEvent.on(n,"click",L.DomEvent.stopPropagation),n},_addHoverStyle:function(t,e,i){var o=t.style[e];L.DomEvent.on(t,"mouseover",function(){t.style[e]!==i&&(o=t.style[e],t.style[e]=i)}),t.resetHoverStyle=function(){t.style[e]=o},t.updateHoverDefault=function(){o=t.style[e]},L.DomEvent.on(t,"mouseout",t.resetHoverStyle)},_recursiveCall:function(t,e){if(t&&t[e]){t[e].call(t);for(var i=t.getElementsByTagName("*"),o=0;o<i.length;o++)i[o][e]&&i[o][e].call(i[o])}},_update:function(){if(this._container){for(var t=[],e=0;e<this._layers.length;e++){var i=this._layers[e];i.div?this._recursiveCall(i.div,"resetHoverStyle"):i.div=this._createItem(i),i.div.style.background=this._selected==e?this.options.selectedColor:this.options.bgColor,i.div.style.borderTop=e?"1px solid "+this.options.selectedColor:"0",this._recursiveCall(i.div,"updateHoverDefault"),this._container.appendChild(i.div),t.push(i.div),this._map.hasLayer(i.layer)&&this._selected!=e?this._map.removeLayer(i.layer):this._map.hasLayer(i.layer)||this._selected!=e||this._map.addLayer(i.layer)}for(var o,n=this._container.childNodes,s=0;s<n.length;s++){o=!1;for(var r=0;r<t.length;r++)t[r]===n[s]&&(o=!0);o||this._container.removeChild(n[s])}}}}),L.staticLayerSwitcher=function(t,e){return new L.StaticLayerSwitcher(t,e)},window.layerList={list:{OpenStreetMap:"L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a>', minZoom: 0, maxZoom: 19 })","OpenStreetMap DE":"L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a>', minZoom: 0, maxZoom: 18 })",CycleMap:"L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.opencyclemap.org\">Andy Allan</a>', minZoom: 0, maxZoom: 18 })",OpenMapSurfer:"L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://giscience.uni-hd.de/\">GIScience Heidelberg</a>', minZoom: 0, maxZoom: 19 })","OpenMapSurfer Contour":"L.layerGroup([ L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://giscience.uni-hd.de/\">GIScience Heidelberg</a>', minZoom: 0, maxZoom: 19 }), L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/asterc/x={x}&y={y}&z={z}') ])","OpenMapSurfer Grayscale":"L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://giscience.uni-hd.de/\">GIScience Heidelberg</a>', minZoom: 0, maxZoom: 19 })",Humanitarian:"L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> | Tiles &copy; <a href=\"http://hot.openstreetmap.org\">Humanitarian OSM Team</a>', minZoom: 0, maxZoom: 19 })",Transport:"L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.opencyclemap.org\">Andy Allan</a>', minZoom: 0, maxZoom: 18 })",Landscape:"L.tileLayer('http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.opencyclemap.org\">Andy Allan</a>', minZoom: 0, maxZoom: 18 })",Outdoors:"L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.opencyclemap.org\">Andy Allan</a>', minZoom: 0, maxZoom: 18 })","MapQuest Open":"L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://www.mapquest.com/\">MapQuest</a>', subdomains: '1234', minZoom: 0, maxZoom: 18 })","Stamen Toner":"L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://stamen.com\">Stamen Design</a>', minZoom: 0, maxZoom: 20 })","Stamen Toner Lite":"L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://stamen.com\">Stamen Design</a>', minZoom: 0, maxZoom: 20 })","Stamen Watercolor":"L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', { attribution: 'Map &copy; <a href=\"http://openstreetmap.org\">OSM</a> | Tiles &copy; <a href=\"http://stamen.com\">Stamen Design</a>', minZoom: 3, maxZoom: 16 })"},getSortedKeys:function(){var t,e=[];for(t in this.list)this.list.hasOwnProperty(t)&&e.push(t);return e.sort(),e},requiresKey:function(t){var e=/{key(?::[^}]+)?}/,i=this.list[t];return i&&e.test(i)},getKeyLink:function(t){var e=/{key(?::([^}]+))?}/,i=this.list[t],o=i&&i.match(e);return o&&o[1]&&o[1].length>0?o[1]:""},getLeafletLayer:function(layerId,LL){var L=LL||window.L,reKeyC=/{key(?::[^}]+)?}/,m=layerId.match(/^(.+?)(?::([^'"]+))?$/);if(m&&m[1]&&this.list[m[1]]){var layer=this.list[m[1]];if(m[2]&&m[2].length>0&&(layer=layer.replace(reKeyC,m[2])),!reKeyC.test(layer))try{var done=eval(layer);if(done)return done.options||(done.options={}),done.options.name=m[1],done}catch(e){}}return null},getLeafletLayers:function(t,e){var i,o="string"==typeof t?t.split(","):t,n=[],s=-1;for(i=0;i<o.length;i++){var r=this.getLeafletLayer(o[i],e);r&&(n.push(r),0>s&&this.isOpenStreetMapLayer(r)&&(s=i))}if(s>0){var a=o[i];o[i]=o[0],o[0]=a}else 0>s&&n.length>0&&n.unshift(this.getLeafletLayer("OpenStreetMap",e));return n},isOpenStreetMapLayer:function(t){if("string"==typeof t||t.substring)return t.indexOf("openstreetmap.org")>0;var e=t.options&&t._url?t:t.getLayers?t.getLayers()[0]:{};return e.options&&e._url?e.options.attribution&&e.options.attribution.indexOf("openstreetmap.org")>0||e._url.indexOf("tile.openstreetmap.")>0||e._url.indexOf("opencyclemap.org")>0||e._url.indexOf("stamen.com")>0||e._url.indexOf("server.arcgisonline.com")>0:!1}},window.MapBBCodeConfig=L.Class.extend({includes:L.Mixin.Events,options:{layers:[],defaultZoom:2,defaultPosition:[22,11],viewWidth:600,viewHeight:300,fullViewHeight:600,editorHeight:400,windowWidth:800,windowHeight:500,fullFromStart:!1,editorInWindow:!0,editorTypeFixed:!1,maxLayers:5},strings:{},initialize:function(t){L.setOptions(this,t)},setStrings:function(t){this.strings=L.extend({},this.strings,t)},addLayer:function(t){this._layerSwitcher.addLayer(t)},_updateDivSize:function(t){var e,i,o=this._mode;"view"===o&&this.options.fullFromStart&&(o="full"),"edit"===o&&this.options.editorInWindow&&(o="window"),"view"===o?(e=""+this.options.viewWidth+"px",i=""+this.options.viewHeight+"px"):"full"===o?(e="100%",i=""+this.options.fullViewHeight+"px"):"edit"===o?(e="100%",i=""+this.options.editorHeight+"px"):"window"===o&&(e=this.options.windowWidth||this.options.viewWidth,i=this.options.windowHeight||this.options.editorHeight),t.style.width=e,t.style.height=i},_latLngToArray:function(t){return[L.Util.formatNum(t.lat,5),L.Util.formatNum(t.lng,5)]},_updateFullTitle:function(t,e){"view"===this._mode?(t.setContent(this.strings.view),t.setTitle(this.strings.viewTitle),e.setContent(this.options.fullFromStart?this.strings.viewFull:this.strings.viewNormal),e.setTitle(this.options.fullFromStart?this.strings.viewFullTitle:this.strings.viewNormalTitle)):"edit"===this._mode&&(t.setContent(this.strings.editor),t.setTitle(this.strings.editorTitle),e.setContent(this.options.editorInWindow?this.strings.editInWindow:this.strings.editInPanel),e.setTitle(this.options.editorInWindow?this.strings.editInWindowTitle:this.strings.editInPanelTitle))},bindLayerAdder:function(t){function e(t){return"string"==typeof t?document.getElementById(t):t}var i=e(t.select),o=e(t.button),n=e(t.keyBlock),s=e(t.keyTitle),r=e(t.keyValue);n.style.display="none",r.value="",o.value||(o.value=this.strings.addLayer);var a=function(e){var i=e.target.value,a=i?window.layerList.getKeyLink(i):"";a?(s.innerHTML=this.strings.keyNeeded.replace("%s",a),r.value="",n.style.display=t.keyBlockDisplay||"inline"):n.style.display="none",o.disabled=i?!1:!0};L.DomEvent.on(i,"change",a,this);var l=function(){var t,e=window.layerList.getSortedKeys(),o=this.options.layers,n=[];for(t=0;t<o.length;t++)n.push(o[t].indexOf(":")<0?o[t]:o[t].substring(0,o[t].indexOf(":")));for(;i.firstChild;)i.removeChild(i.firstChild);var s=document.createElement("option");for(s.value="",s.selected=!0,s.innerHTML=this.strings.selectLayer+"...",i.appendChild(s),t=0;t<e.length;t++)n.indexOf(e[t])>=0||(s=document.createElement("option"),s.innerHTML=e[t],s.value=e[t],i.appendChild(s));a.call(this,{target:i})};L.DomEvent.on(o,"click",function(){var t=i.value;if(t){var e=window.layerList.requiresKey(t),o=r.value.trim();e&&!o.length?window.alert(this.strings.keyNeededAlert):this.addLayer(e?t+":"+o:t)}},this),this.on("show change",function(){l.call(this)},this)},show:function(t){var e="string"==typeof t?document.getElementById(t):t;if(e){this._mode="view";var i=document.createElement("div");e.appendChild(i),this._updateDivSize(i);var o=L.map(i,{zoomControl:!1}).setView(this.options.defaultPosition&&2==this.options.defaultPosition.length?this.options.defaultPosition:[22,11],this.options.defaultZoom);o.addControl(new L.Control.Zoom({zoomInTitle:this.strings.zoomInTitle,zoomOutTitle:this.strings.zoomOutTitle})),o.attributionControl&&o.attributionControl.setPrefix('<a href="http://mapbbcode.org">MapBBCode</a>');var n=L.staticLayerSwitcher(this.options.layers,{editable:!0,maxLayers:this.options.maxLayers});o.addControl(n),n.on("layerschanged",function(t){this.options.layers=t.layers,this.fire("change",this.options)},this),n.on("selectionchanged",function(t){this.fire("layerselected",{id:t.selectedId})},this),this.options.layers=n.getLayerIds(),this._layerSwitcher=n,o.on("moveend zoomend",function(){this.options.defaultPosition=this._latLngToArray(o.getCenter()),this.options.defaultZoom=o.getZoom(),this.fire("change",this.options)},this);var s=new L.FunctionButton("full",{position:"topright"}),r=new L.FunctionButton("mode",{position:"topright"}),a=new L.FunctionButtons(["&ltrif;","&rtrif;"],{position:"bottomright",titles:[this.strings.shrinkTitle,this.strings.growTitle]}),l=new L.FunctionButtons(["&utrif;","&dtrif;"],{position:"bottomleft",titles:[this.strings.shrinkTitle,this.strings.growTitle]}),h=function(){var t="view"===this._mode?this.options.fullFromStart:!this.options.editorInWindow;t?o.removeControl(a):o.addControl(a)};s.on("clicked",function(){var t="view"===this._mode?this.options.fullFromStart:!this.options.editorInWindow;"view"===this._mode?this.options.fullFromStart=!t:this.options.editorInWindow=t,h.call(this),this._updateFullTitle(r,s),this._updateDivSize(i),o.invalidateSize(),this.fire("change",this.options)},this),r.on("clicked",function(){this._mode="view"===this._mode?"edit":"view",this.options.fullFromStart==this.options.editorInWindow&&h.call(this),this.options.editorTypeFixed&&("view"===this._mode?o.addControl(s):o.removeControl(s)),this._updateFullTitle(r,s),this._updateDivSize(i),o.invalidateSize()},this),a.on("clicked",function(t){var e=100*t.idx-50,n="view"===this._mode?this.options.viewWidth:this.options.windowWidth;n+e>=400&&1e3>=n+e&&("view"===this._mode?this.options.fullFromStart||(this.options.viewWidth+=e,this._updateDivSize(i),o.invalidateSize(),this.fire("change",this.options)):"edit"===this._mode&&this.options.editorInWindow&&(this.options.windowWidth+=e,this._updateDivSize(i),o.invalidateSize(),this.fire("change",this.options)))},this),l.on("clicked",function(t){var e,n=100*t.idx-50;"view"===this._mode?e=this.options.fullFromStart?this.options.fullViewHeight:this.options.viewHeight:"edit"===this._mode&&(e=this.options.editorInWindow?this.options.windowHeight:this.options.editorHeight),e+n>=200&&800>=e+n&&("view"===this._mode?this.options.fullFromStart?this.options.fullViewHeight+=n:this.options.viewHeight+=n:"edit"===this._mode&&(this.options.editorInWindow?this.options.windowHeight+=n:this.options.editorHeight+=n),this._updateDivSize(i),o.invalidateSize(),this.fire("change",this.options))},this),o.addControl(r),o.addControl(s),o.addControl(a),o.addControl(l),this._updateFullTitle(r,s),this.fire("show",this.options)}}}),L.FunctionButtons=L.Control.extend({includes:L.Mixin.Events,initialize:function(t,e){if(this._content=t,e.titles||(e.titles=[]),e.titles.length<t.length)for(var i=e.titles.length;i<t.length;i++)e.titles.push("");L.Control.prototype.initialize.call(this,e)},onAdd:function(t){this._map=t,this._links=[];for(var e=L.DomUtil.create("div","leaflet-bar"),i=0;i<this._content.length;i++){var o=L.DomUtil.create("a","",e);this._links.push(o),o.href="#",o.style.padding="0 4px",o.style.width="auto",o.style.minWidth="20px",this.options.bgColor&&(o.style.backgroundColor=this.options.bgColor),this.options.titles&&this.options.titles.length>i&&(o.title=this.options.titles[i]),this._updateContent(i);var n=L.DomEvent.stopPropagation;L.DomEvent.on(o,"click",n).on(o,"mousedown",n).on(o,"dblclick",n).on(o,"click",L.DomEvent.preventDefault).on(o,"click",this.clicked,this)}return e},_updateContent:function(t){if(!(t>=this._content.length)){var e=this._links[t],i=this._content[t];if("string"==typeof i){var o=i.length<4?"":i.substring(i.length-4),n="data:image/"===i.substring(0,11);".png"===o||".gif"===o||".jpg"===o||n?(e.style.width=""+(this.options.imageSize||26)+"px",e.style.height=""+(this.options.imageSize||26)+"px",e.style.padding="0",e.style.backgroundImage="url("+i+")",e.style.backgroundRepeat="no-repeat",e.style.backgroundPosition=this.options.bgPos&&this.options.bgPos.length>t&&this.options.bgPos[t]?-this.options.bgPos[t][0]+"px "+-this.options.bgPos[t][1]+"px":"0px 0px"):e.innerHTML=i}else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(i)}}},setContent:function(t,e){t>=this._content.length||(this._content[t]=e,this._updateContent(t))},setTitle:function(t,e){this.options.titles[t]=e,this._links[t].title=e},setBgPos:function(t,e){this.options.bgPos[t]=e,this._links[t].style.backgroundPosition=e?-e[0]+"px "+-e[1]+"px":"0px 0px"},clicked:function(t){for(var e=window.event&&window.event.srcElement||t.target||t.srcElement,i=this._links.length;--i>=0&&e!==this._links[i];);this.fire("clicked",{idx:i})}}),L.functionButtons=function(t,e){return new L.FunctionButtons(t,e)},L.FunctionButton=L.FunctionButtons.extend({initialize:function(t,e){e.title&&(e.titles=[e.title]),e.bgPos&&(e.bgPos=[e.bgPos]),L.FunctionButtons.prototype.initialize.call(this,[t],e)},setContent:function(t){L.FunctionButtons.prototype.setContent.call(this,0,t)},setTitle:function(t){L.FunctionButtons.prototype.setTitle.call(this,0,t)},setBgPos:function(t){L.FunctionButtons.prototype.setBgPos.call(this,0,t)}}),L.functionButton=function(t,e){return new L.FunctionButton(t,e)},window.MapBBCodeConfig.include({strings:{view:"View",editor:"Editor",editInWindow:"Window",editInPanel:"Panel",viewNormal:"Normal",viewFull:"Full width only",viewTitle:"Adjusting browsing panel",editorTitle:"Adjusting editor panel or window",editInWindowTitle:"Editor will be opened in a popup window",editInPanelTitle:"Editor will appear inside a page",viewNormalTitle:'Map panel will have "fullscreen" button',viewFullTitle:"Map panel will always have maximum size",growTitle:"Click to grow the panel",shrinkTitle:"Click to shrink the panel",zoomInTitle:"Zoom in",zoomOutTitle:"Zoom out",selectLayer:"Select layer",addLayer:"Add layer",keyNeeded:'This layer needs a developer key (<a href="%s" target="devkey">how to get it</a>)',keyNeededAlert:"This layer needs a developer key"}})}(window,document);