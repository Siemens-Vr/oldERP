"use client"; // Ensures this component runs only on the client-side

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PermissionCheck = ({ user }) => {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Redirect to a 403 or login page if user is not authenticated
      router.push("/403");
    } else if (user.role === "admin") {
      // Redirect to the student dashboard if user has the correct role
      router.push("/pages/admin/dashboard");
    } else if (user.role === "equipment") {
      // Redirect to the equipment dashboard if user has the correct role
      router.push("/pages/equipment/dashboard");
    } else if (user.role === "student") {
      // Redirect to the equipment dashboard if user has the correct role
      router.push("/pages/student/dashboard");
    }else {
      // Redirect to a 403 page if user does not have the required role
      router.push("/403");
    }
  }, [user, router]);

  // Optionally render a loading state or nothing while redirecting
  return <div>Loading...</div>;
};

export default PermissionCheck;
