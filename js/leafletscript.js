// var map;

String.prototype.lowFirstLetter = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

$(document).ready(function() {
	//Editing power values
	//dormData["features"][0].properties.power=1000;

	map = L.map('map', {zoomControl: false}).setView([41.966975161113574,-71.18357218801937], 17); 
	L.tileLayer('http://{s}.tiles.mapbox.com/v3/austinrg7.jl4274hk/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 20
	}).addTo(map);

	new L.control.zoom({
		position: 'topright'
	}).addTo(map);


	// control that shows state info on hover
	var info = L.control({position: 'topleft'});

	info.onAdd = function (map) {
	  this._div = L.DomUtil.create('div', 'info');
	  this.update();
	  return this._div;
	};

	info.update = function (props) {
		props ? checkDorm(props) : 'Hover over a dorm';
	  this._div.innerHTML = '<h6>Wheaton Residential Power Use</h6>' +  (props ?
	    '<b>' + props.name + '</b><br />' + props.power + ' kW/h' + '<br />$' + props.cost + ' per hour'
	    : 'Hover over a dorm');
	};

	info.addTo(map);

	/*
	this is what i got to in having it check all the dorms

	for (var i = 0; i < _.size(avgKWh); i++) {
		console.log(avgKWh[_.keys(avgKWh)]);
		if (props.name == avgKWh[i]) {
			props.power = avgKWh[_.keys(avgKWh)[i]][0].toFixed(2);
			props.cost = (props.power*.14).toFixed(2);
		}
	}
	*/
	function checkDorm(props) {
		

		var allDorms= ["beard", "emerson-dorm", "chapin", "clark", "mcintire", "young", "meadows-ew", "meadows-north", "metcalf", "kilham", "larcom", "stanton", "cragin", "everett"];

		var key= props.name.lowFirstLetter();
		var index= allDorms.indexOf(key);

		props.power = avgKWh[key][0].toFixed(2);
		props.cost = (props.power*.14).toFixed(2);

	}


	function getColor(d) {
	    return d > 1000 ? '#FF0000' :
	           d > 500  ? '#FF4322' :
	           d > 200  ? '#FFD744' :
	           d > 100  ? '#FFAC66' :
	           d > 50   ? '#FFD089' :
	           d > 20   ? '#FFEBAB' :
	           d > 10   ? '#FFFACD' :
	                      '#FDFFF0';
	    }

	function style(feature) {
	  return {
	    weight: 2,
	    opacity: 1,
	    color: 'white',
	    dashArray: '3',
	    fillOpacity: 0.7,
	    fillColor: getColor(feature.properties.power)
	  };
	}

	function highlightFeature(e) {
	  var layer = e.target;

	  layer.setStyle({
	    weight: 5,
	    color: '#666',
	    dashArray: '',
	    fillOpacity: 0.7
	  });

	  if (!L.Browser.ie && !L.Browser.opera) {
	    layer.bringToFront();
	  }

	  info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
	  geojson.resetStyle(e.target);
	  info.update();
	}

	// function zoomToFeature(e) {
	//   map.fitBounds(e.target.getBounds());
	// }

	function onEachFeature(feature, layer) {
	  layer.on({
	    mouseover: highlightFeature,
	    mouseout: resetHighlight
	    //click: zoomToFeature
	  });
	}

	geojson = L.geoJson(dormData, {
	  style: style,
	  onEachFeature: onEachFeature
	}).addTo(map);

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

	  var div = L.DomUtil.create('div', 'info legend'),
	    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
	    labels = [],
	    from, to;

	  for (var i = 0; i < grades.length; i++) {
	    from = grades[i];
	    to = grades[i + 1];

	    labels.push(
	      '<i style="background:' + getColor(from + 1) + '"></i> ' +
	      from + (to ? '&ndash;' + to : '+'));
	  }

	  div.innerHTML = labels.join('<br>');
	  return div;
	};

	legend.addTo(map);
});