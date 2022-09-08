import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { OpenStreetMapProvider } from "react-leaflet-geosearch";
import MapSearch from "./MapSearch";

function DisplayMapSearch(props) {
    const prov = OpenStreetMapProvider();

    return (
      <MapContainer center={[30.498, 68.997]} zoom={6} style={{ height:"400px"}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapSearch
                provider={prov}
                showMarker={true}
                showPopup={false}
                popupFormat={({ query, result }) => result.label}
                maxMarkers={1}
                retainZoomLevel={false}
                animateZoom={true}
                autoClose={true}
                searchLabel={"Please, enter your location as accurately as possible."}
                keepResult={true}
                setLat={(lat) => props.setLat(lat)}
                setLon={(lon) => props.setLon(lon)}
            />
      </MapContainer>
    );
}

export default DisplayMapSearch;