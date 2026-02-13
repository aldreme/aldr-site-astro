import AdminLayout from "@/layouts/admin-layout";
import AdminRouter from "./AdminRouter";

export default function AdminApp() {
  return (
    <AdminLayout>
      <AdminRouter />
    </AdminLayout>
  );
}
