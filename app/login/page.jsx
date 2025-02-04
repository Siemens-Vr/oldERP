import styles from '@/app/styles/login/login.module.css'
import LoginForm from '@/app/components/login/loginForm';



const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LoginForm/>
    </div>
  );
};

export default LoginPage;
