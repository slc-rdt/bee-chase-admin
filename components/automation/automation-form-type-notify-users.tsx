import React, { ComponentProps, ComponentType } from "react";
import { UseFormRegister } from "react-hook-form";
import { AutomationFormValues } from "./automation-form";

interface IAutomationFormTypeNotifyUsers {
  register: UseFormRegister<AutomationFormValues>;
  isLoading: boolean;
}

const AutomationFormTypeNotifyUsers: ComponentType<
  ComponentProps<"div"> & IAutomationFormTypeNotifyUsers
> = ({ register, isLoading, ...rest }) => {
  return (
    <div className="form-control" {...rest}>
      <label className="label">
        <span className="label-text">Message</span>
      </label>

      <textarea
        {...register("automation_data.message")}
        disabled={isLoading}
        className="textarea textarea-bordered h-24"
        placeholder="Enter your message here..."
        required
      ></textarea>

      <label className="label">
        <span className="label-text-alt">
          Enter the message you would like to send to all participants.
        </span>
      </label>
    </div>
  );
};

export default AutomationFormTypeNotifyUsers;
