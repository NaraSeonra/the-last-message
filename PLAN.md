# THE LAST MESSAGE — Rencana

1. ✅ Mesin cerita & data (`src/game/`): tipe, jam game, reducer, antrean aksi, 3 episode, 8 prompt ketik-bebas, panggilan bertranskrip, 6 akhir cerita, sistem petunjuk, localStorage (save, checkpoint per episode, meta akhir), audio Web Audio sintetis + aset lokal opsional.
2. ✅ Konten semua aplikasi (`src/game/data/content.ts`) dan 6 gambar sinematik di `public/img/`.
3. ✅ Tema gelap, font, animasi di `src/styles.css`.
4. ⬜ `src/game/GameRoot.tsx`: GameProvider + layar judul (Mulai Baru / Lanjutkan / Pilih Episode / akhir terbuka) + bingkai ponsel; lalu kembalikan `src/routes/index.tsx` ke `<GameRoot />`.
5. ⬜ Shell ponsel: layar kunci (jam, notifikasi, PIN 1402), beranda, status bar, navigasi, pengaturan cepat, aplikasi terbaru, panggilan masuk, kartu episode, layar akhir.
6. ⬜ 17 aplikasi di `src/game/apps/` membaca `GameState` dan memicu `EVENTS` (rec_done, zip_open, map_go, gate_open, call_end).
7. ⬜ Overlay tutorial & tombol petunjuk (`OBJECTIVES`).
8. ⬜ Uji alur penuh, typecheck, lint.
