window.Squared = (function(){
	
	function Squared(id){
		if( id ){
			if( window == this ){
				return new Square(id);
			}
			this.e = document.getElementById(id);
			return this;
		}	
	} 

	Squared.prototype.defaultOptions = {
		padding: .1,
		"background-color": "#77B5E3",
		color: "white",
		"font-family": "sans-serif",
		"font-size": "10pt"
	} 

	Squared.prototype.make = function(data, options, template){
	
		var Map = this;
	
		// See if user supplied options; if not, use default
		if( !options ){
			options = this.defaultOptions;
		}
		else {
			// Fill in any options the user didn't specify with defaults
			for( key in this.defaultOptions ){
				if( !options[key] ) options[key] = this.defaultOptions[key];
			}
		
			// Check to see if a CSV template was supplied. If so, convert to object
			if( typeof template == "string" ){
				var mapData = [];
				template=template.replace(/[\n\r]/g, '\n');
				template.split("\n").forEach(function(row, y){
					row.split(",").forEach(function(rowItem, x){
						if( rowItem != "") mapData.push({ name: rowItem, x: x, y: y });
					});
				});
				template = mapData;
			}
			else {
				template = [{"name":"AL","x":7,"y":6},{"name":"AK","x":0,"y":1},{"name":"AZ","x":2,"y":5},{"name":"AR","x":5,"y":5},{"name":"CA","x":1,"y":4},{"name":"CO","x":3,"y":4},{"name":"CT","x":10,"y":3},{"name":"DE","x":10,"y":4},{"name":"FL","x":9,"y":7},{"name":"GA","x":8,"y":6},{"name":"HI","x":0,"y":6},{"name":"ID","x":2,"y":2},{"name":"IL","x":6,"y":3},{"name":"IN","x":6,"y":4},{"name":"IA","x":5,"y":3},{"name":"KS","x":4,"y":5},{"name":"KY","x":6,"y":5},{"name":"LA","x":5,"y":6},{"name":"ME","x":11,"y":0},{"name":"MD","x":9,"y":4},{"name":"MA","x":10,"y":2},{"name":"MI","x":7,"y":2},{"name":"MN","x":5,"y":2},{"name":"MS","x":6,"y":6},{"name":"MO","x":5,"y":4},{"name":"MT","x":3,"y":2},{"name":"NE","x":4,"y":4},{"name":"NV","x":2,"y":4},{"name":"NH","x":11,"y":1},{"name":"NJ","x":9,"y":3},{"name":"NM","x":3,"y":5},{"name":"NY","x":9,"y":2},{"name":"NC","x":9,"y":5},{"name":"ND","x":4,"y":2},{"name":"OH","x":7,"y":3},{"name":"OK","x":4,"y":6},{"name":"OR","x":1,"y":3},{"name":"PA","x":8,"y":3},{"name":"RI","x":11,"y":2},{"name":"SC","x":8,"y":5},{"name":"SD","x":4,"y":3},{"name":"TN","x":7,"y":5},{"name":"TX","x":4,"y":7},{"name":"UT","x":2,"y":3},{"name":"VT","x":10,"y":1},{"name":"VA","x":8,"y":4},{"name":"WA","x":1,"y":2},{"name":"WV","x":7,"y":4},{"name":"WI","x":6,"y":2},{"name":"WY","x":3,"y":3}];
			}
		
			// Did user supply class data?
			if( data ){
				var localities = template.map(function(d){ return d.name });
				// right now this requires a JSON file. Lame, I know
				data.forEach(function(d){
					if( localities.indexOf(d.name) != -1 )
						if(d.class){ template[ localities.indexOf(d.name) ].class = d.class; }
						template[ localities.indexOf(d.name) ].data = d;
				});
			}
		}

		// Make map container position: relative;
		Map.e.style.position = "relative";

		// If no defined width, fit to template
		if( !options.width ){ 
			// Find dimensions of template
			Map.height = Math.max.apply(null, template.map(function(d){ return +d.y }) ) + 1;
			Map.width = Math.max.apply(null, template.map(function(d){ return +d.x }) ) + 1;

			// Figure out orientation of map
			if(Map.e.clientWidth / this.e.clientHeight <= Map.width / Map.height) {
				Map.padding = Map.e.clientWidth / (Map.width) * options.padding;
				Map.dimension = Map.e.clientWidth / (Map.width) - Map.padding;
			}
			else {
				Map.padding = Map.e.clientHeight / (Map.height) * options.padding;
				Map.dimension = Map.e.clientHeight / (Map.height) - Map.padding;
			}
		}
		// Otherwise, use defined width
		else {
			Map.padding = parseInt(options.width) * options.padding;
			Map.dimension = parseInt(options.width);
		}

		// Overall map styles
		Map.e.style.fontFamily = options["font-family"];
		Map.e.style.fontSize = options["font-size"];

		// Append states
		Map.geographies = [];
		template.forEach(function(locality){
			var box = document.createElement("div");
			box.style.width = Map.dimension + "px";
			box.style.height = Map.dimension + "px";
			box.style.left = (locality.x) * (Map.dimension + Map.padding) + "px";
			box.style.top = (locality.y) * (Map.dimension + Map.padding) + "px";
			box.style.lineHeight = Map.dimension + "px";
			box.style.position = "absolute";
			box.style.textAlign = "center";
			if( locality.class ) {
				box.className(locality.class);
			}
			
			box.data = locality.data;
			box.innerHTML = locality.name;

			Map.e.appendChild(box);
			Map.geographies.push(box);
		});

		return this;
	}
	
	Squared.prototype.data = function(data){
		var Map = this;
		if( data ){
			var localities = Map.geographies.map(function(d){ return d.data.name });
			// right now this requires a JSON file. Lame, I know
			data.forEach(function(d){
				if( localities.indexOf(d.name) != -1 )
					Map.geographies[ localities.indexOf(d.name) ].class = d.class;
					Map.geographies[ localities.indexOf(d.name) ].data = d;
			});
		}
		else 
			throw "No data specified!"
	}
	
	Squared.prototype.addClass = function(classifier){
		var Map = this;
		Map.geographies.forEach(function(geography){
			
			// Check if the classifier is a string vs. a function
			if( typeof classifier == "string")
				var newClass = classifier;
			else if( typeof classifier == "function")
				var newClass = classifier(geography.data);
				
			// See if class has already been applied
			if( geography.className.indexOf(newClass) == -1)
				geography.className += " " + newClass;
		});
	}
	
	Squared.prototype.removeClass = function(classifier){
		var Map = this;
		Map.geographies.forEach(function(geography){
			
			// Check if the classifier is a string vs. a function
			if( typeof classifier == "string")
				var oldClass = classifier;
			else if( typeof classifier == "function")
				var oldClass = classifier(geography.data);
				
			// If class exists, remove it
			if( geography.className.indexOf(oldClass) != -1)
				geography.className = geography.className.replace(new RegExp("(?:^|\\s)" + oldClass + "(?!\\S)", "g"), '');
		});
	}
	
	Squared.prototype.makeColorScale = function(property, options){
		var Map = this;
		var scale;
		var steps = 4;
		if(options){
			
			
			// If they supply colors
			if(options.minColor && options.maxColor){
				scale = chroma.scale([options.minColor, options.maxColor]);
			}
			// otherwise supplie defaults
			else {
				scale = chroma.scale(["#FDC26D", "#77B5E3"]);
			}
			// If they supply min/max values
			if(options.min && options.max){
				scale.domain([options.min, options.max], steps);
			}
			else {
				scale = getMaxMin(scale);
			}

			// If they supply steps
			if(options.steps) steps = options.steps;

		}
		// Otherwise, if no options...
		else {
			
			scale = chroma.scale(["#FDC26D", "#77B5E3"]);
			scale = getMaxMin(scale);
		}

		// Run through geographies and color them accordingly
		Map.geographies.forEach(function(locality){
			locality.style.backgroundColor = scale.mode('lab').classes(steps)(locality.data[property]).hex();
		});

		return Map;
		
		function getMaxMin(scale){
			var values = Map.geographies.map(function(d){
				// Check to see if data has the selected property
				if(!d.data)
					throw "One or more of the map's geographies doesn't have that data property.";
				else {
					if(!d.data[property]) throw "One or more of the map's geographies doesn't have that data property.";
					else return d.data[property];
				}
			});
			scale.domain([Math.min.apply(null, values), Math.max.apply(null, values)]);
			return scale;
		}
		
	}	
	
	return Squared;
	
}());