
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import MessageList from "./messages/MessageList";
import PartnerManager from "./partners/PartnerManager";
import EditProductClient from "./products/EditProductClient";
import ProductForm from "./products/ProductForm";
import ProductList from "./products/ProductList";
import RFQList from "./rfqs/RFQList";
import SettingsForm from "./settings/SettingsForm";

export default function AdminRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Simple Router Logic
  // /admin -> Dashboard
  // /admin/products -> ProductList
  // /admin/products/new -> ProductForm (isNew)
  // /admin/products/:id -> EditProductClient
  // /admin/partners -> PartnerManager
  // /admin/rfqs -> RFQList
  // /admin/messages -> MessageList
  // /admin/settings -> SettingsForm

  // Normalize path to remove trailing slash
  const cleanPath = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  if (cleanPath === "/admin") {
    return <Dashboard />;
  }

  if (cleanPath === "/admin/products") {
    return <ProductList />;
  }

  if (cleanPath === "/admin/products/new") {
    return <ProductForm isNew={true} />;
  }

  if (cleanPath.startsWith("/admin/products/")) {
    const id = cleanPath.split("/").pop();
    return <EditProductClient id={id} />;
  }

  if (cleanPath === "/admin/partners") {
    return <PartnerManager />;
  }

  if (cleanPath === "/admin/rfqs") {
    return <RFQList />;
  }

  if (cleanPath === "/admin/messages") {
    return <MessageList />;
  }

  if (cleanPath === "/admin/settings") {
    return <SettingsForm />;
  }

  return <div>404 - Page Not Found</div>;
}
