import { ReactNode } from "react";
import MainHeader from "./main-header";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <MainHeader />
      <main className="pt-16">{children}</main>
    </div>
  );
}

export default Layout;
