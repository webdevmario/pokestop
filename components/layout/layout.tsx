import MainHeader from "./main-header";

function Layout(props) {
  return (
    <div className="min-h-screen">
      <MainHeader />
      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
