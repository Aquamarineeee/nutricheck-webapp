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

    // Hàm an toàn để dừng mọi scanner đang chạy và reset trạng thái quét
    // QUAN TRỌNG: Hàm này KHÔNG reset scanResult
    const stopAndClearScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                // Kiểm tra kỹ clear là hàm và gọi nó
                if (typeof scannerRef.current.clear === 'function') {
                    await scannerRef.current.clear(); 
                }
            } catch (error) {
                console.error("Failed to clear scanner: ", error);
            } finally {
                scannerRef.current = null; // Luôn xóa ref sau khi cố gắng clear
            }
        }
        setIsCameraScanning(false);
        setIsFileScanning(false);
    }, []);

    // Hàm xử lý khi đóng UI scanner (người dùng nhấn nút X)
    const handleCloseScannerUI = useCallback(() => {
        stopAndClearScanner(); // Dừng scanner và reset trạng thái quét
        // KHÔNG reset scanResult ở đây, để kết quả vẫn hiển thị
    }, [stopAndClearScanner]);


    const onScanSuccess = useCallback(async (decodedText, decodedResult) => {
        console.log(`Scan result: ${decodedText}`, decodedResult);
        setScanResult(decodedText); // Cập nhật kết quả để hiển thị

        // Dừng scanner sau khi quét thành công
        await stopAndClearScanner(); // Gọi hàm an toàn để dừng scanner
        
        if (onScanResult) {
            onScanResult(decodedText); // Truyền kết quả lên component cha
        }
    }, [onScanResult, stopAndClearScanner]); // Thêm stopAndClearScanner vào dependencies


    const onScanError = useCallback((errorMessage) => {
        console.warn(`Scan error: ${errorMessage}`);
        // Cập nhật scanResult với thông báo lỗi để hiển thị trên UI
        setScanResult(`Lỗi quét: ${errorMessage}`); 
        // Cũng dừng scanner khi có lỗi để người dùng có thể thử lại
        stopAndClearScanner(); 
    }, [stopAndClearScanner]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setIsFileScanning(true);
        setScanResult(null); // Xóa kết quả cũ khi bắt đầu quét ảnh mới

        let html5QrCodeInstance = null; // Khai báo cục bộ
        try {
            html5QrCodeInstance = new Html5Qrcode(FILE_SCANNER_ID); 
            const result = await html5QrCodeInstance.scanFile(file, true);
            const finalScanResult = result.decodedText || (typeof result.result === 'string' ? result.result : '');
            
            await onScanSuccess(finalScanResult, result); // Chờ onScanSuccess hoàn tất
            
        } catch (err) {
            setScanResult(`Lỗi: ${err.message || "Không tìm thấy mã QR/Barcode trong ảnh."}`);
            onScanError(err.message || "Không tìm thấy mã QR/Barcode trong ảnh.");
        } finally {
            // Đảm bảo clear instance của file scanner (nếu nó không phải scannerRef.current)
            if (html5QrCodeInstance && typeof html5QrCodeInstance.clear === 'function') {
                try {
                    await html5QrCodeInstance.clear(); 
                } catch (clearSyncError) {
                    console.error("Error during html5QrCodeInstance.clear() after file scan:", clearSyncError);
                }
            }
            setIsFileScanning(false); // Đặt trạng thái này về false cuối cùng
        }
    };

    useEffect(() => {
        let html5QrCodeScanner = null; 

        if (isCameraScanning) {
            // Đảm bảo không có scanner cũ nào đang chạy từ useEffect trước đó
            stopAndClearScanner(); 

            html5QrCodeScanner = new Html5QrcodeScanner(
                QR_CODE_SCANNER_ID,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    disableFlip: false,
                },
                /* verbose= */ false
            );

            // Gán scanner mới vào ref
            scannerRef.current = html5QrCodeScanner;
            html5QrCodeScanner.render(onScanSuccess, onScanError);

        } else {
            // Khi isCameraScanning chuyển thành false, dừng scanner (nếu nó đang chạy)
            stopAndClearScanner();
        }

        // Cleanup function: Dừng scanner khi component bị unmount hoặc isCameraScanning thay đổi thành false
        return () => {
            stopAndClearScanner(); // Đảm bảo dọn dẹp khi component unmount
        };
    }, [isCameraScanning, onScanSuccess, onScanError, stopAndClearScanner]); // Dependencies cho useEffect


    // Hàm để reset toàn bộ, bao gồm xóa kết quả quét
    const handleResetScan = useCallback(() => {
        setScanResult(null); // Xóa kết quả hiện tại
        stopAndClearScanner(); // Dừng tất cả các loại scanner
    }, [stopAndClearScanner]);

    return (
        <Box sx={{ my: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Quét mã QR/Barcode
            </Typography>

            {/* Div ẩn mà Html5Qrcode cần để khởi tạo khi quét file */}
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
                        onClick={handleCloseScannerUI} // Dùng hàm mới để đóng UI scanner
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
                        onClick={handleCloseScannerUI} // Dùng hàm mới để đóng UI scanner
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
                        onClick={handleResetScan} // Nút này mới reset scanResult
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
