import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import "react-leaflet-geosearch/lib/react-leaflet-geosearch.css";

function MapSearch (props) {
    const map = useMap();

    function searchEventHandler(result) {
        //Need these 3; x is lon, y is lat, and label you can either ignore or replace it with the location bar in the form.
        // console.log(result.location.label);
        props.setLon(result.location.x);
        props.setLat(result.location.y);
      }

    useEffect(() => {
        const searchControl = new GeoSearchControl({
            provider: props.provider,
            ...props
        });
        map.addControl(searchControl);
        map.on('geosearch/showlocation', searchEventHandler) //Event listener for when a search is made.
        return () => map.removeControl(searchControl);
    }, [props]);
    return null;
};

export default MapSearch;
