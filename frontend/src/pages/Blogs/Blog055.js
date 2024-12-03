import React from "react";
import { Grid, Container, Box } from "@mui/material";
import styles from "../../styles/blog.module.css";
import { motion } from "framer-motion";
import egg from "../../images/eggs.png";
import banana from "../../images/bananas.png";
import sweetpotato from "../../images/sweetpotato.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

const Blog055 = () => {
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
                  src={"https://i.pinimg.com/originals/42/80/a8/4280a8e5e9f0b3d7b0e9e94c32244644.gif"}
                  alt="nature"
                  className={styles.imgTips1}
                  variants={photoAnim}
                  style={{ width: "400px", height: "auto" }}
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
                    Calo (Năng lượng), Protein, Tinh bột (Carbohydrate)
                    Chất béo (Lipid) và Canxi
                  </motion.h3>
                  <motion.p variants={fade}>
                    <br />
                    <b> Calories </b>: Đối với nam: Khoảng 2.000 - 2.500 kcal mỗi ngày.
                    Đối với nữ: Khoảng 1.800 - 2.200 kcal mỗi ngày. <br/>
                    <b> Lưu ý: </b> Nếu bạn có mức độ hoạt động cao (tập thể dục thường xuyên), nhu cầu calo sẽ tăng lên.
                    <br />
                    <br />
                    <b> Protein </b>: Protein rất quan trọng cho sự phát triển cơ bắp và tái tạo mô.
<br/>Khoảng 0.8 - 1 gram protein mỗi kg trọng lượng cơ thể đối với người trưởng thành trung bình. <br /> <b> Ví dụ: </b>
Một người nặng 70kg cần khoảng 56 - 70g protein mỗi ngày.<br/>
Nếu bạn là người tập thể dục hoặc vận động viên, nhu cầu protein có thể lên tới 1.2 - 2.0g/kg.
                    <br />
                    <br />
                    <b> Tinh bột </b>: Tinh bột là nguồn cung cấp năng lượng chính của cơ thể.<br />
Khoảng 45-65% tổng lượng calo hàng ngày nên đến từ tinh bột. <br />
Nếu bạn tiêu thụ 2.000 kcal mỗi ngày, bạn cần khoảng 225-325g tinh bột. <br />

<h3>&bull;                    <b> Chất béo : </b> </h3> Chất béo giúp cơ thể hấp thụ vitamin và cung cấp năng lượng dài hạn.
Khoảng 20-35% tổng lượng calo hàng ngày nên đến từ chất béo. Trong đó:
Chất béo không bão hòa (từ dầu thực vật, cá, quả hạch) là lựa chọn tốt.
Chất béo bão hòa (từ mỡ động vật) cần được hạn chế.
Ví dụ: Nếu bạn tiêu thụ 2.000 kcal mỗi ngày, khoảng 44-78g chất béo là cần thiết. <br />

<h3>&bull;  <b> Canxi </b>:  </h3> Canxi rất quan trọng cho sức khỏe xương và răng. 

Nam và nữ trưởng thành (19-50 tuổi) cần khoảng 1.000mg canxi mỗi ngày.
Phụ nữ trên 50 tuổi và nam trên 70 tuổi cần khoảng 1.200mg canxi mỗi ngày. <br />
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
                    Gợi ý thực đơn cho người muốn tăng cân <br/>
                  </motion.h3>
                  <motion.p className={styles.para} variants={fade}> <br/>
                    <b>Yến mạch với trái cây và hạt: </b>: Kết hợp yến mạch nấu chín với sữa (hoặc sữa hạnh nhân), thêm một ít trái cây tươi (chuối, quả mọng) và một muỗng hạt chia hoặc hạt lanh.
                    <br />
                    <br />
                    <b>Trứng chiên và bánh mì nguyên cám</b>: 2-3 quả trứng chiên cùng với 1-2 lát bánh mì nguyên cám hoặc bánh mì nướng, thêm một ít bơ (hoặc dầu oliu) để tăng lượng calo.
                    <br />
                    <br />
                    <b>Cơm với thịt gà và rau củ</b>: Cơm gạo lứt hoặc cơm trắng, thịt gà (hoặc thịt bò), kèm rau xanh như cải bó xôi hoặc bông cải xanh. Bạn có thể thêm dầu oliu hoặc bơ vào món rau để tăng lượng chất béo lành mạnh.
                    <br />
                    <br />
                    <b>Salad với protein và quả bơ:</b> Salad với các loại rau tươi, quả bơ, trứng luộc, hạt hướng dương hoặc các loại hạt, kèm sốt dầu oliu và chanh.
                    <br />
                    <br />
                    <b>Mỳ Ý sốt bơ và thịt bò</b>: Mỳ Ý với sốt bơ và thịt bò xào, thêm một ít phô mai Parmesan để bổ sung thêm calo và chất béo.
                    <br />
                    <br />
                    <b>Phô mai hoặc sữa chua </b>: Các loại thực phẩm giàu protein và chất béo lành mạnh giúp hỗ trợ quá trình tăng cân.
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
                  src={"https://i.pinimg.com/originals/ae/3d/62/ae3d6215a590f15a8ef3928789829ec9.gif"}
                  alt="nature"
                  className={styles.imgTips1}
                  variants={photoAnim}
                  style={{ width: "400px", height: "auto" }}
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
                  src={"https://i.pinimg.com/originals/1c/ab/85/1cab8527ea8cc3f3899c5ac2557d5131.gif"}
                  alt="giamcan"
                  className={styles.imgTips1}
                  variants={photoAnim}
                  style={{ width: "580px", height: "auto" }}
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
                    <br/> Gợi ý thực đơn cho người muốn giảm cân
                  </motion.h3>
                  <motion.p className={styles.para} variants={fade}>
                    <b> <br/>Trứng luộc và rau xanh </b>: 2 quả trứng luộc hoặc trứng chiên bằng dầu oliu, kèm với salad rau xanh (rau xà lách, cà chua, dưa chuột) để cung cấp nhiều chất xơ và vitamin.
                    <br />
                    <br />
                    <b>Sinh tố rau củ và trái cây </b>: Một ly sinh tố với cải bó xôi, chuối, táo và chút nước cốt chanh, thêm một ít hạt chia hoặc yến mạch.
                    <br />
                    <br />
                    <b>Salad với ức gà </b>: Salad gồm rau xanh (xà lách, rau cải, cà chua), thịt ức gà nướng hoặc luộc, thêm một ít dầu oliu và chanh làm nước sốt. Có thể thêm một chút hạt hướng dương hoặc hạt chia để tăng cường chất béo lành mạnh.
                    <br />
                    <br />
                    <b>Sữa chua không đường </b>: Một hũ sữa chua không đường hoặc một ly nước ép rau củ giúp cơ thể tiếp tục tiêu hóa tốt trong khi ngủ.
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

export default Blog055;
