import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileSearchOutlined,
  DashboardOutlined,
  SettingOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, type MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import logo from "../assets/images/travel-planner-vertical-logo.png";
const { Header, Sider, Content, Footer } = Layout;

export const isMobile = window.innerWidth < 768;

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
  const [collapsed, setCollapsed] = useState(isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const portal = location.pathname.split("/")[1];
  const { user, logout } = useAuth();

  const getSelectedKeys = (pathname: string): string[] => {
    return [pathname];
  };
  // Initialize menu configuration based on portal
  const menuConfigs = getMenuConfigurations();
  const configInit =
    menuConfigs[portal as keyof typeof menuConfigs] || menuConfigs.user;
  const [menuOptions, setMenuOptions] = useState<MenuOptions>({
    menu: configInit.menu,
    defaultOpen: configInit.defaultOpen,
    selectedKeys: getSelectedKeys(location.pathname),
  });
  // Effect to update menu options when the route changes or message count changes
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
  useEffect(() => {
    const handleResize = () => {
      if (isMobile) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("load", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  });
  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key.split("/")[1] === "signin") {
      await logout();
    }
    routeTo(key);
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderLogo = () => (
    <div className=" flex items-center justify-center pt-5 pb-2 border-b border-amber-200 mb-3">
      <img src={logo} alt="Travel Planner logo" className="h-9" />
      <span className="font-bold text-xl">
        {collapsed ? "" : "Travel Planner"}
      </span>
    </div>
  );
  const renderUserProfile = () => (
    <div className=" flex items-center justify-center gap-2">
      <span className="text-base hidden md:block">
        {user?.firstName} {user?.lastName}
      </span>
      {user?.isOauth && user.oauthPicture ? (
        <img
          src={user.oauthPicture}
          alt="User Profile"
          className="h-9 w-9 rounded-full object-fit-cover mr-3 shadow"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-9 w-9 rounded-full object-fit-cover bg-yellow-300 text-black mr-3 border border-amber-400">
          <span className="font-bold">
            {user?.firstName
              .charAt(0)
              .toUpperCase()
              .concat(user?.lastName.charAt(0).toUpperCase())}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        collapsedWidth={isMobile ? 0 : 80}
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
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex flex-row justify-between items-center">
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
        {isMobile && !collapsed ? null : (
          <>
            <Content
              className="flex flex-col"
              style={{
                // margin: "24px 16px 10px 16px",
                marginBottom: "0px",
                padding: 24,
                minHeight: 280,
                // background: colorBgContainer,
                // borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </Content>

            <Footer
              style={{
                textAlign: "center",
                backgroundColor: "transparent",
                paddingTop: "0px",
                paddingBottom: "10px",
              }}
            >
              <p>&copy; 2025 Travel Planner. All rights reserved.</p>
            </Footer>
          </>
        )}
      </Layout>
    </Layout>
  );
};

export default MainLayout;
