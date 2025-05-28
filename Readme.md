# NutriWise Advisor – Web Application ứng dụng AI vào phân tích chế độ dinh dưỡng và hỗ trợ sức khỏe

## Giới thiệu Dự án

NutriWise Advisor là một ứng dụng web (webapp) tiên tiến sử dụng Trí tuệ Nhân tạo (AI) để phân tích chế độ dinh dưỡng và hỗ trợ chăm sóc sức khỏe cá nhân. Dự án này được phát triển nhằm giúp người dùng theo dõi, kiểm soát chế độ ăn uống, nhận gợi ý thực đơn cá nhân hóa, và cảnh báo nguy cơ bệnh tật.

Mục tiêu chính của NutriWise Advisor là tạo ra một công cụ toàn diện và dễ sử dụng, giúp mọi người duy trì một lối sống lành mạnh thông qua việc quản lý dinh dưỡng thông minh.

## Các Tính năng Chính

* **Nhận diện món ăn thông minh:** Sử dụng công nghệ AI để tự động nhận diện thực phẩm từ hình ảnh được người dùng cung cấp.
* **Định lượng chất dinh dưỡng chi tiết:** Phân tích và hiển thị chi tiết lượng calo, protein, chất béo, carbohydrate và các vi chất dinh dưỡng khác có trong món ăn.
* **Thống kê dinh dưỡng hàng ngày/tuần:** Cung cấp biểu đồ và báo cáo trực quan về tỉ lệ chất dinh dưỡng và lượng calo tiêu thụ của người dùng theo thời gian.
* **Phân tích thói quen & Gợi ý thực đơn cá nhân hóa:** Dựa trên dữ liệu đã ghi nhận, ứng dụng phân tích thói quen ăn uống và đề xuất thực đơn phù hợp với mục tiêu sức khỏe và sở thích cá nhân.
* **Chatbot AI tư vấn dinh dưỡng:** Tích hợp chatbot được hỗ trợ bởi AI (GPT-4.0) để giải đáp các thắc mắc về dinh dưỡng và cung cấp lời khuyên chuyên sâu.
* **Cảnh báo nguy cơ bệnh tật:** Đưa ra các khuyến cáo sớm về nguy cơ mắc các bệnh liên quan đến chế độ ăn uống (ví dụ: tiểu đường, béo phì) dựa trên lịch sử dinh dưỡng của người dùng.
* **Hướng dẫn điều chỉnh chế độ ăn:** Gợi ý những điều chỉnh cần thiết trong chế độ ăn để cải thiện sức khỏe tổng thể và phòng ngừa bệnh tật.

## Công nghệ Sử dụng

Dự án NutriWise Advisor được xây dựng trên các công nghệ hiện đại để đảm bảo hiệu suất và khả năng mở rộng:

* **Frontend:** JavaScript, HTML, CSS, ReactJS, Material-UI.
* **Backend:** Python (Flask framework).
* **Cơ sở dữ liệu:** PostgreSQL, Supabase.
* **Triển khai ứng dụng (Deployment):** Vercel, GitHub (cho quản lý mã nguồn).
* **API & Mô hình AI:**
    * **Clarifai API:** Để nhận diện hình ảnh thực phẩm.
    * **Nutritionix API:** Để truy xuất dữ liệu dinh dưỡng chi tiết.
    * **OpenAI GPT-4.0 Model:** Cung cấp khả năng của chatbot AI.
    * **Google Firebase Firestore:** Để lưu trữ ảnh.

## Hướng dẫn Sử dụng (Demo)

Bạn có thể trải nghiệm ứng dụng NutriWise Advisor trực tuyến qua các đường dẫn sau:

* **Phiên bản chính thức:** [https://nutricheck.io.vn/](https://nutricheck.io.vn/)
* **Phiên bản dự phòng:** [https://nutriwiseadvisor.vercel.app/](https://nutriwiseadvisor.vercel.app/)

**Các bước cơ bản để sử dụng:**

1.  Truy cập vào một trong hai đường dẫn trên.
2.  Xác nhận Re-Captcha và thực hiện đăng nhập hoặc đăng ký tài khoản.
3.  Cung cấp các thông tin cá nhân cơ bản (tên, email, tuổi, chiều cao, cân nặng, mức độ hoạt động) để ứng dụng có thể cá nhân hóa trải nghiệm.
4.  Bắt đầu khám phá các chức năng của ứng dụng như chụp ảnh món ăn để phân tích, xem gợi ý thực đơn theo mức độ tiêu thụ calo từ các chỉ số riêng được thiết kế cá nhân hóa, xem thống kê dinh dưỡng hoặc trò chuyện với chatbot AI,...

## So sánh với Sản phẩm Tương tự

NutriWise Advisor nổi bật so với các ứng dụng dinh dưỡng hiện có (như Foodvisor, MyFitnessPal, Lifesum) nhờ vào:

* **Khả năng cá nhân hóa cao:** Dựa trên dữ liệu người dùng để đưa ra gợi ý chính xác hơn.
* **Tích hợp chatbot AI mạnh mẽ:** Cung cấp khả năng tư vấn và giải đáp thắc mắc chuyên sâu.
* **Nhận diện thực phẩm tự động từ hình ảnh:** Giúp người dùng dễ dàng theo dõi chế độ ăn mà không cần nhập liệu thủ công.

Chúng tôi tin rằng những tính năng này sẽ mang lại trải nghiệm ưu việt và hiệu quả hơn cho người dùng trong việc quản lý dinh dưỡng và sức khỏe.

## Liên hệ

Dự án này là sản phẩm tham gia Hội thi Tin học trẻ.

---

**Bản quyền:**

Copyright (c) 2024 Nguyễn Ngọc Anh THPT Đức Trọng. Mọi quyền được bảo lưu.

---
