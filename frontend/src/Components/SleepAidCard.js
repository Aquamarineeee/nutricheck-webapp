// src/Components/SleepAidCard.js

import React, { useState, useCallback } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
    OutlinedInput, Button, Divider, Card, CardContent, Typography, Box,
    Chip, IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSnackbar } from 'notistack';
import { keyframes } from '@emotion/react';

// Đảm bảo đường dẫn đúng
import herbsData from './herbsData.json';
// Import sleepAidData
import sleepAidData from './sleepAidData.json'; 

const sleepHerbsOptions = [...new Set(herbsData.flatMap(item => item.herbs))];
const sleepConditionsOptions = ['Mất ngủ', 'Căng thẳng', 'Lo âu', 'Ngủ không sâu giấc', 'Giật mình khi ngủ', 'Khó ngủ'];

const floatAnimation = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const SleepAidCard = () => {
    const [selectedSleepHerbs, setSelectedSleepHerbs] = useState([]);
    const [selectedSleepConditions, setSelectedSleepConditions] = useState([]);
    const [suggestionsList, setSuggestionsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const generateSleepAidSuggestion = useCallback((isRandomButton = false) => { // Thêm tham số để biết gọi từ đâu
        let potentialSuggestions = [];

        // 1. Ưu tiên tìm kiếm từ herbsData dựa trên các tiêu chí đã chọn
        const filteredHerbsData = herbsData.filter(item => {
            const matchesCondition = selectedSleepConditions.length === 0 ||
                selectedSleepConditions.some(condition => item.conditions.includes(condition));
            const matchesHerb = selectedSleepHerbs.length === 0 ||
                selectedSleepHerbs.some(herb => item.herbs.includes(herb));
            return matchesCondition && matchesHerb;
        });

        // 2. Tìm kiếm từ sleepAidData dựa trên các điều kiện đã chọn
        const filteredSleepAidData = sleepAidData.filter(item => {
            return selectedSleepConditions.length === 0 ||
                   selectedSleepConditions.some(condition => item.conditions.includes(condition));
        });

        // Combine and prioritize
        // If filters are applied, prioritize results that match the filters.
        if (selectedSleepConditions.length > 0 || selectedSleepHerbs.length > 0) {
            // Add filtered herbsData suggestions
            potentialSuggestions.push(...filteredHerbsData.map(item => ({ ...item, source: 'herbsData' })));
            // Add filtered sleepAidData suggestions
            potentialSuggestions.push(...filteredSleepAidData.map(item => ({ ...item, source: 'sleepAidData' })));
        }

        // If no specific filters or no matches, or if button "Tạo gợi ý khác" is clicked,
        // include all data for random selection (but still prefer filtered if available)
        if (potentialSuggestions.length === 0 || isRandomButton) {
            // If random button is clicked or no filtered suggestions, broaden the scope
            // Combine all herbsData and sleepAidData
            const allData = [
                ...herbsData.map(item => ({ ...item, source: 'herbsData' })),
                ...sleepAidData.map(item => ({ ...item, source: 'sleepAidData' }))
            ];

            // If filters are present, we still want to prefer those that partially match
            if (selectedSleepConditions.length > 0 || selectedSleepHerbs.length > 0) {
                const partiallyMatched = allData.filter(item => {
                    const matchesCondition = selectedSleepConditions.length === 0 ||
                        selectedSleepConditions.some(condition => item.conditions?.includes(condition)); // Use ?. for safety
                    const matchesHerb = selectedSleepHerbs.length === 0 ||
                        item.herbs?.some(herb => selectedSleepHerbs.includes(herb)); // Use ?. for safety
                    return matchesCondition || matchesHerb; // Match if either condition or herb is present
                });
                if (partiallyMatched.length > 0) {
                    potentialSuggestions = partiallyMatched;
                } else {
                    // If no partial match, just use all data
                    potentialSuggestions = allData;
                }
            } else {
                potentialSuggestions = allData;
            }
        }

        // Ensure uniqueness and shuffle for randomness
        const uniqueSuggestions = [];
        const seenIds = new Set();
        potentialSuggestions.forEach(suggestion => {
            // Use both id and source to ensure uniqueness if IDs might overlap between datasets
            const uniqueKey = `${suggestion.id}-${suggestion.source}`;
            if (!seenIds.has(uniqueKey)) {
                uniqueSuggestions.push(suggestion);
                seenIds.add(uniqueKey);
            }
        });

        // Shuffle the unique suggestions
        for (let i = uniqueSuggestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [uniqueSuggestions[i], uniqueSuggestions[j]] = [uniqueSuggestions[j], uniqueSuggestions[i]];
        }
        
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

            <Button variant="contained" color="primary" onClick={() => generateSleepAidSuggestion(false)} sx={{ mt: 2 }}>
                Tạo gợi ý hỗ trợ giấc ngủ
            </Button>
            <Divider sx={{ my: 3 }} />

            {suggestionsList.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <IconButton onClick={handlePrevPage} disabled={suggestionsList.length <= 1}>
                        <ArrowBackIosIcon />
                    </IconButton>

                    <Card
                        sx={{
                            maxWidth: 800,
                            mx: "auto",
                            mt: 4,
                            width: '100%',
                            animation: `${floatAnimation} 3s ease-in-out infinite`,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Gợi ý cho bạn: {currentSuggestion.title}
                            </Typography>
                            {currentSuggestion.type === 'herb_specific' && ( // Keep this if you want to explicitly label.
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
                <Button variant="outlined" onClick={() => generateSleepAidSuggestion(true)} sx={{ mt: 2 }}> {/* Pass true here */}
                    Tạo gợi ý khác (ngẫu nhiên)
                </Button>
            )}
        </Box>
    );
}

export default SleepAidCard;
