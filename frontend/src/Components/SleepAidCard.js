import React from 'react';
import {
    Box, Card, CardContent, Typography, Button, Chip // Import the necessary Material-UI components
} from '@mui/material';
import { keyframes } from '@mui/system'; // Import keyframes if floatAnimation is used directly inside

// Define animation if it's specific to this card and not global
const floatAnimation = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const SleepAidCard = ({ suggestion, sx }) => (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, ...sx }}>
        <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Gợi ý cho bạn: {suggestion.title}
            </Typography>
            {suggestion.image && (
                <Box
                    component="img"
                    src={suggestion.image}
                    alt={suggestion.title}
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
                {suggestion.description}
            </Typography>

            {suggestion.materials && suggestion.materials.length > 0 && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Cần chuẩn bị:</strong> {suggestion.materials.join(', ')}
                </Typography>
            )}

            {suggestion.prepTime && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Thời gian chuẩn bị:</strong> {suggestion.prepTime}
                </Typography>
            )}

            {suggestion.howTo && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Cách thực hiện:</strong> {suggestion.howTo}
                </Typography>
            )}

            {suggestion.realLifeApplication && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ứng dụng thực tế:</strong> {suggestion.realLifeApplication}
                </Typography>
            )}

            {suggestion.suitableAgeGroup && suggestion.suitableAgeGroup.length > 0 && (
                <Box mb={1}>
                    <Typography variant="body2" fontWeight="bold">Phù hợp với:</Typography>
                    {suggestion.suitableAgeGroup.map((item, idx) => (
                        <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                    ))}
                </Box>
            )}

            {suggestion.benefits && suggestion.benefits.length > 0 && (
                <Box mb={1}>
                    <Typography variant="body2" fontWeight="bold">Lợi ích:</Typography>
                    {suggestion.benefits.map((item, idx) => (
                        <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                    ))}
                </Box>
            )}

            {suggestion.prevention && suggestion.prevention.length > 0 && (
                <Box mb={1}>
                    <Typography variant="body2" fontWeight="bold">Phòng ngừa:</Typography>
                    {suggestion.prevention.map((item, idx) => (
                        <Chip key={idx} label={item} sx={{ m: 0.5 }} />
                    ))}
                </Box>
            )}
            {suggestion.slink && (
                <Box mb={1}>
                    <Typography variant="body2" fontWeight="bold">Nguồn:</Typography>
                    <Chip label={suggestion.slink} sx={{ m: 0.5 }} />
                </Box>
            )}

            {suggestion.link && (
                <Button
                    variant="outlined"
                    href={suggestion.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 2 }}
                >
                    Xem video hướng dẫn
                </Button>
            )}
        </CardContent>
    </Card>
);

export default SleepAidCard;
