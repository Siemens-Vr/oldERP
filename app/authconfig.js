export const authConfig = {
  providers: [], 
  pages: {
    signIn: "/login", 
  },
  callbacks: {
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user; // Check if the user is logged in
      const isOnLoginPage = request.nextUrl.pathname === "/login";

      if (!isLoggedIn && !isOnLoginPage) {
        // If the user is not logged in and is not on the login page, redirect to the login page
        return Response.redirect(new URL("/login", request.nextUrl));
      }

      if (isLoggedIn && isOnLoginPage) {
        // If the user is logged in and tries to access the login page, redirect to the dashboard
        return Response.redirect(new URL("/", request.nextUrl));
      }

      // Allow access if authenticated or accessing the login page
      return isLoggedIn || isOnLoginPage;
    },
  },
};
