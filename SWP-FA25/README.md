# Hệ thống Quản lý Bảo hành Xe Điện (EV Warranty Management System)

Một ứng dụng web hiện đại được xây dựng bằng React và TailwindCSS để quản lý toàn bộ quy trình bảo hành xe điện.

## Tính năng chính

### 🏠 Dashboard
- Tổng quan hệ thống với các chỉ số quan trọng
- Biểu đồ xu hướng yêu cầu bảo hành
- Danh sách yêu cầu gần đây
- Các thao tác nhanh

### 🛡️ Quản lý Yêu cầu Bảo hành
- Theo dõi và xử lý yêu cầu bảo hành từ khách hàng
- Phân công kỹ thuật viên
- Quản lý trạng thái xử lý
- Tìm kiếm và lọc nâng cao

### 📢 Chiến dịch Dịch vụ
- Quản lý các chiến dịch triệu hồi (Recall)
- Theo dõi tiến độ thực hiện
- Thống kê xe bị ảnh hưởng
- Quản lý lịch trình chiến dịch

### 🔧 Quản lý Phụ tùng
- Theo dõi tồn kho phụ tùng thay thế
- Cảnh báo hết hàng
- Quản lý nhà cung cấp
- Tính tương thích với các dòng xe

### 📊 Báo cáo & Phân tích
- Thống kê hiệu suất xử lý
- Biểu đồ xu hướng theo thời gian
- Phân tích loại vấn đề
- Đánh giá hiệu suất kỹ thuật viên

## Công nghệ sử dụng

- **Frontend**: React 18 với JSX
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd SWP-FA25

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

### Scripts có sẵn
- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## Cấu trúc dự án

```
src/
├── components/          # Shared components
│   └── Layout.jsx      # Main layout với sidebar
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── WarrantyClaims.jsx
│   ├── ServiceCampaigns.jsx
│   ├── PartManagement.jsx
│   └── Reports.jsx
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Giao diện người dùng

### Layout chính
- **Sidebar**: Menu điều hướng với các module chính
- **Header**: Thông báo và thông tin người dùng
- **Main Content**: Nội dung trang hiện tại
- **Responsive**: Tối ưu cho mobile và desktop

### Thiết kế
- Sử dụng TailwindCSS để tạo giao diện hiện đại
- Color scheme nhất quán với primary blue
- Icons từ Lucide React cho trải nghiệm thống nhất
- Typography và spacing theo design system

## Tính năng đặc biệt

### 🔍 Tìm kiếm và Lọc
- Tìm kiếm real-time
- Bộ lọc đa điều kiện
- Export dữ liệu

### 📱 Responsive Design
- Tối ưu cho tất cả thiết bị
- Mobile-first approach
- Sidebar collapse trên mobile

### 🎨 UI/UX
- Giao diện trực quan, dễ sử dụng
- Feedback visual cho các thao tác
- Loading states và error handling

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

Project Link: [https://github.com/your-username/SWP-FA25](https://github.com/your-username/SWP-FA25)
