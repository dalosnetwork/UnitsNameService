import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div>
      <Outlet /> {/* This renders the current route's page */}
    </div>
  );
}
