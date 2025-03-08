document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const nameInput = document.getElementById("nameInput");
    const cccdInput = document.getElementById("cccdInput");
    const searchMessage = document.getElementById("searchMessage");
    const resultTable = document.getElementById("resultTable");
    const resultTableBody = resultTable.querySelector("tbody");

    // Thay YOUR_API_KEY và YOUR_AUTH_TOKEN bằng khóa của bạn
    const API_URL = "https://ezbqiajemruzegceorwv.supabase.co/rest/v1";
    const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc";

    searchButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Ngăn chặn reload trang
        const hoTen = nameInput.value.trim();
        const soCccd = cccdInput.value.trim();

        if (hoTen && soCccd) {
            searchMessage.textContent = "Đang tìm kiếm...";
            await handleSearch(hoTen, soCccd);
        } else {
            searchMessage.textContent = "Vui lòng nhập cả BHYT và SO_CCCD.";
        }
    });

    async function handleSearch(hoTen, soCccd) {
        try {
            // Gọi API để tìm MA_LK từ bảng thongtin dựa trên HO_TEN và SO_CCCD
            const thongtinResponse = await fetch(
                `${API_URL}/thongtin?MA_THE_BHYT.ilike.%${hoTen}%&SO_CCCD.eq.${soCccd}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": API_KEY,
                        "Authorization": `Bearer ${API_KEY}`
                    }
                }
            );
            const thongtinData = await thongtinResponse.json();

            if (thongtinData.length === 0) {
                searchMessage.textContent = "Không tìm thấy thông tin phù hợp.";
                resultTable.style.display = "none";
                return;
            }

            const maLk = thongtinData[0].MA_LK;

            // Gọi API để lấy kết quả từ bảng ketqua dựa trên MA_LK
            const ketquaResponse = await fetch(
                `${API_URL}/ketqua?MA_LK.eq.${maLk}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": API_KEY,
                        "Authorization": `Bearer ${API_KEY}`
                    }
                }
            );
            const ketquaData = await ketquaResponse.json();

            if (ketquaData.length === 0) {
                searchMessage.textContent = "Không có kết quả nào.";
                resultTable.style.display = "none";
                return;
            }

            // Hiển thị kết quả vào bảng
            searchMessage.textContent = "";
            resultTableBody.innerHTML = "";
            ketquaData.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.MA_DICH_VU}</td>
                    <td>${item.TEN_CHI_SO}</td>
                    <td>${item.GIA_TRI}</td>
                    <td>${item.MO_TA}</td>
                    <td>${item.KET_LUAN}</td>
                `;
                resultTableBody.appendChild(row);
            });
            resultTable.style.display = "table";
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            searchMessage.textContent = "Có lỗi xảy ra khi tìm kiếm.";
        }
    }
});
