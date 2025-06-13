import React, { useState, useCallback } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput,
    Button,
    Divider,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSnackbar } from 'notistack';

// Import keyframes từ @emotion/react
import { keyframes } from '@emotion/react';

// Import dữ liệu từ file JSON
import herbsData from './herbsData.json'; // Đảm bảo đường dẫn đúng

// Lọc ra danh sách dược liệu duy nhất từ dữ liệu của bạn
const sleepHerbsOptions = [...new Set(herbsData.flatMap(item => item.herbs))];
// Giả sử bạn cũng có một danh sách các điều kiện
const sleepConditionsOptions = ['Mất ngủ', 'Căng thẳng', 'Lo âu', 'Ngủ không sâu giấc', 'Giật mình khi ngủ', 'Khó ngủ'];

// Định nghĩa keyframes animation
const floatAnimation = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

function generateSleepAidSuggestions() {
    const [selectedSleepHerbs, setSelectedSleepHerbs] = useState([]);
    const [selectedSleepConditions, setSelectedSleepConditions] = useState([]);
    const [suggestionsList, setSuggestionsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const generateSleepAidSuggestion = useCallback(() => {
        let matchedSuggestions = [];

        let baseFilteredSuggestions = herbsData.filter(item => {
            const matchesCondition = selectedSleepConditions.length === 0 ||
                selectedSleepConditions.some(condition => item.conditions.includes(condition));

            const matchesHerb = selectedSleepHerbs.length === 0 ||
                selectedSleepHerbs.some(herb => item.herbs.includes(herb));

            return matchesCondition && matchesHerb;
        });

        if (baseFilteredSuggestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * baseFilteredSuggestions.length);
            matchedSuggestions.push({
                ...baseFilteredSuggestions[randomIndex],
                type: 'random_suggestion'
            });
        } else {
            if (herbsData.length > 0) {
                const randomIndex = Math.floor(Math.random() * herbsData.length);
                matchedSuggestions.push({
                    ...herbsData[randomIndex],
                    type: 'random_fallback'
                });
            }
        }

        if (selectedSleepHerbs.length > 0) {
            selectedSleepHerbs.forEach(chosenHerb => {
                const herbSpecificSuggestions = herbsData.filter(item =>
                    item.herbs.includes(chosenHerb)
                );

                if (herbSpecificSuggestions.length > 0) {
                    const randomHerbIndex = Math.floor(Math.random() * herbSpecificSuggestions.length);
                    matchedSuggestions.push({
                        ...herbSpecificSuggestions[randomHerbIndex],
                        type: 'herb_specific',
                        chosenHerb: chosenHerb
                    });
                } else {
                    console.warn(`Không tìm thấy gợi ý nào cho dược liệu: ${chosenHerb}`);
                }
            });
        }

        const uniqueSuggestions = [];
        const seenIds = new Set();
        matchedSuggestions.forEach(suggestion => {
            if (!seenIds.has(suggestion.id)) {
                uniqueSuggestions.push(suggestion);
                seenIds.add(suggestion.id);
            }
        });

        if (uniqueSuggestions.length > 0) {
            setSuggestionsList(uniqueSuggestions);
            setCurrentPage(0);
            enqueueSnackbar("Đã tạo gợi ý hỗ trợ giấc ngủ!", { variant: "success" });
        } else {
            setSuggestionsList([]);
            enqueueSnackbar("Không tìm thấy gợi ý hỗ trợ giấc ngủ phù hợp với lựa chọn của bạn.", { variant: "info" });
        }
    }, [selectedSleepConditions, selectedSleepHerbs, enqueueSnackbar]);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => (prevPage + 1) % suggestionsList.length);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => (prevPage - 1 + suggestionsList.length) % suggestionsList.length);
    };

    const currentSuggestion = suggestionsList[currentPage];

    return (
        <Box sx={{ p: 3 }}>
            {/* Các FormControl của bạn */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="sleep-herbs-label">Dược liệu bạn muốn thử</InputLabel>
                <Select
                    labelId="sleep-herbs-label"
                    multiple
                    value={selectedSleepHerbs}
                    onChange={(e) => setSelectedSleepHerbs(e.target.value)}
                    input={<OutlinedInput label="Dược liệu bạn muốn thử" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 224,
                                width: 250,
                            },
                        },
                    }}
                >
                    {sleepHerbsOptions.map((herb) => (
                        <MenuItem key={herb} value={herb}>
                            <Checkbox checked={selectedSleepHerbs.indexOf(herb) > -1} />
                            <ListItemText primary={herb} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel id="sleep-conditions-label">Tình trạng giấc ngủ</InputLabel>
                <Select
                    labelId="sleep-conditions-label"
                    multiple
                    value={selectedSleepConditions}
                    onChange={(e) => setSelectedSleepConditions(e.target.value)}
                    input={<OutlinedInput label="Tình trạng giấc ngủ" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 224,
                                width: 250,
                            },
                        },
                    }}
                >
                    {sleepConditionsOptions.map((condition) => (
                        <MenuItem key={condition} value={condition}>
                            <Checkbox checked={selectedSleepConditions.indexOf(condition) > -1} />
                            <ListItemText primary={condition} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={generateSleepAidSuggestion} sx={{ mt: 2 }}>
                Tạo gợi ý hỗ trợ giấc ngủ
            </Button>
            <Divider sx={{ my: 3 }} />

            {suggestionsList.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <IconButton onClick={handlePrevPage} disabled={suggestionsList.length <= 1}>
                        <ArrowBackIosIcon />
                    </IconButton>

                    <Card
                        // Áp dụng animation vào Card
                        sx={{
                            maxWidth: 800,
                            mx: "auto",
                            mt: 4,
                            width: '100%',
                            animation: `${floatAnimation} 3s ease-in-out infinite`, // Áp dụng animation
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Gợi ý cho bạn: {currentSuggestion.title}
                            </Typography>
                            {currentSuggestion.type === 'herb_specific' && (
                                <Typography variant="caption" display="block" sx={{ mb: 1, fontStyle: 'italic' }}>
                                    (Gợi ý theo dược liệu đã chọn: **{currentSuggestion.chosenHerb}**)
                                </Typography>
                            )}

                            {currentSuggestion.image && (
                                <Box
                                    component="img"
                                    src={currentSuggestion.image}
                                    alt={currentSuggestion.title}
                                    sx={{
                                        width: "100%",
                                        height: 200,
                                        objectFit: "cover",
                                        borderRadius: 1,
                                        mb: 2
                                    }}
                                />
                            )}
                            <Typography variant="body1" paragraph>
                                {currentSuggestion.description}
                            </Typography>

                            {currentSuggestion.materials && currentSuggestion.materials.length > 0 && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Cần chuẩn bị:</strong> {currentSuggestion.materials.join(', ')}
                                </Typography>
                            )}

                            {currentSuggestion.prepTime && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Thời gian chuẩn bị:</strong> {currentSuggestion.prepTime}
                                </Typography>
                            )}

                            {currentSuggestion.howTo && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Cách thực hiện:</strong> {currentSuggestion.howTo}
                                </Typography>
                            )}

                            {currentSuggestion.realLifeApplication && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Ứng dụng thực tế:</strong> {currentSuggestion.realLifeApplication}
                                </Typography>
                            )}

                            {currentSuggestion.suitableAgeGroup && currentSuggestion.suitableAgeGroup.length > 0 && (
                                <Box mb={1}>
                                    <Typography variant="body2" fontWeight="bold">Phù hợp với:</Typography>
                                    {currentSuggestion.suitableAgeGroup.map((item, idx) => (
                                        <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                    ))}
                                </Box>
                            )}

                            {currentSuggestion.benefits && currentSuggestion.benefits.length > 0 && (
                                <Box mb={1}>
                                    <Typography variant="body2" fontWeight="bold">Lợi ích:</Typography>
                                    {currentSuggestion.benefits.map((item, idx) => (
                                        <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                    ))}
                                </Box>
                            )}

                            {currentSuggestion.prevention && currentSuggestion.prevention.length > 0 && (
                                <Box mb={1}>
                                    <Typography variant="body2" fontWeight="bold">Phòng ngừa:</Typography>
                                    {currentSuggestion.prevention.map((item, idx) => (
                                        <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                                    ))}
                                </Box>
                            )}
                            {currentSuggestion.slink && (
                                <Box mb={1}>
                                    <Typography variant="body2" fontWeight="bold">Nguồn:</Typography>
                                    <Chip label={currentSuggestion.slink} sx={{ m: 0.5 }} />
                                </Box>
                            )}

                            {currentSuggestion.link && (
                                <Button
                                    variant="outlined"
                                    href={currentSuggestion.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ mt: 2 }}
                                >
                                    Xem thêm
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                    <IconButton onClick={handleNextPage} disabled={suggestionsList.length <= 1}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            )}

            {suggestionsList.length > 1 && (
                <Button variant="outlined" onClick={generateSleepAidSuggestion} sx={{ mt: 2 }}>
                    Tạo gợi ý khác (ngẫu nhiên)
                </Button>
            )}
        </Box>
    );
}

export default generateSleepAidSuggestionsr;
