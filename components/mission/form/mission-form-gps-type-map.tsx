import { LeafletEventHandlerFnMap, Map } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { ComponentType, useRef } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { MissionFormValues } from "./mission-form";

interface IMissionFormGpsTypeMap {
  watch: UseFormWatch<MissionFormValues>;
  setValue: UseFormSetValue<MissionFormValues>;
}

const DEFAULT_LATITUDE = 51.505;
const DEFAULT_LONGITUDE = -0.09;

const MissionFormGpsTypeMap: ComponentType<IMissionFormGpsTypeMap> = ({
  watch,
  setValue,
}) => {
  const leafletMapRef = useRef<Map | null>(null);

  const originalLatitude = watch("mission_data.latitude");
  const originalLongitude = watch("mission_data.longitude");

  const invalidCoordinate = !originalLatitude || !originalLongitude;
  const hasNavigator = typeof navigator !== "undefined";

  const setFormLatLang = (lat: number, long: number) => {
    const reRenderOptions = {
      shouldValidate: true,
      shouldDirty: true,
    };

    setValue("mission_data.latitude", lat, reRenderOptions);
    setValue("mission_data.longitude", long, reRenderOptions);
  };

  if (invalidCoordinate && hasNavigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        leafletMapRef.current?.panTo({ lat: latitude, lng: longitude });
        setFormLatLang(latitude, longitude);
      },
      (err) => {
        toast.error(`${err.code}: ${err.message}`);
        console.error(err);
      }
    );
  }

  const eventHandlers: LeafletEventHandlerFnMap = {
    drag: (e) => {
      const target = e.target as L.Marker;
      const { lat, lng } = target.getLatLng();
      setFormLatLang(lat, lng);
    },
  };

  const latitude = originalLatitude ?? DEFAULT_LATITUDE;
  const longitude = originalLongitude ?? DEFAULT_LONGITUDE;

  return (
    <MapContainer
      ref={leafletMapRef}
      center={[latitude, longitude]}
      zoom={13}
      className="h-96"
      scrollWheelZoom
    >
      <MapContainerEventListeners setFormLatLang={setFormLatLang} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[latitude, longitude]}
        eventHandlers={eventHandlers}
        draggable
      ></Marker>
    </MapContainer>
  );
};

interface IMapContainerEventListeners {
  setFormLatLang: (lat: number, long: number) => void;
}

const MapContainerEventListeners: ComponentType<
  IMapContainerEventListeners
> = ({ setFormLatLang }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setFormLatLang(lat, lng);
    },
  });

  return null;
};

export default MissionFormGpsTypeMap;
