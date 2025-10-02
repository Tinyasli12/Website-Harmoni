document.addEventListener('DOMContentLoaded', function() {
    
    const passwordField = document.getElementById('kataSandi');
    const confirmPasswordField = document.getElementById('ulangSandi');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthFeedback = document.getElementById('sandiAmanFeedback');
    const form = document.getElementById('registrationForm');
    
    const provinsiDropdown = document.getElementById('pilihProvinsi');

    // ====================================
    // DATA: DAFTAR 34 PROVINSI INDONESIA
    // ====================================
    const provinces = [
        "Aceh", "Bali", "Bangka Belitung", "Banten", "Bengkulu",
        "DI Yogyakarta", "DKI Jakarta", "Gorontalo", "Jambi", "Jawa Barat",
        "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan",
        "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Riau",
        "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat",
        "Nusa Tenggara Timur", "Papua", "Papua Barat", "Papua Pegunungan", 
        "Papua Selatan", "Papua Tengah", "Riau", "Sulawesi Barat", 
        "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara",
        "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"
    ];

    // FUNGSI UNTUK MENGISI DROPDOWN PROVINSI
    function populateProvinces() {
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinsiDropdown.appendChild(option);
        });
    }
    
    populateProvinces(); // Panggil fungsi saat DOM dimuat


    // ====================================
    // FUNGSI 1: TOGGLE PASSWORD VISIBILITY
    // ====================================
    function setupPasswordToggle(inputEl, buttonEl) {
        buttonEl.addEventListener('click', function() {
            const type = inputEl.getAttribute('type') === 'password' ? 'text' : 'password';
            inputEl.setAttribute('type', type);
            
            const icon = buttonEl.querySelector('i');
            icon.classList.toggle('bi-eye-fill');
            icon.classList.toggle('bi-eye-slash-fill');
        });
    }

    setupPasswordToggle(passwordField, togglePasswordBtn);
    setupPasswordToggle(confirmPasswordField, toggleConfirmPasswordBtn);


    // ====================================
    // FUNGSI 2: CEK KEKUATAN SANDI (Sederhana)
    // ====================================
    passwordField.addEventListener('input', function() {
        const value = passwordField.value;
        let strength = 0;
        
        if (value.length >= 8) strength += 25;
        if (/[A-Z]/.test(value)) strength += 25;
        if (/[a-z]/.test(value)) strength += 25;
        if (/[0-9]/.test(value)) strength += 25;

        strengthBar.style.width = `${strength}%`;
        strengthBar.className = 'password-strength-bar'; 
        strengthFeedback.style.display = 'block';

        if (strength < 50) {
            strengthBar.classList.add('bg-danger');
            strengthFeedback.textContent = 'Kata sandi lemah.';
            strengthFeedback.className = 'form-text text-danger';
        } else if (strength < 100) {
            strengthBar.classList.add('bg-warning');
            strengthFeedback.textContent = 'Kata sandi cukup kuat.';
            strengthFeedback.className = 'form-text text-warning';
        } else {
            strengthBar.classList.add('bg-success');
            strengthFeedback.textContent = 'Kata sandi aman!';
            strengthFeedback.className = 'form-text text-success';
        }

        if (value.length === 0) {
            strengthBar.style.width = '0%';
            strengthFeedback.style.display = 'none';
        }
    });

    // ====================================
    // FUNGSI 3: VALIDASI FORM DASAR (DEMO)
    // ====================================
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        let isValid = true;

        // Validasi Nama
        const namaLengkapInput = document.getElementById('namaLengkap');
        const namaLengkapFeedback = document.getElementById('namaLengkapFeedback');
        if (!/^[a-zA-Z\s]+$/.test(namaLengkapInput.value) || namaLengkapInput.value.trim() === '') {
            namaLengkapFeedback.style.display = 'block';
            isValid = false;
        } else {
            namaLengkapFeedback.style.display = 'none';
        }
        
        // Validasi Provinsi (Pilih Provinsi harus diubah)
        const provinsiFeedback = document.getElementById('provinsiFeedback');
        if (provinsiDropdown.value === "") {
             provinsiFeedback.style.display = 'block';
             isValid = false;
        } else {
             provinsiFeedback.style.display = 'none';
        }


        // Validasi Konfirmasi Sandi
        const ulangSandiFeedback = document.getElementById('ulangSandiFeedback');
        if (passwordField.value !== confirmPasswordField.value || confirmPasswordField.value.length === 0) {
            ulangSandiFeedback.style.display = 'block';
            isValid = false;
        } else {
            ulangSandiFeedback.style.display = 'none';
        }

        if (isValid) {
            alert('Pendaftaran Berhasil! (Ini hanya simulasi)');
            // window.location.href = "login.html"; // Redirect ke Login setelah sukses
        } else {
            alert('Mohon periksa kembali data pendaftaran Anda.');
        }
    });

});