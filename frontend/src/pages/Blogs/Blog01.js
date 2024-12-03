import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import nature from "../../images/healthtips.jpg";
import blog1 from "../../images/blog1.jpg";
import blog2 from "../../images/blog2.jpg";
import blog3 from "../../images/blog3.jpg";
import blog4 from "../../images/blog4.jpg";
import blog5 from "../../images/blog5.jpg";
import blog6 from "../../images/blog6.jpg";
import { Grid, Container, Box } from "@mui/material";
import styles from "../../styles/blog.module.css";
import { useNavigate } from "react-router-dom";
const Blog01 = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: "var(--backgroundColor)",
        paddingBottom: "70px",
      }}
    >
      <div
        style={{
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px 0px",
        }}
      >
        <Container maxWidth="lg">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <ArrowBackIosIcon
              onClick={() => navigate("/blogs")}
              sx={{
                cursor: "pointer",
                position: "absolute",
                top: "1.3rem",
                left: 0,
                fontSize: "2rem",
              }}
            />
            <h1
              style={{
                display: "inline-block",
                margin: "0 auto",
                padding: "0.8rem",
              }}
            >
              Bài viết
            </h1>
          </div>
        </Container>
      </div>
      <Container maxWidth="lg" sx={{ mt: 2, pb: 5 }}>
        <Box>
          <div className={styles.container2}>
            <Grid container spacing={5}>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src={blog1} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <h3 className={styles.title}>1.Ăn chế độ ăn lành mạnh</h3>
                  <p className={styles.para}>
                    Bằng cách ăn một sự kết hợp của nhiều loại thực phẩm khác
                    nhau, bao gồm trái cây, rau củ, đậu, hạt và ngũ cốc nguyên
                    hạt, bạn sẽ giảm nguy cơ bị suy dinh dưỡng và các bệnh không
                    lây nhiễm (NCDs) như tiểu đường, bệnh tim, đột quỵ và ung
                    thư.
                  </p>
                </div>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <h3 className={styles.title}>2. Uống đủ nước</h3>
                  <p className={styles.para}>
                    Việc duy trì sự hydrat hóa giúp đảm bảo cơ thể bạn hoạt động
                    tối ưu và thể tích máu đầy đủ. Uống nước là cách tốt nhất để
                    duy trì sự hydrat hóa, vì nó không có calo và đường.
                  </p>
                </div>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src={blog2} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={blog3} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <h3 className={styles.title}>
                    3. Giảm lượng chất béo tiêu thụ
                  </h3>
                  <p className={styles.para}>
                    Ăn chế độ ăn nhiều chất béo có thể góp phần vào bệnh tim và
                    thừa cân. Một chế độ ăn ít béo quan trọng để duy trì trọng
                    lượng cơ thể khỏe mạnh và ngăn ngừa bệnh tim. Lượng chất béo
                    nên chiếm từ 25 đến 35 phần trăm tổng lượng calo từ chất
                    béo.
                  </p>
                </div>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src={blog4} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <h3 className={styles.title}>4. Tiêu thụ ít muối và đường</h3>
                  <p className={styles.para}>
                    Hầu hết mọi người nhận được natri từ muối. Hạn chế lượng
                    muối của bạn xuống còn 5g mỗi ngày, tương đương với khoảng
                    một muỗng cà phê. Ngược lại, tiêu thụ quá nhiều đường làm
                    tăng nguy cơ sâu răng và tăng cân không lành mạnh. Giảm
                    lượng đường của bạn xuống còn 50g hoặc khoảng 12 muỗng cà
                    phê.
                  </p>
                </div>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src={blog5} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <h3 className={styles.title}>
                    5. Tránh hút thuốc và uống rượu có hại
                  </h3>
                  <p className={styles.para}>
                    Nếu bạn làm những điều này, hãy xem xét giảm bớt hoặc bỏ hẳn
                    để giảm nguy cơ mắc các bệnh mạn tính. Hút thuốc lá gây ra
                    các bệnh không lây nhiễm như bệnh phổi, bệnh tim và đột quỵ.
                  </p>
                </div>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src={blog6} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <h3 className={styles.title}>6. Tập thể dục thường xuyên</h3>
                  <p className={styles.para}>
                    Dù bạn ở độ tuổi nào, có bằng chứng khoa học vững chắc cho
                    thấy việc hoạt động thể chất thường xuyên giúp bạn sống khỏe
                    mạnh và hạnh phúc hơn. Những người tập thể dục thường xuyên
                    có nguy cơ thấp mắc phải nhiều bệnh lý mãn tính như bệnh
                    tim, tiểu đường loại 2, đột quỵ và một số bệnh ung thư.
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Mobile container */}
          <div className={styles.container3}>
            <Grid container spacing={5}>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src={blog1} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <h3 className={styles.title}>1.Ăn chế độ ăn lành mạnh</h3>
                  <p className={styles.para}>
                    Bằng cách ăn một sự kết hợp của nhiều loại thực phẩm khác
                    nhau, bao gồm trái cây, rau củ, đậu, hạt và ngũ cốc nguyên
                    hạt, bạn sẽ giảm nguy cơ bị suy dinh dưỡng và các bệnh không
                    lây nhiễm (NCDs) như tiểu đường, bệnh tim, đột quỵ và ung
                    thư.
                  </p>
                </div>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src={blog2} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <h3 className={styles.title}>2. Uống đủ nước</h3>
                  <p className={styles.para}>
                    Việc duy trì sự hydrat hóa giúp đảm bảo cơ thể bạn hoạt động
                    tối ưu và thể tích máu đầy đủ. Uống nước là cách tốt nhất để
                    duy trì sự hydrat hóa, vì nó không có calo và đường.
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default Blog01;
