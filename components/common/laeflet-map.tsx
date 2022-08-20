import { LeafletEventHandlerFnMap, Map } from "leaflet";
import React, { ComponentProps, ComponentType, useRef } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

interface ILeafletMap {
  latitude: number;
  longitude: number;
  circleRadius?: number;
  onLatLngChange: (lat: number, lng: number) => void;
}

const LeafletMap: ComponentType<
  ComponentProps<typeof MapContainer> & ILeafletMap
> = ({ latitude, longitude, circleRadius, onLatLngChange, ...rest }) => {
  const leafletMapRef = useRef<Map | null>(null);

  const eventHandlers: LeafletEventHandlerFnMap = {
    drag: (e) => {
      const target = e.target as L.Marker;
      const { lat, lng } = target.getLatLng();
      onLatLngChange(lat, lng);
    },
  };

  return (
    <MapContainer
      ref={leafletMapRef}
      center={[latitude, longitude]}
      zoom={12}
      className="h-96"
      scrollWheelZoom
      {...rest}
    >
      <MapContainerEventListeners onLatLngChange={onLatLngChange} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {circleRadius && <Circle radius={circleRadius} center={[latitude, longitude]} />}

      <Marker
        position={[latitude, longitude]}
        eventHandlers={eventHandlers}
        draggable
      />
    </MapContainer>
  );
};

interface IMapContainerEventListeners {
  onLatLngChange: (lat: number, long: number) => void;
}

const MapContainerEventListeners: ComponentType<
  IMapContainerEventListeners
> = ({ onLatLngChange }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLatLngChange(lat, lng);
    },
  });

  return null;
};

export default LeafletMap;
