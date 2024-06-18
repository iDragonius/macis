import React, { FC, ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

export const PageTitle: FC<PageTitleProps> = ({ children }) => {
  return <h1 className={"text-[32px] font-semibold"}> {children} </h1>;
};
