import clsx from "clsx";
import React from "react";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
};
