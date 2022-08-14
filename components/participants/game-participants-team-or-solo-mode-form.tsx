import React, { ComponentProps, ComponentType } from "react";

const GameParticipantsTeamOrSoloModeForm: ComponentType<
  ComponentProps<"section">
> = () => {
  return (
    <section className="form-control my-4 w-full">
      <label className="label">
        <span className="label-text">How would you like people to join?</span>
      </label>

      <div className="flex flex-wrap gap-4">
        <label className="label cursor-pointer gap-2">
          <input
            type="radio"
            name="radio-6"
            className="radio checked:bg-red-500"
            checked
          />
          <span className="label-text">In teams</span>
        </label>
        <label className="label cursor-pointer gap-2">
          <input
            type="radio"
            name="radio-6"
            className="radio checked:bg-blue-500"
            checked
          />
          <span className="label-text">Solo</span>
        </label>
      </div>

      <label className="label">
        <span className="label-text-alt">
          Participants collect points as teams, collaborating with others or as
          teams of one. You can pre-create teams below, or participants can make
          their own!
        </span>
      </label>
    </section>
  );
};

export default GameParticipantsTeamOrSoloModeForm;
