// Neighborhood Map app: shows the city of Zagreb in Croatia and map Markers 
// showing different amenities throughout Zagreb sorted by type: food, park, 
// sport, culture, user can filter different types of amenities using either 
// list of all amenities or drop down list. Drop down list will show all the 
// markers of the same type, and choosing an item from the list of all markers 
// will leave only that marker present on the map.

// The latitude and longitude of the city of Zagreb
var position = [45.802512, 15.959353];

// All the data needed for creating map markers, 
// list and dropdown list, each marker has a type specific image
var mapMarkers= [
        {
            name: "Bundek",
            type: "Park",
            imgSrc: "images/parkmarker.png",
            position: [45.785924, 15.982728],
            address: "Ulica Damira Tomljanovića 15"
        },
        {
            name: "Maksimir",
            type: "Park",
            imgSrc: "images/parkmarker.png",
            position: [45.823619, 16.016888],
            address: "Maksimirski Perivoj"
        },
        {
            name: "Jarun",
            type: "Park",
            imgSrc: "images/parkmarker.png",
            position: [45.778023, 15.926423],
            address: "Aleja Matije Ljubeka"
        },
        {
            name: "Zrinjevac",
            type: "Park",
            imgSrc: "images/parkmarker.png",
            position: [45.808663, 15.978522],
            address: "Park Zrinjevac"
        },
        {
            name: "Dom Sportova",
            type: "Sport",
            imgSrc: "images/sportsmarker.png",
            position: [45.807586, 15.952000],
            address: "Trg Krešimira Ćosića 11"
        },
        {
            name: "Arena Zagreb",
            type: "Sport",
            imgSrc: "images/sportsmarker.png",
            position: [45.771018, 15.943074],
            address: "Arena Zagreb"
        },
        {
            name: "National and University Library in Zagreb",
            type: "Culture",
            imgSrc: "images/culturemarker.png",
            position: [45.796517, 15.977320],
            address: "Hrvatske Bratske Zajednice 4"
        },
        {
            name: "Museum of Contemporary Art, Zagreb",
            type: "Culture",
            imgSrc: "images/culturemarker.png",
            position: [45.778621, 15.982556],
            address: "Avenija Dubrovnik 17"
        },
        {
            name: "Pivnica Mali Medo",
            type: "Food",
            imgSrc: "images/foodmarker.png",
            position: [45.815676, 15.976573],
            address: "Ul. Ivana Tkalčića 36"
        },
        {
            name: "Restoran Ilsecondo",
            type: "Food",
            imgSrc: "images/foodmarker.png",
            position: [45.776986, 15.9747],
            address: "Avenija Dubrovnik 12"
        }
];

// Map styles Array used to customize Google map
// Source: https://snazzymaps.com/style/22/old-timey
var mapStyle = [
    {
        "featureType": "administrative",
        "stylers": [
            {"visibility": "off"}]
    },
    {
        "featureType": "poi",
        "stylers": [
            {"visibility": "simplified"}]
    },
    {
        "featureType": "road",
        "stylers": [
            {"visibility": "simplified"}]
    },
    {
        "featureType": "water",
        "stylers": [
            {"visibility": "simplified"}]
    },
    {
        "featureType": "transit",
        "stylers": [
            {"visibility": "simplified"}]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {"visibility": "simplified"}]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {"visibility": "off"}]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {"visibility": "on"}]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {"visibility": "on"}]
    },
    {
        "featureType": "water",
        "stylers": [
            {"color": "#84afa3"},
            {"lightness": 52}]
    },
    {
        "stylers": [
            {"saturation": -77}]
    },
    {
        "featureType": "road"
    }
];

// Declaring global variables
var marker, i;

// Creating the Marker Array 
var markerArray = [];

