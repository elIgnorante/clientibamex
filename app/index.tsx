// import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Page = () => {
//   const { isSignedIn } = useAuth();
    const isSignedIn = true;

  if (isSignedIn) return <Redirect href="/(admin)/(dashboard)/dashboard" />;

  return <Redirect href="/(auth)/sign-in" />;
};

export default Page;