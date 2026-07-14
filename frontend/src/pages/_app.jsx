// frontend\src\pages\_app.jsx
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactModal from "react-modal";

import "../styles/globals.css";
import "../styles/dashboard.css";

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  "768004342999-p4ivhapdmh7sm1pv02vft691vlt9d38n.apps.googleusercontent.com";

// نقش‌های مجاز برای هر مسیر
const routeRoleMap = {
  "/users-dashboard": ["student"],
  "/trainers-dashboard": ["teacher", "coach"],
  "/manager-dashboard": ["admin"],
};

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // React Modal fix
  useEffect(() => {
    if (typeof window !== "undefined") {
      ReactModal.setAppElement("#__next");
    }
  }, []);

  // Route Guard (فعلاً خاموش گذاشتی، همون خوبه)
  /*
  useEffect(() => {
    if (typeof window === "undefined") return;

    const publicRoutes = ["/"];
    const currentUserRaw = sessionStorage.getItem("currentUser");
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

    if (!currentUser && !publicRoutes.includes(router.pathname)) {
      router.replace("/");
      return;
    }

    const allowedRoles = routeRoleMap[router.pathname];

    if (allowedRoles && currentUser) {
      if (!allowedRoles.includes(currentUser.role)) {
        switch (currentUser.role) {
          case "student":
            router.replace("/users-dashboard");
            break;
          case "teacher":
          case "coach":
            router.replace("/trainers-dashboard");
            break;
          case "admin":
            router.replace("/manager-dashboard");
            break;
          case "cafe":
            router.replace("/cafe-dashboard");
            break;
          case "reception":
            router.replace("/reception-dashboard");
            break;
          default:
            router.replace("/");
        }
      }
    }
  }, [router.pathname]);
  */

  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </GoogleOAuthProvider>
  );
}
