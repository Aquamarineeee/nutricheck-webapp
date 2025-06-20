// src/Components/QrScannerComponent.js
import React, { useEffect, useState, useCallback } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Box, Button, Typography, IconButton, Alert } from '@mui/material'; 
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const QR_CODE_SCANNER_ID = "qr-code-full-region";
const FILE_SCANNER_ID = "file-scanner-container";

const QrScannerComponent = ({ onScanResult }) => {
    const [scanResult, setScanResult] = useState(null);
    const [isCameraScanning, setIsCameraScanning] = useState(false);
    const [isFileScanning, setIsFileScanning] = useState(false);
    const [scannerInstance, setScannerInstance] = useState(null);

    const handleCloseScanner = useCallback(async () => {
        if (scannerInstance) {
            try {
                if (typeof scannerInstance.clear === 'function') {
                    await scannerInstance.clear();
                }
            } catch (error) {
                console.error("Failed to clear scanner on close button:", error);
            } finally {
                setScannerInstance(null);
            }
        }
        setIsCameraScanning(false);
        setIsFileScanning(false);
    }, [scannerInstance]);

    const onScanSuccess = useCallback(async (decodedText, decodedResult) => {
        console.log(`Scan result: ${decodedText}`, decodedResult);
        const cleaned = decodedText?.trim();
        setScanResult(prev => (prev === cleaned ? cleaned + " " : cleaned));
        await handleCloseScanner();
        if (onScanResult) onScanResult(cleaned);
    }, [handleCloseScanner, onScanResult]);

    const onScanError = useCallback((errorMessage) => {
        console.warn(`Scan error: ${errorMessage}`);
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsFileScanning(true);
        setScanResult(null);

        let html5QrCodeInstance = null;
        try {
            html5QrCodeInstance = new Html5Qrcode(FILE_SCANNER_ID);
            const result = await html5QrCodeInstance.scanFile(file, true);
            const finalScanResult = result.decodedText || (typeof result.result === 'string' ? result.result : '');
            await onScanSuccess(finalScanResult, result);
        } catch (err) {
            setScanResult(`Lỗi: ${err.message || "Không tìm thấy mã QR/Barcode trong ảnh."}`);
            onScanError(err.message || "Không tìm thấy mã QR/Barcode trong ảnh.");
        } finally {
            if (html5QrCodeInstance && typeof html5QrCodeInstance.clear === 'function') {
                try {
                    await html5QrCodeInstance.clear();
                } catch (clearError) {
                    console.error("Error during clear after file scan:", clearError);
                }
            }
            setIsFileScanning(false);
        }
    };

    useEffect(() => {
        if (isCameraScanning) {
            const scanner = new Html5QrcodeScanner(
                QR_CODE_SCANNER_ID,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    disableFlip: false,
                },
                false
            );
            scanner.render(onScanSuccess, onScanError);
            setScannerInstance(scanner);
        }

        return () => {
            if (scannerInstance && typeof scannerInstance.clear === 'function') {
                scannerInstance.clear().catch(e => console.error("Cleanup error:", e));
                setScannerInstance(null);
            }
        };
    }, [isCameraScanning, onScanSuccess, onScanError, scannerInstance]);

    const handleResetScan = () => {
        setScanResult(null);
        handleCloseScanner();
    };

    return (
        <Box sx={{ my: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Quét mã QR/Barcode
            </Typography>

            <div id={FILE_SCANNER_ID} style={{ display: 'none' }}></div>

            {!isCameraScanning && !isFileScanning && !scanResult && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<QrCodeScannerIcon />}
                        onClick={() => setIsCameraScanning(true)}
                        sx={{ mt: 2 }}
                    >
                        Quét bằng Camera
                    </Button>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<ImageSearchIcon />}
                        sx={{ mt: 2 }}
                    >
                        Quét từ Ảnh
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </Button>
                </Box>
            )}

            {isCameraScanning && (
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mx: 'auto' }}>
                    <IconButton
                        onClick={handleCloseScanner}
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                        color="error"
                    >
                        <CloseIcon />
                    </IconButton>
                    <div id={QR_CODE_SCANNER_ID} style={{ width: '100%' }}></div>
                    <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                        Đang quét bằng Camera...
                    </Typography>
                </Box>
            )}

            {isFileScanning && (
                <Box sx={{ mt: 2, position: 'relative' }}>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                        Đang xử lý ảnh...
                    </Typography>
                    <IconButton
                        onClick={handleCloseScanner}
                        color="error"
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            {scanResult && (
                <Box sx={{ mt: 2 }}>
                    <Alert severity={scanResult.includes("Lỗi") ? "error" : "success"}>
                        {scanResult || "(Trống – không có nội dung trong mã QR)"}
                    </Alert>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleResetScan}
                        sx={{ mt: 2 }}
                    >
                        Quét lại / Xóa kết quả
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default QrScannerComponent;
