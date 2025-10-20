import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      <div className="text-white text-base">Loading...</div>
    </div>
  );
};

export default PageLoader;
