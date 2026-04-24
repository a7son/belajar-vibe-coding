# Implementasi Fitur Registrasi User

Dokumen ini berisi perencanaan dan langkah-langkah untuk mengimplementasikan fitur registrasi user baru. Dokumen ini dapat digunakan sebagai acuan bagi developer atau AI asisten dalam mengerjakan fitur ini.

## 1. Spesifikasi Database

Buat tabel `users` dengan struktur kolom sebagai berikut:

- `id` (int, auto increment, primary key)
- `name` (varchar 255, not null)
- `email` (varchar 255, not null)
- `password` (varchar 255, not null) -> *Catatan: password harus disimpan dalam bentuk hash menggunakan bcrypt*
- `created_at` (datetime, default current timestamp)
- `updated_at` (datetime, default current timestamp)

## 2. Struktur Folder & File

Penyusunan kode harus diletakkan di dalam folder `src/` dengan mengikuti konvensi berikut:

- `src/routes/`: Folder ini khusus berisi definisi routing dari Elysia.js. Gunakan format penamaan file: `[nama]-route.ts` (contoh: `user-route.ts`).
- `src/services/`: Folder ini khusus berisi logika bisnis aplikasi. Gunakan format penamaan file: `[nama]-services.ts` (contoh: `user-services.ts`).

## 3. Spesifikasi API

Buat API untuk registrasi user baru dengan detail berikut:

**Endpoint**: `POST /api/users`

**Request Body**:
```json
{
    "name": "John Doe",
    "email": "john_doe@localhost",
    "password": "rahasia"
}
```

**Response (Sukses)**:
```json
{
    "message": "User created successfully",
    "data": "OK"
}
```

**Response (Error - Validasi)**:
```json
{
    "error": "Email sudah terdaftar"
}
```

## 4. Tahapan Implementasi

Untuk mengerjakan fitur ini, jalankan langkah-langkah berikut secara berurutan:

### Langkah 1: Setup & Migrasi Database
- Perbarui schema database atau buat file migrasi baru untuk mendefinisikan tabel `users` sesuai spesifikasi di atas.
- Jalankan proses migrasi atau sinkronisasi database agar tabel `users` terbentuk di dalam database.

### Langkah 2: Pembuatan Service Layer
- Buat sebuah file baru bernama `src/services/user-services.ts`.
- Di dalam file service ini, buat fungsi registrasi (misalnya `register`) yang menerima payload berisi `name`, `email`, dan `password`.
- **Pengecekan Duplikat**: Lakukan *query* ke tabel `users` untuk mengecek apakah `email` yang diinputkan sudah ada.
  - Jika email sudah ada, `throw` sebuah error dengan pesan "Email sudah terdaftar".
- **Hashing Password**: Jika email belum terdaftar, lakukan hashing pada input `password` menggunakan library `bcrypt`.
- **Penyimpanan Data**: Simpan data user baru (`name`, `email`, dan password yang *sudah di-hash*) ke dalam tabel `users`.
- Kembalikan (return) string `"OK"` atau data yang relevan agar bisa digunakan oleh controller/route.

### Langkah 3: Pembuatan Route Layer
- Buat sebuah file baru bernama `src/routes/user-route.ts`.
- Definisikan route untuk `POST /api/users` menggunakan instance Elysia.js.
- Di dalam *handler* route tersebut, ekstrak `name`, `email`, dan `password` dari request body.
- Panggil fungsi registrasi yang ada di `user-services.ts` dengan mengirimkan data dari body tersebut.
- Tangani hasil balikan dari service:
  - Jika berhasil, kembalikan HTTP status response sukses (200 atau 201) dengan format JSON sesuai "Response (Sukses)".
  - Jika gagal (terjadi error lemparan dari service, khususnya duplikat email), tangkap error tersebut (`catch`) dan kembalikan HTTP status error (misal 400 Bad Request) dengan format JSON sesuai "Response (Error)".

### Langkah 4: Registrasi Route ke Aplikasi Utama
- Buka file utama aplikasi (biasanya `src/index.ts` atau `src/app.ts`).
- Import route yang sudah dibuat dari `src/routes/user-route.ts`.
- Daftarkan (use) route tersebut ke instance utama Elysia agar endpoint `/api/users` dapat diakses dari luar.

### Langkah 5: Pengujian (Testing)
- Jalankan server lokal.
- Uji coba endpoint `POST /api/users` dengan mengirimkan request body yang valid. Pastikan response sukses dan data tersimpan di database (password ter-hash).
- Uji coba kembali endpoint dengan menggunakan email yang sama. Pastikan API mengembalikan response error "Email sudah terdaftar" dan data ganda tidak tersimpan.
