import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import AdminLayout from "../layouts/Admin/Admin.js";
import Dashboard from "../views/Dashboard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <AdminLayout>
        <Dashboard></Dashboard>
      </AdminLayout>
    </>
  );
}
