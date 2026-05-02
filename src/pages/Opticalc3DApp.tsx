import { Navigate } from "react-router-dom";

export default function Opticalc3DApp() {
  // Redirect to the new integrated opticalc3d page
  return <Navigate to="/opticalc-3d" replace />;
}
