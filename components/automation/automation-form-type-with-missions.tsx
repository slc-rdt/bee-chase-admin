import { ComponentProps, ComponentType } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import Mission from "../../libs/models/mission";
import MissionCard from "../mission/card/mission-card";
import { AutomationFormValues } from "./automation-form";

interface IAutomationFormTypeWithMissions {
  register: UseFormRegister<AutomationFormValues>;
  watch: UseFormWatch<AutomationFormValues>;
  setValue: UseFormSetValue<AutomationFormValues>;
  missions: Mission[];
  isLoading: boolean;
}

const AutomationFormTypeWithMissions: ComponentType<
  ComponentProps<"div"> & IAutomationFormTypeWithMissions
> = ({ register, watch, setValue, missions, isLoading, ...rest }) => {
  const includedMissionIds = watch("automation_data.mission_ids") ?? [];

  const onCheck = (mission: Mission, isChecked: boolean) => {
    setValue(
      "automation_data.mission_ids",
      isChecked
        ? [...includedMissionIds, mission.id]
        : includedMissionIds.filter((id) => id !== mission.id)
    );
  };

  return (
    <section className="grid grid-cols-1 gap-4" {...rest}>
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          checked={includedMissionIds.includes(mission.id)}
          onCheck={(isChecked) => onCheck(mission, isChecked)}
          isLoading={isLoading}
          showAvailability
        />
      ))}
    </section>
  );
};

export default AutomationFormTypeWithMissions;
