//API ESRI

require(["esri/Map", "esri/views/MapView","esri/layers/FeatureLayer"], function (Map, MapView, FeatureLayer) {

    //obiect de tip harta
    let myMap = new Map({
      basemap: "topo-vector" //hybrid
    });

    //randare harta
    let viewMap = new MapView({
      container: "viewDiv",
      map: myMap,
      zoom: 6, //0-23
      center: [13, 43] // longitude, latitude
    });


    let urlRegions = "https://services7.arcgis.com/eyYAdzn07jACFQSk/arcgis/rest/services/regions/FeatureServer/0"
    //add feature layer 
    let flRegions = new FeatureLayer({url:urlRegions});
    //add to map
   // myMap.add(flRegions);

    let urlRestaurants = "https://services7.arcgis.com/eyYAdzn07jACFQSk/arcgis/rest/services/italypoints/FeatureServer/0";
    let flRestaurants = new FeatureLayer({url:urlRestaurants});
    //myMap.add(flRestaurants);

    //add to map multiple feature layers 
    myMap.addMany([flRegions,flRestaurants]);
  });