/*

    Explore the 10/40 window

    This is free because the grace of God is free through His son Jesus.

	The code is Copyright (C) 2016 JTeam

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>

*/

var JPKey = 'f07cf62bd819';
var JPData = [];

d3.csv("https://raw.githubusercontent.com/JTeamDevelop/1040Window/master/data/AllCountriesListing.csv")
    .get(function(error, rows) { 
        JPData=rows.slice(); 
    });

var cData = basicData.countries.country;
var windowCountries = ["Afghanistan", "Albania", "Algeria", "Azerbaijan", "Bahrain", "Bangladesh", "Benin",
    "Bhutan", "Brunei", "Burkina Faso", "Cambodia", "Chad", "China", "Hong Kong", "Macao", 
    "Djibouti", "East Timor", "Egypt", "Eritrea", "Ethiopia", "Gambia", "Guinea", "Guinea-Bissau", "India", "Indonesia",
    "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "North Korea", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon",
    "Libya", "Malaysia", "Maldives", "Mali", "Mauritania", "Mongolia", "Morocco", "Myanmar [Burma]", "Nepal", "Niger",
    "Nigeria", "Oman", "Pakistan", "Qatar", "Saudi Arabia", "Senegal", "Somalia", "Sri Lanka", "Sudan", "Syria", "Taiwan",
    "Tajikistan", "Thailand", "Tunisia", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam",
    "West Bank / Gaza", "Western Sahara", "Yemen"];

function polygon(d) {
  return "M" + d.join("L") + "Z";
}

function zoomMap (country) {
    $("#mainMap").empty();  
    $("#mainMap").css("position", "");
    $("#mainMap").css("padding-bottom", "");
    $("#mainMap").removeClass("world");
    $("#mainMap").addClass("zoom");

    $("#breadcrumbs").empty();
    $("#breadcrumbs").append('<span class="homeLink">World</span> > '+country);

    var height = $("#mainMap").height(), width=$("#mainMap").width();

    var data = {};
    for (var i=0; i<cData.length; i++) {
        if(cData[i].countryName==country) {
            data = cData[i];           
        }
    }

    var JPD = {};
    for (var i=0; i<JPData.length; i++) {
        if(JPData[i].CTRY.includes(country)) {
            JPD = JPData[i];           
        }
    }
    var $JP = $("<div id=countryData />");
    $JP.append("<h2>"+country+"</h2>");
    $JP.append("<strong>Population:</strong> "+JPD.POPLPEOPLES);
    $JP.append("</br><strong>% of Pop Least Reached:</strong> "+JPD.PCTPOPLR.substr(0,4));
    $JP.append("</br><strong>People Groups:</strong> "+JPD.CNTPEOPLES);
    $("#mainMap").append($JP);
    
    var ccode = data.isoAlpha3.toLowerCase();
    var mapurl = 'https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/'+ccode+ '.topo.json';
    var jpurl = 'https://joshuaproject.net/api/v2/countries?api_key='+JPKey+'&ISO3='+data.isoAlpha3;
    
  d3.json(jpurl, function(error, json) {
        if (error) return console.error(error);
        console.log(json)
  });

<<<<<<< HEAD
=======
    
>>>>>>> refs/remotes/origin/master
var svg = d3.select("#mainMap").append("svg")
    .attr("width", width)
    .attr("height", height);

    d3.json(mapurl, function(error, json) {
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

        svg.selectAll(".subunit")
        .data(subunits.features)
        .enter().append("path")
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", path)
        .style("fill", "LightGreen")
            .style("stroke-width", "1")
            .style("stroke", "black")
                        .on("dblclick", function(){
                //d3.selectAll(".voronoi").classed({'selected': false});
                //d3.select(this).classed({'selected': true});
                //d3.select(this).style({fill: "yellow"});
                var vPoly = d3.select(this).datum();
                console.log(vPoly);
            });

        //d3 resize
        d3.select(window).on('resize', function() {
            map.resize();
        });      

    });

}

function worldMap () {
    $("#mainMap").empty();
    $("#mainMap").removeClass("zoom");
    $("#mainMap").addClass("world");
    $("#breadcrumbs").empty();

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
        element: document.getElementById('mainMap'),
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

    //d3 resize
    d3.select(window).on('resize', function() {
        map.resize();
    });

}

worldMap();

$(document).on("click", ".homeLink", function(){
    worldMap();
});

