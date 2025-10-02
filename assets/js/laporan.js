document.addEventListener('DOMContentLoaded', function() {

    const reportForm = document.getElementById('reportForm');
    const historyContainer = document.getElementById('reportHistoryContainer');
    
    // Database Simulasi (Untuk menyimpan data laporan)
    let reports = loadReports(); 

    // Muat data dari localStorage atau default
    function loadReports() {
        const storedReports = localStorage.getItem('rtb_reports');
        if (storedReports) {
            return JSON.parse(storedReports);
        }
        // Data default (simulasi 3 laporan dengan status berbeda)
        return [
            { id: 1, type: "Mesin Cuci Rusak", loc: "Blok B, Lt 3", desc: "Mesin cuci tidak mau berputar.", date: "2025-09-25", status: "Resolved", rating: 4 },
            { id: 2, type: "Kebocoran/Air", loc: "Kamar Mandi Cluster 1", desc: "Kran air menetes sejak 2 hari lalu.", date: "2025-09-28", status: "In Progress", rating: 0 },
            { id: 3, type: "Fasilitas Umum Lain", loc: "Meja Coworking", desc: "Meja belajar goyang dan bautnya hilang.", date: "2025-09-30", status: "Pending", rating: 0 },
        ];
    }
    
    // Simpan data ke localStorage
    function saveReports() {
        localStorage.setItem('rtb_reports', JSON.stringify(reports));
    }


    // ====================================
    // FUNGSI 1: MENGUBAH STATUS KE TAMPILAN HTML
    // ====================================
    function getStatusHtml(status) {
        switch (status) {
            case 'Pending':
                return '<span class="status-tag status-pending">Menunggu Review</span>';
            case 'In Progress':
                return '<span class="status-tag status-in-progress">Sedang Dikerjakan</span>';
            case 'Resolved':
                return '<span class="status-tag status-resolved">Selesai Dikerjakan</span>';
            default:
                return '<span class="status-tag status-closed">Closed</span>';
        }
    }

    // ====================================
    // FUNGSI 2: MENGISI RIWAYAT LAPORAN
    // ====================================
    function renderHistory() {
        if (reports.length === 0) {
            historyContainer.innerHTML = '<div class="alert alert-secondary text-center">Belum ada riwayat pelaporan.</div>';
            return;
        }

        historyContainer.innerHTML = '';
        
        reports.sort((a, b) => b.id - a.id); // Urutkan dari terbaru
        
        reports.forEach((report) => {
            const date = new Date(report.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            
            let ratingHtml = '';
            
            if (report.status === 'Resolved' && report.rating === 0) {
                // Tampilkan opsi rating jika selesai dan belum di-rating
                ratingHtml = `
                    <div class="ms-3 text-end" data-report-id="${report.id}">
                        <p class="mb-1 small fw-bold text-dark">Beri Nilai Teknisi:</p>
                        <div class="rating-stars" data-report-id="${report.id}">
                            <i class="bi bi-star rating-star" data-rating="1"></i>
                            <i class="bi bi-star rating-star" data-rating="2"></i>
                            <i class="bi bi-star rating-star" data-rating="3"></i>
                            <i class="bi bi-star rating-star" data-rating="4"></i>
                            <i class="bi bi-star rating-star" data-rating="5"></i>
                        </div>
                    </div>
                `;
            } else if (report.rating > 0) {
                 // Tampilkan rating yang sudah ada
                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    stars += `<i class="bi bi-star-fill ${i <= report.rating ? 'filled' : ''}"></i>`;
                }
                ratingHtml = `<div class="ms-3 text-end"><p class="mb-1 small text-dark">Nilai Anda:</p><span class="small">${stars}</span></div>`;
            }

            const listItem = document.createElement('div');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center mb-2 report-item';
            listItem.innerHTML = `
                <div class="me-3">
                    <h5 class="mb-1 fw-bold">${report.type}</h5>
                    <small class="text-muted">Lokasi: ${report.loc} | Diajukan: ${date}</small>
                    <p class="mb-0 small">${report.desc.substring(0, 50)}...</p>
                </div>
                ${getStatusHtml(report.status)}
                ${ratingHtml}
            `;
            
            historyContainer.appendChild(listItem);
        });
        
        // Panggil listener untuk rating stars setelah semua di-render
        setupRatingListeners();
    }
    
    // ====================================
    // FUNGSI 3: LOGIC SUBMIT FORM
    // ====================================
    reportForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const reportType = document.getElementById('reportType').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;

        const newReport = {
            id: Date.now(),
            type: reportType,
            loc: location,
            desc: description,
            date: new Date().toISOString().slice(0, 10),
            status: 'Pending', // Selalu mulai dari Pending
            rating: 0
        };

        reports.push(newReport);
        saveReports();
        
        reportForm.reset();
        alert('Laporan Kerusakan berhasil diajukan! Laporan Anda sekarang di status "Menunggu Review".');

        renderHistory();
    });

    // ====================================
    // FUNGSI 4: LOGIC RATING
    // ====================================
    function setupRatingListeners() {
        document.querySelectorAll('.rating-stars').forEach(starsContainer => {
            const reportId = starsContainer.dataset.reportId;
            const starIcons = starsContainer.querySelectorAll('.rating-star');
            
            starIcons.forEach(star => {
                star.addEventListener('click', function() {
                    const ratingValue = parseInt(this.dataset.rating);
                    
                    // Konfirmasi dan simpan rating
                    if (confirm(`Anda memberi rating ${ratingValue} bintang untuk layanan ini?`)) {
                        
                        // Temukan dan update report di database simulasi
                        const index = reports.findIndex(r => r.id == reportId);
                        if (index !== -1) {
                            reports[index].rating = ratingValue;
                            saveReports();
                            alert(`Terima kasih atas rating ${ratingValue} bintang Anda!`);
                            renderHistory(); // Render ulang untuk menampilkan bintang terisi
                        }
                    }
                });
                
                // Efek hover
                star.addEventListener('mouseover', function() {
                    const hoverValue = parseInt(this.dataset.rating);
                    starIcons.forEach(s => {
                        if (parseInt(s.dataset.rating) <= hoverValue) {
                            s.classList.add('filled');
                        } else {
                            s.classList.remove('filled');
                        }
                    });
                });
                
                star.addEventListener('mouseout', function() {
                    // Reset hover effect
                    starIcons.forEach(s => s.classList.remove('filled'));
                });
            });
        });
    }

    // INISIASI
    renderHistory();
});