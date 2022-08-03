# BNMO-backend

> BMO with an N backend

## Link Penting

- [Repo Frontend](https://github.com/rifqi2320/BNMO-frontend)
- [Spesifikasi](https://docs.google.com/document/u/2/d/e/2PACX-1vTXfRSh4yLUKN8n0cyRYWwZVF5hvNYPoj-wvOs35dQnrE3iclnVYUx9kUAq0-cZdXztN1nLKGgjBbAa/pub)
- [Dokumentasi API Swagger](https://app.swaggerhub.com/apis-docs/rifqi2320/BNM/1.0.0)

## Link Deploy

- [Frontend (Vercel)](https://bnmo-frontend.vercel.app/)
- [Backend (Heroku)](https://bnmo-backend.herokuapp.com/)

## Tech Stack

- Express JS (Typescript)
- Prisma ORM
- PostgreSQL (DB Utama)
- Redis (DB Cache)
- Docker

## Design Pattern

- <b>Singleton</b>  
  Dalam pembuatan instance dari service, hanya ada 1 instance yang akan di buat.
- <b>Chain of Responsibility</b>  
  Dalam penerimaan request, penerimaan request akan diteruskan oleh middleware hingga ke controller
- <b>Decorator</b>  
  Dikarenakan error yang terjadi secara asinkronus tidak bisa ditangkap oleh express, maka dibuat decorator middleware untuk menangkap error tersebut.

## Penggunaan

1. Duplikat `.env.example` yang berada pada folder menjadi `.env` dan isikan data yang sesuai dengan deskripsi dibawah ini

|        Variable         |                                     Deskripsi                                     |
| :---------------------: | :-------------------------------------------------------------------------------: |
|         `PORT`          |                             Port yang akan digunakan                              |
|      `JWT_SECRET`       |                  Secret yang digunakan untuk mengenkripsi token                   |
|      `JWT_EXPIRE`       |                             Waktu token akan expired                              |
|     `DATABASE_URL`      |                         URL database yang akan digunakan                          |
|       `REDIS_URL`       |                           URL redis yang akan digunakan                           |
|  `GOOGLE_PRIVATE_KEY`   | Private key (service account) yang akan digunakan untuk mengakses service google  |
|  `GOOGLE_CLIENT_EMAIL`  | Client email (service account) yang akan digunakan untuk mengakses service google |
|       `FOLDER_ID`       |  Folder ID (Google Drive) yang akan digunakan untuk menyimpan file yang diupload  |
| `EXCHANGE_RATE_API_KEY` |         API key yang akan digunakan untuk mengakses service exchange rate         |

2. Jalankan Server  
   Jalankan command `docker compose up` untuk memulai proses build dan deploy di local.  
    atau  
   Install (`npm install`) dan jalankan command `npm run build` dan `npm run start` untuk memulai proses build dan deploy di local.

## Tambahan

- Dapat digunakan `npx prisma studio` jika telah menginstall prisma untuk melihat isi database.

- Dapat digunakan `npx prisma db seed` untuk melakukan seeding database.

<br/>
<br/>
<br/>

### <b>Dibuat oleh Rifqi Naufal Abdjul (13520062)</b>
