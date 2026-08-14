import { Link, Route, Routes } from "react-router-dom";
import ScanPage from "../app/scan/page.tsx";
import DbPage from "../app/db/page.tsx";

export default function AppRoute() {
  return (
    <>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>
            QRスキャンページ
          </Link>
          <Link to="/db">DB確認ページ</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ScanPage />} />
          <Route path="/db" element={<DbPage />} />
        </Routes>
      </div>
    </>
  );
}
