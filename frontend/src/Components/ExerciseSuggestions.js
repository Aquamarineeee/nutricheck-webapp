import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    Typography, Box, Card, CardContent, Button, Alert, Chip, IconButton,
    // Đã bỏ Select, MenuItem, InputLabel, FormControl vì mục tiêu được quản lý ở AppContext/UserInfo
} from "@mui/material";
import Slider from "react-slick";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext"; // Vẫn cần AppContext cho userInfo
import exerciseData from './exerciseData.json';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <IconButton className={className} style={{ ...style, display: "block", right: 0 }} onClick={onClick}>
            <ArrowForwardIosIcon />
        </IconButton>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <IconButton className={className} style={{ ...style, display: "block", left: 0 }} onClick={onClick}>
            <ArrowBackIosIcon />
        </IconButton>
    );
}

const ExerciseSuggestions = () => {
    // Chỉ lấy userInfo từ AppContext, bao gồm cả goal nếu có
    const { userInfo } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    // ĐÃ BỎ: State cục bộ cho goal và useEffect lưu vào localStorage
    // const [localGoal, setLocalGoal] = useState(() => { ... });
    // useEffect(() => { ... }, [localGoal]);

    const [exerciseSuggestions, setExerciseSuggestions] = useState([]);

    // Cài đặt Slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    // ĐÃ BỎ: Hàm xử lý khi người dùng chọn goal (vì không còn UI chọn goal ở đây)
    // const handleLocalGoalChange = useCallback((event) => { ... }, [enqueueSnackbar]);

    const generateExerciseSuggestions = useCallback((isRandom = false) => {
        // Kiểm tra thông tin người dùng và userInfo.goal
        // Bây giờ goal được kỳ vọng có trong userInfo
        if (!userInfo || !userInfo.ACTIVITY || !userInfo.goal) {
            enqueueSnackbar("Vui lòng cập nhật đầy đủ thông tin cá nhân và chọn mục tiêu để nhận gợi ý bài tập.", { variant: "warning" });
            setExerciseSuggestions([]);
            return;
        }

        const { ACTIVITY: activityLevel, goal: currentGoal } = userInfo; // Lấy goal từ userInfo

        const relevantExercises = exerciseData.filter(
            (item) => item.activityLevel === activityLevel || item.activityLevel === "any"
        );

        let suggestionsToDisplay = [];
        const selectedIds = new Set(); // Dùng Set để theo dõi các ID đã chọn, đảm bảo duy nhất

        const addUniqueSuggestion = (item) => {
            // Thêm item chỉ khi chưa có trong danh sách và tổng số gợi ý chưa đạt 3
            if (!selectedIds.has(item.id) && suggestionsToDisplay.length < 3) {
                selectedIds.add(item.id);
                suggestionsToDisplay.push(item);
            }
        };

        if (isRandom) {
            const shuffled = [...relevantExercises].sort(() => 0.5 - Math.random());
            for (let i = 0; i < shuffled.length && suggestionsToDisplay.length < 3; i++) {
                addUniqueSuggestion(shuffled[i]);
            }
            enqueueSnackbar("Đã tạo gợi ý bài tập ngẫu nhiên mới!", { variant: "info" });
        } else {
            // Ưu tiên 1: Khớp hoàn toàn activityLevel và goal
            relevantExercises.filter(
                (item) => item.activityLevel === activityLevel && item.goal === currentGoal
            ).forEach(addUniqueSuggestion);

            // Ưu tiên 2: Khớp activityLevel, mục tiêu "any"
            if (suggestionsToDisplay.length < 3) {
                relevantExercises.filter(
                    (item) => item.activityLevel === activityLevel && item.goal === "any"
                ).forEach(addUniqueSuggestion);
            }

            // Ưu tiên 3: Khớp goal, activityLevel "any"
            if (suggestionsToDisplay.length < 3) {
                relevantExercises.filter(
                    (item) => item.activityLevel === "any" && item.goal === currentGoal
                ).forEach(addUniqueSuggestion);
            }

            // Ưu tiên 4: Các bài tập chung (activityLevel "any", goal "any")
            if (suggestionsToDisplay.length < 3) {
                relevantExercises.filter(
                    (item) => item.activityLevel === "any" && item.goal === "any"
                ).forEach(addUniqueSuggestion);
            }

            // Đảm bảo đủ số lượng bằng cách thêm ngẫu nhiên từ phần còn lại nếu cần
            if (suggestionsToDisplay.length < 3) {
                const remainingExercises = relevantExercises.filter(item => !selectedIds.has(item.id));
                const shuffledRemaining = [...remainingExercises].sort(() => 0.5 - Math.random());
                for (let i = 0; i < shuffledRemaining.length && suggestionsToDisplay.length < 3; i++) {
                    addUniqueSuggestion(shuffledRemaining[i]);
                }
            }

            enqueueSnackbar("Đã tạo gợi ý bài tập cá nhân hóa!", { variant: "success" });
        }
        setExerciseSuggestions(suggestionsToDisplay);
    }, [userInfo, enqueueSnackbar]); // Dependencies cho useCallback: chỉ dùng userInfo

    useEffect(() => {
        // Sử dụng userInfo.goal trực tiếp
        if (userInfo && userInfo.ACTIVITY && userInfo.goal) {
            generateExerciseSuggestions(false); // Tạo gợi ý ban đầu (không random)
        } else {
            setExerciseSuggestions([]); // Xóa gợi ý nếu các tiêu chí không được đáp ứng
        }
    }, [userInfo, generateExerciseSuggestions]); // Dependencies cho useEffect: chỉ dùng userInfo

    return (
        <Box mt={4} className="fade-in">
            <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
                Gợi ý bài tập
            </Typography>

            {/* Cập nhật phần hiển thị thông báo nếu thiếu thông tin */}
            {(!userInfo || !userInfo.ACTIVITY || !userInfo.goal) && (
                <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="body1" sx={{mb:1}}>
                        Vui lòng cập nhật đầy đủ thông tin cá nhân (mức độ hoạt động) và mục tiêu bài tập của bạn để nhận gợi ý phù hợp.
                    </Typography>
                    {/* ĐÃ BỎ: Phần FormControl chọn mục tiêu ở đây, nó sẽ được xử lý ở UserInfo.js */}
                </Alert>
            )}

            {/* Hiển thị gợi ý nếu có đủ thông tin */}
            {exerciseSuggestions.length > 0 && userInfo && userInfo.ACTIVITY && userInfo.goal ? (
                <>
                    <Box mt={2}>
                        <Typography variant="body1">
                            <strong>Dựa trên thông tin của bạn ({userInfo?.ACTIVITY || 'N/A'} và mục tiêu {userInfo.goal === "gain" ? "tăng cân" : userInfo.goal === "lose" ? "giảm cân" : "giữ cân"}):</strong>
                        </Typography>
                    </Box>
                    <Slider {...settings}>
                        {exerciseSuggestions.map((exercise) => (
                            <Box key={exercise.id} p={2}>
                                <Card sx={{ maxWidth: 800, mx: "auto" }}>
                                    {exercise.image && (
                                        <Box
                                            component="img"
                                            src={exercise.image}
                                            alt={exercise.title}
                                            sx={{
                                                width: "100%",
                                                height: 300,
                                                objectFit: "cover",
                                                borderTopLeftRadius: 8,
                                                borderTopRightRadius: 8,
                                            }}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {exercise.title}
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            {exercise.description}
                                        </Typography>

                                        {exercise.note && (
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Lưu ý:</strong> {exercise.note}
                                            </Typography>
                                        )}

                                        {exercise.benefitsForHealth?.length > 0 && (
                                            <Box mb={1}>
                                                <Typography variant="body2" fontWeight="bold">Lợi ích:</Typography>
                                                {exercise.benefitsForHealth.map((item, idx) => (
                                                    <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                                ))}
                                            </Box>
                                        )}

                                        {exercise.diseasePrevention?.length > 0 && (
                                            <Box mb={1}>
                                                <Typography variant="body2" fontWeight="bold">Phòng ngừa bệnh:</Typography>
                                                {exercise.diseasePrevention.map((item, idx) => (
                                                    <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                                ))}
                                            </Box>
                                        )}

                                        {exercise.suitableAgeGroup?.length > 0 && (
                                            <Box mb={1}>
                                                <Typography variant="body2" fontWeight="bold">Phù hợp với:</Typography>
                                                {exercise.suitableAgeGroup.map((item, idx) => (
                                                    <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                                ))}
                                            </Box>
                                        )}

                                        {exercise.realLifeApplication && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                <strong>Ứng dụng thực tế:</strong> {exercise.realLifeApplication}
                                            </Typography>
                                        )}

                                        {exercise.link && (
                                            <Button
                                                variant="outlined"
                                                href={exercise.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ mt: 2 }}
                                            >
                                                Xem video hướng dẫn
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Slider>
                </>
            ) : (
                // Hiển thị cảnh báo nếu không có gợi ý và thông tin mục tiêu chưa đầy đủ
                userInfo?.ACTIVITY && !userInfo?.goal && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Không thể tạo gợi ý bài tập. Vui lòng chọn mục tiêu bài tập của bạn (Tăng/Giảm/Giữ cân).
                    </Alert>
                )
            )}

            {/* Nút đổi gợi ý chỉ hiển thị khi có gợi ý */}
            {exerciseSuggestions.length > 0 && (
                <Box textAlign="center" mt={3}>
                    <Button variant="contained" color="primary" onClick={() => generateExerciseSuggestions(true)}>
                        Đổi gợi ý bài tập khác
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ExerciseSuggestions;