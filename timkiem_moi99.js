document.addEventListener("DOMContentLoaded", function () {
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Khởi tạo Supabase client
const supabaseUrl = 'https://ezbqiajemruzegceorwv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc';
const supabase = createClient(supabaseUrl, supabaseKey);

const searchButton = document.getElementById("searchButton");
const maTheBHYTInput = document.getElementById("maTheBHYTInput");
const cccdInput = document.getElementById("cccdInput");
const searchMessage = document.getElementById("searchMessage");
const resultTable = document.getElementById("resultTable");
const resultTableBody = resultTable.querySelector("tbody");

searchButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Ngăn chặn form load lại trang
    const maTheBHYT = maTheBHYTInput.value.trim();
    const soCccd = cccdInput.value.trim();

    if (!maTheBHYT || !soCccd) {
        searchMessage.textContent = "Vui lòng nhập cả MA_THE_BHYT và SO_CCCD.";
        return;
    }

    searchMessage.textContent = "Đang tìm kiếm...";
    resultTable.style.display = "none";
    resultTableBody.innerHTML = "";

    try {
        // Gọi function search_results từ Supabase với MA_THE_BHYT thay vì HO_TEN
        const { data, error } = await supabase
            .rpc('search_results', { ma_the_bhyt: maTheBHYT, so_cccd: soCccd });

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
                <td>${item.ma_dich_vu}</td>
                <td>${item.ten_chi_so}</td>
                <td>${item.gia_tri}</td>
                <td>${item.ket_luan}</td>
            `;
            resultTableBody.appendChild(row);
        });
        resultTable.style.display = "table";

    } catch (error) {
        console.error("Lỗi:", error);
        searchMessage.textContent = "Có lỗi xảy ra khi tìm kiếm.";
    }
});

})
