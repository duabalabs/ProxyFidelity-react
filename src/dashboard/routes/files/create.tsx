import type { FC, PropsWithChildren } from "react";

import { FilesFormModal } from "./components";

export const FilesCreatePage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <FilesFormModal action="create" />
      {children}
    </>
  );
};
