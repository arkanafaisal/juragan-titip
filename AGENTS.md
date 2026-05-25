1. patuhi file implementation_plan.md yang ada di root directory
2. jika ada instruksi yang bertentangan dengan implementation_plan.md, maka konfirmasikan dengan user terlebih dahulu.
3. baca file sebanyak yang kamu butuhkan sebelum melakukan perubahan apapun
4. jangan menyentuh ui / ux (seperti class, layout, html semantic, dll) saat sedang menjalankan perintah refactor (logic)
5. jangan menulis comment apapun kecuali memang disuruh
6. kalau ada 2 file yang memiliki flow yang mirip, maka pisahkan menjadi 1 file function utility
7. selalu review perubahan yang dilakukan, apakah sudah sesuai dengan implementation_plan.md dan instruksi atau belum
8. jangan menyentuh perintah git apapun
9. pastikan menambah kata "type" ketika sedang import type 
10. return custom hook dan parameter function harus berbentuk object {} untuk keterbacaan
11. kalau ada deklarasi panjang melebihi layar (seperti custom hook dengan banyak parameter dan return, import lucide react, define function atau pemanggilan function dengan banyak parameter), tetap buat dalam 1 baris