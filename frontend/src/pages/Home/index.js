import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import About from "./About";
import Services from "./Services";
import styles from "../../styles/home.module.css";
import ReCAPTCHA from "react-google-recaptcha";

export default function Home() {
  const navigate = useNavigate();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaSuccess = () => {
    setIsCaptchaVerified(true); // Cho phép hiển thị nội dung khi CAPTCHA được xác nhận
  };

  return (
    <div>
      {!isCaptchaVerified ? (
        <div className={styles.captchaWrapper}>
          <h3>Vui lòng hoàn thành CAPTCHA để tiếp tục</h3>
          <ReCAPTCHA
            sitekey="6Ld5X7UqAAAAAMxqLlbxsjjDT5-IGBz40LDpQoYv" // Thay YOUR_GOOGLE_RECAPTCHA_SITE_KEY bằng khóa site từ Google reCAPTCHA
            onChange={handleCaptchaSuccess}
          />
        </div>
      ) : (
        <>
          <div className={styles.heroSection}>
            <img className={styles.logo} src="/static/img/logo.png" alt="Logo" />
            <div className={styles.titleWrapper}>
              <img
                className={styles.titletest}
                src="/static/img/brandname.png"
                alt="Brandname"
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
        </>
      )}
    </div>
  );
}
