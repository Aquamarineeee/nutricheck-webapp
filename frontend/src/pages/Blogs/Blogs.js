import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/blog.module.css";
import { Box, Container, Grid } from "@mui/material";
import { Button } from "@mui/material";
import healthys from "../../images/healthy.gif";
import wtime from "../../images/wtimes.gif";
import fruits from "../../images/fruit.gif";
import hinhnen from "../../images/hinh.png";
import Footer from "../../Footer/Footer";
const Blogs = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url(${hinhnen})`, 
        backgroundSize: "cover", 
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center", 
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          boxShadow: "rgb(255, 253, 253) 0px 3px 3px 0px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            display: "inline-block",
            margin: "0 auto",
            padding: "0.8rem",
            color: "white"
          }}
        >
          Bài viết
        </h1>
      </div>
      <Container maxWidth="lg">
        <Box sx={{ mt: "2rem", mx: "2rem", pb: "8rem" }}>
          <Grid container spacing={3}>
            <Grid item sm={6} lg={4} xs={12}>
              <div style={{ width: "100%" }} className={styles.cardContainer}>
                <div className={styles.cardImage}>
                  <img src={healthys} />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardBadge}>Dinh dưỡng</span>
                  <h1 style={{ textAlign: "start" }}>
                    Tại sao thực phẩm lành mạnh lại quan trọng trong cuộc sống
                    hàng ngày?
                  </h1>
                  <p className={styles.cardBubtitle}>
                    Bởi vì thói quen ăn uống không lành mạnh không chỉ làm giảm
                    sức khỏe thể chất của bạn....
                  </p>
                  <div className={styles.cardAuthor}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/blog/healthyliving")}
                      className={styles.btnInfo}
                    >
                      Đọc thêm
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item sm={6} lg={4} xs={12}>
              <div style={{ width: "100%" }} className={styles.cardContainer}>
                <div className={styles.cardImage}>
                  <img src={wtime} alt="a brand new sports car" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardBadge}>Chế độ ăn hàng ngày</span>
                  <h1 style={{ textAlign: "start" }}>
                    Tại sao việc lên kế hoạch bữa ăn lại quan trọng?
                  </h1>
                  <p className={styles.cardBubtitle}>
                    Lên kế hoạch bữa ăn là quá trình quyết định những món ăn cho
                    một khoảng thời gian nhất định...
                  </p>
                  <div className={styles.cardAuthor}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/blog/diet")}
                    >
                      Đọc thêm
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
            
            {/* blog3 */}
            <Grid item sm={6} lg={4} xs={12}>
              <div style={{ width: "100%" }} className={styles.cardContainer}>
                <div className={styles.cardImage}>
                  <img src={fruits} alt="ảnh blog 3" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardBadge}>Khuyến nghị</span>
                  <h1 style={{ textAlign: "start" }}>
                    Bao nhiêu dinh dưỡng 1 ngày là đủ?
                  </h1>
                  <p className={styles.cardBubtitle}>
                  Nhu cầu dinh dưỡng hàng ngày có thể thay đổi tùy thuộc vào tuổi tác, giới tính,...
                  Dưới đây là các khuyến nghị về lượng dinh dưỡng cần thiết.... 
                  
                  </p>
                  <div className={styles.cardAuthor}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/blog/suggest")}
                    >
                      Đọc thêm
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
            
            {/* blog4 */}
            <Grid item sm={6} lg={4} xs={12}>
              <div style={{ width: "100%" }} className={styles.cardContainer}>
                <div className={styles.cardImage}>
                  <img src={"https://i.pinimg.com/originals/3a/20/fe/3a20fe9f88e6fe15bc177eb72ea9d667.gif"} alt="ảnh blog 3" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardBadge}>Khuyến nghị</span>
                  <h1 style={{ textAlign: "start" }}>
                    Hôm nay ăn ít, ngày mai ăn nhiều có nên không?
                  </h1>
                  <p className={styles.cardBubtitle}>
                  Rất nhiều người có thói quen, suy nghĩ hôm nay ăn ít, ngày mai ăn nhiều 1 chút cũng không sao, vậy điều này có ảnh hưởng gì đến sức khỏe không?
                  
                  </p>
                  <div className={styles.cardAuthor}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/blog/quest")}
                    >
                      Đọc thêm
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>

            {/* blog4 */}
            <Grid item sm={6} lg={4} xs={12}>
              <div style={{ width: "100%" }} className={styles.cardContainer}>
                <div className={styles.cardImage}>
                  <img src={"https://i.pinimg.com/originals/cc/b2/9a/ccb29aadc3680b839bf05da2af2fef75.gif"} alt="ảnh blog 3" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardBadge}>Nâng cao sức khỏe </span>
                  <h1 style={{ textAlign: "start" }}>
                    Gợi ý các bài tập thể dục rèn luyện sức khỏe bản thân <br/> 
                  </h1>
                  <p className={styles.cardBubtitle}>
                  Chúng ta cần thường xuyên tập thể dục thể thao để nâng cao sức khỏe chính mình, vậy cần thực hiện các bài thể dục nào thì hiệu quả?
                  </p>
                  <div className={styles.cardAuthor}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/blog/excercise")}
                    >
                      Đọc thêm
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>

            {/* quiz */}
            <Grid item sm={6} lg={4} xs={12}>
              <div style={{ width: "100%" }} className={styles.cardContainer}>
                <div className={styles.cardImage}>
                  <img src={"https://i.pinimg.com/originals/91/f6/6f/91f66fae35a6135a42ca2b8de4554964.gif"} alt="gõ máy làm quiz :))" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardBadge}>Quiz </span>
                  <h1 style={{ textAlign: "start" }}>
                    Kiểm tra kiến thức của bạn về sức khỏe <br/> 
                  </h1>
                  <p className={styles.cardBubtitle}>
                  Làm bài quiz mỗi ngày để tăng vốn hiểu biết của bạn về tầm quan trọng của việc rèn luyện sức khỏe, chế độ dinh dưỡng như thế nào là hợp lý
                  </p>
                  <div className={styles.cardAuthor}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/quiz")}
                    >
                      Đọc thêm
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
            <Footer/>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Blogs;
