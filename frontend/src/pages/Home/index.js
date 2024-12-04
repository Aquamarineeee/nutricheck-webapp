import React from "react";
import { useNavigate } from "react-router-dom";
import About from "./About";
import Services from "./Services";
import styles from "../../styles/home.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const MyComponent = () => {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      handleResize(); // Kiểm tra ngay khi render lần đầu
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
    <div>
      <div className={styles.heroSection}>
        <img className={styles.logo} src="/static/img/logo.png" alt="Logo" />
        <div className={styles.titleWrapper}>
        <img
      src="/static/img/brandname.png"
      alt="Brandname"
      style={{
        width: isMobile ? "300px" : "500px",
        height: "auto",
      }}
      />
          <p className={styles.subtitle}>
            Trợ lý dinh dưỡng để kiểm soát chế độ ăn uống, quản lý thói quen ăn
            uống và duy trì sức khỏe tốt. 
          </p>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.homebtns} ${styles.signinBtn}`}
              onClick={() => {
                navigate("/signin");
              }}
            >
              Đăng nhập
            </button>
            <span className={styles.divider}>/</span>
            <button
              className={`${styles.homebtns} ${styles.signupBtn}`}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      <About />
      <Services />
    </div>
  );
}
}
