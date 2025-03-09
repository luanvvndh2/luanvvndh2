document.addEventListener("DOMContentLoaded", function () {
    const supabaseUrl = "https://ezbqiajemruzegceorwv.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc";

    const searchButton = document.getElementById("searchButton");
    const maTheBHYTInput = document.getElementById("maTheBHYTInput");
    const hotenTInput = document.getElementById("hotenTInput");
    const namsinhTInput = document.getElementById("namsinhTInput");
    const searchMessage = document.getElementById("searchMessage");
    const resultTableBody = document.querySelector("#resultTable tbody");

    searchButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const hoten = hotenTInput.value.trim();
        const namsinh = namsinhTInput.value.trim();
        const maTheBHYT = maTheBHYTInput.value.trim();

        resultTableBody.innerHTML = "";
        searchMessage.textContent = "Đang tìm kiếm...";

        if (!maTheBHYT && !hoten && !namsinh) {
            searchMessage.textContent = "Vui lòng nhập họ tên, số BHYT hoặc ngày/tháng/năm sinh.";
            return;
        }

        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/tim_kiem_thong_tin1`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({
                    ho_ten: hoten || null,
                    ngay_sinh: namsinh || null,
                    ma_the_bhyt: maTheBHYT || null,
                }),
            });

            if (!response.ok) {
                throw new Error("Lỗi kết nối đến Supabase.");
            }

            const data = await response.json();

            if (data && Array.isArray(data) && data.length > 0) {
                searchMessage.textContent = `Tìm thấy ${data.length} kết quả.`;

                const groupedData = {};
                data.forEach(item => {
                    const ngayXetNghiem = item.ngay_kq || "Không rõ ngày";
                    if (!groupedData[ngayXetNghiem]) {
                        groupedData[ngayXetNghiem] = [];
                    }
                    groupedData[ngayXetNghiem].push(item);
                });

                let stt = 1; // Đánh số thứ tự từng dòng

                for (const [ngay, records] of Object.entries(groupedData)) {
                    const ngayRow = document.createElement("tr");
                    ngayRow.innerHTML = `<td colspan="5" style="background-color:#f0f0f0; font-weight:bold; text-align:center;">Ngày xét nghiệm: ${ngay}</td>`;
                    resultTableBody.appendChild(ngayRow);

                    records.forEach(record => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${stt++}</td>
                            <td>${record.ma_dich_vu}</td>
                            <td>${record.ten_chi_so}</td>
                            <td>${record.gia_tri}</td>
                            <td>${record.ket_luan}</td>
                        `;
                        resultTableBody.appendChild(row);
                    });
                }
            } else {
                searchMessage.textContent = "Không tìm thấy kết quả phù hợp.";
            }
        } catch (error) {
            console.error("Lỗi:", error);
            searchMessage.textContent = "Đã xảy ra lỗi khi tìm kiếm.";
        }
    });
});
