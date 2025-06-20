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

const activityLevelValues = {
    sedentary: 1.2, // Ít vận động
    light: 1.375,   // Vận động nhẹ
    moderate: 1.55, // Vận động trung bình
    active: 1.725,  // Vận động cao
    very_active: 1.9, // Vận động rất cao
};

const ExerciseSuggestions = () => {

    const { userInfo } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();


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



    const generateExerciseSuggestions = useCallback((isRandom = false) => {
        // Kiểm tra thông tin người dùng và mức độ hoạt động
        if (!userInfo || !userInfo.ACTIVITY) {
            enqueueSnackbar("Vui lòng cập nhật đầy đủ thông tin cá nhân và chọn mức độ hoạt động để nhận gợi ý bài tập.", { variant: "warning" });
            setExerciseSuggestions([]);
            return;
        }

        const userActivityLevelString = userInfo.ACTIVITY;
        let userActivityLevelValue;

        // Kiểm tra xem mức độ hoạt động của người dùng có hợp lệ không
        const rawUserActivity = userInfo.ACTIVITY;

        // userInfo.ACTIVITY chỉ là số hoặc chuỗi số, nên chỉ cần parseFloat
        userActivityLevelValue = parseFloat(rawUserActivity);
        
        // Kiểm tra sau khi chuẩn hóa
        if (isNaN(userActivityLevelValue) || userActivityLevelValue === undefined) { // Thêm undefined check để an toàn hơn
            enqueueSnackbar("Mức độ hoạt động của bạn không hợp lệ. Vui lòng kiểm tra lại thông tin cá nhân.", { variant: "error" });
            setExerciseSuggestions([]);
            return;
        }

        // Bước 1: Lọc ra TẤT CẢ các bài tập phù hợp
        // Bao gồm:
        // - Các bài tập có mức độ hoạt động bằng hoặc thấp hơn mức của người dùng.
        // - Các bài tập có activityLevel là "any".
        let allApplicableExercises = exerciseData.filter(item => {
            if (item.activityLevel === "any") {
                return true;
            }
            const itemActivityValue = activityLevelValues[item.activityLevel];
            // Đảm bảo itemActivityValue là một số hợp lệ trước khi so sánh
            return itemActivityValue !== undefined && itemActivityValue <= userActivityLevelValue;
        });

        let suggestionsToDisplay = [];
        const selectedIds = new Set(); // Dùng Set để theo dõi các ID đã chọn, đảm bảo duy nhất và giới hạn 3

        // Hàm tiện ích để thêm bài tập vào danh sách gợi ý (đảm bảo duy nhất và không quá 3)
        const addUniqueSuggestion = (item) => {
            if (item && !selectedIds.has(item.id) && suggestionsToDisplay.length < 3) {
                selectedIds.add(item.id);
                suggestionsToDisplay.push(item);
                return true; // Đã thêm
            }
            return false; // Không thêm
        };

        if (isRandom) {
            // Nếu yêu cầu ngẫu nhiên, xáo trộn tất cả các bài tập phù hợp và chọn 3 bài đầu tiên
            const shuffled = [...allApplicableExercises].sort(() => 0.5 - Math.random());
            for (const item of shuffled) {
                if (addUniqueSuggestion(item) && suggestionsToDisplay.length === 3) {
                    break; // Dừng lại khi đã đủ 3 gợi ý
                }
            }
            enqueueSnackbar("Đã tạo gợi ý bài tập ngẫu nhiên mới!", { variant: "info" });
        } else {
            // --- Ưu tiên 1: Lấy các bài tập có MỨC ĐỘ HOẠT ĐỘNG CHÍNH XÁC của người dùng ---
            allApplicableExercises
                .filter(item => item.activityLevel === userActivityLevelString)
                .forEach(addUniqueSuggestion);

            // --- Ưu tiên 2: Lấy các bài tập có MỨC ĐỘ HOẠT ĐỘNG THẤP HƠN mức của người dùng ---
            // Lấy danh sách các mức độ hoạt động thấp hơn, sắp xếp từ cao nhất (gần nhất với người dùng) đến thấp nhất
            const lowerActivityLevelStrings = Object.keys(activityLevelValues)
                .filter(level => activityLevelValues[level] < userActivityLevelValue)
                .sort((a, b) => activityLevelValues[b] - activityLevelValues[a]); // Sắp xếp giảm dần theo giá trị số

            for (const level of lowerActivityLevelStrings) {
                if (suggestionsToDisplay.length === 3) break; // Dừng nếu đã đủ 3
                allApplicableExercises
                    .filter(item => item.activityLevel === level)
                    .forEach(addUniqueSuggestion);
            }

            // --- Ưu tiên 3: Lấy các bài tập có activityLevel là "any" ---
            if (suggestionsToDisplay.length < 3) {
                allApplicableExercises
                    .filter(item => item.activityLevel === "any")
                    .forEach(addUniqueSuggestion);
            }
            
            // --- Ưu tiên 4: Nếu vẫn chưa đủ 3 bài, bổ sung ngẫu nhiên từ các bài tập còn lại ---
            if (suggestionsToDisplay.length < 3) {
                const remainingApplicableExercises = allApplicableExercises.filter(item => !selectedIds.has(item.id));
                const shuffledRemaining = [...remainingApplicableExercises].sort(() => 0.5 - Math.random());
                for (const item of shuffledRemaining) {
                    if (addUniqueSuggestion(item) && suggestionsToDisplay.length === 3) {
                        break;
                    }
                }
            }

            enqueueSnackbar("Đã tạo gợi ý bài tập cá nhân hóa!", { variant: "success" });
        }
        setExerciseSuggestions(suggestionsToDisplay);
    }, [userInfo, enqueueSnackbar]); // Dependencies của useCallback

    // --- useEffect để tạo gợi ý ban đầu và cập nhật khi userInfo thay đổi ---
    useEffect(() => {
        if (userInfo && userInfo.ACTIVITY) {
            generateExerciseSuggestions(false); // Tạo gợi ý ban đầu (không random)
        } else {
            setExerciseSuggestions([]); // Xóa gợi ý nếu thông tin chưa đủ
        }
    }, [userInfo, generateExerciseSuggestions]); // generateExerciseSuggestions đã là useCallback nên sẽ ổn định

    return (
        <Box mt={4} className="fade-in">
            <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
                Gợi ý bài tập
            </Typography>

            {/* Thông báo nếu thiếu thông tin mức độ hoạt động */}
            {(!userInfo || !userInfo.ACTIVITY) && (
                <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Vui lòng cập nhật đầy đủ thông tin cá nhân và **chọn mức độ hoạt động của bạn** để nhận gợi ý bài tập phù hợp.
                    </Typography>
                </Alert>
            )}

            {/* Hiển thị gợi ý nếu có đủ thông tin và có bài tập */}
            {exerciseSuggestions.length > 0 && userInfo && userInfo.ACTIVITY ? (
                <>
                    <Box mt={2}>
                        <Typography variant="body1">
                            <strong>Dựa trên mức độ hoạt động của bạn ({userInfo?.ACTIVITY || 'N/A'}):</strong>
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
                // Hiển thị cảnh báo nếu có mức độ hoạt động nhưng không tìm thấy gợi ý nào
                userInfo?.ACTIVITY && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Không tìm thấy bài tập phù hợp với mức độ hoạt động của bạn ({userInfo.ACTIVITY}). Vui lòng thử đổi gợi ý ngẫu nhiên.
                    </Alert>
                )
            )}

            {/* Nút đổi gợi ý chỉ hiển thị khi có gợi ý đã được tạo */}
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
