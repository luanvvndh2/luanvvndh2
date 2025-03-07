let currentPage = 1;
const recordsPerPage = 10;  // Số bản ghi mỗi trang
let dataCache = [];         // Bộ nhớ đệm dữ liệu sau khi fetch

// Hàm lấy dữ liệu từ API
async function fetchData() {
    const response = await fetch("https://ezbqiajemruzegceorwv.supabase.co/rest/v1/datlichkham_36065?select=*", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc"
        }
    });

    const data = await response.json();
    dataCache = data;  // Lưu dữ liệu vào bộ nhớ đệm
    renderTable();
    renderPagination();  // Hiển thị các nút phân trang

    // Gán sự kiện lọc sau khi dữ liệu đã được tải
    document.getElementById("searchInput").addEventListener("keyup", filterTable);
    document.querySelectorAll(".filter-input").forEach(input => {
        input.addEventListener("keyup", filterColumn);
    });
}

// Gọi hàm fetchData khi trang tải xong
window.onload = fetchData;

// Hàm hiển thị dữ liệu theo trang
function renderTable() {
    let tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";  // Xóa dữ liệu cũ

    let startIndex = (currentPage - 1) * recordsPerPage;
    let endIndex = startIndex + recordsPerPage;
    let pageData = dataCache.slice(startIndex, endIndex);  // Lấy dữ liệu của trang hiện tại

    pageData.forEach(item => {
        let row = `<tr>
            <td>${item.id}</td>
            <td>${item.ho_ten}</td>
            <td>${item.ngay_sinh}</td>
            <td>${item.bhyt_cccd}</td>
            <td>${item.ngay_kham}</td>
            <td>${item.so_dien_thoai}</td>
            <td>${item.tien_su_benh || "Không có"}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Hàm tạo các nút phân trang
function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";  // Xóa nút cũ

    let totalPages = Math.ceil(dataCache.length / recordsPerPage);

    if (totalPages > 1) {
        if (currentPage > 1) {
            pagination.innerHTML += `<button class="btn btn-secondary m-1" onclick="changePage(${currentPage - 1})">Trang trước</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            pagination.innerHTML += `<button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} m-1" onclick="changePage(${i})">${i}</button>`;
        }

        if (currentPage < totalPages) {
            pagination.innerHTML += `<button class="btn btn-secondary m-1" onclick="changePage(${currentPage + 1})">Trang sau</button>`;
        }
    }
}

// Hàm thay đổi trang
function changePage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
}

// Hàm lọc tìm kiếm chung
function filterTable() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
    dataCache = dataCache.filter(item => JSON.stringify(item).toLowerCase().includes(searchValue));
    currentPage = 1;  // Quay lại trang đầu tiên sau khi tìm kiếm
    renderTable();
    renderPagination();
}

// Hàm lọc theo từng cột
function filterColumn() {
    let filters = document.querySelectorAll(".filter-input");
    dataCache = dataCache.filter(item => {
        return Array.from(filters).every(filter => {
            let colIndex = filter.getAttribute("data-col");
            let filterValue = filter.value.toLowerCase().trim();
            let cellText = Object.values(item)[colIndex]?.toString().toLowerCase() || "";

            return !filterValue || cellText.includes(filterValue);
        });
    });
    currentPage = 1;  // Quay lại trang đầu tiên sau khi lọc
    renderTable();
    renderPagination();
}
