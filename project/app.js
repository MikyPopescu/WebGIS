//API ESRI

require(["esri/Map", "esri/views/MapView","esri/layers/FeatureLayer","esri/symbols/SimpleMarkerSymbol","esri/widgets/Legend", "esri/widgets/LayerList","esri/widgets/BasemapToggle", "esri/widgets/Search"], 
  function (Map, MapView, FeatureLayer, SimpleMarkerSymbol,Legend, LayerList, BasemapToggle, Search) {

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

     //Symbols
     let symbolPharmacy = {
         type: "simple-marker",
         style: "square",
         color:"blue",
         size:"8px",
         outline:{
             color: [255,255,0],
             width:3
         }
     };

     let symbolRestaurant = {
        type: "simple-marker",
        style: "triangle",
        color:"red",
        size:"25px",
        outline:{
            color: [0,0,255],
            width:3
        }
    };

    

    const display = {
        type: "unique-value",
        field:"type",
        uniqueValueInfos:[{
            value:"restaurant",
            symbol: symbolRestaurant,
            label:"Restaurant"
        },
        {
        value:"pharmacy",
        symbol: symbolPharmacy,
        label:"Farmacie"
        }
    ]
    }





    let urlRegions = "https://services7.arcgis.com/eyYAdzn07jACFQSk/arcgis/rest/services/regions/FeatureServer/0"
    //add feature layer 
    let flRegions = new FeatureLayer({url: urlRegions, title:"Regiuni"});
    //add to map
   // myMap.add(flRegions);

    let urlPoints = "https://services7.arcgis.com/eyYAdzn07jACFQSk/arcgis/rest/services/italypoints/FeatureServer/0";
    let flPoints = new FeatureLayer({url: urlPoints, renderer: display, title: "Puncte de interes"});
    //myMap.add(flPoints);

    //add to map multiple feature layers 
    myMap.addMany([flRegions, flPoints]);

//Popup
    let sablonPopUpRestaurantFarmacie = {
        title: "{name}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "type",
                label: "Denumire punct"
              }
            ]
          }
        ]
      };
      flPoints.popupTemplate = sablonPopUpRestaurantFarmacie;
    
    let sablonPopUpRegiuni = {
        title: "{Regiune}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "reg_name",
                label: "Nume Regiune"
              }
            ]
          }
        ]
      };
      flRegions.popupTemplate = sablonPopUpRegiuni;

//legend
      const legenda = new Legend({
        view: viewMap,
        layerInfos: [
          {
            layer: flRegions
          },
          {
            layer: flPoints
          }
        ]
      });
      viewMap.ui.add(legenda, "bottom-right");

//straturi tematice
      const straturiTematice = new LayerList({
        view: viewMap
      });
      viewMap.ui.add(straturiTematice, "top-right");

      const galerieHarti = new BasemapToggle({
        view: viewMap,
        nextBasemap: "topo-vector"
      });
      viewMap.ui.add(galerieHarti, "top-right");


      //cautari
      var surseCautare = [
        {
          layer: flPoints,
          searchFields: ["name"],
          displayField: "name",
          exactMatch: false,
          outFields: ["name"],
          name: "Cautare restaurante/farmacii"
        },
       {
           layer: flRegions,
           searchFields: ["reg_name"],
           displayField: "Regiune",
           exactMatch: false,
           outFields: ["*"],
           name: "Cautare regiuni"
         }
      ];

      var cauta = new Search({
        view: viewMap,
        allPlaceholder: "Cauta restaurante,farmacii sau regiuni",
        sources: surseCautare
      });
      viewMap.ui.add(cauta, "top-left");
  });