import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileSearchOutlined,
  DashboardOutlined,
  SettingOutlined,
  PoweroffOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Dropdown, type MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { useMediaQuery } from "../hooks/useMediaQuery";
import logo from "../assets/images/travel-planner-vertical-logo.png";
import { X } from "lucide-react";
const { Header, Sider, Content } = Layout;

// Type definitions for menu items and options
type MenuItem = Required<MenuProps>["items"][number];
type MenuOptions = {
  menu: MenuItem[];
  defaultOpen: string[];
  selectedKeys: string[];
};

/**
 * Helper function to create a menu item
 * @param label - Display text for the menu item
 * @param key - Unique key for the menu item
 * @param icon - Icon to display with the menu item
 * @param children - Submenu items
 * @returns MenuItem object
 */
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const getMenuConfigurations = () => ({
  user: {
    menu: [
      getItem("Dashboard", "/dashboard", <DashboardOutlined />),
      getItem("Search", "/search", <FileSearchOutlined />),
      getItem("Settings", "/settings", <SettingOutlined />),
      getItem("Contact Us", "/contact", <MailOutlined />),
      getItem("Logout", "/signin", <PoweroffOutlined />),
    ],
    defaultOpen: [],
  },
  admin: {
    menu: [],
    defaultOpen: [],
  },
});

const MainLayout: React.FC = () => {
  const isMobile = useMediaQuery(768);
  const [collapsed, setCollapsed] = useState(isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const portal = location.pathname.split("/")[1];
  const { user, logout } = useAuth();

  const getSelectedKeys = (pathname: string): string[] => {
    if (pathname.startsWith(`/dashboard`)) {
      return [`/dashboard`];
    }
    return [pathname];
  };

  const menuConfigs = getMenuConfigurations();
  const configInit =
    menuConfigs[portal as keyof typeof menuConfigs] || menuConfigs.user;
  const [menuOptions, setMenuOptions] = useState<MenuOptions>({
    menu: configInit.menu,
    defaultOpen: configInit.defaultOpen,
    selectedKeys: getSelectedKeys(location.pathname),
  });

  useEffect(() => {
    const menuConfigs = getMenuConfigurations();
    const config =
      menuConfigs[portal as keyof typeof menuConfigs] || menuConfigs.user;
    setMenuOptions({
      menu: config.menu,
      defaultOpen: config.defaultOpen,
      selectedKeys: getSelectedKeys(location.pathname),
    });
  }, [location.pathname, portal]);

  const routeTo = (path: string) => {
    navigate(path);
  };

  // Auto-collapse sidebar based on screen size
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);
  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key.split("/")[1] === "signin") {
      await logout();
    }
    routeTo(key);
    // Auto-collapse sidebar on mobile after menu click
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const {
    token: { colorBgContainer /*borderRadiusLG*/ },
  } = theme.useToken();

  const renderLogo = () => (
    <div className=" flex flex-col w-full pt-5 pb-2 border-b border-amber-200 mb-3">
      <div className="flex items-end justify-end w-full">
        {isMobile && (
          <div
            className="flex flex-col w-fit mb-3 mr-3 bg-[#fbde68] rounded-full"
            onClick={() => {
              if (isMobile) {
                setCollapsed(true);
              }
            }}
          >
            <X
              size={32}
              className="text-black cursor-pointer hover:text-white w-fit"
            />
          </div>
        )}
      </div>

      <div className="flex flex-row w-full items-center justify-center">
        <img src={logo} alt="Travel Planner logo" className="h-9" />
        <span className="font-bold text-xl text-white">
          {collapsed ? "" : "Travel Planner"}
        </span>
      </div>
    </div>
  );
  const userMenuItems: MenuProps["items"] = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => {
        if (isMobile) {
          setCollapsed(true);
        }
        navigate("/settings");
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <PoweroffOutlined />,
      label: "Logout",
      onClick: async () => {
        if (isMobile) {
          setCollapsed(true);
        }
        await logout();
        navigate("/signin");
      },
      danger: true,
    },
  ];

  const renderUserProfile = () => (
    <Dropdown
      menu={{ items: userMenuItems }}
      trigger={["click", "hover"]}
      placement="bottomRight"
      overlayStyle={{ borderRadius: "6px" }}
    >
      <div className="flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-all">
        <span className="text-sm sm:text-base ">
          {user?.firstName} {user?.lastName}
        </span>
        {user?.isOauth && user.oauthPicture ? (
          <img
            src={user.oauthPicture}
            alt="User Profile"
            className="h-9 w-9 rounded-full object-fit-cover mr-3 shadow"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-9 w-9 rounded-full object-fit-cover bg-yellow-300 text-black mr-3 border border-amber-400 shadow">
            <span className="font-bold">
              {user?.firstName
                .split(" ")[0]
                .charAt(0)
                .toUpperCase()
                .concat(user?.lastName.charAt(0).toUpperCase())}
            </span>
          </div>
        )}
      </div>
    </Dropdown>
  );

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {renderLogo()}
        <Menu
          className="tree-menu mt-4"
          theme="light"
          mode="inline"
          defaultSelectedKeys={menuOptions.selectedKeys}
          defaultOpenKeys={isMobile ? [] : menuOptions.defaultOpen}
          items={menuOptions.menu.map((item) => {
            if (
              item &&
              typeof item === "object" &&
              "key" in item &&
              typeof item.key === "string" &&
              item.key.includes("/signin")
            ) {
              return {
                ...item,
                className: " logout-menu-item",
              };
            }
            return item;
          })}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? (isMobile ? 0 : 80) : 230,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div className="flex flex-row justify-between items-center w-full shadow">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {user && renderUserProfile()}
          </div>
        </Header>

        <Content
          className={`flex flex-col`}
          style={{
            padding: 24,
            overflow: "auto",
            flex: 1,
          }}
          onClick={() => {
            if (isMobile) {
              setCollapsed(true);
            }
          }}
        >
          {isMobile && !collapsed ? null : (
            <>
              <Outlet />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
