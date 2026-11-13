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
- Üretici betik: `outputs/dwh-sunum-kasim-2026/build_deck.py` (`python3 build_deck.py`; `python-pptx` gerekir). Her slaydın konuşmacı notunda kaynak notlar yazılıdır.

> [!warning] Taslak
> Öneri slaytları ("Öneri — onay bekliyor") [[Başlangıç Yaklaşımı]] ve [[Proje Planı]] önerilerini aktarır; kurum kararı değildir. Kapaktaki logo yer tutucudur, kurum şablonuyla değiştirilmeli. Kapasite rakamları Aralık 2024 görüntüsüdür.


## Slayt akışı

| # | Slayt | Kaynak |
|---|---|---|
| 1 | Kapak | — |
| 2 | İçerik | — |
| 3 | Çalışmanın tarihçesi (Haz 2024 – Eki 2026) | [[Firmalarla Yapılan DWH Görüşmeleri]], [[Obase Takasbank Değerlendirme Raporu Ağustos 2024]], önceki sunumlar ([[DWH Sunum Mart 2025]] dahil), [[Komtaş Future-Ready Data Platform Teklifi Ağustos 2026]], [[Proje Planı#Ekip]] (personel arayışı), [[Proje Planı#Araç ve kapasite]] (ODI, Informatica, dbt PoC'leri) |
| 4 | Eylül–Ekim 2026 çalışmaları | Hanifi'nin 02.11.2026 tarihli aktarımı (UG görüşmeleri, danışman firma görüşmeleri, dbt PoC, Dataspecta workshop, ETL dokümantasyonu, GoldenGate, orkestrasyon, tasarım taslakları) |
| 5 | Mevcut durum: veri ve ortamlar | [[Fiziksel Topoloji - Teknik Taraf]], [[Ortamlar hakkında]], [[PowerDesigner Bilgilendirme]] |
| 6 | Mevcut durum: raporlama (rapor kanalları; anlık ve geçmiş tarihli sorgu, işlem ve raporlama aynı veritabanında) | [[Takasbank Genel Bilgilendirme]], [[Takasbank Genel Bilgilendirme 2]], Hanifi'nin 04.11.2026 aktarımı |
| 7 | Temel tespitler | [[DWH Sunum Aralık 2024]], [[Başlangıç Yaklaşımı]] |
| 8 | Hedef mimari ve araç seti (kaynaklar, GoldenGate veri alımı, ODS → CORE → Data Mart → Publish, DBT Core dönüşüm, Apache DolphinScheduler zamanlama, Pusula/MSTR ve diğer rapor kanalları; dört adımlı günlük akış) | [[Sistemler ve Servisler#4.1 Karar\|ODS ve landing kararları]], [[Sistemler ve Servisler]] (GoldenGate kaynak kapsamı), [[Başlangıç Yaklaşımı]], [[DWH Hedef Mimarisi v2]], [[Aktif Sorular]] madde 16 (zamanlayıcı); araç seti kullanıcı aktarımı (13.11.2026) |
| 9 | Fiziksel yerleşim ve kapasite | [[Fiziksel Topoloji - Teknik Taraf#DWH yerleşim adayları]] |
| 10 | ETL aracı değerlendirmesi: özet (puanlar, iki seçenek önerisi) | [Takasbank_ETL_Comparison_TR.xlsx](../../outputs/etl-comparison/Takasbank_ETL_Comparison_TR.xlsx) (12.11.2026 güncellemesi) · canvas `outputs/etl-comparison/takasbank_etl_evaluation.canvas.tsx` |
| 11 | ETL: iki seçenek (dbt Core / ODI 14c), ön koşullar | Aynı çalışma kitabı (Executive Summary, Risks) |
| 12 | ETL: yöntem, adaylar ve karar kısıtları | Aynı çalışma kitabı (Executive Summary, Tool Profiles) |
| 13 | ETL: kategori puanları (15 kategori × 5 araç) | Aynı çalışma kitabı (Scoring Matrix, Criteria & Weights) |
| 14 | ETL: ağırlık senaryoları, 5 yıllık maliyet, rapor dönüşüm eforu | Aynı çalışma kitabı (Scenario Analysis, TCO) |
| 15 | ETL: Borsa İstanbul ve MKK görüşmeleri (kullandıkları ürünler: ODI, Informatica PowerCenter; ürün görüşleri) | Hanifi'nin 04.11.2026 aktarımı; [[DWH Sunum Eylül 2024]] (ETL araçları), [[DWH Sunum Aralık 2024#Slayt 5 — Merkezi Kayıt Kuruluşu]], [[DWH Sunum Aralık 2024#Slayt 6 — Borsa İstanbul]]. Görüş içeriği henüz notlarda yok; slaytta yer tutucu var |
| 16 | Pilot, yol haritası ve Faz 0 ilk 30 gün (sade: faz şeridi, Pilot A/B, dört Faz 0 maddesi) | [[Proje Planı#Pilot seçimi]], [[Proje Planı]], [[Başlangıç Yaklaşımı#Fazlar]] |
| 17 | Riskler | [[Başlangıç Yaklaşımı#Risk kaydı (ilk gün)]] |
| 18 | Karar beklenen konular | [[Başlangıç Yaklaşımı#İlk yönlendirme komitesine götürülecek kararlar]] |
| 19 | Açık sorular | [[Aktif Sorular]] |
| 20 | Kapanış | — |
