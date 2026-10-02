import { ReactNode } from "react";
import MainHeader from "./main-header";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-bg">
      <MainHeader />
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default Layout;
