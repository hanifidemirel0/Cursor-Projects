---
title: DWH Sunum Kasım 2026
created: 2026-11-02
status: draft
section: Kendi Notlarım
tags:
  - dwh
  - sunum
  - takasbank
---

# DWH Sunum Kasım 2026

**Takasbank Data Warehouse Alt Yapısı Oluşturma Çalışması Durum Bilgilendirmesi-5 — Kasım 2026** taslağı. Seri: [[DWH Sunum Eylül 2024]] (1) · [[DWH Sunum Aralık 2024]] (2) · [[DWH Sunum Mart 2025]] (3) · [[DWH Sunum Temmuz 2025]] (4). `Documents/DWH/` dosya adlarındaki numaralar (2 - Eylül 2024, 3 - Aralık 2024) bu sıralamadan farklıdır. Bu not yalnızca sunumun yapısını ve hangi notlardan beslendiğini tutar; içerik ilgili kaynak notlarda yaşar.

- Dosya: [5 - DWHSunum_Kasim2026.pptx](../../outputs/dwh-sunum-kasim-2026/5%20-%20DWHSunum_Kasim2026.pptx) · [PDF](../../outputs/dwh-sunum-kasim-2026/5%20-%20DWHSunum_Kasim2026.pdf)
- Üretici betik: `outputs/dwh-sunum-kasim-2026/build_deck.py` (`python3 build_deck.py --pdf`; `python-pptx`, LibreOffice ve poppler gerekir). Her slaydın konuşmacı notunda kaynak notlar yazılıdır.

> [!warning] Taslak
> Öneri slaytları ("Öneri — onay bekliyor") [[Başlangıç Yaklaşımı]] ve [[Proje Planı]] önerilerini aktarır; kurum kararı değildir. Kapaktaki logo yer tutucudur, kurum şablonuyla değiştirilmeli. Kapasite rakamları Aralık 2024 görüntüsüdür.


## Slayt akışı

PPTX'te GoldenGate (8) ve DBT (9) detay sayfalarından sonra mimari sayfasının birer kopyası daha vardır: Morph ile mimariye geri uzaklaşan geçiş slaytları. Sayfa numarası 7 olarak kalır ve PDF'e alınmazlar; tablo PDF numaralarını izler.

