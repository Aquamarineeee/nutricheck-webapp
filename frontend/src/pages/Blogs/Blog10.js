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
const Blog10 = () => {
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
                <img src={"https://i.pinimg.com/originals/05/3f/84/053f8446c9f19ed89dbb7a88613993ab.gif"} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "left",
                }}
              >
                <div>
                  <h3 className={styles.title}> <br/>1.Ảnh hưởng tích cực (trong một số trường hợp)</h3>
                  <p className={styles.para}>
                  <b>Điều chỉnh linh hoạt năng lượng: </b>
<br/> &bull; Nếu tổng lượng calo trong tuần phù hợp với nhu cầu của cơ thể, chênh lệch nhỏ giữa các ngày (ăn ít một ngày, ăn nhiều một ngày) thường không gây tác động xấu. <br/>Ví dụ:
<br/>
&bull; Hôm nay ít hoạt động: ăn ít hơn. <br/>
&bull; Ngày mai vận động nhiều: ăn nhiều hơn.
<br/>
<br/>
<b>Giảm áp lực về chế độ ăn: </b>
 Một số người cảm thấy thoải mái hơn khi không ép bản thân ăn đều đặn mỗi ngày. Điều này có thể giúp họ tuân thủ chế độ ăn uống lành mạnh lâu dài.
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
                  textAlign: "left",
                }}
              >
                <div>
                  <h3 className={styles.title}>2. Ảnh hưởng tiêu cực nếu lặp lại thường xuyên: </h3>
                  <p className={styles.para}>
                  <br/><b>Mất cân bằng năng lượng: </b> <br/>
                  <br/> &bull; Việc ăn quá ít hôm nay có thể khiến bạn đói và ăn bù quá nhiều vào ngày mai. Điều này dễ dẫn đến:

<br/> &bull; Tích trữ mỡ thừa nếu ngày hôm sau ăn quá mức nhu cầu. <br/>
&bull; Rối loạn ăn uống: hình thành thói quen ăn uống không kiểm soát. <br/>
&bull; Rối loạn trao đổi chất:
Khi cơ thể bị đói (ăn ít), nó sẽ giảm tốc độ trao đổi chất. Nếu ngày hôm sau bạn ăn nhiều đột ngột, cơ thể khó xử lý kịp, dẫn đến tích lũy năng lượng dư thừa.
<br/>
<br/> &bull; Ảnh hưởng đến hệ tiêu hóa:

<br/> &bull; Hôm nay ăn ít: Dạ dày co lại, giảm sản xuất enzyme tiêu hóa.
<br/> &bull; Ngày mai ăn nhiều: Dạ dày bị quá tải, dễ gây đầy hơi, khó tiêu.
<br/> &bull; Thay đổi hormone:
Việc ăn ít và ăn nhiều không đều đặn có thể ảnh hưởng đến hormone kiểm soát đói và no (như ghrelin và leptin), làm bạn khó cảm nhận được khi nào đói hay no.
                  </p>
                </div>
              </Grid>
              <Grid
                item
                md={6}
                xs={11}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  
                }}
              >
                <img src={"https://i.pinimg.com/originals/3a/30/a6/3a30a640c77c44b63b842e94bda67447.gif"} alt="nature" className={styles.imgTips} />
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
                  alignItems: "left",
                  textAlign: "left",
                }}
              >
                <div>
                  <h3 className={styles.title}>
                    3. Ai không nên áp dụng thói quen này?
                  </h3>
                  <p className={styles.para}>
                  &bull; Người muốn giảm cân:
Sự dao động calo lớn dễ dẫn đến việc ăn bù không kiểm soát, làm quá trình giảm cân trở nên khó khăn.
<br/>
&bull; Người có vấn đề tiêu hóa:
Ăn không đều đặn có thể làm trầm trọng hơn các vấn đề như đau dạ dày, viêm loét.
<br/>
&bull; Người cần ổn định năng lượng:
Những người lao động trí óc hoặc thể lực cao cần cung cấp năng lượng ổn định mỗi ngày để đảm bảo hiệu suất làm việc.
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
                <img src={"https://i.pinimg.com/originals/73/71/56/737156baeb076e4c89d39c0345689656.gif"} alt="nature" className={styles.imgTips} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "left",
                  textAlign: "left",
                }}
              >
                <div>
                  <h3 className={styles.title}>4. Lời khuyên</h3>
                  <p className={styles.para}>
                  <b>Duy trì sự ổn định: </b> <br/> 
                  &bull; Cố gắng phân bổ lượng calo đều đặn trong các ngày. <br/> &bull; Nếu cần điều chỉnh, hãy chênh lệch vừa phải, ví dụ:

Hôm nay ăn 1800 calo → Ngày mai ăn 2200 calo.
<br/>&bull; Ăn theo nhu cầu:
Dựa vào mức độ vận động để điều chỉnh. Ngày ít hoạt động, ăn ít hơn một chút là hợp lý, nhưng không nên ăn dưới mức tối thiểu (nữ: ~1200 calo/ngày; nam: ~1500 calo/ngày).
<br/> <br/>
<b>Lắng nghe cơ thể: </b>
Không nên để cơ thể quá đói, vì dễ dẫn đến việc ăn bù quá mức vào ngày hôm sau.
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

export default Blog10;