// Function that generates individual map markers
function createMarker(data) {
    var marker = new google.maps.Marker({

        // Setting the Lat and Long to our data position values   
        position: new google.maps.LatLng(mapMarkers[data].position[0], mapMarkers[data].position[1]),
        map: map,

        // Setting initial animation on the marker
        animation: google.maps.Animation.DROP,

        // Setting the Google maps icon to our (type specific) data imgSrc image
        icon: new google.maps.MarkerImage(mapMarkers[data].imgSrc, new google.maps.Size(50,70)),
        draggable: false,
        title: mapMarkers[data].name    
    });

    // When a map marker is clicked on it triggers the markerEvents function, 
    // the function stores the mapMarker’s name in the linkName variable that is used by 
    // the loadWikiLinks and loadplaceTitle function. LoadWikiLinks function opens a window containing Wikipedia 
    // links for selected spot. LoadStreetView function takes the marker’s address, stored in the linkAddress 
    // variable, as an argument and displays a Google street view image below the  Wikipedia links. 
    // The LoadplaceTitle appends the name of the marker on the top of the info window.
    google.maps.event.addListener(marker, 'click', function markerEvents() {   
        linkName = mapMarkers[data].name;
        linkAddress = mapMarkers[data].address;
        loadWikiLinks();
        loadStreetView();
        loadplaceTitle();
        infowindow.open(map, marker);

        // Adding an animation when user clicks on the individual marker, 
        // the marker will bounce until user clicks on it again or after a period of time
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        // Setting a function that stops the marker from bouncing after a period of time
        var bounceTimeout = setTimeout(function(){
        marker.setAnimation(null);
        }, 4000);
    });
    
    // Ads every marker to the markerArray 
    markerArray[data] = marker;
    // Returns every generated marker
    return marker;  
    }

// Setting the variable infoContent to be the contents of wikipedia-container, 
// infoContent is used by Google Map infowindow
var infoContent = document.getElementById("wikipedia-container");

var infowindow;


// Function is called on Google Map api successful callback 
function onGoogleLoad(){

    // Creating Google infowindow and setting the content to above 
    // created variable infoContent
    infowindow = new google.maps.InfoWindow({
    content: infoContent
    });

    // Function for generating Google Map
    function displayGoogleMaps() {

        // Setting the map Lat and Long to Zagreb coordinates
        var latLng = new google.maps.LatLng(position[0], position[1]);

        // Setting map options-> how the map will look like
        var mapOptions = {
            zoom: 13, // initialize zoom level - the max value is 21
            streetViewControl: false, // hide the yellow Street View pegman
            scaleControl: true, // allow users to zoom the Google Map
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: latLng,
            styles: mapStyle // uses custom array mapStyle to change the style of the map
        };
    
        // Binds the Goggle Map to the “googlemaps” div in html
        map = new google.maps.Map(document.getElementById('googlemaps'),
            mapOptions);
 
        // Loops through all the mapMarkers array of objects, and creates 
        // a marker on the map for each one
        for (var i = 0; i < mapMarkers.length; i++) {
            createMarker(i);
        }
    }
    // Starts the function for generating the Google map and all markers 
    // on the initial load of the window 
    google.maps.event.addDomListener(window, 'load', displayGoogleMaps);
}

// Creating an array with initial value of “All”, array is used to store and 
// create options to choose from in the dropdown list containing types of amenities
var optionValuesArray = ["All"];

// variable used to store the last value of mapMarker type out of the for loop
var lastMapMarker = 0;

// Loops through all mapMarkers if the type of the marker is not present it pushes the 
// type into the otionValuesArray that is used to populate the dropdown list
for (var i = 0; i < mapMarkers.length; i++) {
    if ((mapMarkers[i].type !== lastMapMarker)){
        optionValuesArray.push(mapMarkers[i].type);
    }
    // Stores the current value of mapMarket type into the lastMapMarker variable
    lastMapMarker = mapMarkers[i].type;
}

// Sets map on all the markers in the markerArray
function setMapOnAll(map) {
    for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(map);
    }
}

