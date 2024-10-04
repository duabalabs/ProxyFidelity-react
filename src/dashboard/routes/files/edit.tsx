import type { FC, PropsWithChildren } from "react";

import { FilesFormModal } from "./components";

export const FilesEditPage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <FilesFormModal action="edit" />
      {children}
    </>
  );
};
