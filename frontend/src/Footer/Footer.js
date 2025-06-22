import React, { useState } from "react";
import { Facebook, Email, Phone, Info } from "@mui/icons-material";

const Footer = () => {
  const [popupType, setPopupType] = useState(null);

  const showPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);

  const getPopupContent = () => {
    if (popupType === "privacy") {
      return {
        title: "Chính sách bảo mật",
        content:
          "Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu thu thập sẽ chỉ được sử dụng cho mục đích cải thiện trải nghiệm và sẽ không được chia sẻ với bên thứ ba mà không có sự đồng ý của bạn."
      };
    } else if (popupType === "terms") {
      return {
        title: "📄 Điều khoản sử dụng",
        content: (
          <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
            <p>
              Bằng việc sử dụng dịch vụ này, bạn đồng ý tuân thủ các <strong>điều khoản và điều kiện</strong> mà chúng tôi đưa ra. Vui lòng <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>không sử dụng</span> dịch vụ cho các mục đích vi phạm pháp luật hoặc gây hại đến người khác.
            </p>
            <p>
              Các <strong>gợi ý thực phẩm, phân tích dinh dưỡng và thực đơn</strong> do hệ thống cung cấp chỉ mang tính chất tham khảo. Đây là một <em>sản phẩm hỗ trợ sức khỏe sử dụng trí tuệ nhân tạo (AI)</em>, không thay thế cho lời khuyên chuyên môn.
            </p>
            <div style={{ backgroundColor: '#fff3cd', padding: '0.8rem', borderLeft: '5px solid #ffc107', borderRadius: '4px', marginTop: '1rem' }}>
              ⚠️ <strong>Lưu ý:</strong> Người dùng <strong>tự chịu trách nhiệm</strong> với các lựa chọn được đưa ra dựa trên dữ liệu AI. <br />
              Chúng tôi <strong>khuyến nghị</strong> bạn nên tham khảo ý kiến từ <strong>bác sĩ</strong> hoặc <strong>chuyên gia dinh dưỡng</strong> trước khi áp dụng bất kỳ thay đổi nào liên quan đến chế độ ăn uống hoặc sức khỏe.
            </div>
          </div>
        )
      };
    }
    return { title: "", content: "" };
  };

  const { title, content } = getPopupContent();

  return (
    <footer style={{ backgroundColor: "#66CC00", color: "black", padding: "2rem", fontSize: "0.95rem", fontFamily: 'Segoe UI, sans-serif', lineHeight: 1.6 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>

        <section>
          <h3>1. Giới thiệu</h3>
          <p>NutriWise Advisor là nền tảng hỗ trợ người dùng theo dõi chế độ dinh dưỡng và sức khỏe cá nhân, cung cấp phân tích khẩu phần ăn, gợi ý thực đơn, theo dõi calo và cảnh báo nguy cơ sức khỏe.</p>
        </section>

        <section>
          <h3>2. Liên hệ & Hỗ trợ</h3>
          <p><Phone fontSize="small" /> Hotline: 0987706319</p>
          <p><Email fontSize="small" /> Email: emerldforever@gmail.com</p>
          <p>
            <Facebook fontSize="small" /> <a href="https://www.facebook.com/mochi.mocha.77377" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'black' }}>Facebook cá nhân</a>
          </p>
        </section>

        <section>
          <h3>3. Điều hướng</h3>
          <p>Trang chủ | Giới thiệu | Gợi ý dinh dưỡng | BMI/BMR | Quản lý thực đơn | Cộng đồng</p>
        </section>

        <section>
          <h3>4. Chính sách & pháp lý</h3>
          <p>
            <a href="#" onClick={() => showPopup("privacy")} style={{ fontWeight: "bold", textDecoration: "underline", color: "black" }}>
              Chính sách bảo mật
            </a>{" | "}
            <a href="#" onClick={() => showPopup("terms")} style={{ fontWeight: "bold", textDecoration: "underline", color: "black" }}>
              Điều khoản sử dụng
            </a>
          </p>
          <p>Phản hồi người dùng | Trách nhiệm cá nhân</p>
        </section>

        <section>
          <h3>5. Tiêu chuẩn</h3>
          <p>Dữ liệu tuân thủ HIPAA / GDPR</p>
          <p>Nguồn tham chiếu: WHO, NIH, FAO, Open Food Facts, USDA Food</p>
        </section>

        <section>
          <h3>6. Bản quyền</h3>
          <p>© 2025 NutriWise Advisor. Bảo lưu mọi quyền.</p>
          <p>Phát triển bởi Nguyễn Ngọc Anh – Hội thi Tin học trẻ 2025</p>
        </section>
        <section><h3>Theo quy đổi đơn vị từ FAO trong tài liệu:</h3>
        <a href = "https://openknowledge.fao.org/server/api/core/bitstreams/65875dc7-f8c5-4a70-b0e1-f429793860ae/content" target = "_blank">FAO/WHO/UNU</a>
        <p>Ứng dụng thực hiện quy đổi đơn vị Calo = kcal= calo trên thực tế Calo = 1000 calo nhưng người dùng đã quen với calo nên thực hiện quy đổi như trên.</p>
        </section>
      </div>

      {popupType && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.7)",
          zIndex: 999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "white",
            color: "black",
            padding: "2rem",
            width: "80%",
            maxWidth: "700px",
            borderRadius: "8px",
            position: "relative",
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h2>{title}</h2>
            <div>{content}</div>
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer"
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
