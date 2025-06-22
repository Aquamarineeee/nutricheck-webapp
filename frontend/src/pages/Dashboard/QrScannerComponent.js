// QRScannerComponent.js
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

// Danh sách mã quốc gia tham khảo từ EAN-13
const countryCodeMap = {
  '000': 'Mỹ/Canada', '030': 'Mỹ', '040': 'Mỹ', '050': 'Coupons Mỹ',
  '300': 'Pháp', '380': 'Bulgaria', '383': 'Slovenia', '385': 'Croatia', '387': 'Bosnia & Herzegovina',
  '400': 'Đức', '450': 'Nhật', '460': 'Nga', '470': 'Kyrgyzstan',
  '471': 'Đài Loan', '474': 'Estonia', '475': 'Latvia', '476': 'Azerbaijan',
  '477': 'Lithuania', '478': 'Uzbekistan', '479': 'Sri Lanka', '480': 'Philippines',
  '481': 'Belarus', '482': 'Ukraine', '484': 'Moldova', '485': 'Armenia', '486': 'Georgia',
  '487': 'Kazakhstan', '489': 'Hong Kong', '490': 'Nhật Bản', '500': 'Anh',
  '520': 'Hy Lạp', '528': 'Liban', '529': 'Cyrprus', '530': 'Albania',
  '531': 'Macedonia', '535': 'Malta', '539': 'Ireland', '540': 'Bỉ/Luxembourg',
  '560': 'Bồ Đào Nha', '569': 'Iceland', '570': 'Đan Mạch', '590': 'Ba Lan',
  '594': 'Romania', '599': 'Hungary', '600': 'Nam Phi', '603': 'Ghana',
  '608': 'Bahrain', '609': 'Mauritius', '611': 'Ma-rốc', '613': 'Algeria',
  '616': 'Kenya', '618': 'Bờ Biển Ngà', '619': 'Tunisia', '621': 'Syria',
  '622': 'Ai Cập', '624': 'Libya', '625': 'Jordan', '626': 'Iran',
  '627': 'Kuwait', '628': 'Saudi Arabia', '629': 'UAE', '640': 'Phần Lan',
  '690': 'Trung Quốc', '700': 'Na Uy', '729': 'Israel', '730': 'Thụy Điển',
  '735': 'Thụy Điển', '740': 'Guatemala', '741': 'El Salvador', '742': 'Honduras',
  '743': 'Nicaragua', '744': 'Costa Rica', '745': 'Panama', '746': 'Dominican Republic',
  '750': 'Mexico', '759': 'Venezuela', '760': 'Thụy Sĩ', '770': 'Colombia',
  '773': 'Uruguay', '775': 'Peru', '777': 'Bolivia', '779': 'Argentina',
  '780': 'Chile', '784': 'Paraguay', '786': 'Ecuador', '789': 'Brazil',
  '800': 'Ý', '840': 'Tây Ban Nha', '850': 'Cuba', '858': 'Slovakia',
  '859': 'Czech Republic', '860': 'Nam Tư', '865': 'Mongolia', '867': 'North Korea',
  '868': 'Thổ Nhĩ Kỳ', '869': 'Thổ Nhĩ Kỳ', '870': 'Hà Lan', '880': 'Hàn Quốc',
  '884': 'Campuchia', '885': 'Thái Lan', '888': 'Singapore', '890': 'Ấn Độ',
  '893': 'Việt Nam', '899': 'Indonesia', '900': 'Áo', '955': 'Malaysia',
  '958': 'Macau'
};

const QRScannerComponent = () => {
  const scannerRef = useRef(null);
  const [scanMode, setScanMode] = useState('camera');
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const [parsedInfo, setParsedInfo] = useState(null);
  const [isCameraRunning, setIsCameraRunning] = useState(false);

  const parseEAN13 = (code) => {
    if (!/^\d{13}$/.test(code)) return null;

    const countryCode = code.substring(0, 3);
    const companyCode = code.substring(3, 8);
    const productCode = code.substring(8, 12);
    const checksum = code.substring(12);

    const countryName = countryCodeMap[countryCode] || `Mã: ${countryCode}`;

    return {
      loai: "EAN-13 (Barcode)",
      quoc_gia: countryName,
      doanh_nghiep: companyCode,
      san_pham: productCode,
      so_kiem_tra: checksum
    };
  };

  const handleDecodedText = (decodedText) => {
    setScanResult(decodedText);

    if (/^\d{13}$/.test(decodedText)) {
      setParsedInfo(parseEAN13(decodedText));
    } else {
      setParsedInfo({ loai: "QR Code", noi_dung: decodedText });
    }

    stopCameraScan();
  };

  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode("reader");
    setHtml5QrCode(qrCodeScanner);

    return () => {
      if (qrCodeScanner && isCameraRunning) {
        qrCodeScanner.stop().catch(() => {});
      }

      if (typeof qrCodeScanner.clear === 'function') {
        const result = qrCodeScanner.clear();
        if (result instanceof Promise) {
          result.catch(() => {});
        }
      }
    };
  }, []);

  const startCameraScan = () => {
    if (!html5QrCode || isCameraRunning) return;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        handleDecodedText,
        () => {}
      )
      .then(() => setIsCameraRunning(true))
      .catch((err) => console.error("Không thể khởi động camera:", err));
  };

  const stopCameraScan = () => {
    if (!html5QrCode || !isCameraRunning) return;

    html5QrCode
      .stop()
      .then(() => setIsCameraRunning(false))
      .catch((err) => {
        if (!err?.message?.includes("scanner is not running")) {
          console.warn("Không thể dừng camera:", err);
        }
      });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !html5QrCode) return;

    document.getElementById('reader').style.display = 'block';

    html5QrCode
      .scanFile(file, true)
      .then((decodedText) => handleDecodedText(decodedText))
      .catch((err) => {
        alert("Không tìm thấy mã QR hoặc Barcode trong ảnh.");
        console.error("Lỗi khi quét từ ảnh:", err);
      })
      .finally(() => {
        if (scanMode !== 'camera') {
          document.getElementById('reader').style.display = 'none';
        }
      });
  };

  useEffect(() => {
    if (scanMode === 'camera') {
      startCameraScan();
    } else {
      stopCameraScan();
    }
  }, [scanMode]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Quét mã QR / Barcode</h2>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setScanMode('camera')}>📷 Camera</button>
        <button onClick={() => setScanMode('file')}>🖼️ Ảnh</button>
      </div>

      <div
        id="reader"
        ref={scannerRef}
        style={{
          width: 300,
          marginBottom: 20,
          display: scanMode === 'camera' ? 'block' : 'none',
        }}
      />

      {scanMode === 'file' && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />
      )}

      {scanResult && (
        <div style={{ marginTop: 20 }}>
          <strong>Kết quả:</strong> {scanResult}
        </div>
      )}

      {parsedInfo && (
        <div style={{ marginTop: 10 }}>
          <strong>Kết quả phân tích:</strong>
          <div style = {{
            background: '#f9f9f9',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            lineHeight: 1.6
          }}>

            {Object.entries(parsedInfo).map(([key, value]) => (
            <div key={key}>
              <strong>{key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}:</strong> {value}
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScannerComponent;
