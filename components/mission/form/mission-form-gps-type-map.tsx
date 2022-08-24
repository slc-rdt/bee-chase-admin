import { Map } from "leaflet";
import dynamic from "next/dynamic";
import { ComponentType, useRef } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { MissionFormValues } from "./mission-form";

const LeafletMap = dynamic(() => import("../../common/laeflet-map"), {
  ssr: false,
});

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
  const radius = watch("mission_data.radius");

  const invalidCoordinate = !originalLatitude || !originalLongitude;
  const hasNavigator = typeof navigator !== "undefined";

  const onLatLngChange = (lat: number, long: number) => {
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
        onLatLngChange(latitude, longitude);
      },
      (err) => {
        toast.error(`${err.code}: ${err.message}`);
        console.error(err);
      }
    );
  }

  const latitude = originalLatitude ?? DEFAULT_LATITUDE;
  const longitude = originalLongitude ?? DEFAULT_LONGITUDE;

  return (
    <LeafletMap
      ref={leafletMapRef}
      latitude={latitude}
      longitude={longitude}
      circleRadius={radius}
      onLatLngChange={onLatLngChange}
      scrollWheelZoom
      draggable
    />
  );
};

export default MissionFormGpsTypeMap;
