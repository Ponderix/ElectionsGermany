//pan-zoom function
var panZoomMap = svgPanZoom("#wahlkreise_map")
svgPanZoom("#wahlkreise_map", {
  viewportSelector: '.svg-pan-zoom_viewport'
, panEnabled: true
, controlIconsEnabled: false
, zoomEnabled: true
, dblClickZoomEnabled: true
, mouseWheelZoomEnabled: true
, preventMouseEventsDefault: true
, zoomScaleSensitivity: 0.2
, minZoom: 0.5
, maxZoom: 10
, fit: true
, contain: false
, center: true
, refreshRate: 'auto'
, beforeZoom: function(){}
, onZoom: function(){}
, beforePan: function(){}
, onPan: function(){}
, onUpdatedCTM: function(){}
, customEventsHandler: {}
, eventsListenerElement: null
});
