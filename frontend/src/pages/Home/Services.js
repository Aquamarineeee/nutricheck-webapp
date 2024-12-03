import React from "react";
import styles from "../../styles/home.module.css";
import { motion } from "framer-motion";

const titleVariants = {
  offscreen: {
    x: 40,
  },
  onscreen: {
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
    },
  },
};

const descVariants = {
  offscreen: {
    x: 40,
  },
  onscreen: {
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.5,
    },
  },
};
const imgVariants = {
  offscreen: {
    x: -100,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.5,
    },
  },
};

const Services = () => {
  return (
    <div className={styles.servicesContainer}>
      <div>
        <h1 className={styles.servicesTitle}>Dịch Vụ Của Chúng Tôi</h1>

        <div className={styles.servicesLayout}>
          <motion.div className={styles.serviceItem}>
            <motion.img
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              className={styles.serviceImg}
              variants={imgVariants}
              src="/static/img/services_dashboard.png"
              alt="Bảng Điều Khiển"
            />
            <div className={styles.serviceText}>
              <motion.h1
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                variants={titleVariants}
                className={styles.serviceTitle}
              >
                Sức Khỏe Hôm Nay
              </motion.h1>
              <motion.p variants={descVariants} className={styles.serviceDesc}>
                Bảng điều khiển chính của chúng tôi theo dõi tiến độ calo tiêu
                thụ hôm nay cùng với lượng chất dinh dưỡng đã nạp. Bạn cũng có
                thể xem các món ăn và chất dinh dưỡng liên quan.
              </motion.p>
            </div>
          </motion.div>

          <motion.div className={styles.serviceItem}>
            <motion.img
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              className={styles.serviceImg}
              variants={imgVariants}
              src="/static/img/analytic.png"
              alt="Báo Cáo Hàng Tuần"
            />
            <div className={styles.serviceText}>
              <motion.h1
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                variants={titleVariants}
                className={styles.serviceTitle}
              >
                Báo Cáo Chi Tiết
              </motion.h1>
              <motion.p variants={descVariants} className={styles.serviceDesc}>
                Biểu đồ phân tích của chúng tôi cung cấp chi tiết về lượng chất
                dinh dưỡng nạp vào hàng ngày. Bạn có thể theo dõi thực phẩm cùng
                các chất dinh dưỡng trong 7 ngày qua.
              </motion.p>
            </div>
          </motion.div>
        </div>

        <div className={styles.servicesLayout}>
          <motion.div className={styles.serviceItem}>
            <motion.img
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={imgVariants}
              className={styles.serviceImg}
              src="/static/img/food.png"
              alt="Theo Dõi Bữa Ăn"
            />
            <div className={styles.serviceText}>
              <motion.h1
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                variants={titleVariants}
                className={styles.serviceTitle}
              >
                Theo Dõi Bữa Ăn
              </motion.h1>
              <motion.p variants={descVariants} className={styles.serviceDesc}>
                Bạn có thể xem những gì đã ăn trong một tuần. Điều này giúp bạn
                nhận thức rõ hơn về thực phẩm bạn tiêu thụ, kiểm soát những gì
                cần và không cần. Bạn sẽ không bao giờ quên đã ăn gì! 😝
              </motion.p>
            </div>
          </motion.div>

          <motion.div className={styles.serviceItem}>
            <motion.img
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={imgVariants}
              className={styles.serviceImg}
              src="/static/img/services_details.png"
              alt="Ghi Lại Chi Tiết"
            />
            <div className={styles.serviceText}>
              <motion.h1
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                variants={titleVariants}
                className={styles.serviceTitle}
              >
                Ghi Lại và Xác Định
              </motion.h1>
              <motion.p variants={descVariants} className={styles.serviceDesc}>
                Sau khi chụp hoặc tải lên hình ảnh, chúng tôi sẽ cung cấp tổng
                calo và tất cả chất dinh dưỡng bạn sẽ nhận được. Bạn có thể hủy
                hoặc thêm thực phẩm vào nhật ký của mình.
              </motion.p>
            </div>
          </motion.div>
        </div>

        <div className={styles.servicesLayout}>
          <motion.div className={styles.serviceItem}>
            <motion.img
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={imgVariants}
              className={styles.serviceImg}
              src="/static/img/services_blog.png"
              alt="Blog"
            />
            <div className={styles.serviceText}>
              <motion.h1
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                variants={titleVariants}
                className={styles.serviceTitle}
              >
                Tất Cả Thông Tin Bạn Cần Biết
              </motion.h1>
              <motion.p variants={descVariants} className={styles.serviceDesc}>
                Phần Blog cung cấp nghiên cứu chi tiết về thực phẩm, chất dinh
                dưỡng, kế hoạch ăn kiêng lành mạnh, danh mục thực phẩm dựa trên
                chất dinh dưỡng, và các kế hoạch thành công dựa trên mục tiêu cơ
                thể của bạn.
              </motion.p>
            </div>
          </motion.div>
          <motion.div className={styles.serviceItem}>
            <motion.img
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              variants={imgVariants}
              className={styles.serviceImg}
              src="https://i.pinimg.com/originals/6d/46/da/6d46da1e0527b62bbfea166acb0e52f2.gif"
              alt="Project by"
            />
            <div className={styles.serviceText}>
              <motion.h1
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                variants={titleVariants}
                className={styles.serviceTitle}
              >
                Project by...
              </motion.h1>
              <motion.p variants={descVariants} className={styles.serviceDesc}>
                Cả dự án được làm bởi - Nguyễn Ngọc Anh - 11A2
                All design & code by Ngọc Anh :3
              </motion.p>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
  );
};

export default Services;