// Uses setMapOnAll function to loop through all the markers in markerArray and 
// sets the value of map to null
// This removes all the current markers of the map 
function clearMarkers() {
    setMapOnAll(null);
}

// Function that creates the title of the Google info window and tells the user 
// the name of the marker/place they have selected, this function is called when 
// a marker is clicked
function loadplaceTitle(){
    var $placeTitleElem = $('#placeTitle');
    $placeTitleElem.text("");
    $placeTitleElem.text('You are at ' + linkName + '');
}

// Function that loads a street view of the marker/place the user has clicked on. 
// It uses the linkAddress created on marker click as a variable for Google street view api.
function loadStreetView(){
    var $streetViewElem = $('#streetViewWindow');
    var streetview = "";
    $streetViewElem.empty();
    // Replace all the spaces with +
    var place = linkAddress.replace(/ /g, "+");
    streetView = "https://maps.googleapis.com/maps/api/streetview?size=250x140&location=" + place;
    // Append the image generated by api to the streetViewWindow, used in Google info window
    $streetViewElem.append('<img src="' + streetView + '">');
}

// Function that changes the visibility of Wikipedia Link’s window to show on screen, 
// sends request to Wikipedia website with the name of the marker or list item that is 
// clicked. It then displays links supplied by Wikipedia 
function loadWikiLinks() {
    // Make the #wikipedia-container visible on screen
    $('#wikipedia-container').css('visibility','visible');
    // Use the markerName variable to store variable with a name from either the list of 
    // spots or markers on the map
    var markerName = linkName;
    
    var $wikiElem = $('#wikipedia-links');

    // Clear the old text from the window
    $wikiElem.empty();
    $wikiElem.contents().remove();
    
    // Stores the url used for ajax request using the MarkerName variable
    var wikiU = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + markerName + "&format=json&callback=wikiCallback";
    
    // Handles errors by displaying a message if wikipedia website does not respond after a set
    // period of time
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia resources");
    }, 8000);

    
    // Ajax request: if successful starts a function that loads the wikipedia generated links 
    $.ajax({
        url: wikiU,
        dataType: "jsonp",
        success: function(response) {

        var articleList = response[1];

        // If there are no wikipedia links it displays a message saying there are none
        if (articleList.length === 0) {
                $wikiElem.append('<p>This spot has no wiki articles</p>');
        }

        // Loops through the articleList array and puts each link in a list in the 
        // Wikipedia Links window
        for(var i = 0; i < articleList.length; i++){
            var articleStr = articleList[i];
            var url = "http://en.wikipedia.org/wiki/" + articleStr;
            $wikiElem.append('<li><a href = "'+ url +'">'+articleStr+'</a></li>');
        }
        clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
}

//ViewModel uses knockout to listen to changes user makes on the app
var ViewModel = function() {
    var self= this;

    // Function used to generate the list of all the map markers, 
    // stores the individual marker’s name and type
    self.mark = function(data){
        this.name = ko.observable(data.name);
        this.type = ko.observable(data.type);
    };

    //Populates the list of all amenities on the map using the Mark function, 
    //list contains names of the amenities stored as title in markerArray 
    this.markerList = ko.observableArray("");
    mapMarkers.forEach(function(markerItem) {
        self.markerList.push(new self.mark(markerItem));
    });

    // Array of items used by autocomplete function created from markerList array
    var availableTags = [];
    for(i in self.markerList()){
        if (self.markerList().hasOwnProperty(i)){
            availableTags.push(self.markerList()[i].name());
        }   
    }

    // Filters the markers displayed on the map leaving just the one the user 
    // selected from the list of marker names
    this.filterThisLocation = function(markerItem) {
        // Remove all the markers from the map
        clearMarkers();

        // Loop through the markerArray, if the marker’s title is equal to 
        // the seleted name from the list, display that marker on the map
        for (var i = 0; i < markerArray.length; i++) {
            if(markerItem.name() === markerArray[i].title){
                createMarker(i);
            } 
        }
    };

    this.searchedMarkerName = ko.observable("");

    // Filtering function activated when user searches 
    // through text input, on pressing the <Search>button 
    // or <ENTER>  Shows only searched place on map and in the 
    // list of maker/place names. If the input is not a name of 
    // the marker a message is displayed saying “This place 
    // is not currently maped!”
    this.filterSearchedLocation = function() {   
        that = this;
        // Remove all the markers from the map
        clearMarkers();

        // Remove the existing message text ("This place is not currently maped!")
        document.getElementById("message").innerHTML = "";

        // Variables used to check if the if conditions are met and to 
        // then display a message or not
        var emptySearch = 1;
        var populateList = "All";

        // Loop through the markerArray, if the marker’s title is equal to 
        // the searched name, display that marker on the map and remove all 
        // the map markers names from the list of names
        for (var i = 0; i < markerArray.length; i++) {
            if(this.searchedMarkerName() === markerArray[i].title){
                createMarker(i);
                emptySearch = 0;
                populateList = 1;
                // remove all the map markers names from the list of names
                mapMarkers.forEach(function(markerItem) {
                    self.markerList.pop();
                });
            }        
        }

        // Go through all the mapMarkers, if the name is same as the searched name, 
        // put that name on the list of marker names
        mapMarkers.forEach(function(markerItem) {
            if(markerItem.name === that.searchedMarkerName()){
                self.markerList.push(new self.mark(markerItem));
            }
        });

        // If the searched input is not equal to any marker name the variable empty search 
        // will be set to 1 in the first if statement above. A message is displayed.
        if(emptySearch === 1){
            document.getElementById("message").innerHTML = "This place is not currently maped!";
            emptySearch = 0;  
        }
    };

    // Seting the optionValues, used by the dropdown list, to the 
    // optionValuesArray created in the global scope 
    this.optionValues = optionValuesArray;

    // Selection from the list is monitored by knockout and used for 
    // filtering the markers and the list
    this.selectedOptionValue = ko.observable("");

    var lastMapMarkerType = "All";
    // Filtering function activated when user clicks on the list and item on it, 
    // passes the selected item as an argument, this filter will display all the 
    // markers and list items of the same type (park, food, sport or culture)
    this.filterAllOfType = function(item) {
        // Check if the selected type is not equal to lastMarkerType
        if ((item.selectedOptionValue() !== lastMapMarkerType)) {
            // If true remove all the markers from the map
            clearMarkers();
            // If true remove all the items from the list
            mapMarkers.forEach(function(markerItem) {
                self.markerList.pop();
            });

            // Go through all the mapMarkers, if the type is the same as the 
            // selected type, create a list item for that marker
            mapMarkers.forEach(function(markerItem) {
                if (item.selectedOptionValue()=== markerItem.type){
                    self.markerList.push(new self.mark(markerItem));
                }
                // If the selected type from the dropdown list is "All", 
                // create all of the original list items
                else if(item.selectedOptionValue() === "All") {
                    self.markerList.push(new self.mark(markerItem)); 
                }   
            });
            
            // Go through all the mapMarkers, if the type is the same as the 
            // selected type, create all the markers of this type on the map
            for (var i = 0; i < mapMarkers.length; i++) {
                if(item.selectedOptionValue() === mapMarkers[i].type) {
                    createMarker(i);
                }
                //If the selected type from the dropdown list is ALL, 
                // create all of the original markers on the map
                else if(item.selectedOptionValue() === "All") {
                       createMarker(i); 
                }
            }
            lastMapMarkerType = item.selectedOptionValue();
        }
    };

    // Autocomplete function for the text input filter, allows 
    // the user to select from the list of names in a dropdown list
    $(function() {
        $( "#autoComplete" ).autocomplete({
            source: availableTags
        });
    });
};
// Apply knockout bindings to the ViewModel
ko.applyBindings(new ViewModel());
