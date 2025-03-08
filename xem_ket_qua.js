document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const nameInput = document.getElementById("nameInput");
    const cccdInput = document.getElementById("cccdInput");
    const searchMessage = document.getElementById("searchMessage");
    const resultTable = document.getElementById("resultTable");
    const resultTableBody = resultTable.querySelector("tbody");

    searchButton.addEventListener("click", async function (event) {
         event.preventDefault();//them
        const hoTen = nameInput.value.trim();
        const soCccd = cccdInput.value.trim();

        if (hoTen && soCccd) {
            searchMessage.textContent = "Đang tìm kiếm...";
            await handleSearch(hoTen, soCccd);
        } else {
            searchMessage.textContent = "Vui lòng nhập cả HO_TEN và SO_CCCD.";
        }
    });

    async function handleSearch(hoTen, soCccd) {
        try {
            // Tìm MA_LK từ bảng thongtin dựa trên HO_TEN và SO_CCCD
            const thongtinResponse = await fetch(
                `https://ezbqiajemruzegceorwv.supabase.co/rest/v1/thongtin?HO_TEN.ilike.%${hoTen}%&SO_CCCD.eq.${soCccd}`,
                {
                    headers: {
                "Content-Type": "application/json",
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc"
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

            // Tìm kết quả từ bảng ketqua dựa trên MA_LK
            const ketquaResponse = await fetch(
                `https://ezbqiajemruzegceorwv.supabase.co/rest/v1/ketqua?MA_LK.eq.${maLk}`,
                {
                    headers: {
                        "apikey": "YOUR_API_KEY",
                        "Authorization": "Bearer YOUR_AUTH_TOKEN"
                    }
                }
            );
            const ketquaData = await ketquaResponse.json();

            if (ketquaData.length === 0) {
                searchMessage.textContent = "Không có kết quả nào.";
                resultTable.style.display = "none";
                return;
            }

            // Hiển thị kết quả
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
