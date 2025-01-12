import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import About from "./About";
import Services from "./Services";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "../../styles/home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // Hàm xử lý khi CAPTCHA được xác minh thành công
  const handleCaptchaSuccess = () => {
    setIsCaptchaVerified(true);
  };

  // Giao diện khi CAPTCHA chưa được xác minh
  const renderCaptchaSection = () => (
    <div className={styles.captchaWrapper}>
      <h3>Vui lòng hoàn thành CAPTCHA để tiếp tục</h3>
      <ReCAPTCHA
        sitekey="6LcifrUqAAAAALR4ZBp2feXBAkvt37KywhaEXIkP" // Thay bằng khóa site của bạn
        onChange={handleCaptchaSuccess}
      />
    </div>
  );

  // Giao diện chính sau khi CAPTCHA được xác minh
  const renderMainContent = () => (
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
              onClick={() => navigate("/signin")}
            >
              Đăng nhập
            </button>
            <span className={styles.divider}>/</span>
            <button
              className={`${styles.homebtns} ${styles.signupBtn}`}
              onClick={() => navigate("/signup")}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      <About />
      <Services />
    </>
  );

  return (
    <div>
      {isCaptchaVerified ? renderMainContent() : renderCaptchaSection()}
    </div>
  );
}
