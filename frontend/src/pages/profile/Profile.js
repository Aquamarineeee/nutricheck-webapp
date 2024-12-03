import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import nature from "../../images/profile.jpg";
import { Button } from "@mui/material";
import styles from "../../styles/blog.module.css";
import { AppContext } from "../../Context/AppContext";

const Profile = () => {
  const { userInfo, handleLogout } = useContext(AppContext);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--backgroundColor)",
        paddingBottom: "5rem",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--backgroundColor)",
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px 0px",
          display: "flex",
          justifyContent: "start",
        }}
      >
        <h1
          style={{
            display: "inline-block",
            margin: "0 auto",
            padding: "0.8rem",
          }}
        >
          Hồ sơ
        </h1>
      </div>
      <Container maxWidth="sm" sx={{ pb: 3, mt: 10 }}>
        <Box
          sx={{
            bgcolor: "white",
            p: 4,
            borderRadius: "16px",
            boxShadow: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <div>
              <img
                src="https://avatar.iran.liara.run/public/boy"
                alt=""
                style={{ borderRadius: "50%", objectFit: "contain" }}
                className={styles.Img}
              />
            </div>
            <div>
              <h3>{userInfo.USERNAME}</h3>
              <p>{userInfo.EMAIL}</p>
            </div>
          </div>

          <div
            style={{
              maxHeight: "50px",
            }}
            className={styles.detailsCon}
          >
            <div>
              <h3>Tuổi</h3>
            </div>
            <div>
              <p>
                <span>{userInfo.AGE}</span> Tuổi
              </p>
            </div>
          </div>
          <div
            style={{
              maxHeight: "70px",
            }}
            className={styles.detailsCon}
          >
            <div>
              <h3>Giới tính</h3>
            </div>
            <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '17px'}}>{userInfo.GENDER === 'female' ? 'Nữ' : userInfo.GENDER === 'male' ? 'Nam' : userInfo.GENDER}</p>
            </div>
          </div>
          <div
            style={{
              maxHeight: "70px",
            }}
            className={styles.detailsCon}
          >
            <div>
              <h3>Chiều cao</h3>
            </div>
            <div>
              <p>{userInfo.HEIGHT} cm</p>
            </div>
          </div>
          <div
            style={{
              maxHeight: "50px",
            }}
            className={styles.detailsCon}
          >
            <div>
              <h3>Cân nặng</h3>
            </div>
            <div>
              <p>
                <span>{userInfo.WEIGHT}</span> kg
              </p>
            </div>
          </div>
          <div
            style={{
              paddingTop: "5rem",
              paddingLeft: "5rem",
              paddingRight: "5rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <Button onClick={handleLogout} variant="contained" color="info">
                Đăng xuất
              </Button>
            </div>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default Profile;
