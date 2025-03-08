document.addEventListener("DOMContentLoaded", function () {
      const importKetQua = document.getElementById("importKetQua");
        const importThongtin = document.getElementById("importThongtin");
importKetQua.addEventListener("click", async function (event) {
        event.preventDefault(); // Ngăn chặn form load lại trang
            alert("importKetQuai!");
        importKetQua() 
})
      
importThongtin.addEventListener("click", async function (event) {
        event.preventDefault(); // Ngăn chặn form load lại trang
        importThongTin() 
})
    
async function importKetQua() {
        const fileInput = document.getElementById("fileKetQua");
        const message = document.getElementById("messageKetQua");

        if (!fileInput.files.length) {
            message.textContent = "Vui lòng chọn file Excel cho bảng Kết Quả!";
            return;
        }

        const file = fileInput.files[0];
        const data = await readExcelFile(file);
        message.textContent = "Đang tải dữ liệu lên Supabase...";

        const response = await uploadToSupabase(data, "ketqua");
        message.textContent = response.ok ? "Import Kết Quả thành công!" : "Có lỗi xảy ra khi import Kết Quả.";
    }

    async function importThongTin() {
        const fileInput = document.getElementById("fileThongTin");
        const message = document.getElementById("messageThongTin");

        if (!fileInput.files.length) {
            message.textContent = "Vui lòng chọn file Excel cho bảng Thông Tin!";
            return;
        }

        const file = fileInput.files[0];
        const data = await readExcelFile(file);
        message.textContent = "Đang tải dữ liệu lên Supabase...";

        const response = await uploadToSupabase(data, "thongtin");
        message.textContent = response.ok ? "Import Thông Tin thành công!" : "Có lỗi xảy ra khi import Thông Tin.";
    }

    function readExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                resolve(jsonData);
            };
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        });
    }

    async function uploadToSupabase(data, tableName) {
        const response = await fetch(`https://ezbqiajemruzegceorwv.supabase.co/rest/v1/${tableName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc"
            },
            body: JSON.stringify(data)
        });
        return response;
    }
})
