  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

    // Khởi tạo Supabase client
    const supabaseUrl = 'https://ezbqiajemruzegceorwv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const searchButton = document.getElementById("searchButton");
    const nameInput = document.getElementById("nameInput");
    const cccdInput = document.getElementById("cccdInput");
    const searchMessage = document.getElementById("searchMessage");
    const resultTable = document.getElementById("resultTable");
    const resultTableBody = resultTable.querySelector("tbody");

    searchButton.addEventListener("click", async () => {
        const hoTen = nameInput.value.trim();
        const soCccd = cccdInput.value.trim();

        if (!hoTen || !soCccd) {
            searchMessage.textContent = "Vui lòng nhập cả HO_TEN và SO_CCCD.";
            return;
        }

        searchMessage.textContent = "Đang tìm kiếm...";
        resultTable.style.display = "none";
        resultTableBody.innerHTML = "";

        try {
            // Gọi function search_results từ Supabase
            const { data, error } = await supabase
                .rpc('search_results', { ho_ten: hoTen, so_cccd: soCccd });

            if (error) {
                console.error("Lỗi khi gọi function:", error);
                searchMessage.textContent = "Có lỗi xảy ra khi tìm kiếm.";
                return;
            }

            if (data.length === 0) {
                searchMessage.textContent = "Không tìm thấy kết quả.";
                return;
            }

            // Hiển thị kết quả
            searchMessage.textContent = "";
            data.forEach(item => {
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
            console.error("Lỗi:", error);
            searchMessage.textContent = "Có lỗi xảy ra khi tìm kiếm.";
        }
    });
