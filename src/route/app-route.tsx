import { Route, Routes } from "react-router-dom";
import ScanPage from "../app/scan/page.tsx";
import DbPage from "../app/db/page.tsx";
import Layout from "../components/layout/layout.tsx";

export default function AppRoute() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<ScanPage />} />
          <Route path="/db" element={<DbPage />} />
        </Route>
      </Routes>
    </>
  );
}
