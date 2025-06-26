import React, { useState, useCallback } from 'react';
import {
    Typography, Box, Alert, FormControl, TextField,
    Button, Paper, Chip, Divider, Autocomplete, List, ListItem
} from '@mui/material';
import { useSnackbar } from 'notistack';
import menuData from './menu.json';

function HealthUtilsComponent() {
    const healthConditions = {
        calorie_deficit: [
            "Thiếu máu", "Suy dinh dưỡng", "Loãng xương", "Mất ngủ", "Mệt mỏi mãn tính",
            "Hạ đường huyết", "Trầm cảm", "Hệ miễn dịch yếu", "Chậm phát triển", "Dễ nhiễm trùng",
            "Giảm cân không kiểm soát", "Chán ăn tâm thần", "Rối loạn tiêu hóa", "Thiếu vitamin D",
            "Thiếu vitamin B12", "Hạ huyết áp", "Suy thận", "Giảm cơ", "Suy gan", "Thiếu máu cơ tim",
            "Thiếu sắt", "Thiếu kẽm", "Thiếu Vitamin A", "Thiếu Vitamin C", "Thiếu Folate",
            "Huyết áp thấp", "Rối loạn ăn uống", "Phục hồi chậm sau bệnh", "Tóc khô, dễ gãy", "Da xanh xao, khô",
            "Đau nửa đầu", "Lạnh tay chân", "Suy giảm trí nhớ", "Tê bì chân tay", "Giảm khả năng tập trung"
        ],
        calorie_surplus: [
            "Tiểu đường", "Béo phì", "Gan nhiễm mỡ", "Huyết áp cao", "Cholesterol cao",
            "Bệnh gout", "Viêm khớp", "Đột quỵ", "Ung thư đại tràng", "Chứng ngưng thở khi ngủ",
            "Loãng mạch máu", "Viêm tụy", "Rối loạn lipid máu", "Bệnh tim mạch", "Hội chứng buồng trứng đa nang",
            "Rối loạn chuyển hóa", "Chứng đau lưng mãn tính", "Hội chứng ruột kích thích", "Trào ngược dạ dày",
            "Bệnh Parkinson",
            "Tiền tiểu đường", "Hội chứng chuyển hóa", "Thoái hóa khớp", "Sỏi mật", "Tăng nguy cơ ung thư (vú, thận)",
            "Ngừng thở khi ngủ", "Hen suyễn nặng hơn", "Bệnh thận mãn tính", "Viêm gan không do rượu", "Bệnh túi mật",
            "Mỡ máu cao", "Khó thở", "Đau khớp gối", "Đau khớp háng", "Vấn đề về xương khớp"
        ]
    };

    // --- 2. State của Component ---
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [feedbackContentArray, setFeedbackContentArray] = useState([]); // Sẽ lưu mảng các JSX elements
    const [alertMessage, setAlertMessage] = useState("Chúng tôi sẽ cung cấp gợi ý dinh dưỡng dựa trên tình trạng sức khỏe bạn chọn.");
    const [alertSeverity, setAlertSeverity] = useState("info");

    const { enqueueSnackbar } = useSnackbar();

    const totalDailyCalories = 2000; // Giá trị calo mẫu

    // --- 3. Hàm Logic ---

    const getDetailedHealthInfo = useCallback((conditionName) => {
        return menuData.find(item => item.name === conditionName);
    }, []);

    // Hàm để tạo danh sách options cho Autocomplete từ healthConditions cục bộ
    const getAllAutocompleteOptions = useCallback(() => {
        const deficitNames = healthConditions.calorie_deficit;
        const surplusNames = healthConditions.calorie_surplus;
        const allNames = [...new Set([...deficitNames, ...surplusNames])];
        return allNames.sort();
    }, [healthConditions]);

    // Hàm xử lý chính khi click nút
    const processAndSetHealthFeedback = useCallback(() => {
        if (selectedConditions.length === 0) {
            setFeedbackContentArray([]); // Xóa feedback cũ
            setAlertMessage("Vui lòng chọn hoặc nhập ít nhất một tình trạng sức khỏe.");
            setAlertSeverity("warning");
            enqueueSnackbar("Vui lòng chọn hoặc nhập ít nhất một tình trạng sức khỏe.", { variant: "warning" });
            return;
        }

        const newFeedbackContentArray = [];
        let finalAlertMessage = "Gợi ý sức khỏe và Thực đơn";
        let finalAlertSeverity = "success";

        selectedConditions.forEach((conditionName, index) => {
            const diseaseInfo = getDetailedHealthInfo(conditionName);

            if (diseaseInfo) {
                newFeedbackContentArray.push(
                    <React.Fragment key={conditionName}> {/* Dùng React.Fragment để nhóm các elements */}
                        <Typography variant="h6" sx={{ mt: index === 0 ? 0 : 3, mb: 1.5, color: 'primary.dark', fontWeight: 'bold', textAlign: 'center' }}>
                            {diseaseInfo.name}
                        </Typography>
                        {diseaseInfo.image && (
                            <Box
                                component="img"
                                src={diseaseInfo.image}
                                alt={diseaseInfo.name}
                                sx={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', mt: 1, mb: 2 }}
                            />
                        )}
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <Typography component="strong" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>Mô tả:</Typography> {diseaseInfo.description}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <Typography component="strong" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>Dữ liệu chuẩn:</Typography> {diseaseInfo.standard_data}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <Typography component="strong" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>Gợi ý thực đơn nên ăn:</Typography> {diseaseInfo.diet_suggestions}
                        </Typography>

                        {diseaseInfo.recommendations && diseaseInfo.recommendations.should_eat.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                                <Typography component="strong" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>Thực phẩm NÊN ăn:</Typography>
                                <List dense sx={{ py: 0 }}>
                                    {diseaseInfo.recommendations.should_eat.map((item, itemIndex) => (
                                        <ListItem key={itemIndex} sx={{ py: 0.2, pl: 0 }}>
                                            <Typography variant="body2" sx={{ ml: 1 }}>• {item}</Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                        {diseaseInfo.recommendations && diseaseInfo.recommendations.should_avoid.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                                <Typography component="strong" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>Thực phẩm KHÔNG NÊN ăn:</Typography>
                                <List dense sx={{ py: 0 }}>
                                    {diseaseInfo.recommendations.should_avoid.map((item, itemIndex) => (
                                        <ListItem key={itemIndex} sx={{ py: 0.2, pl: 0 }}>
                                            <Typography variant="body2" sx={{ ml: 1 }}>• {item}</Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            <Typography component="strong" sx={{ fontWeight: 'bold' }}>Nguồn tham khảo:</Typography> {diseaseInfo.sources}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            <Typography component="strong" sx={{ fontWeight: 'bold' }}>Hướng dẫn và Khuyến cáo:</Typography> {diseaseInfo.guidance}
                        </Typography>
                        {index < selectedConditions.length - 1 && <Divider sx={{ my: 3 }} />} {/* Divider giữa các bệnh */}
                    </React.Fragment>
                );

                if (healthConditions.calorie_deficit.includes(conditionName)) {
                    finalAlertMessage = `Lưu ý: Bạn đang có tình trạng thiếu calo (${conditionName}). Cân nhắc tăng lượng calo nạp vào.`;
                    finalAlertSeverity = "info";
                } else if (healthConditions.calorie_surplus.includes(conditionName)) {
                    finalAlertMessage = `Lưu ý: Bạn đang có tình trạng thừa calo (${conditionName}). Cân nhắc giảm lượng calo tiêu thụ.`;
                    finalAlertSeverity = "info";
                }

            } else {
                newFeedbackContentArray.push(
                    <React.Fragment key={conditionName}>
                        <Typography variant="h6" sx={{ mt: index === 0 ? 0 : 3, mb: 1.5, color: 'error.main', fontWeight: 'bold', textAlign: 'center' }}>
                            {conditionName}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Không tìm thấy thông tin chi tiết cho "{conditionName}". Vui lòng tham khảo ý kiến chuyên gia dinh dưỡng.
                        </Typography>
                        {index < selectedConditions.length - 1 && <Divider sx={{ my: 3 }} />}
                    </React.Fragment>
                );
                finalAlertMessage = `Không tìm thấy thông tin chi tiết cho một số tình trạng đã chọn.`;
                finalAlertSeverity = "warning";
            }
        });

        setFeedbackContentArray(newFeedbackContentArray); // Lưu mảng các JSX elements vào state
        setAlertMessage(finalAlertMessage);
        setAlertSeverity(finalAlertSeverity);

        if (finalAlertSeverity === "warning") {
            enqueueSnackbar(finalAlertMessage, { variant: "warning" });
        } else if (finalAlertSeverity === "success") {
            enqueueSnackbar("Gợi ý dinh dưỡng đã sẵn sàng!", { variant: "success" });
        }

    }, [selectedConditions, totalDailyCalories, enqueueSnackbar, getDetailedHealthInfo, healthConditions]);


    return (
        <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto', p: 2 }}>

            {/* Health Feedback Section */}
            <Box mt={4} className="fade-in" sx={{ width: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: 'primary.dark' }}>
                    Cảnh báo sức khỏe và gợi ý dinh dưỡng
                </Typography>
                <Alert severity={alertSeverity} sx={{ marginBottom: "20px", borderRadius: '8px', textAlign: 'left' }}>
                    {alertMessage}
                </Alert>

                <FormControl fullWidth margin="normal">
                    <Autocomplete
                        multiple
                        freeSolo
                        options={getAllAutocompleteOptions()}
                        value={selectedConditions}
                        onChange={(event, newValue) => {
                            setSelectedConditions(newValue);
                            setFeedbackContentArray([]); // Reset feedback cũ
                            setAlertMessage("Chúng tôi sẽ cung cấp gợi ý dinh dưỡng dựa trên tình trạng sức khỏe bạn chọn.");
                            setAlertSeverity("info");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn hoặc nhập tình trạng sức khỏe bạn đang gặp phải"
                                placeholder="Ví dụ: Tiểu đường, Mệt mỏi mãn tính, ..."
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    key={index}
                                    label={option}
                                    {...getTagProps({ index })}
                                    sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', borderRadius: '4px' }}
                                />
                            ))
                        }
                    />
                </FormControl>
                <Box sx={{ mt: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={processAndSetHealthFeedback}
                        disabled={selectedConditions.length === 0}
                        sx={{
                            padding: '14px 35px',
                            fontSize: '1.2rem',
                            borderRadius: '10px',
                            boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                            transition: 'transform 0.2s ease-in-out, boxShadow 0.2s ease-in-out',
                            '&:hover': {
                                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                                transform: 'translateY(-2px)',
                            },
                            '&:disabled': {
                                opacity: 0.6,
                                cursor: 'not-allowed',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Nhận gợi ý thực đơn bệnh lý
                    </Button>

                    {feedbackContentArray.length > 0 && ( // Kiểm tra mảng feedback có nội dung
                        <Paper
                            elevation={6}
                            sx={{
                                mt: 4,
                                p: 4,
                                width: '100%',
                                maxWidth: '900px',
                                bgcolor: 'background.paper',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 3 }}>
                                Gợi ý sức khỏe và Thực đơn
                            </Typography>
                            <Box sx={{ width: '100%', textAlign: 'left' }}> {/* Bỏ whiteSpace: 'pre-line' vì đã dùng Typography */}
                                <Alert severity="success" sx={{ width: '100%', p: 3, borderRadius: '8px', bgcolor: '#CCFFCC' }}>
                                   {feedbackContentArray} {/* Render mảng các JSX elements */}
                                </Alert>
                            </Box>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default HealthUtilsComponent;
