# Implementasi Unit Test untuk API Users

## Deskripsi
Buatkan unit test untuk semua API endpoints yang terkait dengan User menggunakan `bun test`. Pastikan semua skenario di bawah ini ter-cover dengan baik untuk memastikan keandalan API.

## Persyaratan Teknis
- **Lokasi File**: Simpan semua file unit test di dalam folder `tests`.
- **Framework**: Menggunakan `bun test`.
- **Konsistensi Data**: Untuk setiap skenario test, pastikan untuk **menghapus data (cleanup)** terlebih dahulu sebelum test dijalankan (misalnya dengan blok `beforeEach` atau pada masing-masing test) agar data konsisten dan test tidak saling mempengaruhi.

## Daftar Skenario Test per API

### 1. API Register (`POST /api/users/`)
- [ ] Berhasil melakukan registrasi user baru dengan data yang valid.
- [ ] Gagal melakukan registrasi (return 400) jika email sudah terdaftar sebelumnya.
- [ ] Gagal melakukan registrasi (return 400) jika field yang wajib (name, email, password) tidak diisi.
- [ ] Gagal melakukan registrasi (return 400) jika panjang input melebihi batas maksimal (misal: panjang nama/email > 255 karakter).

### 2. API Login (`POST /api/users/login`)
- [ ] Berhasil melakukan login dan mengembalikan token jika kredensial email dan password benar.
- [ ] Gagal melakukan login (return 401) jika email user tidak ditemukan di database.
- [ ] Gagal melakukan login (return 401) jika password yang dimasukkan salah.
- [ ] Gagal melakukan login jika format request body tidak sesuai (misal tidak ada email/password).

### 3. API Get Current User (`GET /api/users/current`)
- [ ] Berhasil mendapatkan data user saat ini jika mengirimkan token (Authorization: Bearer) yang valid.
- [ ] Gagal mendapatkan data (return 401 Unauthorized) jika header Authorization tidak disertakan.
- [ ] Gagal mendapatkan data (return 401 Unauthorized) jika token yang dikirimkan tidak valid, sudah kadaluarsa, atau sudah di-logout.

### 4. API Logout (`DELETE /api/users/logout`)
- [ ] Berhasil melakukan logout jika mengirimkan token yang valid (token berhasil dihapus/di-invalidate di database).
- [ ] Gagal melakukan logout (return 401 Unauthorized) jika header Authorization tidak disertakan.
- [ ] Gagal melakukan logout (return 401 Unauthorized) jika token yang dikirimkan tidak valid.

## Catatan Implementasi
Silakan implementasikan detail kode unit test dan setup koneksi database testing jika diperlukan. Dokumentasi ini hanya berisi skenario yang wajib di-test, detail implementasi sepenuhnya diserahkan kepada programmer.
