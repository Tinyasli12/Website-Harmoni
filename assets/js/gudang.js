document.addEventListener('DOMContentLoaded', function() {
    
    const categorySidebar = document.getElementById('categorySidebar');
    const itemListingContainer = document.getElementById('itemListing');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const itemCountElement = document.getElementById('itemCount');
    
    // ====================================
    // DATA INVENTARIS GUDANG (BARANG-BARANG KELAS)
    // ====================================
    const INVENTORY_DATA = [
        // Kategori: Logistik Acara
        { id: 1, name: "Proyektor EPSON C52", category: "Acara & Presentasi", stock: 3, total: 5, owner: "PPBP 4", image: "gudang/proyektor.jpg" },
        { id: 2, name: "Kabel Ekstensi 10m", category: "Perkakas & Listrik", stock: 15, total: 20, owner: "PPTI 19", image: "gudang/kabel.jpg" },
        { id: 3, name: "Mic Wireless Shure", category: "Acara & Presentasi", stock: 0, total: 2, owner: "PPBP 6", image: "gudang/mic.jpg" },
        // Kategori: Kebersihan
        { id: 4, name: "Vacuum Cleaner", category: "Kebersihan", stock: 1, total: 3, owner: "DPP", image: "gudang/vacuum.jpg" },
        { id: 5, name: "Ember Pel MOP", category: "Kebersihan", stock: 10, total: 10, owner: "PPBP 4", image: "gudang/ember.jpg" },
        // Kategori: Olahraga
        { id: 6, name: "Bola Voli Mikasa", category: "Olahraga", stock: 2, total: 5, owner: "PPTI 19", image: "gudang/bola_voli.jpg" },
        { id: 7, name: "Net Lapangan", category: "Olahraga", stock: 1, total: 1, owner: "DPP", image: "gudang/net.jpg" },
        // Kategori: Lain-lain
        { id: 8, name: "Papan Tulis Flip Chart", category: "Acara & Presentasi", stock: 4, total: 4, owner: "PPBP 6", image: "gudang/flipchart.jpg" },
        { id: 9, name: "Obat P3K Set", category: "Kesehatan", stock: 1, total: 1, owner: "CORE Team", image: "gudang/p3k.jpg" },
        { id: 10, name: "Tenda Lipat 3x3m", category: "Acara & Presentasi", stock: 0, total: 1, owner: "PPBP 4", image: "gudang/tenda.jpg" },
    ];
    
    // Mendapatkan daftar kategori unik
    const UNIQUE_CATEGORIES = ["Semua Kategori", ...new Set(INVENTORY_DATA.map(item => item.category))];

    // ====================================
    // 1. FUNGSI: MENGISI SIDEBAR KATEGORI
    // ====================================
    function renderCategories(activeCategory = "Semua Kategori") {
        categorySidebar.innerHTML = '';
        
        UNIQUE_CATEGORIES.forEach(category => {
            const isActive = category === activeCategory ? 'active' : '';
            const link = document.createElement('a');
            link.href = '#';
            link.className = `sidebar-category-link ${isActive}`;
            link.dataset.category = category;
            link.textContent = category;
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const cat = this.dataset.category;
                // Panggil fungsi render utama untuk memfilter
                filterAndRenderItems(cat);
                // Set active class
                document.querySelectorAll('.sidebar-category-link').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            });
            
            categorySidebar.appendChild(link);
        });
    }

    // ====================================
    // 2. FUNGSI: MERENDER KARTU INVENTARIS
    // ====================================
    function renderInventory(data) {
        if (!data || data.length === 0) {
            itemListingContainer.innerHTML = '<p class="text-center text-muted mt-4 w-100">Inventaris tidak ditemukan.</p>';
            itemCountElement.textContent = 0;
            return;
        }

        itemListingContainer.innerHTML = '';
        itemCountElement.textContent = data.length;
        
        data.forEach(item => {
            const isAvailable = item.stock > 0;
            const stockStatus = item.stock === 0 ? "Out of Stock" : (item.stock <= 3 ? "Stok Rendah" : "Tersedia");
            const statusClass = item.stock === 0 ? "status-out" : (item.stock <= 3 ? "status-low" : "status-ready");
            
            // Encode data untuk dilewatkan ke detail page (simulasi)
            const detailUrl = `#detail-${item.id}`; 
            
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 col-sm-6';
            col.innerHTML = `
                <div class="item-card">
                    <img src="assets/images/${item.image}" class="item-image" alt="${item.name}">
                    <div class="p-3">
                        <h5 class="fw-bold">${item.name}</h5>
                        <p class="small text-muted mb-2">${item.category} | Milik: ${item.owner}</p>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <p class="mb-0 item-status ${statusClass}">${stockStatus}</p>
                                <p class="mb-0 small fw-bold">Stok: ${item.stock} / ${item.total}</p>
                            </div>
                            <button class="btn btn-sm btn-submit-report" ${isAvailable ? '' : 'disabled'}>
                                ${isAvailable ? 'Order Pinjam' : 'Habis'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            itemListingContainer.appendChild(col);
        });
    }

    // ====================================
    // 3. FUNGSI: LOGIC FILTER UTAMA
    // ====================================
    function filterAndRenderItems(categoryFilter = "Semua Kategori", searchQuery = "") {
        let filteredData = INVENTORY_DATA;
        const query = searchQuery.toLowerCase();

        // 1. Filter Kategori
        if (categoryFilter !== "Semua Kategori") {
            filteredData = filteredData.filter(item => item.category === categoryFilter);
        }

        // 2. Filter Pencarian
        if (query) {
            filteredData = filteredData.filter(item => 
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.owner.toLowerCase().includes(query)
            );
        }
        
        // Urutkan: Stok Tersedia > Stok Rendah > Habis
        filteredData.sort((a, b) => {
            if (a.stock === 0 && b.stock > 0) return 1;
            if (a.stock > 0 && b.stock === 0) return -1;
            if (a.stock <= 3 && b.stock > 3) return 1;
            if (a.stock > 3 && b.stock <= 3) return -1;
            return b.stock - a.stock; // Urutkan stok tinggi ke rendah
        });

        renderInventory(filteredData);
    }
    
    // ====================================
    // 4. LOGIC SEARCH BUTTON
    // ====================================
    searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        const query = searchInput.value.trim();
        // Set kategori aktif ke "Semua Kategori" saat pencarian manual
        renderCategories("Semua Kategori"); 
        filterAndRenderItems("Semua Kategori", query);
    });

    // ====================================
    // INISIASI AWAL
    // ====================================
    function initialLoad() {
        renderCategories();
        filterAndRenderItems(); // Tampilkan semua item saat pertama kali dibuka
    }

    initialLoad();
});