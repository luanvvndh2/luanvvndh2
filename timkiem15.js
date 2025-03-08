document.addEventListener("DOMContentLoaded", function () {

const supabaseUrl = 'https://ezbqiajemruzegceorwv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YnFpYWplbXJ1emVnY2Vvcnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjg3OTEsImV4cCI6MjA1NjgwNDc5MX0.5Co6s1RLLIpNgMC2Qymf4ZwFdKwmh3EFLu1fu4n68Lc';

    document.getElementById('searchButton').addEventListener('click', async (event) => {
          event.preventDefault(); // Ngăn chặn form load lại trang
        const maTheBHYT = document.getElementById('maTheBHYTInput').value.trim();
        const soCCCD = document.getElementById('cccdInput').value.trim();
        const searchMessage = document.getElementById('searchMessage');
        const resultTable = document.getElementById('resultTable');
        const tbody = resultTable.querySelector('tbody');

        // Xóa kết quả tìm kiếm cũ
        tbody.innerHTML = '';
        resultTable.style.display = 'none';
        searchMessage.textContent = 'Đang tìm kiếm...';

        // Kiểm tra dữ liệu đầu vào
        if (!maTheBHYT && !soCCCD) {
            searchMessage.textContent = 'Vui lòng nhập BHYT hoặc SO_CCCD!';
            return;
        }

        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/tim_kiem_thong_tin`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "MA_THE_BHYT": maTheBHYT,
                    "so_cccd": soCCCD
                })
            });

            if (response.ok) {
                const data = await response.json();

                if (data.length > 0) {
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.MA_DICH_VU}</td>
                            <td>${item.TEN_CHI_SO}</td>
                            <td>${item.GIA_TRI}</td>
                            <td>${item.KET_LUAN}</td>
                        `;
                        tbody.appendChild(row);
                    });
                    resultTable.style.display = 'table';
                    searchMessage.textContent = 'Đã tìm thấy kết quả:';
                } else {
                    searchMessage.textContent = 'Không tìm thấy kết quả nào!';
                }
            } else {
                searchMessage.textContent = `Lỗi API: ${response.status} - ${response.statusText}`;
            }
        } catch (error) {
            console.error('Lỗi kết nối:', error);
            searchMessage.textContent = 'Có lỗi xảy ra khi kết nối!';
        }
    });

})
