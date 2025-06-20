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
                // Kiểm tra và clear scanner nếu nó đã được khởi tạo
                if (typeof scannerRef.current.clear === 'function') {
                    await scannerRef.current.clear(); // Sử dụng await nếu clear() trả về Promise
                }
            } catch (error) {
                console.error("Failed to clear scanner on close button: ", error);
            } finally {
                scannerRef.current = null;
            }
        }
        setIsCameraScanning(false);
        setIsFileScanning(false);
        // Giữ lại scanResult nếu có, không reset ở đây
    }, []);

    const onScanSuccess = useCallback(async (decodedText, decodedResult) => { // Thêm async ở đây
        console.log(`Scan result: ${decodedText}`, decodedResult);
        setScanResult(decodedText); // Đây là dòng cập nhật state để hiển thị

        // Dừng scanner ngay lập tức sau khi quét thành công
        if (scannerRef.current) {
            try {
                if (typeof scannerRef.current.clear === 'function') {
                    await scannerRef.current.clear(); // Dùng await để đảm bảo nó hoàn tất
                }
            } catch (error) {
                console.error("Failed to clear html5QrcodeScanner on success: ", error);
            } finally {
                scannerRef.current = null;
                setIsCameraScanning(false);
                setIsFileScanning(false); // Đặt trạng thái về false SAU KHI scanner đã được clear
            }
        } else {
             // Trường hợp scannerRef.current không tồn tại (có thể đã bị clear bởi file scanner)
             setIsCameraScanning(false);
             setIsFileScanning(false);
        }

        if (onScanResult) {
            onScanResult(decodedText); // Truyền kết quả lên component cha (nếu có)
        }
    }, [onScanResult]);

    const onScanError = useCallback((errorMessage) => {
        console.warn(`Scan error: ${errorMessage}`);
        // Có thể setScanResult(`Lỗi: ${errorMessage}`); để hiển thị lỗi ngay
        // setScanResult(`Lỗi quét: ${errorMessage}`); 
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
            // Khởi tạo instance mới cho mỗi lần quét file để tránh các vấn đề tiềm ẩn
            // Sử dụng một div tạm thời hoặc div đã có sẵn nhưng đảm bảo nó tồn tại
            html5QrCodeInstance = new Html5Qrcode(FILE_SCANNER_ID); 
            const result = await html5QrCodeInstance.scanFile(file, true);
            const finalScanResult = result.decodedText || (typeof result.result === 'string' ? result.result : '');
            
            // Gọi onScanSuccess với kết quả
            await onScanSuccess(finalScanResult, result); // Dùng await để đảm bảo xử lý xong trước khi kết thúc
            
        } catch (err) {
            // Hiển thị lỗi ra giao diện
            setScanResult(`Lỗi: ${err.message || "Không tìm thấy mã QR/Barcode trong ảnh."}`);
            onScanError(err.message || "Không tìm thấy mã QR/Barcode trong ảnh.");
        } finally {
            // Đảm bảo clear instance sau khi hoàn tất, dù thành công hay thất bại
            if (html5QrCodeInstance) {
                try {
                    // Kiểm tra xem clear có phải là một hàm và có trả về một Promise không
                    if (typeof html5QrCodeInstance.clear === 'function') {
                        // html5-qrcode's clear() for file scanner might not return a Promise reliably.
                        // We call it directly and catch sync errors if any.
                        await html5QrCodeInstance.clear(); 
                    }
                } catch (clearSyncError) {
                    console.error("Error during html5QrCodeInstance.clear() after file scan:", clearSyncError);
                }
            }
            setIsFileScanning(false); // Chỉ đặt false sau khi mọi thứ đã hoàn tất, bao gồm cả onScanSuccess
        }
    };

    useEffect(() => {
        let html5QrCodeScanner = null; // Khai báo cục bộ

        if (isCameraScanning) {
            // Đảm bảo không có scanner cũ nào đang chạy
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

            // Gán scanner mới vào ref
            scannerRef.current = html5QrCodeScanner;
            html5QrCodeScanner.render(onScanSuccess, onScanError);

        } else {
            // Khi không quét bằng camera, dừng scanner nếu nó đang hoạt động
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

        // Cleanup function: Dừng scanner khi component bị unmount hoặc isCameraScanning thay đổi thành false
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
    }, [isCameraScanning, onScanSuccess, onScanError]); // Dependencies cho useEffect
    const renderScanResult = useCallback(() => {
        if (scanResult === null) return null;

        return (
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
        );
        }, [scanResult, handleResetScan]);

    const handleResetScan = useCallback(() => { // Thêm useCallback để tối ưu
        setScanResult(null); // Xóa kết quả hiện tại
        handleCloseScanner(); // Dừng tất cả các loại scanner
    }, [handleCloseScanner]);


    return (
        <Box sx={{ my: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Quét mã QR/Barcode
            </Typography>

            {/* Div ẩn mà Html5Qrcode cần để khởi tạo khi quét file */}
            <div id={FILE_SCANNER_ID} style={{ display: 'none' }}></div>

            {/* Hiển thị các nút chọn chế độ quét khi không có chế độ nào đang hoạt động và không có kết quả quét */}
            {!isCameraScanning && !isFileScanning && !scanResult && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<QrCodeScannerIcon />}
                        onClick={() => setIsCameraScanning(true)} // Đặt trạng thái quét camera
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
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mx: 'auto' }}> {/* Thêm position: relative để IconButton định vị đúng */}
                    <IconButton
                        onClick={handleCloseScanner}
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }} // Thêm zIndex
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
                <Box sx={{ mt: 2, position: 'relative' }}> {/* Thêm position: relative cho nút đóng */}
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                        Đang xử lý ảnh...
                    </Typography>
                    <IconButton
                        onClick={handleCloseScanner}
                        color="error"
                        sx={{ position: 'absolute', top: 0, right: 0 }} // Đặt vị trí cho nút đóng
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            {/* Hiển thị kết quả quét */}
            {renderScanResult()}
        </Box>
    );
};

export default QrScannerComponent;
