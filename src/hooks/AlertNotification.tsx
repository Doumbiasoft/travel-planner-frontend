import React, { createContext, useContext, type ReactNode } from "react";
import { message } from "antd"; // Ensure you have antd imported
import { ENV } from "../config/env";

type AlertNotificationContextType = (msg: string, type: any) => void;

const AlertNotificationContext = createContext<
  AlertNotificationContextType | undefined
>(undefined);

interface AlertNotificationProviderProps {
  children: ReactNode;
}

export const AlertNotificationProvider: React.FC<
  AlertNotificationProviderProps
> = ({ children }) => {
  const [api, contextHolder] = message.useMessage();

  const openNotification: AlertNotificationContextType = (
    msg: string,
    type: any
  ) => {
    api
      .open({
        type, // success, info, warning, error
        content: msg,
      })
      .then((response) => {
        if (ENV.VITE_MODE === "development") {
          console.log(response);
        }
      });
  };

  return (
    <AlertNotificationContext.Provider value={openNotification}>
      {contextHolder}
      {children}
    </AlertNotificationContext.Provider>
  );
};

export const useAlertNotification = (): AlertNotificationContextType => {
  const context = useContext(AlertNotificationContext);
  if (!context) {
    throw new Error(
      "useAlertNotification must be used within a AlertNotificationProvider"
    );
  }
  return context;
};
