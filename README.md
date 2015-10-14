# Squared
Automates making hipster square cartograph maps.

<img src="http://i.imgur.com/R97XzOF.png" />

##How it works
It's really easy. Promise.

###Include the library
Install with Bower:
    
    bower install squared

Put `squared.js` in the `<head>` of your HTML file. <br /> 
 
    <script src="/bower_components/squared/dist/squared.js"></script>

###Include any custom styles
By default , every Squared.js geography is given the class `squared-geog`. You can apply custom classes to cartographic elements, so make sure you have the styles to back them up. 

    <style type="text/css">
      .squared-geog {
        background-color: #9F8EC3;
      }

      squared-geog.commonwealth {
        background-color: #FDC26D;
      }
    </style>

### Set a container
It needs to have a unique `id` and a width/height, though they can be percentages.

    <div id="map" style="width: 600px; height: 400px"></div>

### Make a new Squared object
It accepts the container's `id` as an argument. You'll need this Javascript to run after the DOM loads, so wrap in a `<script>` tag after the closing `<body>` tag or make sure it's called after an `onload` or `$(document).ready()` event in an external file.

      var map = new Squared("map");
      
### Make the base map
The `make()` function takes (optional) options and an (optional) template (more on the below). 

    map.make(data, 
      { 
        "background-color": "#9F8EC3",
        color: white,
        "font-size": "11pt"  
      }
    );

### Add data
Bind data to geographies with `Squared.data(array, key)`, which accepts an array of data objects and an optional key value. If given, `key` should match a unique id in your template's geographies; it defaults to `"name"`.

Example: 

    data = [
      {
        "name":"AL",
        "full_name":"Alabama",
        "2014_population": 4849377
      },
      {
        "name":"AK",
        "full_name":"Alaska",
        "2014_population": 736732
      }
      ...
      {
        "name":"WY",
        "full_name":"Wyoming",
        "2014_population": 584153
      }
    ];
    
    map.data(data, "name");

### Figure out what you want to highlight
Two ways to do this. 

1. Apply a CSS class using `Squared.addClass()`.

   Example: 
   
        map.addClass(function(d){
          if(d.2014_population < 1000000)
            return "small";
           else if(d.2014_population < 10000000 )
             return "medium";
           else return "large";
        });
        
    `Squared.removeClass(classifier)` works the same way, but removes the selected class.

2. Apply a  choropleth color scale! You can do this with `Squared.makeColorScale()`.

   Example:
   
        map.makeColorScale('2014_population', {
          minColor: "#63998F",
          maxColor: "#EA463D",
          steps: 3
        });

### Boom, map!
<img src="http://i.imgur.com/4GH0lcq.png" />

Full HTML: 

    <!doctype html>
    <html>
    <head>
      <script src="bower_components/squared/squared.js"></script>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
      <style type="text/css">
        .squared-geog {
          background-color: #FDC26D
        }
        .squared-geog.small {
          background-color: red;
        }
        .squared-geog.medium {
          background-color: green;
        }
        .squared-geog.large {
          background-color: blue;
        }
      </style>    
    </head>
    <body>
      <div id="map" style="width: 600px; height: 400px"></div>  
    </body>

    <script>
      map = new Squared("map");
      map.make();

      $.get("data.json", function(data){
        map.data(data);
        map.addClass(function(d){
          if(d.population_2014 < 1000000)
            return "small";
           else if(d.population_2014 < 10000000 )
             return "medium";
           else return "large";
        });
      });
    </script>
    </html>

##Options
The `options` object takes a bunch of parameters:

* padding: The distance between squares, as a percentage of the width of the square. Default is 0.1.
* template: Object or string holding map template data.

## Making your own template
What good is a hipster cartogram tool if you can't make your own _custom_ hipster cartograms?

The `options` object in `Squared.make()` accepts `template`, which is an array of geography objects listing a name and x,y coordinates. 

Alternatively, you can feed it a comma-delinated string, with each row terminated by a `\n`, listing a grid of the same values.

