import { ComponentProps, ComponentType } from "react";

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
  return (
    <>
      <input type="checkbox" id={modalKey} className="modal-toggle" />

      <div className={`modal ${className}`} {...rest}>
        <div className="modal-box relative">
          {title && <h3 className="text-lg font-bold">{title}</h3>}
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
