import { Navigate } from "react-router-dom";

// Password reset now uses an emailed OTP code handled on /forgot-password.
// This route only survives so old emailed links still land somewhere useful.
export default function ResetPassword() {
  return <Navigate to="/forgot-password" replace />;
}
