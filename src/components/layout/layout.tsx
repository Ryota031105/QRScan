import { Link, Outlet, useLocation } from "react-router-dom";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LuQrCode, LuTable } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  });
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="grow p-4">
          <Outlet />
        </div>
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <nav className="pointer-events-auto fixed bottom-0 mb-30">
            <ButtonGroup>
              <Button
                onClick={() => setActiveTab("/")}
                variant="outline"
                className={`${
                  activeTab === "/"
                    ? "bg-blue-300 text-white"
                    : "bg-gray-500 text-gray-600 border-gray-600"
                }`}
                asChild
              >
                <Link to="/" className="inline-flex items-center gap-2">
                  <LuQrCode
                    data-icon="inline-start"
                    color={`${activeTab === "/" ? "#ffffff" : "#4b5563"}`}
                    fill={`${activeTab === "/" ? "#93c5fd" : "#6b7280"}`}
                  />
                  Scan QR
                </Link>
              </Button>
              <Button
                onClick={() => setActiveTab("/db")}
                variant="outline"
                className={`${
                  activeTab === "/db"
                    ? "bg-blue-300 text-white border-gray-600"
                    : "bg-gray-500 text-gray-600"
                } `}
                asChild
              >
                <Link to="/db" className="inline-flex items-center gap-2">
                  <LuTable
                    data-icon="inline-start"
                    color={`${activeTab === "/db" ? "#ffffff" : "#4b5563"}`}
                    fill={`${activeTab === "/db" ? "#93c5fd" : "#6b7280"}`}
                  />
                  棚卸表
                </Link>
              </Button>
            </ButtonGroup>
          </nav>
        </div>
      </div>
    </>
  );
}
