import type { IResourceItem } from "@refinedev/core";

import {
  CalendarOutlined,
  ContainerOutlined,
  CrownOutlined,
  DashboardOutlined,
  ProjectOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "events",
    list: "/calendar",
    create: "/calendar/create",
    edit: "/calendar/edit/:id",
    show: "/calendar/show/:id",
    meta: {
      label: "Calendar",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <CalendarOutlined />,
    },
  },
  {
    name: "tasks",
    list: "/tasks",
    create: "/tasks/create",
    edit: "/tasks/edit/:id",
    meta: {
      label: "Tasks",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <ProjectOutlined />,
    },
  },
  {
    name: "files",
    list: "/files",
    create: "/files/create",
    edit: "/files/edit/:id",
    show: "/files/show/:id",
    meta: {
      label: "Files",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <ContainerOutlined />,
    },
  },
  {
    name: "transaction",
    list: "/transaction",
    create: "/transaction/create",
    edit: "/transaction/edit/:id",
    show: "/transaction/show/:id",
    meta: {
      label: "Transaction",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <ContainerOutlined />,
    },
  },
  {
    name: "people",
    list: "/people",
    create: "/people/create",
    edit: "/people/edit/:id",
    show: "/people/show/:id",
    meta: {
      label: "People",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <ContainerOutlined />,
    },
  },
  {
    name: "administration",
    meta: {
      label: "Administration",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <CrownOutlined />,
    },
  },
  {
    name: "settings",
    list: "/administration/settings",
    meta: {
      label: "Settings",
      parent: "administration",
    },
  },
];
