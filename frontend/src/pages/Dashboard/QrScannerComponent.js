// src/Components/QrScannerComponent.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
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
    const scannerRef = useRef(null); 

    // Hàm xử lý khi đóng scanner (áp dụng cho cả camera và file)
    const handleCloseScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                if (typeof scannerRef.current.clear === 'function') {
                    await scannerRef.current.clear(); 
                }
            } catch (error) {
                console.error("Failed to clear scanner on close button: ", error);
            } finally {
                scannerRef.current = null;
            }
        }
        setIsCameraScanning(false);
        setIsFileScanning(false);
        // QUAN TRỌNG: KHÔNG reset scanResult ở đây.
        // setScanResult(null); // <- BỎ DÒNG NÀY NẾU CÓ
    }, []);

    const onScanSuccess = useCallback(async (decodedText, decodedResult) => {
        console.log(`Scan result: ${decodedText}`, decodedResult);
        // Đây là dòng cập nhật state để hiển thị kết quả
        setScanResult(decodedText); 

        // Dừng scanner ngay lập tức sau khi quét thành công
        if (scannerRef.current) {
            try {
                if (typeof scannerRef.current.clear === 'function') {
                    await scannerRef.current.clear(); 
                }
            } catch (error) {
                console.error("Failed to clear html5QrcodeScanner on success: ", error);
            } finally {
                scannerRef.current = null;
                // Đảm bảo các trạng thái quét được đặt về false CHỈ SAU KHI setScanResult đã chạy
                setIsCameraScanning(false);
                setIsFileScanning(false); 
            }
        } else {
             // Trường hợp scannerRef.current không tồn tại (có thể đã bị clear bởi file scanner)
             setIsCameraScanning(false);
             setIsFileScanning(false);
        }

        if (onScanResult) {
            onScanResult(decodedText); 
        }
    }, [onScanResult]);

    const onScanError = useCallback((errorMessage) => {
        console.warn(`Scan error: ${errorMessage}`);
        // Cập nhật scanResult với thông báo lỗi để hiển thị trên UI
        setScanResult(`Lỗi quét: ${errorMessage}`); 
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setIsFileScanning(true);
        setScanResult(null); // Xóa kết quả cũ khi bắt đầu quét ảnh mới

        let html5QrCodeInstance = null;
        try {
            html5QrCodeInstance = new Html5Qrcode(FILE_SCANNER_ID); 
            const result = await html5QrCodeInstance.scanFile(file, true);
            const finalScanResult = result.decodedText || (typeof result.result === 'string' ? result.result : '');
            
            // Chờ onScanSuccess hoàn tất việc cập nhật state scanResult
            await onScanSuccess(finalScanResult, result); 
            
        } catch (err) {
            // Khi có lỗi, hiển thị lỗi lên giao diện thông qua setScanResult
            setScanResult(`Lỗi: ${err.message || "Không tìm thấy mã QR/Barcode trong ảnh."}`);
            onScanError(err.message || "Không tìm thấy mã QR/Barcode trong ảnh.");
        } finally {
            if (html5QrCodeInstance) {
                try {
                    if (typeof html5QrCodeInstance.clear === 'function') {
                        await html5QrCodeInstance.clear(); 
                    }
                } catch (clearSyncError) {
                    console.error("Error during html5QrCodeInstance.clear() after file scan:", clearSyncError);
                }
            }
            setIsFileScanning(false); 
        }
    };

    useEffect(() => {
        let html5QrCodeScanner = null; 

        if (isCameraScanning) {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error("Error clearing existing scanner:", e));
            }

            html5QrCodeScanner = new Html5QrcodeScanner(
                QR_CODE_SCANNER_ID,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    disableFlip: false,
                },
                /* verbose= */ false
            );

            scannerRef.current = html5QrCodeScanner;
            html5QrCodeScanner.render(onScanSuccess, onScanError);

        } else {
            if (scannerRef.current) {
                try {
                    if (typeof scannerRef.current.clear === 'function') {
                        scannerRef.current.clear();
                    }
                } catch (error) {
                    console.error("Failed to clear html5QrcodeScanner on stop: ", error);
                } finally {
                    scannerRef.current = null;
                }
            }
        }

        return () => {
            if (scannerRef.current) {
                try {
                    if (typeof scannerRef.current.clear === 'function') {
                        scannerRef.current.clear();
                    }
                } catch (error) {
                    console.error("Failed to clear html5QrcodeScanner in cleanup: ", error);
                } finally {
                    scannerRef.current = null;
                }
            }
        };
    }, [isCameraScanning, onScanSuccess, onScanError]);

    const handleResetScan = useCallback(() => {
        setScanResult(null); // Xóa kết quả hiện tại để hiển thị lại các nút quét
        handleCloseScanner(); 
    }, [handleCloseScanner]);


    return (
        <Box sx={{ my: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Quét mã QR/Barcode
            </Typography>

            <div id={FILE_SCANNER_ID} style={{ display: 'none' }}></div>

            {/* Hiển thị các nút chọn chế độ quét khi không có chế độ nào đang hoạt động và KHÔNG CÓ kết quả quét */}
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

            {/* UI khi đang quét bằng camera */}
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

            {/* UI khi đang xử lý ảnh (chờ kết quả) */}
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

            {/* Hiển thị kết quả quét */}
            {scanResult && (
                <Box sx={{ mt: 2 }}>
                    <Alert severity={scanResult.includes('Lỗi') ? "error" : "success"}>
                        {scanResult}
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
