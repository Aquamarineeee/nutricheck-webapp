import React, { useState, useEffect, useCallback } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Box, Button, Typography, IconButton, Alert } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const QR_CODE_SCANNER_ID = "qr-code-full-region";
const FILE_SCANNER_ID = "file-scanner-container";

function QrScannerComponent() {
  // State for QR Scanner Component
  const [scanResult, setScanResult] = useState(null);
  const [isCameraScanning, setIsCameraScanning] = useState(false);
  const [isFileScanning, setIsFileScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  const [error, setError] = useState(null);

  // QR Scanner Functions
  const handleCloseScanner = useCallback(async () => {
    if (scannerInstance) {
      try {
        await scannerInstance.clear();
      } catch (error) {
        console.error("Failed to clear scanner:", error);
      } finally {
        setScannerInstance(null);
      }
    }
    setIsCameraScanning(false);
    setIsFileScanning(false);
  }, [scannerInstance]);

  const onScanSuccess = useCallback((decodedText) => {
    const cleaned = decodedText?.trim();
    console.log('Scan successful:', cleaned);
    setScanResult(cleaned);
    setError(null);
    handleCloseScanner();
  }, [handleCloseScanner]);

  const onScanError = useCallback((errorMessage) => {
    console.warn('Scan error:', errorMessage);
    setError(errorMessage);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsFileScanning(true);
    setScanResult(null);
    setError(null);

    const html5QrCodeInstance = new Html5Qrcode(FILE_SCANNER_ID);
    try {
      const result = await html5QrCodeInstance.scanFile(file, true);
      const finalScanResult = result.decodedText || (typeof result.result === 'string' ? result.result : '');
      onScanSuccess(finalScanResult);
    } catch (err) {
      const errorMsg = err.message || "Không tìm thấy mã QR/Barcode trong ảnh.";
      setError(errorMsg);
      setScanResult(null);
    } finally {
      try {
        await html5QrCodeInstance.clear();
      } catch (clearError) {
        console.error("Error during clear:", clearError);
      }
      setIsFileScanning(false);
    }
  };

  useEffect(() => {
    if (isCameraScanning && !scannerInstance) {
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
      if (scannerInstance) {
        scannerInstance.clear().catch(e => console.error("Cleanup error:", e));
      }
    };
  }, [isCameraScanning, scannerInstance, onScanSuccess, onScanError]);

  const handleResetScan = () => {
    setScanResult(null);
    setError(null);
    handleCloseScanner();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>QR Scanner Demo</h1>
      
      {/* QR Scanner Component */}
      <Box sx={{ my: 3, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Quét mã QR/Barcode
        </Typography>

        <div id={FILE_SCANNER_ID} style={{ display: 'none' }}></div>

        {!isCameraScanning && !isFileScanning && !scanResult && !error && (
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              Đang xử lý ảnh...
            </Typography>
          </Box>
        )}

        {(scanResult || error) && (
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {scanResult && (
              <>
                <Alert severity="success">
                  Kết quả: {scanResult}
                </Alert>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleResetScan}
                  >
                    Quét lại
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>

      {/* Display Area */}
      {scanResult && (
        <Box sx={{ mt: 3, p: 2, border: '1px solid #eee', borderRadius: '4px' }}>
          <Typography variant="h6">Kết quả quét:</Typography>
          <Typography variant="body1" sx={{ mt: 1, wordBreak: 'break-all' }}>
            {scanResult}
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default QrScannerComponent;
