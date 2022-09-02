import { ComponentProps, ComponentType } from "react";
import { createPortal } from "react-dom";

interface IModal {
  modalKey: string;
  title?: string;
}

const Modal: ComponentType<ComponentProps<"div"> & IModal> = ({
  modalKey,
  title,
  children,
  className,
  ...rest
}) => {
  const modal = (
    <>
      <input type="checkbox" id={modalKey} className="modal-toggle" />

      <div className={`modal ${className}`} {...rest}>
        <div className="modal-box">
          {title && <h3 className="text-lg font-bold">{title}</h3>}
          {children}
        </div>
      </div>
    </>
  );

  if (typeof window !== "undefined") {
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) {
      return createPortal(modal, modalContainer);
    }
  }

  return modal;
};

export default Modal;
