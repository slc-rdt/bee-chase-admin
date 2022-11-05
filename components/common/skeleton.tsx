import React, { ComponentProps, ComponentType } from "react";

const Skeleton: ComponentType<ComponentProps<"div">> = ({
  className,
  ...rest
}) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-base-300 ${className}`}
      {...rest}
    />
  );
};

export default Skeleton;
