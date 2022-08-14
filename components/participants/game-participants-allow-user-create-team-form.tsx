import React, { ComponentProps, ComponentType } from "react";

interface IGameParticipantsAllowUserCreateTeamForm

const GameParticipantsAllowUserCreateTeamForm: ComponentType<
  ComponentProps<"section">
> = () => {
  return (
    <section className="form-control my-4">
      <label className="label cursor-pointer justify-start gap-2">
        <input type="checkbox" className="checkbox checkbox-primary" />
        <span className="label-text">
          Allow participants to create their own teams
        </span>
      </label>

      <label className="label">
        <span className="label-text">
          If disabled, you will need to pre-create all the teams for this Game.
        </span>
      </label>
    </section>
  );
};

export default GameParticipantsAllowUserCreateTeamForm;
