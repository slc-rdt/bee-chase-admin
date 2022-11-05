import React, { ComponentProps, ComponentType } from "react";
import {
  CameraIcon,
  DocumentTextIcon,
  ListBulletIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { AnswerTypes } from "../../libs/enums";
import Mission from "../../libs/models/mission";

interface IMissionIcon {
  mission: Mission;
}

const MissionIcon: ComponentType<ComponentProps<"span"> & IMissionIcon> = ({
  mission,
  ...rest
}) => {
  return (
    <span {...rest}>
      {
        {
          [AnswerTypes.IMAGE]: <CameraIcon className="h-6 w-6" />,
          [AnswerTypes.TEXT]: <DocumentTextIcon className="h-6 w-6" />,
          [AnswerTypes.GPS]: <MapPinIcon className="h-6 w-6" />,
          [AnswerTypes.MULTIPLE_CHOICE]: <ListBulletIcon className="h-6 w-6" />,
          [AnswerTypes.VERIFICATION]: <ShieldCheckIcon className="h-6 w-6" />,
        }[mission.answer_type]
      }
    </span>
  );
};

export default MissionIcon;