Easiest way to explain is to show it. This:

    [
      {"name":"N","x":1,"y":0},
      {"name":"E","x":2,"y":1},
      {"name":"S","x":1,"y":2}
      {"name":"W","x":0,"y":1}
    ]

or this:

    ",N,\n" + 
    "W,,E\n" +
    ",S,\n"

...will produce this:

<img src="http://i.imgur.com/Pq94x0Q.png" />

More complicated? This:

    "Iceland,,,,,,,,,\n" +
    ",,,,Norway,Sweden,Finland,,,\n" +
    "Ireland,UK,,,,,Estonia,Russia,,\n" +
    ",,Belgium,Netherlands,Denmark,,Lithuania,Latvia,,\n" +
    ",,France,Germany,Poland,Belarus,Ukraine,Moldova,,\n" +
    ",Portugal,Spain,Switzerland,Austria,Slovakia,Romania,Bulgaria,,\n" +
    ",,,Italy,Slovenia,Hungary,Serbia,,,\n" +
    ",,,,Croatia,Bosnia,Macedonia,Turkey,,\n" +
    ",,,,,Albania,Greece,Cyprus,,\n"

...makes this:

<img src="http://i.imgur.com/lzgL2Lm.png" />

I find it easiest to make these grids in Excel and save as a CSV.

## History
It all began with a map from [The New York Times](http://www.nytimes.com/interactive/2015/03/04/us/gay-marriage-state-by-state.html): 
<img src="http://i.imgur.com/r3fuajG.png" style="display:block" />
It wasn't the first time a designer had sought to minimize visual bias by squishing states into squares, but it launched [plenty of imitations](http://blog.yanofsky.info/post/117635988235/there-appears-to-be-some-disagreement-on-the). 

## Reference

#### Squared.make([options ])
Makes a new Squared object.

**Parameters**

  * options: object
    * **padding** (*float*): The distance between squares, as a percentage of the width of the square. Default is 0.1.
    * **key** (*string*): The property containing a unique id for every template geography. Defaults to `"name"`.
    * **responsive** (*boolean*): Whether the map should resize if the bounds of its containing element change. Useful if the containing element has a percentage width.
    * **template** (*object* or *string*): Either an array holding a collection of geography objects, or a comma-delineated string with rows broken by newlines. See above for example.

**Properties**

  * **geographies** (*array*): An array of DOM elements contained in the map.

#### Squared.data(data[, key])
Bind data to a Squared map. 

  * **data** (*array*): An array of objects, preferably one per geography in the template. They are bound based on the shared id listed in `key`, so make sure both the template and the data have this same id for every object.
  * **key** (*string*): The shared property between the data you're binding and the map template. Defaults to `"name"`.
  
#### Squared.addClass(classifier)
Add a class to map elements, either selectively through a function or en masse via a string.

  * **classifier** (*function* or *string*): This is usually a function: It's repeated for every element in the map and is passed that element's `data` object as an argument, returning a class name.
    If it's a string, each element in the map receives it as a class.
    
#### Squared.removeClass(classifier)
Removes a class from elements, either selectively through a function or en masse via a string.

  * **classifier** (*function* or *string*): This is usually a function: It's repeated for every element in the map and is passed that element's `data` object as an argument, returning a class name.
    If it's a string, each element in the map with the class name loses that class.

#### Squared.makeColorScale(property[, options])
Applies a color scale to the map based on the values in `property`.

  * **property** (*string*): The data property with which the scale will be based.
  * **options** (*object*):
    * **min** (*number*): The minimum value in the color scale. Defaults to the lowest overall value. Must be paired with `max`, though both are optional.
    * **max** (*number*): The maximum value in the color scale. Defaults to the highest overall value. Must be paired with `min`, though both are optional.
    * **minColor** (*string*): The starting color for lowest values.
    * **maxColor** (*string*): The ending color for highest values.
    * **steps** (*number*): The number of colors to display. Defaults to 5.


