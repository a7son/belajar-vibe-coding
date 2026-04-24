# Implementasi Fitur Login User

## Deskripsi Tugas
Tugas ini bertujuan untuk mengimplementasikan fitur login pengguna, termasuk pembuatan tabel sesi (`sessions`) di database untuk menyimpan token login, serta pembuatan REST API endpoint menggunakan framework Elysia.js.

## 1. Persiapan Database
Buat tabel baru dengan nama `sessions` di database dengan skema berikut:

- `id`: `int`, auto increment, primary key
- `user_id`: `int`, not null (foreign key yang mereferensikan kolom id di tabel `users`)
- `token`: `varchar(255)`, not null (berisi UUID untuk token user yang login)
- `created_at`: `datetime`, default current timestamp
- `expired_at`: `datetime`, default current timestamp + 1 jam

*Catatan: Jika proyek ini menggunakan ORM (seperti Prisma, Drizzle, dll), implementasikan skema ini ke dalam file skema ORM dan jalankan perintah migrasi.*

## 2. Struktur Folder dan File
Struktur kode harus mengikuti konvensi berikut di dalam folder `src`:

- **`src/routes/`**: Berisi routing untuk Elysia.js.
  - Format penamaan file: `user-route.ts`
- **`src/services/`**: Berisi logika bisnis (business logic) dari aplikasi.
  - Format penamaan file: `user-services.ts`

## 3. Spesifikasi API Endpoint
Buat API untuk registrasi login user dengan detail berikut:

- **Endpoint**: `POST /api/users/login`

**Request Body**:
```json
{
    "email": "john_doe@localhost",
    "password": "rahasia"
}
```

**Response Berhasil (200 OK)**:
```json
{    
    "data": "token" // Ini adalah string UUID yang di-generate dari login
}
```

**Response Gagal (400 / 401 Error)**:
```json
{
    "error": "Email atau password salah"
}
```

## 4. Tahapan Implementasi (Step-by-Step Guide)
Berikut adalah tahapan-tahapan yang harus dilakukan oleh programmer/AI untuk mengimplementasikan fitur ini:

### Tahap 1: Update Database Skema
1. Buka skema database atau file SQL Anda.
2. Tambahkan tabel `sessions` dengan field `id`, `user_id`, `token`, `created_at`, dan `expired_at` sesuai spesifikasi di atas.
3. Pastikan `user_id` diatur sebagai foreign key yang mengarah ke tabel `users`.
4. Jalankan migrasi database agar tabel baru terbuat di database lokal Anda.

### Tahap 2: Pembuatan Logic di Service
1. Buat file baru `src/services/user-services.ts` (jika belum ada).
2. Buat fungsi (misal: `loginUser`) yang menerima input `email` dan `password`.
3. **Pencarian User**: Query ke database tabel `users` untuk mencari user berdasarkan `email`. Jika tidak ditemukan, lemparkan pesan error `"Email atau password salah"`.
4. **Validasi Password**: Bandingkan `password` dari input dengan password hash yang ada di database. Jika tidak cocok, lemparkan pesan error yang sama `"Email atau password salah"`.
5. **Generate Token**: Jika password valid, buat sebuah UUID baru untuk token.
6. **Simpan Session**: Insert data ke dalam tabel `sessions` dengan `user_id` dari user yang berhasil login, `token` berupa UUID tadi, dan set `expired_at` menjadi waktu saat ini ditambah 1 jam.
7. Return UUID token tersebut dari dalam fungsi.

### Tahap 3: Pembuatan Routing di Controller/Route
1. Buat file baru `src/routes/user-route.ts` (jika belum ada).
2. Import instance Elysia.
3. Import fungsi `loginUser` yang sudah dibuat di service sebelumnya.
4. Definisikan endpoint `POST /api/users/login`.
5. Ambil data `email` dan `password` dari `body` request. Anda juga bisa menambahkan validasi tipe data menggunakan Elysia `t.Object` untuk memastikan request body sesuai dengan skema.
6. Panggil fungsi service `loginUser(email, password)`.
7. Jika sukses, kembalikan objek JSON dengan format `{"data": "token"}`.
8. Jika terjadi error di service, tangkap error tersebut (misalnya dengan blok `try-catch`) dan kembalikan objek JSON `{"error": "Email atau password salah"}` beserta HTTP status code error (seperti 400 Bad Request atau 401 Unauthorized).

### Tahap 4: Integrasi ke Main App
1. Buka file utama aplikasi Elysia (biasanya `src/index.ts` atau `src/app.ts`).
2. Import route dari `src/routes/user-route.ts`.
3. Daftarkan (gunakan method `.use()`) route tersebut ke dalam instance utama Elysia agar endpoint-nya bisa diakses.

### Tahap 5: Testing (Opsional tapi Direkomendasikan)
1. Jalankan server lokal.
2. Gunakan HTTP Client (seperti Postman, Insomnia, atau cURL).
3. Lakukan pengujian untuk skenario login sukses dan pastikan mendapatkan response `"data": "token_uuid"`.
4. Lakukan pengujian untuk skenario login gagal (password salah / email tidak terdaftar) dan pastikan mendapatkan respons `"error": "Email atau password salah"`.
5. Cek database tabel `sessions` untuk memastikan data session benar-benar tersimpan.
