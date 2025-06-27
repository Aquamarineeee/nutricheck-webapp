import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    Typography, Box, Card, CardContent, Button, Alert, Chip, IconButton,
} from "@mui/material";
import Slider from "react-slick";
import { useSnackbar } from "notistack";
import { AppContext } from "../Context/AppContext";
import exerciseData from './exerciseData.json';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <IconButton className={className} style={{ ...style, display: "block", right: 0, top : "50%", }} onClick={onClick}>
            <ArrowForwardIosIcon />
        </IconButton>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <IconButton className={className} style={{ ...style, display: "block", left: 0, top : "50%", }} onClick={onClick}>
            <ArrowBackIosIcon />
        </IconButton>
    );
}

// Thay đổi các giá trị trong activityLevelValues thành số thực
const activityLevelValues = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

const ExerciseSuggestions = () => {
    const { userInfo } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    const [exerciseSuggestions, setExerciseSuggestions] = useState([]);

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
        if (!userInfo || !userInfo.ACTIVITY) {
            enqueueSnackbar("Vui lòng cập nhật đầy đủ thông tin cá nhân và chọn mức độ hoạt động để nhận gợi ý bài tập.", { variant: "warning" });
            setExerciseSuggestions([]);
            return;
        }

        const userActivityLevelString = userInfo.ACTIVITY;
        // Chuyển đổi mức độ hoạt động của người dùng sang số thực
        const userActivityLevelValue = parseFloat(userActivityLevelString);

        if (isNaN(userActivityLevelValue)) { // Chỉ cần kiểm tra isNaN sau parseFloat
            enqueueSnackbar("Mức độ hoạt động của bạn không hợp lệ. Vui lòng kiểm tra lại thông tin cá nhân.", { variant: "error" });
            setExerciseSuggestions([]);
            return;
        }

        // Bước 1: Lọc ra TẤT CẢ các bài tập phù hợp từ exerciseData
        // Đảm bảo rằng item.activityLevel cũng được chuyển đổi thành số để so sánh,
        // hoặc là "any" (không quan tâm mức độ).
        let allApplicableExercises = exerciseData.filter(item => {
            if (item.activityLevel === "any") {
                return true;
            }
            const itemActivityValue = parseFloat(item.activityLevel);
            // Kiểm tra itemActivityValue là số hợp lệ và nhỏ hơn hoặc bằng mức của người dùng
            return !isNaN(itemActivityValue) && itemActivityValue <= userActivityLevelValue;
        });

        // Nếu không có bài tập phù hợp nào, hiển thị cảnh báo
        if (allApplicableExercises.length === 0) {
            enqueueSnackbar("Không tìm thấy bài tập nào phù hợp với mức độ hoạt động của bạn. Vui lòng thử lại hoặc cập nhật thông tin.", { variant: "info" });
            setExerciseSuggestions([]);
            return;
        }

        let suggestionsToDisplay = [];
        const selectedIds = new Set(); // Theo dõi các ID đã chọn để tránh trùng lặp và giới hạn 3 bài

        const addUniqueSuggestion = (item) => {
            if (item && !selectedIds.has(item.id) && suggestionsToDisplay.length < 3) {
                selectedIds.add(item.id);
                suggestionsToDisplay.push(item);
                return true;
            }
            return false;
        };

        if (isRandom) {
            // Nếu yêu cầu ngẫu nhiên, xáo trộn tất cả các bài tập phù hợp và chọn 3 bài đầu tiên
            const shuffled = [...allApplicableExercises].sort(() => 0.5 - Math.random());
            for (const item of shuffled) {
                if (addUniqueSuggestion(item) && suggestionsToDisplay.length === 3) {
                    break;
                }
            }
            enqueueSnackbar("Đã tạo gợi ý bài tập ngẫu nhiên mới!", { variant: "info" });
        } else {
            // --- Ưu tiên 1: Lấy các bài tập có MỨC ĐỘ HOẠT ĐỘNG CHÍNH XÁC của người dùng ---
            const exactMatchExercises = allApplicableExercises
                .filter(item => parseFloat(item.activityLevel) === userActivityLevelValue);
            
            // Xáo trộn và thêm vào danh sách gợi ý
            const shuffledExact = [...exactMatchExercises].sort(() => 0.5 - Math.random());
            for (const item of shuffledExact) {
                if (addUniqueSuggestion(item) && suggestionsToDisplay.length === 3) {
                    break;
                }
            }

            // --- Ưu tiên 2: Lấy các bài tập có MỨC ĐỘ HOẠT ĐỘNG THẤP HƠN mức của người dùng ---
            if (suggestionsToDisplay.length < 3) {
                // Lấy các giá trị mức độ hoạt động (số thực) duy nhất từ exerciseData mà nhỏ hơn mức của người dùng
                // và sắp xếp giảm dần để ưu tiên các mức gần nhất
                const uniqueLowerActivityValues = Array.from(new Set(
                    exerciseData
                        .map(item => parseFloat(item.activityLevel))
                        .filter(value => !isNaN(value) && value < userActivityLevelValue)
                )).sort((a, b) => b - a);

                for (const levelValue of uniqueLowerActivityValues) {
                    if (suggestionsToDisplay.length === 3) break;

                    const levelSpecificExercises = allApplicableExercises.filter(item => 
                        parseFloat(item.activityLevel) === levelValue && !selectedIds.has(item.id)
                    );
                    const shuffledLevelSpecific = [...levelSpecificExercises].sort(() => 0.5 - Math.random());
                    for (const item of shuffledLevelSpecific) {
                        if (addUniqueSuggestion(item) && suggestionsToDisplay.length === 3) {
                            break;
                        }
                    }
                }
            }
            
            // --- Ưu tiên 3: Lấy các bài tập có activityLevel là "any" ---
            if (suggestionsToDisplay.length < 3) {
                const anyLevelExercises = allApplicableExercises.filter(item => 
                    item.activityLevel === "any" && !selectedIds.has(item.id)
                );
                const shuffledAny = [...anyLevelExercises].sort(() => 0.5 - Math.random());
                for (const item of shuffledAny) {
                    if (addUniqueSuggestion(item) && suggestionsToDisplay.length === 3) {
                        break;
                    }
                }
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

            // Nếu sau tất cả các bước vẫn không có gợi ý nào, hãy kiểm tra lại dữ liệu
            if (suggestionsToDisplay.length === 0) {
                enqueueSnackbar("Rất tiếc, không tìm thấy bài tập phù hợp nào theo tiêu chí của bạn. Vui lòng thử tạo gợi ý ngẫu nhiên hoặc kiểm tra lại dữ liệu bài tập.", { variant: "info" });
            } else {
                enqueueSnackbar("Đã tạo gợi ý bài tập cá nhân hóa!", { variant: "success" });
            }
        }
        setExerciseSuggestions(suggestionsToDisplay);
    }, [userInfo, enqueueSnackbar]); 

    // Sử dụng useEffect để gọi generateExerciseSuggestions khi userInfo thay đổi
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
                // Chỉ hiển thị cảnh báo này nếu có thông tin người dùng nhưng không có gợi ý bài tập
                userInfo?.ACTIVITY && exerciseSuggestions.length === 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Không tìm thấy bài tập phù hợp với mức độ hoạt động của bạn ({userInfo.ACTIVITY}). Vui lòng thử đổi gợi ý ngẫu nhiên.
                    </Alert>
                )
            )}

            {/* Nút đổi gợi ý chỉ hiển thị khi có gợi ý đã được tạo hoặc có thể tạo (có userInfo và activity) */}
            {userInfo?.ACTIVITY && ( // Nút luôn hiển thị nếu có activity level để user có thể thử random
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
