import type { FC, PropsWithChildren } from "react";

import { TransactionFormModal } from "./components/transaction-form-modal";

export const TransactionCreatePage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <TransactionFormModal action="create" />
      {children}
    </>
  );
};
