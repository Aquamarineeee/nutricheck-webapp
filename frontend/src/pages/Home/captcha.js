import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const GoogleCaptcha = ({ onSuccess }) => {
  const [verified, setVerified] = useState(false);

  const handleCaptchaChange = (value) => {
    if (value) {
      setVerified(true);
      onSuccess();
    }
  };

  return (
    <div>
      <ReCAPTCHA
        sitekey="6Ld5X7UqAAAAAMxqLlbxsjjDT5-IGBz40LDpQoYv"
        onChange={handleCaptchaChange}
      />
      {!verified && <p>Vui lòng hoàn thành CAPTCHA</p>}
    </div>
  );
};

export default GoogleCaptcha;
