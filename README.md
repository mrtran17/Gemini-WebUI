# my-project

This template should help get you started developing with Vue 3 in Vite.

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu

Đảm bảo bạn đã cài đặt các phần mềm sau trên máy tính của mình:

*   **Node.js**: Phiên bản 14 trở lên (khuyến nghị sử dụng phiên bản LTS mới nhất).
*   **npm** (hoặc yarn/pnpm): Trình quản lý package, thường đi kèm khi cài đặt Node.js.

### Cài đặt dự án

1.  **Clone repository** (Nếu bạn chưa có mã nguồn):
    ```bash
    git clone https://github.com/mrtran17/Gemini-WebUI.git
    cd my-project
    ```

2.  **Cài đặt các dependencies:**
    Di chuyển vào thư mục gốc của dự án và chạy lệnh sau:
    ```bash
    npm install
    ```
    Lệnh này sẽ đọc file `package.json` và tải về tất cả các thư viện cần thiết vào thư mục `node_modules`.

### Chạy dự án

*   **Chế độ phát triển (Development):
**Chạy lệnh sau để khởi động server phát triển với tính năng hot-reloading:

    ```bash
    npm run dev
    ```
    Ứng dụng sẽ chạy tại địa chỉ `http://localhost:5173/` (hoặc một cổng khác nếu được cấu hình).

*   **Build cho môi trường production:**
Chạy lệnh sau để build ứng dụng cho môi trường production. Kết quả sẽ nằm trong thư mục `dist/`.

    ```bash
    npm run build
    ```

*   **Xem trước bản build production (Preview):**
Sau khi build, bạn có thể chạy lệnh này để xem trước bản build:

    ```bash
    npm run preview
    ```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
