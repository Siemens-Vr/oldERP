import PermissionCheck from "../app/permissionCheck";
import { auth } from "../app/auth";

const Homepage = async () => {
  const result = await auth();
  const user = result?.user;

  return (
    <div>
      {/* <h1>hello</h1> */}
      <PermissionCheck user={user} />
    </div>
  );
};

export default Homepage;