| # | Slayt | Kaynak |
|---|---|---|
| 1 | Kapak | — |
| 2 | İçerik | — |
| 3 | Çalışmanın tarihçesi (Haz 2024 – Eki 2026) | [[Firmalarla Yapılan DWH Görüşmeleri]], [[Obase Takasbank Değerlendirme Raporu Ağustos 2024]], önceki sunumlar ([[DWH Sunum Mart 2025]] dahil), [[Komtaş Future-Ready Data Platform Teklifi Ağustos 2026]], [[Proje Planı#Ekip]] (personel arayışı), [[Proje Planı#Araç ve kapasite]] (ODI, Informatica, dbt PoC'leri) |
| 4 | Eylül–Ekim 2026 çalışmaları | Hanifi'nin 02.11.2026 tarihli aktarımı (UG görüşmeleri, danışman firma görüşmeleri, dbt PoC, Dataspecta workshop, ETL dokümantasyonu, GoldenGate, orkestrasyon, tasarım taslakları) |
| 5 | Mevcut durum (tek slayt: veri kaynakları; ortamlar, üç Exadata makinesinin boş disk/CPU değerleri ve veritabanları dahil; raporlama kanalları; anlık ve geçmiş tarihli sorgu, işlem ve raporlama aynı veritabanında) | [[Fiziksel Topoloji - Teknik Taraf]] (DWH yerleşim adayları), [[Ortamlar hakkında]], [[DWH Sunum Aralık 2024]] (kapasite), Takasbank Genel Bilgilendirme 1-2, Banka Ug, kullanıcı aktarımı (04.11.2026) |
| 6 | Temel tespitler | [[DWH Sunum Aralık 2024]], [[Başlangıç Yaklaşımı]] |
| 7 | Önerilen hedef mimari (kaynaklar, GoldenGate replikasyon/CDC, ODS → CORE → Data Mart → Publish, DBT Core dönüşüm, Apache DolphinScheduler zamanlama, Pusula/MSTR ve diğer rapor kanalları; dört adımlı günlük akış) | [[Sistemler ve Servisler#4.1 Karar\|ODS ve landing kararları]], [[Sistemler ve Servisler]] (GoldenGate kaynak kapsamı), [[Başlangıç Yaklaşımı]], [[DWH Hedef Mimarisi v2]], [[Aktif Sorular]] madde 16 (zamanlayıcı); araç seti kullanıcı aktarımı (13.11.2026) |
| 8 | Oracle GoldenGate (sayfa 7'den Morph geçişiyle GoldenGate kutusuna yakınlaşma; bant içinde iki cümlelik tanım; kapsam: KALE, ARSIV, ÇEKDB, Borsa DWH → `ODS_` şemaları; FTP/CSV/web servis kapsam dışı; neden GoldenGate ideal seçim: mevcut lisans, kaynağa yük bindirmeyen log tabanlı okuma, geçmişe gelen güncellemelerin yakalanması, düşük gecikme, Oracle uyumu; nasıl çalışır; netleşecek konular) | [[Sistemler ve Servisler#2. Goldengate\|Goldengate]], [[Sistemler ve Servisler#4.1 Karar\|ODS ve GG kaynak kapsamı kararları]], [[Fiziksel Topoloji - Teknik Taraf#GoldenGate lisansları]], [[Aktif Sorular]] 4.4, 4.6, 4.7, 14.2 |
| 9 | DBT (sayfa 7'den Morph ile DBT kutusuna yakınlaşma; bant içinde iki cümlelik tanım; katmanlar ODS → CORE → Data Mart → Publish; neden DBT ideal seçim; nasıl çalışır; netleşecek konular: ETL seçimi sürüyor, üretici desteği, dbt-oracle adaptörü, PL/SQL raporların yan yana çalışması) | ETL aracı değerlendirmesi (çalışma kitabı ve canvas: dbt profili, riskler, maliyet), [[DWH Hedef Mimarisi v2]], [[Sistemler ve Servisler#4.3 Katman sınırları]] |
| 10 | Apache DolphinScheduler (sayfa 7'den Morph ile zamanlayıcı bandına yakınlaşma; bant içinde iki cümlelik tanım; günlük akış: gün sonu kaydı → GoldenGate gecikme kontrolü → DBT → Pusula küp yenileme; neden DolphinScheduler ideal seçim; nasıl çalışır; netleşecek konular) | Kullanıcı aktarımı 13.11.2026, [[Fiziksel Topoloji - Teknik Taraf#Zamanlayıcı]], [[Aktif Sorular]] 12, 16, [[DWH Mimari Hafıza - Temmuz 2025 Sunumu]] |
| 11 | ETL aracı değerlendirmesi: özet (puanlar, iki seçenek önerisi) | [Takasbank_ETL_Comparison_TR.xlsx](../../outputs/etl-comparison/Takasbank_ETL_Comparison_TR.xlsx) (12.11.2026 güncellemesi) · canvas `outputs/etl-comparison/takasbank_etl_evaluation.canvas.tsx` |
| 12 | ETL: iki seçenek (dbt Core / ODI 14c), ön koşullar | Aynı çalışma kitabı (Executive Summary, Risks) |
| 13 | ETL: yöntem, adaylar ve karar kısıtları | Aynı çalışma kitabı (Executive Summary, Tool Profiles) |
| 14 | ETL: kategori puanları (15 kategori × 5 araç) | Aynı çalışma kitabı (Scoring Matrix, Criteria & Weights) |
| 15 | ETL: ağırlık senaryoları, 5 yıllık maliyet, rapor dönüşüm eforu | Aynı çalışma kitabı (Scenario Analysis, TCO) |
| 16 | ETL: Borsa İstanbul ve MKK görüşmeleri (kullandıkları ürünler: ODI, Informatica PowerCenter; ürün görüşleri) | Hanifi'nin 04.11.2026 aktarımı; [[DWH Sunum Eylül 2024]] (ETL araçları), [[DWH Sunum Aralık 2024#Slayt 5 — Merkezi Kayıt Kuruluşu]], [[DWH Sunum Aralık 2024#Slayt 6 — Borsa İstanbul]]. Görüş içeriği henüz notlarda yok; slaytta yer tutucu var |
| 17 | Pilot, yol haritası ve Faz 0 ilk 30 gün (sade: faz şeridi, Pilot A/B, dört Faz 0 maddesi) | [[Proje Planı#Pilot seçimi]], [[Proje Planı]], [[Başlangıç Yaklaşımı#Fazlar]] |
| 18 | Riskler | [[Başlangıç Yaklaşımı#Risk kaydı (ilk gün)]] |
| 19 | Karar beklenen konular | [[Başlangıç Yaklaşımı#İlk yönlendirme komitesine götürülecek kararlar]] |
| 20 | Açık sorular | [[Aktif Sorular]] |
| 21 | Kapanış | — |
