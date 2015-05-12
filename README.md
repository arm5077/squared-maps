# Squared
Automates making hipster square cartograph maps.

<img src="http://i.imgur.com/R97XzOF.png" />

##How it works
It's really easy. Promise.
###Include the library
Put `squared.js` in the `<head>` of your HTML file. <br /> 
 
    <script src="https://s3-us-west-2.amazonaws.com/nationaljournal/libraries/squared/squared.js"></script>

###Include any custom styles
You can apply custom classes to cartographic elements using Squared, so make sure you have the styles to back them up. 

    <style type="text/css">
      .commonwealth {
        background-color: #FDC26D
      }
    </style>

### Set a container
It needs to have a unique `id` and a width/height, though they can be percentages.

    <div id="map" style="width: 600px; height: 400px"></div>

### Make a new Squared object
It accepts the container's `id` as an argument. You'll need this Javascript to run after the DOM loads, so wrap in a `<script>` tag after the closing `<body>` tag or make sure it's called after an `onload` or `$(document).ready()` event in an external file.

      var map = new Squared("map");

### Figure out what you want to highlight
Make an object listing the `name` of the cartographic entity and the `class` you're applying to it. The `name` will need to equal the names used in the template (more on that later, the default are USPS state abbreviations).

    var data = [
       { name: "KY", class: "commonwealth" },
       { name: "MA", class: "commonwealth" },
       { name: "PA", class: "commonwealth" },
       { name: "VA", class: "commonwealth" }
     ]

### Launch your creation
The `make()` function takes a `data` object (see above) and a bunch of (optional) options.

    map.make(data, 
      { 
        "background-color": "#9F8EC3",
        color: white,
        "font-size": "11pt"  
      }
    );
   
### Boom, map!
<img src="http://i.imgur.com/4GH0lcq.png" />

Full HTML: 

    <!doctype html>
    <html>
    <head>
      <script src="squared.js"></script>
      <style type="text/css">
        .commonwealth {
          background-color: #FDC26D
        }
      </style>    
    </head>
    <body>
      <div id="map" style="width: 600px; height: 400px"></div>	
    </body>
    
    <script>
      map = new Squared("map");
      var data = [
        { name: "KY", class: "commonwealth" },
        { name: "MA", class: "commonwealth" },
        { name: "PA", class: "commonwealth" },
        { name: "VA", class: "commonwealth" }
      ];
	
      map.make(data, 
      { 
        "background-color": "#9F8EC3",
        color: "white",
        "font-size": "11pt"  
      });
    </script>
    </html>

##Options
The `options` object takes a bunch of parameters:

* padding: The distance between square, as a percentage of the width of the square. Default is 0.1.
* *width:* Width of a square in pixels. If omitted, the map sizes itself to fill the container without clipping.
* *color:* Text color.
* *background-color*
* *font-family*
* *font-size*

## Making your own template
What good is a hipster cartogram tool if you can't make your own _custom_ hipster cartograms?

`Squared.make()` accepts an optional third parameter,`template`, is a string following a CSV format outlining the grid pattern of the map you're trying to produce.

Easiest way to explain is to show it. This:

    ,N,
    W,,E
    ,S,

...will produce this:

<img src="http://i.imgur.com/Pq94x0Q.png" />

More complicated? This:

    Iceland,,,,,,,,,
    ,,,,Norway,Sweden,Finland,,,
    Ireland,UK,,,,,Estonia,Russia,,
    ,,Belgium,Netherlands,Denmark,,Lithuania,Latvia,,
    ,,France,Germany,Poland,Belarus,Ukraine,Moldova,,
    ,Portugal,Spain,Switzerland,Austria,Slovakia,Romania,Bulgaria,,
    ,,,Italy,Slovenia,Hungary,Serbia,,,
    ,,,,Croatia,Bosnia,Macedonia,Turkey,,
    ,,,,,Albania,Greece,Cyprus,,

...makes this:

<img src="http://i.imgur.com/lzgL2Lm.png" />

I find it easiest to make these grids in Excel and save as a CSV.

## History
It all began with a map from [The New York Times](http://www.nytimes.com/interactive/2015/03/04/us/gay-marriage-state-by-state.html): 
<img src="http://i.imgur.com/r3fuajG.png" style="display:block" />
It wasn't the first time a designer had sought to minimize visual bias by squishing states into squares, but it launched [plenty of imitations](http://blog.yanofsky.info/post/117635988235/there-appears-to-be-some-disagreement-on-the). 


