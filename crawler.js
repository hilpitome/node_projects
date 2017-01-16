var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var pageToVisit = "https://www.tripadvisor.com/Restaurants-g294206-Kenya.html";
var authority = "https://www.tripadvisor.com"
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

      goToRestaurant(authority+city_urls[i]);

    }



   }


});
function goToRestaurant(city_to_visit){
var restaurants = [];
  request(city_to_visit, function(error, response, body){


      if(error) {

        console.log("Error: " + error);
      }
      // Check status code (200 is HTTP OK)

      if(response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);

         // array to collect city urls on a page
       $('shortSellDetails','.title').map(function(i,el){
         var rest = ($(this).children().attr('href'));



       });


       //  var result2  =  $('.poi').children().attr('href');
       //  result2 = authority+result2

       //  restaurantLatLng(result2);
      }

   });
   console.log(restaurants);
}
function restaurantLatLng(restaurant_url){

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

      console.log(lat+" "+lng);
    }
  });
}
