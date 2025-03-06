document.addEventListener("DOMContentLoaded", function () {
    const datLichButton = document.getElementById("datLichButton");
    const datLichForm = document.getElementById("datLichForm");

    datLichButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Ngăn chặn form load lại trang

        const hoTen = document.getElementById("hoTen").value.trim();
        const ngaySinh = document.getElementById("ngaySinh").value;
        const bhytCccd = document.getElementById("bhytCccd").value.trim();
        const soDienThoai = document.getElementById("soDienThoai").value.trim();
        const ngayKham = document.getElementById("ngayKham").value;
        const thoiGian = document.getElementById("thoiGian").value;
        const tienSuBenh = document.getElementById("tienSuBenh").value.trim();

        // Lấy ngày hiện tại và ngày tối đa (hiện tại + 15 ngày)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 15);

        // Chuyển đổi giá trị nhập vào thành đối tượng Date
        const ngaySinhDate = new Date(ngaySinh);
        const ngayKhamDate = new Date(ngayKham);

        // Kiểm tra ngày sinh
        if (ngaySinh && ngaySinhDate > today) {
            alert("Ngày sinh không được lớn hơn ngày hiện tại!");
            return;
        }

        // Kiểm tra ngày khám
        if (ngayKhamDate < today || ngayKhamDate > maxDate) {
            alert("Ngày khám phải từ hôm nay đến tối đa 15 ngày sau!");
            return;
        }

        // Kiểm tra độ dài số thẻ BHYT / CCCD (9, 10, 12, hoặc 15 ký tự)
        const validBHYTLengths = [9, 10, 12, 15];
        if (!validBHYTLengths.includes(bhytCccd.length)) {
            alert("Số thẻ BHYT / CCCD phải có 9, 10, 12 hoặc 15 ký tự!");
            return;
        }

        // Kiểm tra số điện thoại (phải có đúng 10 số và là chữ số)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(soDienThoai)) {
            alert("Số điện thoại phải có đúng 10 chữ số!");
            return;
        }

        // Kiểm tra dữ liệu bắt buộc
        if (!hoTen || !ngaySinh || !bhytCccd || !soDienThoai || !ngayKham || !thoiGian) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const data = {
            ho_ten: hoTen,
            ngay_sinh: ngaySinh,
            bhyt_cccd: bhytCccd,
            so_dien_thoai: soDienThoai,
            ngay_kham: ngayKham,
            thoi_gian: thoiGian,
            tien_su_benh: tienSuBenh
        };

        try {
            const response = await fetch("https://ezbqiajemruzegceorwv.supabase.co/rest/v1/datlichkham_36065", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc"
                },
                body: JSON.stringify(data)
            });

    

            console.log("Response:", response);


            if (response.status===201) {
                alert("Đặt lịch thành công!");
                datLichForm.reset();
            } else {
                console.error("Lỗi từ server:", result);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi kết nối đến server:", error);
          
        }
    });
});
