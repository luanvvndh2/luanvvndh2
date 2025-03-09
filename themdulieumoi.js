document.addEventListener("DOMContentLoaded", function () {
    const importKetQua = document.getElementById("importKetQua");
    const importThongtin = document.getElementById("importThongtin");
    const importThuoc = document.getElementById("importthuoc");

    importKetQua.addEventListener("click", async function (event) {
        event.preventDefault();
        await handleImport("fileKetQua", "messageKetQua", "ketqua");
    });

    importThongtin.addEventListener("click", async function (event) {
        event.preventDefault();
        await handleImport("fileThongTin", "messageThongTin", "thongtin");
    });

    importThuoc.addEventListener("click", async function (event) {
        event.preventDefault();
        await handleImport("filethuoc", "messagethuoc", "thuoc");
    });

    async function handleImport(fileInputId, messageId, tableName) {
        const fileInput = document.getElementById(fileInputId);
        const message = document.getElementById(messageId);

        if (!fileInput.files.length) {
            message.textContent = "Vui lòng chọn file Excel!";
            return;
        }

        const file = fileInput.files[0];
        message.textContent = "Đang đọc file...";
        
        const data = await readExcelFile(file);
        if (data.length === 0) {
            message.textContent = "File không có dữ liệu hợp lệ!";
            return;
        }

        message.textContent = "Đang tải dữ liệu lên Supabase...";
        const response = await uploadToSupabase(data, tableName);

        message.textContent = response.ok 
            ? `Import thành công vào bảng ${tableName}!`
            : `Có lỗi xảy ra khi import vào bảng ${tableName}.`;
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
        const batchSize = 500; // Số lượng dòng mỗi lần gửi (tối ưu hiệu suất)
        const url = `https://ezbqiajemruzegceorwv.supabase.co/rest/v1/${tableName}`;
        const headers = {
            "Content-Type": "application/json",
               "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc",
               "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc"
        };

        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(batch)
            });

            if (!response.ok) return response; // Nếu có lỗi, dừng ngay
        }
        return { ok: true };
    }
});
