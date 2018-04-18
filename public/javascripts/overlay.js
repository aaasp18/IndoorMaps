var polygon;
var canvas;
var beingDragged = false;
var finalCoordinates;

function getFinalCoordinates(){
    return finalCoordinates;
}

function showFloorplanWithMarkersForLevel(level){
    //TODO: add part to display POIs
    var image = new Image();
    // nocache path param to prevent loading cached image
    getFloorplanInfo(function(result){
        floorplanInfo = result.floorplans;        
        image.src = floorplanInfo[level].imageFilepath+'?nocache='+(new Date().getTime());
        document.getElementById('loader').style.display = "block";
        var coordinates = {
            sw: floorplanInfo[level].sw,
            se: floorplanInfo[level].se,
            nw: floorplanInfo[level].nw,
            ne: floorplanInfo[level].ne
        };
        var bearingY = LatLon(coordinates.nw.lat, coordinates.nw.lng).bearingTo(LatLon(coordinates.sw.lat, coordinates.sw.lng));
        var bearingX = LatLon(coordinates.nw.lat, coordinates.nw.lng).bearingTo(LatLon(coordinates.ne.lat, coordinates.ne.lng));
        google.maps.event.clearListeners(image, 'load');
        google.maps.event.addDomListener(image,'load',function(){
            console.log("Image load listener called");
            document.getElementById('loader').style.display = "none";
            canvas = new FPOverlay( 
                image, 
                map,
                {x: bearingX, y: bearingY},
                {sw: coordinates.sw, nw: coordinates.nw, ne: coordinates.ne, se: coordinates.se}
            );
        });
    });
        
}

function editFloorplan(imageFile, coordinates){

    if(canvas){
        console.log("before clear canvas not null");
    }
    // clearFloorPlan();
    if(canvas){
        console.log("canvas not null");
    }
    console.log("editFloorplan() function called");
    //console.log("filepath " + imageFilepath);

    var image = new Image();
    //image.src = imageFilepath;

    var reader = new FileReader();
    reader.onload = function (e) {
        image.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);

    polygon =  new google.maps.Polygon({
        fillColor: 'white',
        strokeWeight: 1,
        strokeColor: "#BC1D0F",
        map: null,
        path: [],
        draggable: false,
        editable: true
    });
  
    polygon.addListener('dragstart', function(){
        // polygon was dragged
        beingDragged = true;
    });
  
    polygon.addListener('dragend', function(){
        // Polygon was dragged
        beingDragged = false;
        // google.maps.event.trigger(poly.getPath(),'set_at');
    });

    google.maps.event.addListener(polygon, 'click', function () {
        // polygon.setEditable(true);
    });
  
    google.maps.event.addListener(map, 'click', function () {
        // polygon.setEditable(false);
    });

    var bearingY = LatLon(coordinates.nw.lat, coordinates.nw.lng).bearingTo(LatLon(coordinates.sw.lat, coordinates.sw.lng));
    var bearingX = LatLon(coordinates.nw.lat, coordinates.nw.lng).bearingTo(LatLon(coordinates.ne.lat, coordinates.ne.lng));
    var distanceY = LatLon(coordinates.nw.lat, coordinates.nw.lng).distanceTo(LatLon(coordinates.sw.lat, coordinates.sw.lng));
    var distanceX = LatLon(coordinates.nw.lat, coordinates.nw.lng).distanceTo(LatLon(coordinates.ne.lat, coordinates.ne.lng));
    var se = LatLon(coordinates.ne.lat, coordinates.ne.lng).destinationPoint(bearingY, distanceY);
    var path = [coordinates.sw, coordinates.nw, coordinates.ne, {lat: se.lat, lng: se.lon}];

    finalCoordinates = {sw: coordinates.sw, nw: coordinates.nw, ne: coordinates.ne, se: {lat: se.lat, lng: se.lon}};
        
    var bounds = new google.maps.LatLngBounds(
        // Lower Bound
        new google.maps.LatLng(Math.min(se.lat, coordinates.sw.lat),
        // Left Bound
        Math.min(coordinates.sw.lng, coordinates.nw.lng)),
        // Upper Bound
        new google.maps.LatLng(Math.max(coordinates.ne.lat, coordinates.nw.lat),
        // Right Bound
        Math.max(se.lon, coordinates.ne.lng))
    );

    map.setCenter(bounds.getCenter());
 
    polygon.setOptions({path: path, map: map});

    polygon.getPaths().forEach(function(iPath, index){

        google.maps.event.addListener(iPath, 'insert_at', function(){
            // New point
            console.log("insert_at called");
            console.log("Length: "+this.length);
        });

        google.maps.event.addListener(iPath, 'remove_at', function(){
            // Point was removed
            console.log("remove_at called");
        });

        google.maps.event.addListener(iPath, 'set_at', function(){
            // Point was moved
            if(!beingDragged){
                console.log("set_at called");
                console.log("Length: "+this.length);
 
                swLatLon = LatLon(this.getAt(0).lat(), this.getAt(0).lng());
                nwLatLon = LatLon(this.getAt(1).lat(), this.getAt(1).lng());
                neLatLon = LatLon(this.getAt(2).lat(), this.getAt(2).lng());

                var iBearingY = nwLatLon.bearingTo(swLatLon);
                var iBearingX = nwLatLon.bearingTo(neLatLon);
                var iDistanceY = nwLatLon.distanceTo(swLatLon);
                var iDistanceX = nwLatLon.distanceTo(neLatLon);
                var seLatLon = neLatLon.destinationPoint(iBearingY, iDistanceY);


                //this.setAt(3,new google.maps.LatLng(seLatLon.lat,seLatLon.lon)); // ends up triggering the set_at listener infinitely

                var iPath = {
                    sw: {lat: swLatLon.lat, lng: swLatLon.lon},
                    nw: {lat: nwLatLon.lat, lng: nwLatLon.lon},
                    ne: {lat: neLatLon.lat, lng: neLatLon.lon},
                    se: {lat: seLatLon.lat, lng: seLatLon.lon}
                };


                finalCoordinates = iPath;

                canvas.setMap(null);

                canvas = new FPOverlay(
                    image, 
                    map,
                    {x: iBearingX, y: iBearingY},
                    {sw: iPath.sw, nw: iPath.nw, ne: iPath.ne, se: iPath.se}
                );
            }
        });
    });

    google.maps.event.addDomListener(image,'load',function(){
        console.log("Image load listener called");
        canvas = new FPOverlay( 
            image, 
            map,
            {x: bearingX, y: bearingY},
            {sw: path[0], nw: path[1], ne: path[2], se: path[3]}
        );
    });
}

function clearFloorPlan(){
    if(canvas){
        canvas.setMap(null);
        canvas = null;
    }
    if(polygon){
        polygon.setMap(null);
        polygon = null;
    }
}

function setPolygonEditable(state){
    if(typeof state !== 'boolean'){
        return;
    }
    if(polygon){
        polygon.setEditable(state);
    }
}