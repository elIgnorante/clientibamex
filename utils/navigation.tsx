import { router } from "expo-router";

export const getInitialRoute = (role: string) => {
  switch (role) {
    case "admin":
      return "/(admin)/(dashboard)/dashboard";
    case "driver":
      return "/(driver)/home-driver";
    case "user":
      return "/(client)/home-client";
    default:
      return "/(auth)/sign-in";
  }
};

export const handleRoleNavigation = (role: string) => {
  const route = getInitialRoute(role);
  router.replace(route);
};
