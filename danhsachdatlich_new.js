let currentPage = 1;
const recordsPerPage = 10;  // Số bản ghi mỗi trang
let dataCache = [];         // Bộ nhớ đệm dữ liệu gốc
let filteredData = [];      // Dữ liệu sau khi lọc

// 📌 Hàm lấy dữ liệu từ Worker thay vì Supabase
async function fetchData() {
    try {
        const response = await fetch("https://danhsachkham-worker.luanvv-ndh2.workers.dev", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu từ Worker!");

        const data = await response.json();
        dataCache = data;   // Lưu dữ liệu gốc vào cache
        filteredData = [...data];  // Sao chép dữ liệu cho tìm kiếm & lọc

        renderTable();
        renderPagination();

        // Gán sự kiện lọc sau khi dữ liệu đã được tải
        document.getElementById("searchInput").addEventListener("keyup", filterTable);
        document.querySelectorAll(".filter-input").forEach(input => {
            input.addEventListener("keyup", filterColumn);
        });

    } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
    }
}

// 📌 Gọi fetchData() khi trang tải xong
window.onload = fetchData;

// 📌 Hiển thị dữ liệu theo trang
function renderTable() {
    let tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    let startIndex = (currentPage - 1) * recordsPerPage;
    let endIndex = startIndex + recordsPerPage;
    let pageData = filteredData.slice(startIndex, endIndex);

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

// 📌 Tạo các nút phân trang
function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    let totalPages = Math.ceil(filteredData.length / recordsPerPage);
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

// 📌 Hàm thay đổi trang
function changePage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
}

// 📌 Hàm tìm kiếm toàn bộ bảng
function filterTable() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
    filteredData = dataCache.filter(item => JSON.stringify(item).toLowerCase().includes(searchValue));
    
    currentPage = 1;  // Quay lại trang đầu tiên
    renderTable();
    renderPagination();
}

// 📌 Hàm lọc theo từng cột
function filterColumn() {
    let filters = document.querySelectorAll(".filter-input");
    
    filteredData = dataCache.filter(item => {
        return Array.from(filters).every(filter => {
            let colIndex = filter.getAttribute("data-col");
            let filterValue = filter.value.toLowerCase().trim();
            let cellText = Object.values(item)[colIndex]?.toString().toLowerCase() || "";

            return !filterValue || cellText.includes(filterValue);
        });
    });

    currentPage = 1;  // Quay lại trang đầu tiên
    renderTable();
    renderPagination();
}
