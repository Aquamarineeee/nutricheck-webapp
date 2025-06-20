import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Alert,
    CircularProgress // Thêm CircularProgress để hiển thị trạng thái đang tải
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const QR_CODE_SCANNER_ID = "qr-code-full-region";
const FILE_SCANNER_ID = "file-scanner-container";

const QrScannerComponent = ({ onScanResult }) => {
    const [scanResult, setScanResult] = useState(null); // Lưu kết quả quét thành công
    const [scanError, setScanError] = useState(null); // Lưu thông báo lỗi khi quét
    const [isCameraScanning, setIsCameraScanning] = useState(false); // Trạng thái đang quét bằng camera
    const [isFileScanning, setIsFileScanning] = useState(false); // Trạng thái đang quét bằng file
    const scannerRef = useRef(null); // Tham chiếu đến instance của Html5QrcodeScanner/Html5Qrcode

    // Hàm đóng scanner và reset tất cả trạng thái liên quan đến quét
    const handleCloseScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                if (typeof scannerRef.current.clear === 'function') {
                    await scannerRef.current.clear();
                }
            } catch (error) {
                console.error("Failed to clear scanner on close:", error);
            } finally {
                scannerRef.current = null;
            }
        }
        setIsCameraScanning(false);
        setIsFileScanning(false);
        setScanResult(null); // Reset kết quả khi đóng
        setScanError(null); // Reset lỗi khi đóng
    }, []);

    // Xử lý khi quét thành công
    const onScanSuccess = useCallback(async (decodedText, decodedResult) => {
        // Luôn cố gắng dừng scanner sau khi quét thành công
        if (scannerRef.current) {
            try {
                if (typeof scannerRef.current.clear === 'function') {
                    await scannerRef.current.clear();
                }
            } catch (error) {
                console.error("Failed to clear scanner after success:", error);
            } finally {
                scannerRef.current = null;
                setIsCameraScanning(false); // Tắt trạng thái quét camera
                setIsFileScanning(false); // Tắt trạng thái quét file (nếu có)
            }
        } else { // Trường hợp quét file không dùng scannerRef, cần reset trạng thái thủ công
            setIsCameraScanning(false);
            setIsFileScanning(false);
        }

        console.log("✅ QR Code Scanned:", decodedText);
        setScanResult(decodedText); // <--- CẬP NHẬT STATE KẾT QUẢ
        setScanError(null); // <--- Xóa lỗi cũ nếu có

        // Gọi callback nếu được cung cấp từ component cha
        if (onScanResult) {
            onScanResult(decodedText);
        }

        // --- KHÔNG CẦN return Alert TẠI ĐÂY ---
        // Alert sẽ được render ở phần return JSX của component chính
    }, [onScanResult]);

    // Xử lý khi quét thất bại (chủ yếu cho camera, lỗi từ file được bắt riêng)
    const onScanError = useCallback((errorMessage) => {
        console.warn(`Scan error (camera): ${errorMessage}`);
        // Không setScanError ở đây để tránh hiển thị lỗi liên tục khi camera chưa tìm thấy mã.
        // Nếu muốn hiển thị lỗi sau một thời gian không quét được, cần thêm logic hẹn giờ.
    }, []);

    // Xử lý tải ảnh lên để quét
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setScanResult(null); // Xóa kết quả cũ
        setScanError(null); // Xóa lỗi cũ
        setIsFileScanning(true); // Bật trạng thái đang quét file

        let html5QrCodeInstance = null;

        try {
            html5QrCodeInstance = new Html5Qrcode(FILE_SCANNER_ID);
            const result = await html5QrCodeInstance.scanFile(file, true);
            const finalResult = result.decodedText || '';

            // Gọi onScanSuccess để xử lý kết quả và reset trạng thái quét
            await onScanSuccess(finalResult, result);
        } catch (err) {
            const message = err.message || "Không tìm thấy mã QR/Barcode trong ảnh.";
            console.error("Error scanning image:", err);
            setScanError(message); // <--- CẬP NHẬT STATE LỖI
        } finally {
            if (html5QrCodeInstance) {
                try {
                    if (typeof html5QrCodeInstance.clear === 'function') {
                        await html5QrCodeInstance.clear();
                    }
                } catch (clearErr) {
                    console.error("Error clearing file scan instance:", clearErr);
                }
            }
            setIsFileScanning(false); // Tắt trạng thái quét file
        }
    };

    // useEffect để quản lý vòng đời của Html5QrcodeScanner (cho camera)
    useEffect(() => {
        let html5QrCodeScanner = null;

        if (isCameraScanning) {
            // Đảm bảo không có scanner nào đang chạy trước khi khởi tạo cái mới
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e =>
                    console.error("Error clearing previous scanner in useEffect:", e)
                );
            }
            setScanResult(null); // Xóa kết quả cũ khi bắt đầu quét camera
            setScanError(null);  // Xóa lỗi cũ khi bắt đầu quét camera

            html5QrCodeScanner = new Html5QrcodeScanner(
                QR_CODE_SCANNER_ID,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    disableFlip: false,
                },
                false // Không hiển thị UI của Html5QrcodeScanner, chúng ta tự xây
            );

            scannerRef.current = html5QrCodeScanner;
            html5QrCodeScanner.render(onScanSuccess, onScanError);
        } else {
            // Dọn dẹp scanner khi không còn quét
            if (scannerRef.current) {
                try {
                    if (typeof scannerRef.current.clear === 'function') {
                        scannerRef.current.clear();
                    }
                } catch (err) {
                    console.error("Error clearing scanner when not scanning:", err);
                } finally {
                    scannerRef.current = null;
                }
            }
        }

        // Cleanup function khi component unmount hoặc dependencies thay đổi
        return () => {
            if (scannerRef.current) {
                try {
                    if (typeof scannerRef.current.clear === 'function') {
                        scannerRef.current.clear();
                    }
                } catch (err) {
                    console.error("Error in cleanup function:", err);
                } finally {
                    scannerRef.current = null;
                }
            }
        };
    }, [isCameraScanning, onScanSuccess, onScanError]);

    // Đặt lại tất cả trạng thái để chuẩn bị cho lần quét mới
    const handleResetScan = useCallback(() => {
        setScanResult(null);
        setScanError(null);
        handleCloseScanner(); // Sẽ tự động reset isCameraScanning, isFileScanning và clear scanner
    }, [handleCloseScanner]);

    // Render giao diện của component
    return (
        <Box sx={{ my: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Quét mã QR/Barcode
            </Typography>

            {/* Div ẩn này chỉ dùng làm target cho Html5Qrcode khi quét file, không hiển thị gì */}
            <div id={FILE_SCANNER_ID} style={{ display: 'none' }}></div>

            {/* Hiển thị các nút chọn chế độ quét */}
            {!isCameraScanning && !isFileScanning && !scanResult && !scanError && (
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

            {/* Hiển thị giao diện quét bằng Camera */}
            {isCameraScanning && (
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mx: 'auto' }}>
                    <IconButton
                        onClick={handleCloseScanner}
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                        color="error"
                    >
                        <CloseIcon />
                    </IconButton>
                    {/* Đây là DIV mà Html5QrcodeScanner sẽ render camera feed vào */}
                    <div id={QR_CODE_SCANNER_ID} style={{ width: '100%', minHeight: '250px' }}></div>
                    <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                        Đang quét bằng Camera...
                    </Typography>
                </Box>
            )}

            {/* Hiển thị trạng thái đang xử lý ảnh */}
            {isFileScanning && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <CircularProgress /> {/* Biểu tượng xoay báo hiệu đang xử lý */}
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                        Đang xử lý ảnh...
                    </Typography>
                    <IconButton
                        onClick={handleCloseScanner}
                        color="error"
                        sx={{ mt: 1 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            {/* HIỂN THỊ KẾT QUẢ HOẶC LỖI QUÉT */}
            {(scanResult || scanError) && (
                <Box sx={{ mt: 2 }}>
                    {/* Hiển thị Alert khi có kết quả quét thành công */}
                    {scanResult && (
                        <Alert severity="success" sx={{ mb: 1 }}>
                            **Kết quả quét thành công:** <br/>
                            <Typography variant="body1" component="span" sx={{ wordBreak: 'break-all' }}>
                                {scanResult}
                            </Typography>
                        </Alert>
                    )}
                    {/* Hiển thị Alert khi có lỗi quét */}
                    {scanError && (
                        <Alert severity="error" sx={{ mb: 1 }}>
                            **Lỗi quét:** <br/>
                            <Typography variant="body1" component="span" sx={{ wordBreak: 'break-all' }}>
                                {scanError}
                            </Typography>
                        </Alert>
                    )}
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
