import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, isDarkMode }) => {
  return {
    transactionTableWrapper: {
      overflow: "auto",
    },
    transactionTableContainer: {
      borderRadius: "8px",
      border: `1px solid ${token.colorBorder}`,
    },
    transactionHeader: {
      background: isDarkMode ? "#1F1F1F" : "#FAFAFA",
      borderRadius: "8px 8px 0 0",
    },
    transactionHeaderDivider: {
      height: "24px",
      marginTop: "auto",
      marginBottom: "auto",
      marginInline: "0",
    },
    transactionHeaderColumn: {
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
    },
    transactionRowColumn: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
    },
    addNewTransactionItemButton: {
      color: token.colorPrimary,
    },
    labelTotal: {
      color: token.colorTextSecondary,
      width: "100%",
      display: "flex",
    },
  };
});
