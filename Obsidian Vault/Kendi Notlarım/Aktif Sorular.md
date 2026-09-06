---
title: Aktif Sorular
created: 2026-09-04T14:41:00
source: OneNote
notebook: My Notebook
section: Kendi Notlarım
tags:
  - dwh
  - soru
  - takasbank
---

# Aktif Sorular

Friday, 4 September 2026, 2:41 pm

1. Kritik raporlar [[DWH]] üzerinden verilmeli mi?
    1. SPK, MASAK raporları: kritik ve saat bazında SLA var; birçok farklı piyasadan veriler birleştiriliyor. ([[Takasbank Genel Bilgilendirme 2]])
    2. Üst yönetime nasıl raporlar veriliyor?
2. DWH inşa adımları nasıl olmalı?
    1. Parça parça mı? Öyleyse priority nasıl belirlenmeli?
    2. Topyekün mü?
    3. [[Inmon vs Kimball]] — taslak karar hibrit: [[DWH Mimari Tasarım]] (iş birimleriyle doğrulanmadı)
    4. En çok kullanılan raporlar nasıl çıkartılabilir?
3. DWH'dan anlık rapor alınabilmeli mi? → **GoldenGate kararının kapısı**: gün içi beklenti yoksa replikadan batch okuma yetiyor ([[Dataguard vs Goldengate]])
4. [[ODS]]'i nasıl konumlandırmalı? → kapsam kararı verildi (çok kaynaklı, landing tam tarihçe, ODS rapor verir): [[ODS]]
    1. [[Kale]] haricinde hangi kaynaklar alınmalı? → Arşiv, ÇekDB, BIST DB, FTP/CSV, muhtemel Postgre/MSSQL
    2. Hangi raporlar Kale'den, hangileri ODS'den, hangileri DWH'den verilmeli? **Açık.** Tek tek analiz; önce ilgili UG ve operasyonel ekiplerle (iş birimleri) görüşmek lazım.
    3. ODS'in fiziksel yerleşimi: kale Exadata'sından taşınması gerekiyor, hedef makine kararlaşmadı.
5. [[Dataguard vs Goldengate]] — soru yeniden çerçevelendi: eldeki seçenekler GoldenGate ve ODI; farklı roller, GG tek başına yetmiyor. Karar madde 3'e bağlı.
6. Maskeli veriler DWH'e alınmalı mı? ([[PowerDesigner Bilgilendirme]])
7. Historic dataya hangi durumlarda update geliyor? İlgili UG'den sorulacak. ([[Ortamlar hakkında]])
8. Mutabakatın otorite kaynağı ne olacak? Her konu alanı için "sayı bununla tutmak zorunda" denilen rapor/tablo tek tek belirlenmeli; bugün bu rolü hangi raporun oynadığı belli değil. Mekanizma tasarımı: [[DWH Mimari Tasarım]]
    1. Bugünkü raporların kendi arasında farkı varsa hangisi doğru sayılacak?
    2. Fark çıktığında kim karar veriyor — DWH ekibi mi, ilgili UG mi?

İlgili notlar: [[Fiziksel Topoloji - Teknik Taraf]] · [[Takasbank Genel Bilgilendirme]] · [[Takasbank Genel Bilgilendirme 2]] · [[PowerDesigner Bilgilendirme]]
