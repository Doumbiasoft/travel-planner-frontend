import type { ThemeConfig } from "antd";

const themeAntd: ThemeConfig = {
  // -------------------------------
  // 🔹 GLOBAL TOKENS
  // -------------------------------
  token: {
    // Colors
    colorPrimary: "#fad714",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    colorTextBase: "#000",
    colorBgBase: "#fff",

    // Alias Colors
    colorLink: "#FFFF66",
    colorLinkHover: "#faad14",
    colorLinkActive: "#faad14",
    colorFill: "rgba(0, 0, 0, 0.15)",

    // Custom colors
    blue1: "#ECF9FF",
    blue2: "#C7EDFF",
    blue3: "#0049FC",
    blue4: "#F4F5FF",
    yellow1: "#FFF9EB",

    // Font
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 18,
    fontSizeHeading2: 16,
    fontSizeHeading3: 14,
    fontSizeHeading4: 12,
    fontSizeHeading5: 10,
    fontWeightStrong: 600,
    lineHeight: 1.5715,
    lineHeightHeading1: 1.3,
    lineHeightHeading2: 1.35,
    lineHeightHeading3: 1.4,
    lineHeightHeading4: 1.45,
    lineHeightHeading5: 1.5,

    // Border Radius
    borderRadius: 6,
    borderRadiusSM: 4,
    borderRadiusLG: 16,

    // Padding & Margin
    padding: 16,
    paddingSM: 8,
    paddingXS: 4,
    paddingMD: 12,
    paddingLG: 24,
    marginXS: 4,
    marginSM: 8,
    marginMD: 16,
    marginLG: 24,
    marginXL: 32,

    // Shadows
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    boxShadowSecondary: "0 1px 4px rgba(0, 0, 0, 0.12)",

    // Motion
    motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    //motionEaseIn: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    motionDurationSlow: "0.3s",
    motionDurationMid: "0.2s",
    motionDurationFast: "0.1s",
  },

  // -------------------------------
  // 🔹 COMPONENT TOKENS
  // -------------------------------
  components: {
    Layout: {
      headerBg: "#fff",
      bodyBg: "#F6F6F6",
      footerBg: "#fff",
      siderBg: "#242424",
      triggerBg: "#121212",
      triggerColor: "#fff",
    },

    Button: {
      colorPrimary: "#103B58",
      colorPrimaryHover: "#18415D",
      colorPrimaryActive: "#0B2A40",
      borderRadius: 6,
      primaryShadow: "0px",
      defaultShadow: "0 2px 0 rgba(0, 0, 0, 0.02)",
      controlHeight: 40,
      fontWeight: 500,
    },

    Menu: {
      itemBg: "#242424",
      itemColor: "#ffffff",
      itemHoverBg: "#121212",
      itemHoverColor: "#FFE566",
      itemSelectedColor: "#121212",
      itemBorderRadius: 10,
      subMenuItemSelectedColor: "#FFE566",
      itemSelectedBg: "#FFE566",
      popupBg: "#242424",
      horizontalItemHoverColor: "#fff",
      horizontalItemSelectedColor: "#fff",
      controlItemBgActive: "#FFE566",
      iconSize: 20,
    },

    Card: {
      borderRadiusLG: 16,
      padding: 0,
      paddingSM: 12,
      paddingLG: 0,
      headerHeight: 48,
      actionsBg: "#fafafa",
    },

    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 0,
      fontWeightStrong: 600,
      colorTextHeading: "#103B58",
      fontSizeHeading1: 18,
      fontSizeHeading2: 16,
      fontSizeHeading3: 14,
    },

    Select: {
      optionSelectedBg: "#103B5800",
      optionActiveBg: "#E6F7FF",
      controlOutlineWidth: 0,
      borderRadius: 6,
      controlHeight: 40,
    },

    Input: {
      colorBgContainer: "#fff",
      colorBorder: "#d9d9d9",
      activeShadow: "0 0 0 2px rgba(16, 59, 88, 0.2)",
      borderRadius: 6,
      controlHeight: 40,
    },

    Table: {
      headerBg: "#fafafa",
      headerColor: "#103B58",
      rowHoverBg: "#f5f5f5",
      borderColor: "#f0f0f0",
    },

    Tabs: {
      cardBg: "#fff",
      itemSelectedColor: "#103B58",
      itemHoverColor: "#18415D",
    },

    Modal: {
      headerBg: "#fff",
      footerBg: "#fff",
      colorBgMask: "rgba(0,0,0,0.45)",
      borderRadiusLG: 12,
    },

    Drawer: {
      colorBgElevated: "#fff",
      footerPaddingBlock: 16,
    },

    Tooltip: {
      colorBgBase: "#103B58",
      colorTextLightSolid: "#fff",
    },

    Dropdown: {
      colorBgElevated: "#fff",
      colorText: "#103B58",
    },

    Badge: {
      colorBgBase: "#f0f0f0",
      colorPrimary: "#103B58",
    },

    Pagination: {
      itemActiveBg: "#103B58",
      colorPrimaryHover: "#18415D",
    },

    Progress: {
      defaultColor: "#103B58",
      remainingColor: "#f5f5f5",
    },

    Alert: {
      colorSuccess: "#52c41a",
      colorInfo: "#1677ff",
      colorWarning: "#faad14",
      colorError: "#ff4d4f",
    },
  },
};

export default themeAntd;
