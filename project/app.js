//API ESRI

require(["esri/Map", "esri/views/MapView","esri/layers/FeatureLayer","esri/symbols/SimpleMarkerSymbol","esri/widgets/Legend", "esri/widgets/LayerList","esri/widgets/BasemapToggle", "esri/widgets/Search"], 
  function (Map, MapView, FeatureLayer, _SimpleMarkerSymbol, Legend, LayerList, BasemapToggle, Search) {

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
         color:"yellow",
         size:"16px",
         outline:{    
             color: [0,100,0], //green
             width:2
         }
     };

     let symbolRestaurant = {
        type: "simple-marker",
        style: "triangle",
        color:"red",
        size:"16px",
        outline:{
            color: [0,0,255],
            width:2
        }
    };

    //renderer
    const display = {
        type: "unique-value", 
        field:"type",  //pharmacy/restaurant
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



    //widget legend
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
      viewMap.ui.add(legenda, "bottom-left");


    //layer list
      const straturiTematice = new LayerList({
        view: viewMap
      });
      viewMap.ui.add(straturiTematice, "top-right");



    //Popup
    //template for interest points
    let sablonPopUpRestaurantFarmacie = {
      title: "Punct de interes {type}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "type",
              label: "Tip punct de interes"
            },
            {
              fieldName: "name",
              label: "Denumire punct de interes"
            }
          ]
        }
      ]
    };
    flPoints.popupTemplate = sablonPopUpRestaurantFarmacie;
  
    //template for regions
    let sablonPopUpRegiuni = {
      title: "Regiunea {reg_name}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "reg_name",
              label: "Denumire regiune"
            }
          ]
        }
      ]
    };
    flRegions.popupTemplate = sablonPopUpRegiuni;

     //list of sources
      let surseCautare = [
        {
          layer: flPoints,
          searchFields: ["name"],
          displayField: "name",
          exactMatch: false,
          outFields: ["*"], //all columns are returned
          name: "Cautare puncte de interes"
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

      //Search widget
      let cauta = new Search({
        view: viewMap,
        allPlaceholder: "Cauta restaurante, farmacii sau regiuni dupa denumire",
        sources: surseCautare
      });
      
      viewMap.ui.add(cauta, "top-left");

      //swap map types
      const galerieHarti = new BasemapToggle({
        view: viewMap,
        nextBasemap: "hybrid"
      });
      viewMap.ui.add(galerieHarti, "top-right");
  });