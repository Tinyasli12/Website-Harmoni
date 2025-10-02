document.addEventListener('DOMContentLoaded', function() {
    
    const roomSelect = document.getElementById('pilihRuangan');
    const venueListing = document.getElementById('venueListing');
    const itemCountElement = document.getElementById('itemCount');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchItem');


    // ====================================
    // DATA FASILITAS RTB (Ruangan & Item)
    // ====================================
    const BASE_IMAGE_PATH = "Ruangan/Fasilitas/";
    
    const FASILITAS_STRUCTURE = {
        "Comunall": [
            { name: "Comunal Lantai Dasar", location: "Gedung Utama", image: BASE_IMAGE_PATH + "communal_lantai_dasar.jpg", rating: 4.8, roomType: "Comunall" }
        ],
        "Ruang Mesin Cuci": [
            { name: "Ruang Mesin Cuci", location: "Lantai 1", image: BASE_IMAGE_PATH + "mesincuci.jpg", rating: 4.9, roomType: "Ruang Mesin Cuci" }
        ],
        "Dapur": [
            { name: "Kompor", location: "Dapur Utama RTB", image: BASE_IMAGE_PATH + "dapur_kompor.jpg", rating: 4.2, roomType: "Dapur" },
            { name: "Airfryer", location: "Dapur Utama RTB", image: BASE_IMAGE_PATH + "dapur_airfryer.jpg", rating: 4.6, roomType: "Dapur" },
            { name: "Rice Cooker", location: "Dapur Utama RTB", image: BASE_IMAGE_PATH + "dapur_ricecooker.jpg", rating: 4.5, roomType: "Dapur" }
        ],
        "Serbaguna": [
            { name: "Aula Serbaguna", location: "Gedung Utama", image: BASE_IMAGE_PATH + "serbaguna_aula.jpg", rating: 5.0, roomType: "Serbaguna" }
        ],
        "Coworking Space": [
            { name: "Coworking", location: "Gedung", image: BASE_IMAGE_PATH + "coworking_lantai_2.jpg", rating: 4.5, roomType: "Coworking Space" }
        ],
        "Theater": [
            { name: "Theater Utama", location: "Gedung Utama RTB", image: BASE_IMAGE_PATH + "theater_utama.jpg", rating: 4.7, roomType: "Theater" }
        ],
        "Plaza": [
            { name: "Meja Ping Pong", location: "Area Plaza", image: BASE_IMAGE_PATH + "plaza_pingpong.jpg", rating: 4.4, roomType: "Plaza" },
            { name: "Area Plaza", location: "Outdoor", image: BASE_IMAGE_PATH + "Plaza.jpg", rating: 4.0, roomType: "Plaza" }
        ],
        "Lapangan Voli": [
            { name: "Lapangan Voli Utama", location: "Area Plaza", image: BASE_IMAGE_PATH + "voli.jpg", rating: 4.1, roomType: "Lapangan Voli" }
        ]
    };
    
    const ALL_ITEMS = Object.values(FASILITAS_STRUCTURE).flat();


    // ====================================
    // 1. FUNGSI: MERENDER KARTU FASILITAS
    // ====================================
    function renderCards(data) {
        if (!data || data.length === 0) {
            venueListing.innerHTML = `
                <div class="col-12 text-center text-muted p-5">
                    <i class="bi bi-x-circle-fill display-4 text-danger mb-3"></i>
                    <p class="lead">Maaf, tidak ada fasilitas yang ditemukan untuk kriteria ini.</p>
                </div>
            `;
            itemCountElement.textContent = 0;
            return;
        }

        venueListing.innerHTML = ''; 
        
        data.forEach(item => {
            const encodedName = encodeURIComponent(item.name);
            const encodedLocation = encodeURIComponent(item.location);
            const encodedRoomType = encodeURIComponent(item.roomType);
            const encodedImage = encodeURIComponent(item.image);
            const encodedRating = item.rating;

            // KOREKSI PATH PENGGUNAAN GAMBAR DI HTML
            const imagePath = `assets/images/${item.image}`;

            const detailUrl = `detail-booking.html?name=${encodedName}&location=${encodedLocation}&rating=${encodedRating}&roomType=${encodedRoomType}&image=${encodedImage}`;

            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6';
            
            col.innerHTML = `
                <a href="${detailUrl}" class="text-decoration-none text-dark">
                    <div class="venue-card" data-room-type="${item.roomType}">
                        <div class="venue-image-container">
                            <img src="${imagePath}" class="img-fluid" alt="${item.name}">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: rgba(0, 0, 0, 0.4); color: white; font-size: 1.5rem; font-weight: bold; opacity: 0;">
                                ${item.roomType}
                            </div>
                        </div>
                        <div class="venue-info">
                            <span class="badge bg-primary-custom mb-2">${item.roomType}</span>
                            <h5 class="venue-name mb-1">${item.name}</h5>
                            <small class="venue-rating me-2"><i class="bi bi-star-fill"></i> ${item.rating}</small>
                            <small class="text-muted">- ${item.location}</small>
                            <p class="mt-2 mb-1 small text-muted">Status: Tersedia</p>
                            <p class="venue-price">Mulai <span class="text-danger">Gratis</span></p>
                        </div>
                    </div>
                </a>
            `;
            venueListing.appendChild(col);
        });

        itemCountElement.textContent = data.length;
    }

    // ====================================
    // 2. FUNGSI: MENGISI DROPDOWN RUANGAN
    // ====================================
    function populateRooms() {
        const rooms = Object.keys(FASILITAS_STRUCTURE);
        
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });
    }

    // ====================================
    // 3. FUNGSI: LOGIC FILTER/CHANGE DROPDOWN
    // ====================================
    roomSelect.addEventListener('change', function() {
        const selectedRoom = roomSelect.value;
        let dataToShow;

        if (selectedRoom === "") {
            dataToShow = ALL_ITEMS.slice().sort((a, b) => b.rating - a.rating);
        } else {
            dataToShow = FASILITAS_STRUCTURE[selectedRoom].slice().sort((a, b) => b.rating - a.rating);
        }
        
        renderCards(dataToShow);
    });
    
    // ====================================
    // 4. LOGIC CARI FASILITAS (SEARCH BUTTON)
    // ====================================
    searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        const searchQuery = searchInput.value.toLowerCase().trim();
        const selectedRoom = roomSelect.value;
        
        let dataToFilter = [];

        if (selectedRoom && selectedRoom !== "") {
            dataToFilter = FASILITAS_STRUCTURE[selectedRoom];
        } else {
             dataToFilter = ALL_ITEMS;
        }

        const filteredData = dataToFilter.filter(item => 
            item.name.toLowerCase().includes(searchQuery)
        ).sort((a, b) => b.rating - a.rating);
        
        renderCards(filteredData);
    });


    // ====================================
    // INISIASI AWAL: TAMPILKAN SEMUA FASILITAS POPULER
    // ====================================
    function initialLoad() {
        populateRooms();
        
        const sortedItems = ALL_ITEMS.slice().sort((a, b) => b.rating - a.rating);
        renderCards(sortedItems);
        
        console.log("Halaman Booking berhasil dimuat. Menampilkan semua fasilitas populer.");
    }

    initialLoad();
});