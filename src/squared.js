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
		key: "name",
		responsive: false,
		template: [{"name":"AL","x":7,"y":6},{"name":"AK","x":0,"y":1},{"name":"AZ","x":2,"y":5},{"name":"AR","x":5,"y":5},{"name":"CA","x":1,"y":4},{"name":"CO","x":3,"y":4},{"name":"CT","x":10,"y":3},{"name":"DE","x":10,"y":4},{"name":"FL","x":9,"y":7},{"name":"GA","x":8,"y":6},{"name":"HI","x":0,"y":6},{"name":"ID","x":2,"y":2},{"name":"IL","x":6,"y":3},{"name":"IN","x":6,"y":4},{"name":"IA","x":5,"y":3},{"name":"KS","x":4,"y":5},{"name":"KY","x":6,"y":5},{"name":"LA","x":5,"y":6},{"name":"ME","x":11,"y":0},{"name":"MD","x":9,"y":4},{"name":"MA","x":10,"y":2},{"name":"MI","x":7,"y":2},{"name":"MN","x":5,"y":2},{"name":"MS","x":6,"y":6},{"name":"MO","x":5,"y":4},{"name":"MT","x":3,"y":2},{"name":"NE","x":4,"y":4},{"name":"NV","x":2,"y":4},{"name":"NH","x":11,"y":1},{"name":"NJ","x":9,"y":3},{"name":"NM","x":3,"y":5},{"name":"NY","x":9,"y":2},{"name":"NC","x":9,"y":5},{"name":"ND","x":4,"y":2},{"name":"OH","x":7,"y":3},{"name":"OK","x":4,"y":6},{"name":"OR","x":1,"y":3},{"name":"PA","x":8,"y":3},{"name":"RI","x":11,"y":2},{"name":"SC","x":8,"y":5},{"name":"SD","x":4,"y":3},{"name":"TN","x":7,"y":5},{"name":"TX","x":4,"y":7},{"name":"UT","x":2,"y":3},{"name":"VT","x":10,"y":1},{"name":"VA","x":8,"y":4},{"name":"WA","x":1,"y":2},{"name":"WV","x":7,"y":4},{"name":"WI","x":6,"y":2},{"name":"WY","x":3,"y":3}]
	} 

	Squared.prototype.make = function(options){
	
		var Map = this;
	
		// See if user supplied options; if not, use default
		if( !options ){
			options = Map.defaultOptions;
		}
		else {
			// Fill in any options the user didn't specify with defaults
			for( key in Map.defaultOptions ){
				if( typeof options[key] == "undefined" ) options[key] = Map.defaultOptions[key];
			}		
		
			// Check to see if a CSV template was supplied. If so, convert to object
			if( typeof options.template == "string" ){
				var mapData = [];
				options.template=options.template.replace(/[\n\r]/g, '\n');
				options.template.split("\n").forEach(function(row, y){
					row.split(",").forEach(function(rowItem, x){
						if( rowItem != ""){
							var obj = {x: x, y: y};
							obj[options.key] = rowItem;
						} mapData.push(obj);
					});
				});
				options.template = mapData;
			}
			else if( typeof options.template != "object"){
				options.template = Map.defaultOptions.template;
			}
		}
		
		// Make map container position: relative;
		Map.e.style.position = "relative";

		sizeMapGeographies();

		// Append states
		Map.geographies = [];
		options.template.forEach(function(locality){
			var box = document.createElement("div");
			box.style.width = Map.dimension + "px";
			box.style.height = Map.dimension + "px";
			box.style.left = (locality.x) * (Map.dimension + Map.padding) + "px";
			box.style.top = (locality.y) * (Map.dimension + Map.padding) + "px";
			box.style.lineHeight = Map.dimension + "px";
			box.style.position = "absolute";
			box.style.textAlign = "center";
			box[options.key] = locality[options.key];
			box.className = "squared-geog";
			box.x = locality.x;
			box.y = locality.y;
			if( locality.class ) {
				box.className = box.className + " " + locality.class;
			}
			
			box.data = locality.data;
			box.innerHTML = locality[options.key];

			Map.e.appendChild(box);
			Map.geographies.push(box);
		});

		// Have map resize on window resize if responsive flag is true
		if( options.responsive == true){
			window.addEventListener("resize", function(){
				Map.geographies.forEach(function(box){
					sizeMapGeographies();
					box.style.width = Map.dimension + "px";
					box.style.height = Map.dimension + "px";
					box.style.left = (box.x) * (Map.dimension + Map.padding) + "px";
					box.style.top = (box.y) * (Map.dimension + Map.padding) + "px";
					box.style.lineHeight = Map.dimension + "px";
				});
			});
		}

		return this;
		
		function sizeMapGeographies(){
			// If no defined width, fit to template
			if( !options.width ){ 
				// Find dimensions of template
				Map.height = Math.max.apply(null, options.template.map(function(d){ return +d.y }) ) + 1;
				Map.width = Math.max.apply(null, options.template.map(function(d){ return +d.x }) ) + 1;

				// Figure out orientation of map
				if(Map.e.clientWidth / Map.e.clientHeight <= Map.width / Map.height) {
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
		}
	}
	
	Squared.prototype.data = function(data, key){
		var Map = this;
		
		// Instantiate or clear existing linked data
		Map.geographies.forEach(function(geography){
			geography.data = null;
		});
		
		if(!key) 
			var key = "name";
		if( data ){
			var localities = Map.geographies.map(function(d){ return d[key] });
			// right now this requires a JSON file. Lame, I know
			data.forEach(function(d){
				if( localities.indexOf(d[key]) != -1 )
					Map.geographies[ localities.indexOf(d[key]) ].data = d;
			});
			
		}
		
		else 
			throw "No data specified!"
			
		return Map;
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
		return Map;
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
		return Map;
	}
	
	Squared.prototype.on = function(event, callback){
		var Map = this;
		if( event && typeof callback == "function"){
			Map.geographies.forEach(function(geography){
				geography.addEventListener(event, function(){callback(geography.data, geography)});
			});
		} 
		return Map;
	}
	
	Squared.prototype.makeColorScale = function(property, options){
		var Map = this;
		var scale;
		var steps = 4;
		
		// Get values
		var values = Map.geographies.map(function(d){
			// Check to see if data has the selected property
			if(!d.data)
				throw "One or more of the map's geographies doesn't have that data property.";
			else {
				if(!d.data[property]) throw "One or more of the map's geographies doesn't have that data property.";
				else return d.data[property];
			}
		});
		
		if(options){
			if(options.quantiles == true)
				var scaleMode = "q";
				else var scaleMode = "e";
			
			if(options.padding){
				if( options.padding.length != 2 )
					options.padding = [0,0];
			} else
				options.padding = [0,0];				

			// If they supply steps
			if(options.steps) steps = options.steps;
			
			// If they supply colors
			if(options.minColor && options.maxColor){
				scale = chroma.scale([options.minColor, options.maxColor]);
			}
			// otherwise supply defaults
			else {
				scale = chroma.scale(["#FDC26D", "#77B5E3"]);
			}
			// If they supply min/max values
			if(typeof options.min != "undefined" && typeof options.max != "undefined"){
				// Filter the values array down to values within this range
				values = values.filter(function(d){
					return (d >= options.min && d <= options.max)
				});
			}
		}
		// Otherwise, if no options...
		else {	
			scale = chroma.scale(["#FDC26D", "#77B5E3"]);
			scaleMode = "e";
		}

		scale = scale.mode('lab')
			.correctLightness()
			.padding(options.padding)
			.classes(chroma.limits(values, scaleMode, steps));

		Map.steps = chroma.limits(values, scaleMode, steps);
		Map.scale = scale;
			
		// Run through geographies and color them accordingly
		Map.geographies.forEach(function(locality){
			locality.style.backgroundColor = scale(locality.data[property]).hex();
		});

		return Map;
		
	}	
	
	return Squared;
	
}());