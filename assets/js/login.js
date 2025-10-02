document.addEventListener('DOMContentLoaded', function() {
    
    const passwordField = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loadingSpinner = document.getElementById('loadingSpinner');


    // ====================================
    // FUNGSI 1: TOGGLE PASSWORD VISIBILITY
    // ====================================
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.classList.toggle('bi-eye-fill');
        icon.classList.toggle('bi-eye-slash-fill');
    });

    // ====================================
    // FUNGSI 2: SIMULASI LOGIN & REDIRECT
    // ====================================
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const username = document.getElementById('username').value.trim();
        const password = passwordField.value;

        if (username === "" || password === "") {
            alert('Mohon isi Email/Username dan Kata Sandi.');
            return;
        }

        // 1. Tampilkan loading state
        loginBtn.disabled = true;
        loginText.textContent = 'Memproses...';
        loadingSpinner.style.display = 'inline-block';
        
        // 2. Simulasi proses server (delay 2 detik)
        setTimeout(() => {
            
            // 3. Setelah delay (simulasi berhasil), redirect ke halaman utama
            alert(`Login Berhasil! Selamat Datang, ${username}.`);
            window.location.href = "index.html"; 
            
            // Jika login gagal, kamu bisa mengembalikan tombol dan menampilkan pesan error:
            /*
            loginBtn.disabled = false;
            loginText.textContent = 'Login';
            loadingSpinner.style.display = 'none';
            alert('Username atau password salah.');
            */

        }, 2000); // 2000 milidetik = 2 detik delay
    });

});