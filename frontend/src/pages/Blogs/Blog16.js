import React from "react";
import { Grid, Container, Box } from "@mui/material";
import styles from "../../styles/blog.module.css";
import { motion } from "framer-motion";
import egg from "../../images/eggs.png";
import banana from "../../images/bananas.png";
import sweetpotato from "../../images/sweetpotato.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
//baseon blog 2
const Blog16 = () => {
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
                  src={"https://i.pinimg.com/originals/49/01/07/490107f9be6c34d9e2f12010f3b15f27.gif"}
                  alt="run"
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
                    1. Bài tập Tim mạch (Cardio)
                  </motion.h3>
                  <motion.p variants={fade}>
                    <b>Chạy bộ </b>: Chạy bộ ngoài trời hoặc trên máy chạy đều giúp tăng cường sức khỏe tim mạch và tăng cường sức bền. Bạn có thể thử chạy tốc độ nhẹ, chạy interval (chạy nhanh rồi đi bộ nhanh) để đẩy mạnh sự luyện tập.
                    <br />
                    <br />
                    <b>Đạp xe </b>: Đạp xe ngoài trời hoặc trên xe đạp tĩnh là một bài tập tốt cho sức khỏe tim mạch và giúp tăng cường sức mạnh cho cơ bắp chân.
                    <br />
                    <br />
                    <b>Bơi lội </b>: Bơi là một bài tập toàn thân tuyệt vời, giúp tăng cường sự linh hoạt, sức mạnh cơ bắp, và sức bền.
                    <br />
                    <br />
                    <b>Nhảy dây </b>: Nhảy dây không chỉ giúp cải thiện sức khỏe tim mạch mà còn giúp giảm mỡ, tăng cường sự linh hoạt.
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
                  2. Bài tập Linh hoạt (Flexibility and Mobility)
                  </motion.h3>
                  <motion.p className={styles.para} variants={fade}>
                    <b>Yoga </b>: Yoga giúp tăng cường sự linh hoạt, giảm căng thẳng và cải thiện tâm trí.
                    <br />
                    <br />
                    <b>Pilates</b>: Pilates giúp tăng cường cơ bụng, cải thiện sức mạnh cơ thể và sự linh hoạt.
                    <br />
                    <br />
                    <b>Kéo giãn cơ (Stretching)</b>: Các bài tập kéo giãn cơ có thể giúp cải thiện sự linh hoạt, giảm nguy cơ chấn thương, và phục hồi cơ bắp sau khi tập luyện.
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
                  src={"https://i.pinimg.com/originals/a8/a9/ba/a8a9ba4d3ec0b6e7cdd30918fbbcdd92.gif"}
                  alt="yoga"
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
                  src={"https://i.pinimg.com/originals/82/b9/84/82b984c7f4850eaf61d2327e880a20ad.gif"}
                  alt="deadlift"
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
                  <motion.h3 className={styles.title} variants={fade}>
                  3. Bài tập Sức mạnh (Strength Training)
                  </motion.h3>
                  <motion.p className={styles.para} variants={fade}>
                    <b>Chống đẩy </b>: Bài tập này giúp tăng cường cơ ngực, vai và cơ tay. Bạn có thể thử nhiều biến thể như chống đẩy chuẩn, chống đẩy hẹp, chống đẩy rộng, hay chống đẩy với chân cao
                    <br />
                    <br />
                    <b>Squats </b>: Đây là bài tập tuyệt vời để phát triển cơ đùi, cơ mông và cơ chân. Squats có thể thực hiện với hoặc không có tạ, hoặc dùng tạ đôi để tăng cường mức độ khó.
                    <br />
                    <br />
                    <b>Deadlift (Kéo tạ) </b>: Đây là bài tập sức mạnh giúp phát triển cơ lưng, cơ mông và cơ đùi. Nếu bạn không có tạ, bạn có thể sử dụng vật nặng khác để thực hiện bài tập này.
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
                    1. Bài tập Tim mạch (Cardio)
                  </motion.h3>
                  <motion.p variants={fade}>
                    <b>Chạy bộ </b>: Chạy bộ ngoài trời hoặc trên máy chạy đều giúp tăng cường sức khỏe tim mạch và tăng cường sức bền. Bạn có thể thử chạy tốc độ nhẹ, chạy interval (chạy nhanh rồi đi bộ nhanh) để đẩy mạnh sự luyện tập.
                    <br />
                    <br />
                    <b>Đạp xe </b>: Đạp xe ngoài trời hoặc trên xe đạp tĩnh là một bài tập tốt cho sức khỏe tim mạch và giúp tăng cường sức mạnh cho cơ bắp chân.
                    <br />
                    <br />
                    <b>Bơi lội </b>: Bơi là một bài tập toàn thân tuyệt vời, giúp tăng cường sự linh hoạt, sức mạnh cơ bắp, và sức bền.
                    <br />
                    <br />
                    <b>Nhảy dây </b>: Nhảy dây không chỉ giúp cải thiện sức khỏe tim mạch mà còn giúp giảm mỡ, tăng cường sự linh hoạt.
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
                  2. Bài tập Linh hoạt (Flexibility and Mobility)
                  </motion.h3>
                  <motion.p className={styles.para} variants={fade}>
                    <b>Yoga </b>: Yoga giúp tăng cường sự linh hoạt, giảm căng thẳng và cải thiện tâm trí.
                    <br />
                    <br />
                    <b>Pilates</b>: Pilates giúp tăng cường cơ bụng, cải thiện sức mạnh cơ thể và sự linh hoạt.
                    <br />
                    <br />
                    <b>Kéo giãn cơ (Stretching)</b>: Các bài tập kéo giãn cơ có thể giúp cải thiện sự linh hoạt, giảm nguy cơ chấn thương, và phục hồi cơ bắp sau khi tập luyện.
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
                  src={"https://i.pinimg.com/originals/a8/a9/ba/a8a9ba4d3ec0b6e7cdd30918fbbcdd92.gif"}
                  alt="yoga"
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
                  src={"https://i.pinimg.com/originals/82/b9/84/82b984c7f4850eaf61d2327e880a20ad.gif"}
                  alt="deadlift"
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
                  <motion.h3 className={styles.title} variants={fade}>
                  3. Bài tập Sức mạnh (Strength Training)
                  </motion.h3>
                  <motion.p className={styles.para} variants={fade}>
                    <b>Chống đẩy </b>: Bài tập này giúp tăng cường cơ ngực, vai và cơ tay. Bạn có thể thử nhiều biến thể như chống đẩy chuẩn, chống đẩy hẹp, chống đẩy rộng, hay chống đẩy với chân cao
                    <br />
                    <br />
                    <b>Squats </b>: Đây là bài tập tuyệt vời để phát triển cơ đùi, cơ mông và cơ chân. Squats có thể thực hiện với hoặc không có tạ, hoặc dùng tạ đôi để tăng cường mức độ khó.
                    <br />
                    <br />
                    <b>Deadlift (Kéo tạ) </b>: Đây là bài tập sức mạnh giúp phát triển cơ lưng, cơ mông và cơ đùi. Nếu bạn không có tạ, bạn có thể sử dụng vật nặng khác để thực hiện bài tập này.
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

export default Blog16;
