import styles from "@/app/ui/403.module.css"; // Customize your styles as needed

const Error403 = () => {
  return (
    <div className={styles.container}>
      <h1>403 Forbidden</h1>
      <p>You do not have permission to access this page. Please contact the admin if you believe this is an error.</p>
    </div>
  );
};

export default Error403;
