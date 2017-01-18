var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs')
var csvWriter = require('csv-write-stream')
var writer = csvWriter({sendHeaders: false})
var pageToVisit = "https://www.tripadvisor.com/Restaurants-g294206-Kenya.html";
var baseUrl = "https://www.tripadvisor.com"
var count = 0;

console.log("Visiting page " + pageToVisit);
request(pageToVisit, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
     var city_urls = []; // array to collect city urls on a page
    $('.geo_name').map(function(i,el){
      var url_of_city = ($(this).children().attr('href'));
      city_urls.push(url_of_city)
    });

    for (var i = 0; i<city_urls.length; i++){

      goToRestaurant(baseUrl+city_urls[i]);

    }



   }


});
function goToRestaurant(city_to_visit){



  request(city_to_visit, function(error, response, body){


      if(error) {

        console.log("Error: " + error);
      }
      // Check status code (200 is HTTP OK)

      if(response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);
        $('.shortSellDetails .title').each(function(index, title){
          var restaurant_name = $(title).text();
         var restaurant_abs_url = $(title).children().attr('href');
         result2 = baseUrl+restaurant_abs_url;
         restaurantLatLng(result2, restaurant_name);
        });

      //   var restaurants = []; // array to collect city urls on a page
      //  $('shortSellDetails','.title').map(function(i,el){
      //    var rest = ($(this).children().attr('href'));
       //
      //  console.log(rest+" is it me?");
       //
      //  });

       //  var result2  =  $('.poi').children().attr('href');



      }
   });
}
function restaurantLatLng(restaurant_url, name){

  request(restaurant_url, function(error, response, body) {

    if(error) {
      console.log("Error: " + error);
    }
    // Check status code (200 is HTTP OK)

    if(response.statusCode === 200) {
      // Parse the document body
      var $ = cheerio.load(body);
      var map_container  =  $('.mapContainer');

      var lat = map_container.data('lat');
      var lng = map_container.data('lng');

      console.log(name+": "+lat+" "+lng);
      count += 1
      console.log(count);
      // writer.pipe(fs.createWriteStream('restuarant_with_locations.csv',
      // {'flags': 'a'})) // ensures that it appends row and does not overwrite page
      // writer.write({entity_name: "this", entity_lat: "time", entity_lng: "of year"})
      // writer.end()
    }
  });
}
