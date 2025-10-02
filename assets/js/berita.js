document.addEventListener('DOMContentLoaded', function() {
    
    // --- Elemen Utama ---
    const mainImage = document.getElementById('mainImage');
    const calendarNav = document.getElementById('calendarNav');
    const timeSlotsDisplay = document.getElementById('timeSlotsDisplay');
    const fieldsListContainer = document.getElementById('fieldsList');
    const selectedSlotInfo = document.getElementById('selectedSlotInfo');
    const finalBookBtn = document.getElementById('finalBookBtn');
    const modalItemName = document.getElementById('modalItemName');
    const modalDateDisplay = document.getElementById('modalDateDisplay');

    let mainItemData = null;
    let selectedFieldId = null; // ID lapangan/item yang dipilih
    let selectedTimeSlot = null; // Waktu slot yang dipilih

    const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    
    // Data Item yang Tersedia (Diperluas untuk simulasi Padel Co.)
    const ITEM_FIELDS = {
        "Comunall": [
            { id: 'C1', name: 'Comunal 1', desc: 'Ruang komunal Lantai 1', image: 'communal/communal_1.jpg', location: "Blok A", availableSlots: 2 },
            { id: 'C2', name: 'Comunal 2', desc: 'Ruang komunal Lantai 2', image: 'communal/communal_2.jpg', location: "Blok A", availableSlots: 5 },
            { id: 'C3', name: 'Comunal 3', desc: 'Ruang komunal Lantai 3', image: 'communal/communal_3.jpg', location: "Blok B", availableSlots: 0 },
        ],
        "Dapur": [
            { id: 'DH1', name: 'Air Fryer Halal', desc: 'Air Fryer untuk bahan makanan Halal', image: 'content-dapur.jpg', location: "Dapur Utama", availableSlots: 1 },
            { id: 'DN1', name: 'Air Fryer Non-Halal 1', desc: 'Air Fryer untuk bahan makanan Non-Halal', image: 'content-dapur.jpg', location: "Dapur Utama", availableSlots: 3 },
            { id: 'K1', name: 'Kompor Listrik 1', desc: 'Tungku Kompor Listrik', image: 'content-dapur.jpg', location: "Dapur Utama", availableSlots: 0 },
        ],
        "Lapangan Voli": [
            { id: 'V1', name: 'Lapangan Voli Utama', desc: 'Lapangan outdoor utama', image: 'content-voli.jpg', location: "Outdoor", availableSlots: 5 },
        ]
    };
    
    // Simulasi data ketersediaan per jam
    const SIMULATED_SCHEDULE = [
        { time: "09:00 - 10:00", status: "Available" },
        { time: "10:00 - 11:00", status: "Available" },
        { time: "11:00 - 12:00", status: "Booked" }, 
        { time: "12:00 - 13:00", status: "Available" },
        { time: "13:00 - 14:00", status: "Available" },
        { time: "14:00 - 15:00", status: "Booked" },
        { time: "15:00 - 16:00", status: "Available" },
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

    if (mainItemData.name) {
        // Isi detail item di halaman
        document.getElementById('pageTitle').textContent = `Booking: ${mainItemData.name}`;
        document.getElementById('itemName').textContent = mainItemData.name;
        document.getElementById('itemLocation').textContent = mainItemData.location;
        document.getElementById('itemRoomType').textContent = mainItemData.roomType;
        document.getElementById('itemRating').innerHTML = `${mainItemData.rating} <i class="bi bi-star-fill"></i>`;
        document.getElementById('mainImage').src = `assets/images/${mainItemData.image}`;
        
        // Panggil fungsi render
        renderGallery();
        renderFields(mainItemData.roomType);
    } 

    // ====================================
    // LOGIC FIELD LIST (DAFTAR ITEM BISA DI-BOOK)
    // ====================================
    function renderFields(roomType) {
        const fields = ITEM_FIELDS[roomType] || [];
        fieldsListContainer.innerHTML = '';

        if (fields.length === 0) {
            fieldsListContainer.innerHTML = '<p class="text-center text-muted">Tidak ada item spesifik yang dapat dipesan di ruangan ini.</p>';
            return;
        }

        fields.forEach((field) => {
            const isAvailable = field.availableSlots > 0;
            const card = document.createElement('div');
            card.className = 'card field-card';
            card.innerHTML = `
                <div class="row g-3">
                    <div class="col-md-4">
                        <img src="assets/images/${field.image}" class="field-image w-100" alt="${field.name}">
                    </div>
                    <div class="col-md-8">
                        <h5>${field.name}</h5>
                        <p class="text-muted small">${field.desc}</p>
                        
                        <div class="mb-2"><i class="bi bi-geo-alt facility-icon-small"></i> ${field.location}</div>
                        <div class="mb-3">
                           <i class="bi bi-person-fill facility-icon-small"></i>
                           ${isAvailable ? `${field.availableSlots} Slot Tersedia` : 'Tidak Tersedia'}
                        </div>
                        
                        <button class="slot-btn btn-sm" ${isAvailable ? '' : 'disabled'} data-bs-toggle="modal" data-bs-target="#slotModal" data-field-id="${field.id}" data-field-name="${field.name}">
                            <i class="bi bi-calendar-check me-1"></i> ${isAvailable ? 'Cek Slot' : 'Habis'}
                        </button>
                    </div>
                </div>
            `;
            fieldsListContainer.appendChild(card);
        });
        
        setupFieldListeners();
    }

    // ====================================
    // LOGIC KALENDER & SLOT WAKTU
    // ====================================

    let currentCalendarDate = new Date();
    const DAYS_TO_SHOW_CALENDAR = 7; // Menampilkan 7 hari ke depan
    
    function renderCalendarNav(startDate) {
        calendarNav.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset jam untuk perbandingan

        for (let i = 0; i < DAYS_TO_SHOW_CALENDAR; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            
            const dayName = (i === 0) ? 'Hari Ini' : DAY_NAMES[day.getDay()];
            const dateStr = day.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            const fullDateStr = day.toISOString().split('T')[0];
            
            const dayElement = document.createElement('div');
            dayElement.className = `calendar-day me-2 ${i === 0 ? 'selected' : ''}`;
            dayElement.dataset.date = fullDateStr;
            dayElement.dataset.dayIndex = i;

            dayElement.innerHTML = `<div class="small">${dayName}</div><div>${dateStr}</div>`;
            
            dayElement.addEventListener('click', function() {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');
                renderTimeSlots(this.dataset.date); // Muat slot untuk tanggal yang dipilih
            });
            
            calendarNav.appendChild(dayElement);
        }
    }

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

        // Tampilkan tanggal yang dipilih di modal
        modalDateDisplay.textContent = new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
        selectedSlotInfo.style.display = 'none';
        selectedTimeSlot = null;
        finalBookBtn.disabled = true;
    }
    
    function handleSlotSelection() {
        document.querySelectorAll('.slot-time').forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
        
        selectedTimeSlot = this.dataset.time;
        selectedSlotInfo.textContent = `Slot terpilih: ${selectedTimeSlot}.`;
        selectedSlotInfo.style.display = 'block';
        finalBookBtn.disabled = false;
    }

    function setupFieldListeners() {
        document.querySelectorAll('.slot-btn').forEach(button => {
            button.addEventListener('click', function() {
                selectedFieldId = this.dataset.fieldId;
                const fieldName = this.dataset.fieldName;
                
                // Isi nama item di modal
                modalItemName.textContent = fieldName;
                
                // Atur kalender kembali ke hari ini saat modal dibuka
                currentCalendarDate = new Date();
                renderCalendarNav(currentCalendarDate);
            });
        });
        
        // Final Booking Submission from Modal
        finalBookBtn.addEventListener('click', function() {
            const bookingDate = document.querySelector('.calendar-day.selected').dataset.date;
            
            alert(`Pemesanan ${selectedFieldId} (${modalItemName.textContent}) berhasil diajukan!\nTanggal: ${bookingDate}\nSlot Waktu: ${selectedTimeSlot}\n\nStatus: Menunggu Persetujuan.`);
            
            // Tutup modal
            const modalElement = document.getElementById('slotModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
        });
    }

    // Inisiasi
    // renderFields(mainItemData.roomType); // Sudah dipanggil di baris 110
});