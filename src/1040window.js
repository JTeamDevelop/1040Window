var cData = basicData.countries.country;
var windowCountries = ["Afghanistan", "Albania", "Algeria", "Azerbaijan", "Bahrain", "Bangladesh", "Benin",
    "Bhutan", "Brunei", "Burkina Faso", "Cambodia", "Chad", "China", "Hong Kong", "Macao", 
    "Djibouti", "East Timor", "Egypt", "Eritrea", "Ethiopia", "Gambia", "Guinea", "Guinea-Bissau", "India", "Indonesia",
    "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "North Korea", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon",
    "Libya", "Malaysia", "Maldives", "Mali", "Mauritania", "Mongolia", "Morocco", "Myanmar [Burma]", "Nepal", "Niger",
    "Nigeria", "Oman", "Pakistan", "Qatar", "Saudi Arabia", "Senegal", "Somalia", "Sri Lanka", "Sudan", "Syria", "Taiwan",
    "Tajikistan", "Thailand", "Tunisia", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam",
    "West Bank / Gaza", "Western Sahara", "Yemen"];

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


var afgData = {};
function setData (data) {
    afgData = data;
}
//httpGetAsync(afgUrl,setData)

function zoomMap (country) {
    var data = {};
    for (var i=0; i<cData.length; i++) {
        if(cData[i].countryName==country) {
            data = cData[i];           
        }
    }
    
    var ccode = data.isoAlpha3.toLowerCase();
    var url = 'https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/'+ccode+ '.topo.json';
    

    $("#map1040").empty();

var width = 1200,
    height = 1160;

var svg = d3.select("#map1040").append("svg")
    .attr("width", width)
    .attr("height", height);

    d3.json(url, function(error, json) {
        if (error) return console.error(error);

        var subunits = topojson.feature(json, json.objects[ccode]);
        var center = d3.geo.centroid(subunits);
        
        var scale  = 125;
        var offset = [width/2, height/2];
        var projection = d3.geo.mercator().scale(scale).center(center)
          .translate(offset);
        // create the path
        var path = d3.geo.path().projection(projection);

        // using the path determine the bounds of the current map and use 
        // these to determine better values for the scale and translation
        var bounds  = path.bounds(subunits);
        var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
        var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
        var scale   = (hscale < vscale) ? hscale : vscale;
        var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                        height - (bounds[0][1] + bounds[1][1])/2];

        scale = scale*0.9;

        // new projection
        projection = d3.geo.mercator().center(center)
            .scale(scale).translate(offset);
        path = path.projection(projection);
    
        /*
        svg.selectAll("path").data(subunits).enter().append("path")
            .attr("d", path)
            .style("fill", "red")
            .style("stroke-width", "1")
            .style("stroke", "black");
            */
        svg.append("path")
            .datum(subunits)
            .attr("d", path)
            .style("fill", "LightGreen")
            .style("stroke-width", "1")
            .style("stroke", "black");

    });

}

var mapData = {};
for (var i=0; i<cData.length; i++) {
    var iso3 = cData[i].isoAlpha3;
    if(windowCountries.indexOf(cData[i].countryName)>-1) {
        mapData[iso3] = {};
        mapData[iso3].name = cData[i].countryName;
        mapData[iso3].capital = cData[i].capital;
        mapData[iso3].population = cData[i].population;
        mapData[iso3].raw = cData[i];
        mapData[iso3].fillKey = 'inWindow';
    }
}

var capitals = [];
for (var i=0; i<capitaldata.length; i++) {
    if(windowCountries.indexOf(capitaldata[i].CountryName)>-1) {
        capitals.push({
            name: capitaldata[i].CapitalName,
            radius: 2,
            latitude: capitaldata[i].CapitalLatitude,
            longitude: capitaldata[i].CapitalLongitude            
        });
    }
}

var map = new Datamap({
    element: document.getElementById('map1040'),
    fills: {
        inWindow: 'blue',
        defaultFill: 'grey'
    },
    data: mapData,
    geographyConfig: {
        popupTemplate: function(geo, data) {
            if(data!=null) {
                return ['<div class="hoverinfo"><strong>',
                    geo.properties.name+'</strong>',
                    '<br/>Capital: ' +  data.capital ,
                    '<br/>Population: ' +  data.population ,
                    '</div>'].join('');
            }
            else {
                return ['<div class="hoverinfo"><strong>',
                    geo.properties.name+'</strong>',
                    '</div>'].join('');
            }
        }
    },
    responsive: true,
    done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
            if(windowCountries.indexOf(geo.properties.name)>-1){
                zoomMap(geo.properties.name);
            }
        });
    }
});

map.bubbles(capitals, {});

//alternatively with d3
d3.select(window).on('resize', function() {
    map.resize();
});

