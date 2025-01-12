import React from "react";
import styles from "../../styles/home.module.css";
import { motion } from "framer-motion";

const imgVariants = {
  offscreen: {
    y: 200,
    opacity: 0.1,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1,
    },
  },
};

const About = () => {
  return (
    <div>
      <h1 className={styles.aboutTitle}>Về chúng tôi</h1>
      <div className={styles.why}>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.8 }}
          className={styles.imageWrapper}
        >
          <motion.img
            variants={imgVariants}
            className={styles.whyImg}
            src="/static/img/why-1.png"
            alt="Why Choose Us"
          />
        </motion.div>
        <motion.div className={styles.text}>
          Hãy thư giãn, chúng tôi sẽ chăm sóc chế độ ăn uống lành mạnh của bạn
        </motion.div>
      </div>

      <div
        className={`${styles.why} ${styles.rev}`}
        style={{ backgroundColor: "#f6f6f6" }}
      >
        <motion.div className={styles.text}>
          Chỉ cần chụp ảnh và biết bạn đang ăn gì
        </motion.div>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.8 }}
          className={styles.imageWrapper}
        >
          <motion.img
            variants={imgVariants}
            className={styles.whyImg}
            src="/static/img/why-2.png"
            alt="Snap and Know"
          />
        </motion.div>
      </div>

      <div className={styles.why}>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.8 }}
          className={styles.imageWrapper}
        >
          <motion.img
            variants={imgVariants}
            className={styles.whyImg}
            src="/static/img/why-3.png"
            alt="Analytics"
          />
        </motion.div>
        <motion.div className={styles.text}>
          Chúng tôi cho phép bạn theo dõi và so sánh chế độ ăn uống của bạn
          trong tuần qua qua cách phân tích thật chi tiế, kĩ càng và đầy đủ 
        </motion.div>
      </div>
    </div>
  );
};

export default About;
