import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import About from "./About";
import Services from "./Services";
import styles from "../../styles/home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  useEffect(() => {
    // Tải API Google reCAPTCHA v3
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/enterprise.js?render=6LcifrUqAAAAAN8PGxeUZvj8LKbrY8OXfA0cTNt8";
    script.async = true;
    script.onload = () => {
      console.log("reCAPTCHA API loaded successfully");
    };
    document.head.appendChild(script);
  }, []);

  // Hàm gọi khi nhấn nút gửi
  const handleCaptchaSubmit = async () => {
    try {
      // Gọi grecaptcha.execute để lấy token
      const token = await window.grecaptcha.enterprise.execute("6LcifrUqAAAAAN8PGxeUZvj8LKbrY8OXfA0cTNt8", { action: "submit" });

      if (token) {
        console.log("Token nhận được từ reCAPTCHA: ", token);
        // Sau khi có token, bạn có thể gửi token tới backend để xác minh (hoặc thực hiện thao tác khác)
        setIsCaptchaVerified(true); // Hoặc xác minh token ở backend
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi xác minh reCAPTCHA:", error);
    }
  };

  return (
    <div>
      {!isCaptchaVerified ? (
        <div className={styles.captchaWrapper}>
          <div className={styles.captchaContainer}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/1200px-RecaptchaLogo.svg.png" alt="reCAPTCHA logo" className={styles.recaptchaLogo} />
            <div className={styles.recaptcha}>
              {/* Render reCAPTCHA widget here */}
            </div>
          </div>
          <h3>Vui lòng hoàn thành CAPTCHA để tiếp tục</h3>
          <button className={styles.captchaBtn} onClick={handleCaptchaSubmit}>
            Xác nhận CAPTCHA
          </button>
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
