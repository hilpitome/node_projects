var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var csv = require('ya-csv');
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "semi45",
  database: "test"
});

var pageToVisit = "https://www.tripadvisor.com/Restaurants-g294206-oa40-Kenya.html#LOCATION_LIST";
var baseUrl = "https://www.tripadvisor.com"
var count = 0;

console.log("Visiting: "+pageToVisit);
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

    $('.geoList li').map(function(i,el){
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
      var restaurant_info = {name: name, latitude: lat, longitude: lng}
      con.query(
      'INSERT INTO restaurants SET ?', restaurant_info,
      function (err, result) {
        if (err) throw err;

        console.log('Changed ' + result.changedRows + ' rows');
      }
    );


      count += 1
      console.log(count);

    }
  });
}
