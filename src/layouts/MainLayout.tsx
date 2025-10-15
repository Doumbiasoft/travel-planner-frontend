import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileSearchOutlined,
  DashboardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, type MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
  const handleMenuClick = ({ key }: { key: string }) => {
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
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        collapsedWidth={isMobile ? 0 : 80}
      >
        <div className="demo-logo-vertical mt-5 text-pink-600" />

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
              item.key.includes("/page-three")
            ) {
              return {
                ...item,
                className: " text-pink-600 ",
              };
            }
            return item;
          })}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
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
