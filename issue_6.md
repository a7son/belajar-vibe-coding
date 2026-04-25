# Task: Implementasi API Logout User

## Deskripsi
Fitur ini bertujuan untuk menyediakan API endpoint untuk proses logout aplikasi. Ketika user melakukan logout, sistem harus menghapus data session berdasarkan token yang dikirimkan melalui header. Dengan terhapusnya data session di database, token tersebut tidak akan valid lagi untuk digunakan pada request selanjutnya.

## Spesifikasi API

- **Method:** `DELETE`
- **Endpoint:** `/api/users/logout`
- **Headers:**
  - `Authorization: Bearer <token>`
  *(Catatan: `<token>` adalah token autentikasi yang tersimpan di tabel `users` / `sessions`)*

### Response Body (Success)
Jika proses logout berhasil (token valid dan berhasil dihapus), kembalikan response berikut:
```json
{    
    "data": "OK"
}
```

### Response Body (Error)
Jika proses logout gagal (misalnya token tidak valid, header tidak dikirim, atau sesi tidak ditemukan di database), kembalikan response berikut dengan HTTP Status Code `401` (Unauthorized):
```json
{
    "error": "Unauthorized"
}
```

## Struktur Folder & File yang Digunakan
Sesuai dengan arsitektur proyek, gunakan file berikut:
- **Routes:** `src/routes/user-route.ts` (Tempat mendefinisikan endpoint Elysia.js)
- **Services:** `src/services/user-services.ts` (Tempat menuliskan logic utama/business logic aplikasi)

---

## Tahapan Implementasi (Panduan Pengerjaan)

Ikuti langkah-langkah berikut secara berurutan untuk mengimplementasikan fitur ini:

### 1. Buat Logic Logout di `user-services.ts`
Fokus pada file ini adalah untuk melakukan pengecekan dan eksekusi ke database.
- Buka file `src/services/user-services.ts`.
- Buat sebuah fungsi baru bernama `logout` (atau nama serupa). Fungsi ini harus menerima parameter `token` (bertipe `string`).
- **Validasi ke Database:** Lakukan query ke database (misalnya menggunakan Prisma/Drizzle) untuk mencari data session/user yang memiliki token tersebut.
- **Penanganan Error:** Jika token tidak ditemukan di database, fungsi harus melemparkan error (throw error) yang menandakan akses tidak valid (Unauthorized).
- **Hapus Data Session:** Jika token valid dan ditemukan, lakukan perintah penghapusan (DELETE) pada tabel `sessions` dengan kondisi (where) berdasarkan `token` tersebut.
- Fungsi cukup berjalan sukses jika berhasil menghapus, atau bisa mengembalikan nilai `"OK"`.

### 2. Buat Routing Endpoint di `user-route.ts`
Fokus pada file ini adalah untuk menangani request HTTP dan menghubungkannya dengan service.
- Buka file `src/routes/user-route.ts`.
- Tambahkan sebuah rute baru menggunakan method `.delete()` untuk endpoint `/api/users/logout`.
- **Ambil Token dari Header:** Buat logika untuk membaca header `Authorization`. Anda perlu memisahkan kata `Bearer ` untuk mendapatkan nilai token aslinya.
- **Validasi Format Header:** Jika header tidak ada, atau formatnya bukan `Bearer <token>`, langsung kembalikan error `401` dengan response `{"error": "Unauthorized"}` tanpa perlu memanggil database.
- **Panggil Service:** Jika token didapatkan dari header, panggil fungsi `logout` yang sudah kamu buat di `user-services.ts` dengan menyematkan token tersebut.
- **Bentuk Response:** 
  - Jika fungsi service berhasil, kirimkan kembalian sukses: `{"data": "OK"}`.
  - Tangkap potensi error dari service (seperti error tidak ditemukan). Jika error tersebut terjadi, kembalikan response JSON `{"error": "Unauthorized"}` dengan status HTTP `401`.

### 3. Lakukan Pengujian Singkat
Setelah kode ditulis, pastikan dua skenario ini berjalan:
1. **Skenario Sukses:** Kirim request dengan token yang benar. Pastikan response-nya adalah `"data": "OK"`, dan cek tabel `sessions` di database bahwa baris session dengan token tersebut telah hilang.
2. **Skenario Gagal:** Kirim request tanpa header `Authorization` atau gunakan token asal-asalan. Pastikan aplikasi tidak crash dan merespon dengan `"error": "Unauthorized"`.
