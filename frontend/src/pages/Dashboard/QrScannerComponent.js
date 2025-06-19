// src/Components/QrScannerComponent.js
import React, { useEffect, useRef, useState, useCallback } from 'react'; // Thêm useCallback
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Box, Button, Typography, IconButton, Alert } from '@mui/material'; // Thêm Alert
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const QR_CODE_SCANNER_ID = "qr-code-full-region"; // ID duy nhất cho vùng quét
const FILE_SCANNER_ID = "file-scanner-container"; //

const QrScannerComponent = ({ onScanResult }) => {
    const [scanResult, setScanResult] = useState(null);
    const [isCameraScanning, setIsCameraScanning] = useState(false); // Khai báo isCameraScanning
    const [isFileScanning, setIsFileScanning] = useState(false);
    const scannerRef = useRef(null); // Ref để giữ instance của Html5QrcodeScanner
    // cameraScannerRef và fileScannerRef không thực sự cần thiết nếu bạn quản lý instance qua scannerRef và biến cục bộ.

    // Hàm xử lý khi đóng scanner
    const handleCloseScanner = useCallback(() => {
        setIsCameraScanning(false);
        setIsFileScanning(false);
        setScanResult(null); // Đặt lại kết quả quét
        // Logic dừng scanner đã có trong useEffect khi isCameraScanning/isFileScanning thay đổi
        // hoặc được gọi trực tiếp trong onScanSuccess
    }, []);

    const onScanSuccess = useCallback((decodedText, decodedResult) => {
        console.log(`Scan result: ${decodedText}`, decodedResult);
        setScanResult(decodedText);
        setIsCameraScanning(false); // Dừng quét bằng camera sau khi thành công
        if (onScanResult) {
            onScanResult(decodedText);
        }
        if (scannerRef.current) {
            scannerRef.current.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner on success. ", error);
            });
            scannerRef.current = null;
        }
    }, [onScanResult]); // Thêm onScanResult vào dependencies

    const onScanError = useCallback((errorMessage) => {
        console.warn(`Scan error: ${errorMessage}`);
        // Bạn có thể hiển thị thông báo lỗi cho người dùng ở đây
        // setScanResult(`Lỗi quét: ${errorMessage}`); // Tùy chọn: hiển thị lỗi trên UI
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setIsFileScanning(true);
        setScanResult(null);

        try {
            // Không cần ref cho file scanner nếu chỉ dùng cục bộ trong hàm này
            const html5QrCode = new Html5Qrcode(FILE_SCANNER_ID);
            const result = await html5QrCode.scanFile(file, true);
            onScanSuccess(result.decodedText, result);
            // Quan trọng: clear sau khi quét file
            html5QrCode.clear().catch(error => console.error("Failed to clear file scanner.", error));
        } catch (err) {
            onScanError(err.message || "Không tìm thấy mã QR/Barcode trong ảnh.");
        } finally {
            setIsFileScanning(false);
        }
    };

    useEffect(() => {
        if (isCameraScanning) {
            const html5QrCodeScanner = new Html5QrcodeScanner(
                QR_CODE_SCANNER_ID,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    disableFlip: false,
                },
                /* verbose= */ false
            );

            html5QrCodeScanner.render(onScanSuccess, onScanError);
            scannerRef.current = html5QrCodeScanner;

        } else {
            // Khi không quét bằng camera, dừng scanner
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner on unmount/stop. ", error);
                });
                scannerRef.current = null;
            }
            // Không reset scanResult ở đây để kết quả vẫn hiển thị sau khi dừng scan
        }

        // Cleanup function: Dừng scanner khi component bị unmount hoặc isCameraScanning thay đổi thành false
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner in cleanup. ", error);
                });
                scannerRef.current = null;
            }
        };
    }, [isCameraScanning, onScanSuccess, onScanError]); // Dependencies cho useEffect

    return (
        <Box sx={{ my: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Quét mã QR/Barcode
            </Typography>

            {/* Div ẩn mà Html5Qrcode cần để khởi tạo khi quét file */}
            <div id={FILE_SCANNER_ID} style={{ display: 'none' }}></div>

            {/* Hiển thị các nút chọn chế độ quét khi không có chế độ nào đang hoạt động */}
            {!isCameraScanning && !isFileScanning && (
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
                        <input // Sử dụng thẻ input HTML thông thường
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }} // Ẩn input file gốc
                        />
                    </Button>
                </Box>
            )}

            {/* UI khi đang quét bằng camera */}
            {isCameraScanning && (
                <Box>
                    <IconButton
                        onClick={handleCloseScanner} // Gọi hàm handleCloseScanner
                        sx={{ position: 'absolute', top: 8, right: 8 }}
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
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                        Đang xử lý ảnh...
                    </Typography>
                    <IconButton
                        onClick={handleCloseScanner} // Vẫn cho phép đóng khi đang xử lý
                        color="error"
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            {/* Hiển thị kết quả quét */}
            {scanResult && (
                <Alert severity={scanResult.includes('Lỗi') ? "error" : "success"} sx={{ mt: 2 }}>
                    {scanResult}
                </Alert>
            )}
        </Box>
    );
};

export default QrScannerComponent;
