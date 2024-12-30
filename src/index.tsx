import { Outlet, Route, Routes } from "react-router-dom";

import { ErrorComponent, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";

import { FullScreenLoading, Layout } from "./components";
import { useParseConnect } from "./hooks";
import { IParseServerAPICred } from "./lib/parse";
import { authProvider, dataProvider } from "./providers";
import { resources } from "./resources";
import { SettingsPage } from "./routes/administration";
import {
  CalendarCreatePage,
  CalendarEditPage,
  CalendarPageWrapper,
  CalendarShowPage,
} from "./routes/calendar";
import { DashboardPage } from "./routes/dashboard";
import {
  DocumentListPage,
  FilesCreatePage,
  FilesEditPage,
  GalleryListPage,
} from "./routes/files";
import { ForgotPasswordPage } from "./routes/forgot-password";
import { LoginPage } from "./routes/login";
import { RegisterPage } from "./routes/register";
import {
  TransactionCreatePage,
  TransactionEditPage,
  TransactionListPage,
} from "./routes/transaction";
import { UpdatePasswordPage } from "./routes/update-password";

const Dashboard: React.FC = () => {
  const parseConfig: IParseServerAPICred = {
    serverURL: import.meta.env.VITE_PARSE_SERVER_URL,
    appId: import.meta.env.VITE_PARSE_APP_ID,
    javascriptKey: import.meta.env.VITE_PARSE_JAVASCRIPT_KEY,
  };
  console.log(parseConfig);
  const { loadingParse: initialLoad } = useParseConnect(parseConfig);
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.

  if (initialLoad) {
    return <FullScreenLoading />;
  }

  return (
    <Refine
      authProvider={authProvider}
      dataProvider={dataProvider}
      // liveProvider={liveProvider}
      routerProvider={routerProvider}
      resources={resources}
      notificationProvider={useNotificationProvider}
      options={{
        liveMode: "off",
        syncWithLocation: false,
        warnWhenUnsavedChanges: false,
      }}
    >
      <Routes>
        <Route
          element={
            <Authenticated
              key="authenticated-layout"
              fallback={<CatchAllNavigate to="/login" />}
            >
              <Layout>
                <Outlet />
              </Layout>
            </Authenticated>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route
            path="/calendar"
            element={
              <CalendarPageWrapper>
                <Outlet />
              </CalendarPageWrapper>
            }
          >
            <Route index element={null} />
            <Route path="show/:id" element={<CalendarShowPage />} />
            <Route path="edit/:id" element={<CalendarEditPage />} />
            <Route path="create" element={<CalendarCreatePage />} />
          </Route>
          <Route path="/files">
            <Route
              path="documents"
              element={
                <DocumentListPage>
                  <Outlet />
                </DocumentListPage>
              }
            >
              <Route
                path="create"
                element={
                  <FilesCreatePage>
                    <Outlet />
                  </FilesCreatePage>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <FilesEditPage>
                    <Outlet />
                  </FilesEditPage>
                }
              />
            </Route>
            <Route
              path="gallery"
              element={
                <GalleryListPage>
                  <Outlet />
                </GalleryListPage>
              }
            >
              <Route
                path="create"
                element={
                  <FilesCreatePage>
                    <Outlet />
                  </FilesCreatePage>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <FilesEditPage>
                    <Outlet />
                  </FilesEditPage>
                }
              />
            </Route>
          </Route>
          <Route
            path="/transaction"
            element={
              <TransactionListPage>
                <Outlet />
              </TransactionListPage>
            }
          >
            <Route
              path="create"
              element={
                <TransactionCreatePage>
                  <Outlet />
                </TransactionCreatePage>
              }
            />
            <Route
              path="edit/:id"
              element={
                <TransactionEditPage>
                  <Outlet />
                </TransactionEditPage>
              }
            />
          </Route>

          <Route path="/administration" element={<Outlet />}>
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<ErrorComponent />} />
        </Route>
        <Route
          element={
            <Authenticated key="authenticated-auth" fallback={<Outlet />}>
              <NavigateToResource resource="dashboard" />
            </Authenticated>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Route>
      </Routes>
      <UnsavedChangesNotifier />
      <DocumentTitleHandler />
    </Refine>
  );
};

export default Dashboard;
