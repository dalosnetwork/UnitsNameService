import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error("Caught by React Router:", error);
  const navigate = useNavigate();

  useEffect(()=>{
    navigate("/")
  })

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Oops! Something went wrong.</h1>
      <p>We encountered an error. Please try again later.</p>
      <pre style={{ color: "red" }}>{error?.message || "Unknown error"}</pre>
    </div>
  );
}
