import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { ComponentProps, ComponentType } from "react";
import Modal from "./modal";

interface IConfirmationModal {
  modalKey: string;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmationModal: ComponentType<
  ComponentProps<"label"> & IConfirmationModal
> = ({ modalKey, onConfirm, isLoading, children, className, ...rest }) => {
  return (
    <>
      <label
        htmlFor={modalKey}
        className={`modal-button ${className}`}
        {...rest}
      >
        {children}
      </label>

      <Modal modalKey={modalKey} title="Are you sure to delete?">
        <section className="modal-action">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn btn-error gap-2 ${isLoading && "loading"}`}
          >
            <CheckCircleIcon className="h-5 w-5" />
            Yes
          </button>
          <label htmlFor={modalKey} className="btn btn-success gap-2">
            <XCircleIcon className="h-5 w-5" />
            No
          </label>
        </section>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
