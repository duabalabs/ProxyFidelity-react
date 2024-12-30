import type { FC, PropsWithChildren } from "react";

import { TransactionFormModal } from "./components/transaction-form-modal";

export const TransactionEditPage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <TransactionFormModal action="edit" />
      {children}
    </>
  );
};
