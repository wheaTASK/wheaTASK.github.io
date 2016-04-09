$(document).ready(function() {
	//Editing power values
	//dormData["features"][0].properties.power=1000;

	var map = L.map('map').setView([41.966975161113574,-71.18357218801937], 17); 
	  L.tileLayer('http://{s}.tiles.mapbox.com/v3/austinrg7.jl4274hk/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 20
	  }).addTo(map);


	// control that shows state info on hover
	var info = L.control({position: 'topright'});

	info.onAdd = function (map) {
	  this._div = L.DomUtil.create('div', 'info');
	  this.update();
	  return this._div;
	};

	info.update = function (props) {
		// 17 different dorms to check
		for (var i = 0; i < 17; i++) {
			if (dormJSON.features[i].properties.name == props.name) {
				var kwh = dormJSON.features[i].properties.power;
				// console.log("Chapin is i " + i);
			}
		}
	  this._div.innerHTML = '<h6>Wheaton Residential Power Use</h6>' +  (props ?
		'<b>' + props.name + '</b><br />' + kwh + ' kW/h'
		: 'Hover over a dorm');
	};

	info.addTo(map);


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