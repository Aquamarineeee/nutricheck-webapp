// src/Components/QrScannerComponent.js
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Box, Button, Typography, IconButton } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const QR_CODE_SCANNER_ID = "qr-code-full-region"; // ID duy nhất cho vùng quét
const FILE_SCANNER_ID = "file-scanner-container"; //

const QrScannerComponent = ({ onScanResult }) => {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null); // Ref để giữ instance của Html5QrcodeScanner
    const [isFileScanning, setIsFileScanning] = useState(false); // <-- State mới để kiểm soát quét file
    const cameraScannerRef = useRef(null); // Ref cho camera scanner
    const fileScannerRef = useRef(null); // <-- Ref mới cho file scanner


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setIsFileScanning(true); // Đặt trạng thái đang quét file
        setScanResult(null); // Xóa kết quả quét trước đó

        try {
            // Khởi tạo Html5Qrcode. Nó cần một ID cho phần tử DOM,
            // nhưng chúng ta có thể dùng một div ẩn vì không hiển thị preview camera.
            const html5QrCode = new Html5Qrcode(FILE_SCANNER_ID);
            fileScannerRef.current = html5QrCode; // Lưu instance vào ref

            const result = await html5QrCode.scanFile(file, true); // Gọi hàm scanFile để quét
            onScanSuccess(result.decodedText, result); // Xử lý kết quả quét thành công

        } catch (err) {
            onScanError(err.message || "Không tìm thấy mã QR/Barcode trong ảnh.");
        } finally {
            setIsFileScanning(false); // Đảm bảo đặt lại trạng thái sau khi quét xong (dù thành công hay lỗi)
            fileScannerRef.current = null; // Giải phóng instance
        }
    };

    const onScanSuccess = (decodedText, decodedResult) => {
        // Xử lý kết quả quét thành công
        console.log(`Scan result: ${decodedText}`, decodedResult);
        setScanResult(decodedText);
        setIsScanning(false); // Dừng quét sau khi quét thành công
        if (onScanResult) {
            onScanResult(decodedText); // Truyền kết quả ra ngoài nếu có prop
        }
        // Quan trọng: Dừng scanner để giải phóng tài nguyên camera
        scannerRef.current.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner. ", error);
        });
    };

    const onScanError = (errorMessage) => {
        // Xử lý lỗi quét
        console.warn(`Scan error: ${errorMessage}`);
        // Bạn có thể hiển thị thông báo lỗi cho người dùng ở đây
    };

    useEffect(() => {
        if (isScanning) {
            const html5QrCodeScanner = new Html5QrcodeScanner(
                QR_CODE_SCANNER_ID,
                {
                    fps: 10, // Số khung hình mỗi giây để quét
                    qrbox: { width: 250, height: 250 }, // Kích thước vùng quét
                    disableFlip: false, // Cho phép lật camera (trước/sau)
                },
                /* verbose= */ false
            );

            html5QrCodeScanner.render(onScanSuccess, onScanError);
            scannerRef.current = html5QrCodeScanner; // Lưu instance vào ref

        } else {
            // Khi không quét hoặc component unmount, dừng scanner
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner on unmount. ", error);
                });
                scannerRef.current = null; // Xóa ref
            }
            setScanResult(null); // Reset kết quả khi dừng quét
        }

        // Cleanup function: Dừng scanner khi component bị unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner in cleanup. ", error);
                });
                scannerRef.current = null;
            }
        };
    }, [isScanning]); // Chỉ chạy lại khi isScanning thay đổi

    return (
        <Box sx={{ my: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Quét mã QR/Barcode
            </Typography>

            {/* Div ẩn mà Html5Qrcode cần để khởi tạo */}
            <div id={FILE_SCANNER_ID} style={{ display: 'none' }}></div>

            {/* Hiển thị các nút chọn chế độ quét khi không có chế độ nào đang hoạt động */}
            {!isCameraScanning && !isFileScanning && (
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
                        component="label" // <-- Quan trọng: Biến Button thành label cho input file
                        startIcon={<ImageSearchIcon />}
                        sx={{ mt: 2 }}
                    >
                        Quét từ Ảnh
                        <Input
                            type="file"
                            accept="image/*" // <-- Chỉ chấp nhận file ảnh
                            onChange={handleImageUpload} // <-- Gọi hàm xử lý khi file được chọn
                            sx={{ display: 'none' }} // <-- Ẩn input file gốc
                        />
                    </Button>
                </Box>
            )}

            {/* UI khi đang quét bằng camera */}
            {isCameraScanning && (
                <Box>
                    <IconButton
                        onClick={handleCloseScanner}
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
