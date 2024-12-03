import React from "react";
import { Grid, Container, Box } from "@mui/material";
import styles from "../../styles/blog.module.css";
import { motion } from "framer-motion";
import egg from "../../images/eggs.png";
import banana from "../../images/bananas.png";
import sweetpotato from "../../images/sweetpotato.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

const Blog02 = () => {
  const navigate = useNavigate();
  const pageAnimation = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.5,
      },
    },
  };
  const photoAnim = {
    hidden: {
      scale: 1.25,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: "easeOut",
      },
    },
  };
  const fade = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: { ease: "easeOut", duration: 0.75 },
    },
  };

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
      <Container maxWidth="lg" sx={{ mt: 4, pb: 5 }}>
        <Box>
          <motion.div
            exit="exit"
            variants={pageAnimation}
            initial="hidden"
            animate="show"
            className={styles.container2}
          >
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
                <motion.img
                  src={egg}
                  alt="nature"
                  className={styles.imgTips1}
                  variants={photoAnim}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "justify",
                }}
              >
                <motion.div>
                  <motion.h3 variants={fade} className={styles.title}>
                    Thực phẩm nên ăn vào buổi sáng
                  </motion.h3>
                  <motion.p variants={fade}>
                    <b>Trứng </b>: Trứng là một lựa chọn bữa sáng đơn giản và bổ
                    dưỡng. Chúng là nguồn cung cấp protein tuyệt vời, giúp hỗ
                    trợ sự tổng hợp cơ bắp. Vì protein mất một thời gian để tiêu
                    hóa, nên nó cũng giúp bạn cảm thấy no lâu hơn.
                    <br />
                    <br />
                    <b>Cháo yến mạch </b>: Cháo yến mạch là một lựa chọn bữa
                    sáng cổ điển và bổ dưỡng. Hơn nữa, yến mạch là một nguồn tốt
                    cung cấp sắt, vitamin B, mangan, magiê, kẽm và selenium.
                    <br />
                    <br />
                    <b>Cà phê </b>: Cà phê chứa nhiều caffeine, một phân tử giúp
                    tăng cường sự tỉnh táo, cải thiện tâm trạng và nâng cao hiệu
                    suất thể chất và tinh thần. Đặc biệt, nhiều vận động viên
                    uống cà phê như một thức uống trước khi tập luyện để hỗ trợ
                    hiệu suất thể thao.
                  </motion.p>
                </motion.div>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "justify",
                }}
              >
                <motion.div>
                  <motion.h3 className={styles.title} variants={fade}>
                    Thực phẩm nên ăn vào buổi chiều
                  </motion.h3>
                  <motion.p className={styles.para} variants={fade}>
                    <b>Bánh mì nguyên cám </b>: Glucose là nguồn năng lượng tốt
                    nhất cho não và hệ thần kinh trung ương. Bạn có thể tìm thấy
                    glucose trong các loại carbohydrate như bánh mì nguyên cám
                    và các loại ngũ cốc khác.
                    <br />
                    <br />
                    <b>Chuối</b>: Hầu hết các loại trái cây chứa nhiều loại
                    đường (glucose, fructose và sucrose) và chất xơ – một sự kết
                    hợp tốt để cung cấp năng lượng. Hãy mang theo một quả chuối
                    trong bữa trưa của bạn và ăn khi cảm thấy mệt mỏi vào cuối
                    ngày.
                    <br />
                    <br />
                    <b>Cam</b>: Một loại trái cây khác có tác dụng làm tươi tỉnh
                    là cam. Đây là một món ăn vặt giàu vitamin C, cũng chứa
                    kali, folate và chất xơ. Hơn nữa, mùi của nó thật tuyệt vời!
                  </motion.p>
                </motion.div>
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
                <motion.img
                  src={banana}
                  alt="nature"
                  className={styles.imgTips1}
                  variants={photoAnim}
                />
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
                <motion.img
                  src={sweetpotato}
                  alt="nature"
                  className={styles.imgTips1}
                  variants={photoAnim}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "justify",
                }}
              >
                <motion.div>
                  <motion.h3 className={styles.title} variants={fade}>
                    Thực phẩm nên ăn vào buổi tối
                  </motion.h3>
                  <motion.p className={styles.para} variants={fade}>
                    <b>Khoai lang nhồi </b>: Khoai lang chứa nhiều chất dinh
                    dưỡng có lợi như beta carotene, vitamin C, kali và chất xơ.
                    Thêm vào đó, chúng rất ngon và dễ dàng kết hợp với hầu hết
                    các món ăn khác. Đây là món ăn lý tưởng để xây dựng một bữa
                    ăn no nê.
                    <br />
                    <br />
                    <b>Chén ngũ cốc </b>: Ngũ cốc cung cấp một nguồn chất xơ
                    quan trọng và các dưỡng chất khác như magiê. Các nghiên cứu
                    đã chỉ ra rằng chế độ ăn giàu ngũ cốc có liên quan đến việc
                    giảm nguy cơ mắc một số bệnh lý, bao gồm ung thư đại tràng,
                    bệnh tim và tiểu đường loại 2.
                    <br />
                    <br />
                    <b>Chapati </b>: Chapati giàu chất xơ và chứa một lượng lớn
                    protein và chất béo lành mạnh. Hơn nữa, chapati giúp bạn cảm
                    thấy no lâu hơn. Nó còn cung cấp một lượng calcium, magiê,
                    phốt pho và natri tốt mà không làm tăng mức đường huyết
                    nhanh như cơm.
                  </motion.p>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>

          {/* mobile container */}
          <motion.div
            className={styles.container3}
            exit="exit"
            variants={pageAnimation}
            initial="hidden"
            animate="show"
          >
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
                <motion.img
                  src={egg}
                  alt="nature"
                  className={styles.imgTips1}
                  variants={photoAnim}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "justify",
                }}
              >
                <motion.div>
                  <motion.h3 variants={fade} className={styles.title}>
                    Thực phẩm nên ăn vào buổi sáng
                  </motion.h3>
                  <motion.p variants={fade}>
                    <b>Trứng </b>: Trứng là một lựa chọn bữa sáng đơn giản và bổ
                    dưỡng. Chúng là nguồn cung cấp protein tuyệt vời, giúp hỗ
                    trợ sự tổng hợp cơ bắp. Vì protein mất một thời gian để tiêu
                    hóa, nên nó cũng giúp bạn cảm thấy no lâu hơn.
                    <br />
                    <br />
                    <b>Cháo yến mạch </b>: Cháo yến mạch là một lựa chọn bữa
                    sáng cổ điển và bổ dưỡng. Hơn nữa, yến mạch là một nguồn tốt
                    cung cấp sắt, vitamin B, mangan, magiê, kẽm và selenium.
                    <br />
                    <br />
                    <b>Cà phê </b>: Cà phê chứa nhiều caffeine, một phân tử giúp
                    tăng cường sự tỉnh táo, cải thiện tâm trạng và nâng cao hiệu
                    suất thể chất và tinh thần. Đặc biệt, nhiều vận động viên
                    uống cà phê như một thức uống trước khi tập luyện để hỗ trợ
                    hiệu suất thể thao.
                  </motion.p>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </div>
  );
};

export default Blog02;
