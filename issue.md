# Project Setup: Bun + ElysiaJS + Drizzle + MySQL

## Objective
Tujuan dari issue ini adalah untuk menginisiasi dan mengkonfigurasi proyek backend baru menggunakan ekosistem **Bun**, framework **ElysiaJS**, dan **Drizzle ORM** dengan database **MySQL**.

## High-Level Implementation Plan

1. **Inisialisasi Proyek**
   - Jalankan inisialisasi proyek Bun di direktori saat ini.
   - Pastikan struktur awal (seperti `package.json` dan konfigurasi TypeScript) sudah terbentuk.

2. **Konfigurasi Server (ElysiaJS)**
   - Install dependensi ElysiaJS.
   - Buat *entry point* aplikasi (misal `src/index.ts`).
   - Buat instance server sederhana yang merespons dengan pesan "Hello World" untuk memverifikasi bahwa server Bun + Elysia dapat berjalan dengan sukses.

3. **Konfigurasi Database & ORM (Drizzle + MySQL)**
   - Install Drizzle ORM beserta *driver* MySQL yang sesuai, dan Drizzle Kit untuk keperluan skema & migrasi.
   - Siapkan konfigurasi `drizzle.config.ts`.
   - Buat koneksi *database* (misalnya di `src/db/index.ts`).
   - Buat satu skema tabel dasar (misalnya skema `users`) di `src/db/schema.ts` sebagai contoh awal.

4. **Pengaturan Environment Variables**
   - Buat file `.env` (pastikan terdaftar di `.gitignore`).
   - Tambahkan kredensial koneksi *database* seperti `DATABASE_URL` untuk MySQL, dan variabel lainnya (misalnya port aplikasi).

5. **Integrasi & Pengujian Awal**
   - Tambahkan *scripts* di `package.json` untuk mempermudah menjalankan server mode *development* (misal `bun run dev`) dan migrasi Drizzle.
   - Implementasikan *route* Elysia tambahan yang menguji koneksi ORM secara langsung (misal melakukan *query* select dasar ke *database*).
   - Pastikan proses migrasi/sinkronisasi Drizzle ke server MySQL berjalan dengan baik.

## Catatan Tambahan
- Harap gunakan *best-practices* struktur folder dasar yang modular (pisahkan antara koneksi DB, skema, dan route aplikasi).
- Tidak perlu menambahkan logika *business/controller* yang kompleks; tujuan utama *task* ini adalah sekadar pembuktian konektivitas (*Proof of Concept* infrastruktur).
