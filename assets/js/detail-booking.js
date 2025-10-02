document.addEventListener('DOMContentLoaded', function() {
    
    // --- Elemen Utama ---
    const mainImage = document.getElementById('mainImage');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const recommendationList = document.getElementById('recommendationList');
    const rulesList = document.getElementById('rulesList');
    const calendarNav = document.getElementById('calendarNav');
    const timeSlotsDisplay = document.getElementById('timeSlotsDisplay');
    const selectedSlotInfo = document.getElementById('selectedSlotInfo');
    const prevDayBtn = document.getElementById('prevDayBtn');
    const nextDayBtn = document.getElementById('nextDayBtn');
    const bookNowBtn = document.getElementById('bookNowBtn');
    const slotSummary = document.getElementById('slotSummary');


    let mainItemData = null;
    let currentCalendarDate = new Date(); 
    let selectedTimeSlot = null; 
    const DAYS_TO_SHOW = 4;
    const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];


    // ====================================
    // DATA SIMULASI (Digunakan untuk mengisi konten dinamis)
    // ====================================
    const ALL_RECOMMENDATIONS = [
        { name: "Aula Serbaguna", roomType: "Ruangan", image: "content-serbaguna.jpg", rating: 5.0, location: "Gedung Utama" },
        { name: "Coworking Lantai 2", roomType: "Ruangan", image: "content-coworking.jpg", rating: 4.5, location: "Gedung B" },
        { name: "Theater Utama", roomType: "Ruangan", image: "content-theater.jpg", rating: 4.7, location: "Gedung Utama" },
        { name: "Meja Ping Pong", roomType: "Alat", image: "content-plaza.jpg", rating: 4.4, location: "Area Plaza" },
    ];
    
    const SIMULATED_GALLERY = [
        "content-dapur.jpg",
        "communal/communal_1.jpg", 
        "content-mesincuci.jpg", 
        "content-voli.jpg" 
    ];

    const SIMULATED_RULES = {
        "Dapur": [
            { icon: "bi-trash-fill", text: "WAJIB kirim foto fasilitas BERSIH ke PIC Dapur setelah digunakan." },
            { icon: "bi-ban-fill", text: "TIDAK BOLEH menggunakan minyak sama sekali." },
            { icon: "bi-calendar-event-fill", text: "Booking Kompor dan Air Fryer maksimal 1 jam." },
        ],
        "Comunal": [
            { icon: "bi-volume-mute-fill", text: "Waktu penggunaan sampai Pk 23.00 (weekday) & Pk 24.00 (weekend)." },
            { icon: "bi-trash-fill", text: "Wajib merapikan fasilitas umum setelah dipakai (CLEAN AS YOU GO)." },
        ]
    };

    const SIMULATED_SCHEDULE = [
        { time: "08:00 - 09:00", status: "Available" },
        { time: "09:00 - 10:00", status: "Available" },
        { time: "10:00 - 11:00", status: "Booked" },
        { time: "11:00 - 12:00", status: "Available" },
        { time: "12:00 - 13:00", status: "Available" },
        { time: "13:00 - 14:00", status: "Booked" },
        { time: "14:00 - 15:00", status: "Available" },
        { time: "15:00 - 16:00", status: "Available" },
        { time: "16:00 - 17:00", status: "Available" },
        { time: "17:00 - 18:00", status: "Booked" },
        { time: "18:00 - 19:00", status: "Available" },
        { time: "19:00 - 20:00", status: "Available" },
        { time: "20:00 - 21:00", status: "Available" },
    ];

    // ====================================
    // LOGIC URL PARSING & DETAIL DISPLAY
    // ====================================
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    mainItemData = {
        name: getUrlParameter('name'),
        location: getUrlParameter('location'),
        rating: getUrlParameter('rating'),
        roomType: getUrlParameter('roomType'),
        image: getUrlParameter('image')
    };
    
    const LONG_DESCRIPTION = `Fasilitas ${mainItemData.name} (${mainItemData.roomType}) ini merupakan salah satu sarana unggulan yang disediakan Rumah Biru untuk mendukung tumbuh kembang dan kebutuhan praktis Warga Biru. Terletak strategis di ${mainItemData.location}, area ini dirancang dengan standar kenyamanan tinggi. Meskipun tersedia gratis, kami sangat mengharapkan kesadaran kolektif untuk menjaga kebersihan dan ketertiban.`;

    if (mainItemData.name) {
        document.getElementById('pageTitle').textContent = `Detail: ${mainItemData.name}`;
        document.getElementById('itemName').textContent = mainItemData.name;
        document.getElementById('itemLocation').textContent = mainItemData.location;
        document.getElementById('itemRoomType').textContent = mainItemData.roomType;
        document.getElementById('itemRating').innerHTML = `${mainItemData.rating} <i class="bi bi-star-fill"></i>`;
        document.getElementById('itemDescriptionLong').textContent = LONG_DESCRIPTION.trim();
        mainImage.src = `assets/images/${mainItemData.image}`; 
        
        renderGallery();
        renderRules();
        renderRecommendations();
        renderCalendarNav(currentCalendarDate);
    } else {
        document.querySelector('.container').innerHTML = '<p class="text-center p-5 lead">Data fasilitas tidak valid atau hilang. Kembali ke halaman <a href="booking.html">Booking</a>.</p>';
    }

    // ====================================
    // LOGIC KALENDER & SLOT WAKTU
    // ====================================

    function renderCalendarNav(startDate) {
        calendarNav.innerHTML = '';
        
        for (let i = 0; i < DAYS_TO_SHOW; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            
            const dayName = DAY_NAMES[day.getDay()];
            const dateStr = day.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            const fullDateStr = day.toISOString().split('T')[0];
            
            const dayElement = document.createElement('div');
            dayElement.className = `calendar-day me-2 ${i === 0 ? 'selected' : ''}`;
            dayElement.dataset.date = fullDateStr;
            dayElement.innerHTML = `<div class="small">${dayName}</div><div>${dateStr}</div>`;
            
            dayElement.addEventListener('click', function() {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');
                renderTimeSlots(this.dataset.date); 
            });
            
            calendarNav.appendChild(dayElement);
            
            if (i === 0) {
                 renderTimeSlots(fullDateStr);
            }
        }
    }

    // Navigasi Hari
    prevDayBtn.addEventListener('click', () => {
        // Mencegah navigasi ke tanggal sebelum hari ini
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const newDate = new Date(currentCalendarDate);
        newDate.setDate(currentCalendarDate.getDate() - 1);

        if (newDate >= today) {
            currentCalendarDate.setDate(currentCalendarDate.getDate() - 1);
            renderCalendarNav(currentCalendarDate);
        }
    });

    nextDayBtn.addEventListener('click', () => {
        currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
        renderCalendarNav(currentCalendarDate);
    });

    function renderTimeSlots(date) {
        timeSlotsDisplay.innerHTML = '';
        
        SIMULATED_SCHEDULE.forEach(slot => {
            const status = slot.status;
            let statusClass = status === 'Booked' ? 'booked' : 'available';

            const slotElement = document.createElement('div');
            slotElement.className = `slot-time ${statusClass}`;
            slotElement.dataset.time = slot.time;
            slotElement.dataset.date = date;
            
            slotElement.innerHTML = `
                <div>${slot.time}</div>
                <div class="small ${status === 'Booked' ? 'text-danger' : 'text-success'}">${status === 'Booked' ? 'Booked' : 'Rp0 (Gratis)'}</div>
            `;
            
            if (status === 'Available') {
                slotElement.addEventListener('click', handleSlotSelection);
            }

            timeSlotsDisplay.appendChild(slotElement);
        });
        
        if (SIMULATED_SCHEDULE.length === 0) {
            timeSlotsDisplay.innerHTML = '<p class="text-center text-muted w-100 mb-0">Jadwal tidak tersedia untuk tanggal ini.</p>';
        }

        // Reset state pemilihan slot
        selectedTimeSlot = null;
        selectedSlotInfo.style.display = 'none';
        slotSummary.textContent = '-';
        bookNowBtn.disabled = true;
    }
    
    function handleSlotSelection() {
        document.querySelectorAll('.slot-time').forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
        
        const timeSlot = this.dataset.time;
        const bookingDate = this.dataset.date;
        
        selectedTimeSlot = timeSlot;

        selectedSlotInfo.textContent = `Slot terpilih: ${timeSlot} pada ${bookingDate}.`;
        selectedSlotInfo.style.display = 'block';
        slotSummary.textContent = timeSlot;
        bookNowBtn.disabled = false;


        // Simulasi Aksi Booking (bisa diaktifkan di tombol PESAN SEKARANG)
        /*
        const confirmation = confirm(`Anda ingin memesan slot:\nFasilitas: ${mainItemData.name}\nTanggal: ${bookingDate}\nJam: ${timeSlot}\n\nLanjutkan pemesanan?`);
        
        if (confirmation) {
            alert(`Pemesanan ${itemData.name} berhasil diajukan! Menunggu persetujuan.`);
            renderTimeSlots(bookingDate); 
        } else {
            this.classList.remove('selected');
        }
        */
    }
    
    // Event listener untuk tombol PESAN SEKARANG
    bookNowBtn.addEventListener('click', function() {
        if (selectedTimeSlot) {
            const bookingDate = document.querySelector('.calendar-day.selected').dataset.date;
            
            // Simulasikan form submission
            alert(`Pemesanan ${mainItemData.name} berhasil diajukan!\nTanggal: ${bookingDate}\nSlot Waktu: ${selectedTimeSlot}\n\nStatus: Menunggu Persetujuan.`);
            
            // Reset state setelah simulasi pesan
            renderTimeSlots(bookingDate);
        }
    });

    // ====================================
    // LOGIC GALERI FOTO & REKOMENDASI (Tidak Berubah)
    // ====================================
    function renderGallery() {
        mainImage.src = `assets/images/${mainItemData.image}`; 
        
        const galleryItems = [mainItemData.image, ...SIMULATED_GALLERY];

        thumbnailContainer.innerHTML = ''; 
        galleryItems.slice(0, 4).forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.className = 'gallery-thumbnail';
            thumb.src = `assets/images/${imgSrc}`;
            thumb.alt = `Thumbnail ${index + 1}`;
            thumb.dataset.fullSrc = `assets/images/${imgSrc}`;

            if (index === 0) {
                thumb.classList.add('active');
            }

            thumb.addEventListener('click', function() {
                mainImage.src = this.dataset.fullSrc;
                document.querySelectorAll('.gallery-thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });

            thumbnailContainer.appendChild(thumb);
        });
    }

    function renderRecommendations() {
        const filteredRecs = ALL_RECOMMENDATIONS.filter(rec => rec.name !== mainItemData.name).slice(0, 3);
        
        if (filteredRecs.length === 0) {
            recommendationList.innerHTML = '<p class="text-muted">Tidak ada rekomendasi lain saat ini.</p>';
            return;
        }

        recommendationList.innerHTML = '';
        filteredRecs.forEach(item => {
            const detailUrl = `detail-booking.html?name=${encodeURIComponent(item.name)}&location=${encodeURIComponent(item.location)}&rating=${item.rating}&roomType=${encodeURIComponent(item.roomType)}&image=${encodeURIComponent(item.image)}`;

            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6';
            col.innerHTML = `
                <a href="${detailUrl}" class="text-decoration-none text-dark">
                    <div class="recommendation-card">
                        <div class="row g-0">
                            <div class="col-5">
                                <img src="assets/images/${item.image}" class="img-fluid w-100" alt="${item.name}">
                            </div>
                            <div class="col-7 p-3">
                                <p class="small fw-bold mb-0">${item.name}</p>
                                <small class="text-muted">${item.location}</small>
                                <p class="venue-rating small mb-0 mt-1"><i class="bi bi-star-fill"></i> ${item.rating}</p>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            recommendationList.appendChild(col);
        });
    }
});