import Mission from "../models/mission";

export default interface CreateMissionDto extends Mission {
  availability: number;
}
