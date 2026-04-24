# Implementasi API Get Current User

## Deskripsi Tugas
Buat sebuah API endpoint untuk mendapatkan data user yang saat ini sedang login berdasarkan token.

## Spesifikasi API

- **Endpoint**: `GET /api/users/current`
- **Headers**: 
  - `Authorization: Bearer <token>` (token diambil dari field token pada database table `users`)

### Response Body (Success 200 OK)
```json
{    
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john_doe@localhost",
        "createdAt": "timestamp"
    }
}
```

### Response Body (Error 401 Unauthorized)
Jika token tidak valid, tidak disediakan, atau user tidak ditemukan:
```json
{
    "error": "Unauthorized"
}
```

## Standar Struktur Folder & Penamaan File
Implementasi harus mengikuti standar struktur folder dan penamaan file di dalam direktori `src`:
- **`src/routes/`**: Berisi definisi routing Elysia.js.
  - File untuk route user harus bernama: `user-route.ts`
- **`src/services/`**: Berisi business logic dan interaksi dengan database.
  - File untuk service user harus bernama: `user-services.ts`

---

## Tahapan Implementasi (Step-by-Step)

Untuk mengimplementasikan fitur ini, silakan ikuti panduan langkah demi langkah berikut secara berurutan:

### Tahap 1: Membuat Service untuk Mendapatkan User (`src/services/user-services.ts`)
1. Buka atau buat file `src/services/user-services.ts`.
2. Buat sebuah function asinkron baru bernama `getCurrentUser(token: string)`.
3. Di dalam function tersebut, lakukan query ke database tabel `users` untuk mencari data user di mana field `token` sama dengan parameter `token` yang dikirimkan.
4. **Penanganan Error:** Jika hasil query kosong (user tidak ditemukan dengan token tersebut), lemparkan sebuah error (throw error) yang menandakan akses ditolak (misalnya `Error("Unauthorized")` atau custom error class jika ada).
5. **Return Data:** Jika user ditemukan, return/kembalikan sebuah objek yang **hanya** berisi field: `id`, `name`, `email`, dan `createdAt`. Pastikan field sensitif seperti `password` atau `token` itu sendiri **TIDAK** ikut dikembalikan.

### Tahap 2: Menambahkan Route Endpoint (`src/routes/user-route.ts`)
1. Buka atau buat file `src/routes/user-route.ts`.
2. Tambahkan route baru menggunakan method GET ke path `/api/users/current` pada instance Elysia.
3. Di dalam handler route tersebut, tangkap request header `Authorization`.
4. Lakukan pengecekan header `Authorization`:
   - Jika header tidak ada, segera return response HTTP Status 401 dengan body `{"error": "Unauthorized"}`.
   - Jika ada, pisahkan string-nya (biasanya berformat `Bearer <token-asli>`). Ambil bagian `<token-asli>` saja.
5. Panggil function `getCurrentUser(tokenAsli)` yang sudah dibuat di `user-services.ts`.
6. Bungkus hasil kembalian dari service ke dalam format JSON yang diharapkan:
   ```json
   {
       "data": { ...hasil_dari_service... }
   }
   ```
7. Pastikan route file ini sudah di-import dan di-register ke instance utama aplikasi (biasanya di `src/index.ts`).
8. Jika terjadi error (ditangkap via try-catch atau error handler bawaan Elysia), pastikan response yang dikembalikan adalah HTTP Status 401 dengan JSON `{"error": "Unauthorized"}`.

### Tahap 3: Pengujian (Testing)
Setelah kode selesai ditulis, pastikan untuk melakukan tes secara lokal:
1. **Skenario Gagal (No Token):** Akses `GET /api/users/current` tanpa menyertakan header `Authorization`. Pastikan response adalah `401 Unauthorized`.
2. **Skenario Gagal (Invalid Token):** Akses dengan `Authorization: Bearer token-asal-asalan-123`. Pastikan response adalah `401 Unauthorized`.
3. **Skenario Sukses:** Akses dengan token yang valid (bisa dilihat langsung di database tabel `users`). Pastikan mendapatkan HTTP status 200 OK dan struktur JSON memuat objek `data` dengan data diri user yang sesuai.
