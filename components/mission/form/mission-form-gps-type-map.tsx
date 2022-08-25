import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { MissionFormValues } from "./mission-form";

const LeafletMap = dynamic(() => import("../../common/laeflet-map"), {
  ssr: false,
});

interface IMissionFormGpsTypeMap {
  watch: UseFormWatch<MissionFormValues>;
  setValue: UseFormSetValue<MissionFormValues>;
}

const MissionFormGpsTypeMap: ComponentType<IMissionFormGpsTypeMap> = ({
  watch,
  setValue,
}) => {
  const latitude = watch("mission_data.latitude");
  const longitude = watch("mission_data.longitude");
  const radius = watch("mission_data.radius");

  const onLatLngChange = (lat: number, long: number) => {
    const reRenderOptions = {
      shouldValidate: true,
      shouldDirty: true,
    };

    setValue("mission_data.latitude", lat, reRenderOptions);
    setValue("mission_data.longitude", long, reRenderOptions);
  };

  return (
    <LeafletMap
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
