document.addEventListener("DOMContentLoaded", function () {
    const datLichButton = document.getElementById("datLichButton");
    const datLichForm = document.getElementById("datLichForm");

    datLichButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const data = {
            ho_ten: document.getElementById("hoTen").value.trim(),
            ngay_sinh: document.getElementById("ngaySinh").value,
            bhyt_cccd: document.getElementById("bhytCccd").value.trim(),
            so_dien_thoai: document.getElementById("soDienThoai").value.trim(),
            ngay_kham: document.getElementById("ngayKham").value,
            thoi_gian: document.getElementById("thoiGian").value,
            tien_su_benh: document.getElementById("tienSuBenh").value.trim()
        };

        console.log("🚀 Gửi request đến Worker:", JSON.stringify(data));

        try {
            const response = await fetch("https://datlich-worker.luanvv-ndh2.workers.dev", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("📩 Phản hồi từ Worker:", result);

            if (response.ok) {
                alert("Đặt lịch thành công!");
                datLichForm.reset();
            } else {
                alert(result.error || "Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("❌ Lỗi kết nối:", error);
           // alert("Lỗi kết nối đến server!");
        }
    });
});
