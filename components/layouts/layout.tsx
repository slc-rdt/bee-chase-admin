import { ComponentProps, ComponentType } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout: ComponentType<ComponentProps<"div">> = ({
  children,
  ...rest
}) => {
  return (
    <div className="drawer-mobile drawer" {...rest}>
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Navbar />
        <main className="w-full p-8">{children}</main>
      </div>
      <Sidebar />
    </div>
  );
};

export default Layout;
