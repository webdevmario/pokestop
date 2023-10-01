import { ReactNode } from "react";

import MainHeader from "./main-header";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className="min-h-screen">
      <MainHeader />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
