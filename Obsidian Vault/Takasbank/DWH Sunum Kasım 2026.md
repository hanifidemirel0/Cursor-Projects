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

**Takasbank Data Warehouse Alt Yapısı Oluşturma Çalışması Durum Bilgilendirmesi-5 — Kasım 2026** taslağı. Seri: [[DWH Sunum Eylül 2024]] (2) · [[DWH Sunum Aralık 2024]] (3) · [[DWH Sunum Temmuz 2025]] (4). Bu not yalnızca sunumun yapısını ve hangi notlardan beslendiğini tutar; içerik ilgili kaynak notlarda yaşar.

- Dosya: [5 - DWHSunum_Kasim2026.pptx](../../outputs/dwh-sunum-kasim-2026/5%20-%20DWHSunum_Kasim2026.pptx) · [PDF](../../outputs/dwh-sunum-kasim-2026/5%20-%20DWHSunum_Kasim2026.pdf)
- Üretici betik: `outputs/dwh-sunum-kasim-2026/build_deck.py` (`python3 build_deck.py`; `python-pptx` gerekir). Her slaydın konuşmacı notunda kaynak notlar yazılıdır.

> [!warning] Taslak
> Öneri slaytları ("Öneri — onay bekliyor") [[Başlangıç Yaklaşımı]] ve [[Proje Planı]] önerilerini aktarır; kurum kararı değildir. Kapaktaki logo yer tutucudur, kurum şablonuyla değiştirilmeli. Kapasite rakamları Aralık 2024 görüntüsüdür.
>
> **ODS slaytları güncel değil:** Önceki kararlar (5), hedef mimari (11), katmanlar (12) ve karar beklenen konular (21) slaytları "ayrı fiziksel ODS yalnızca SLA gerektirirse, core üstünde projeksiyon" önerisini taşıyor. 02.11.2026 kararı farklı: [[Sistemler ve Servisler#4.1 Karar|ODS kararı]].

## Slayt akışı

| # | Slayt | Kaynak |
|---|---|---|
| 1 | Kapak | — |
| 2 | İçerik | — |
| 3 | Çalışmanın tarihçesi (Haz 2024 – Eki 2026) | [[Firmalarla Yapılan DWH Görüşmeleri]], [[Obase Takasbank Değerlendirme Raporu Ağustos 2024]], önceki sunumlar, [[Komtaş Future-Ready Data Platform Teklifi Ağustos 2026]] |
| 4 | Eylül–Ekim 2026 çalışmaları | Hanifi'nin 02.11.2026 tarihli aktarımı (UG görüşmeleri, danışman firma görüşmeleri, dbt PoC, Dataspecta workshop, ETL dokümantasyonu, GoldenGate, orkestrasyon, tasarım taslakları) |
| 5–6 | Önceki kararlar ve güncel durumları | [[DWH Sunum Temmuz 2025]], [[Sistemler ve Servisler]], [[Fiziksel Topoloji - Teknik Taraf]] |
| 7 | Mevcut durum: veri ve ortamlar | [[Fiziksel Topoloji - Teknik Taraf]], [[Ortamlar hakkında]], [[PowerDesigner Bilgilendirme]] |
| 8 | Mevcut durum: raporlama ve gün sonu | [[Takasbank Genel Bilgilendirme]], [[Takasbank Genel Bilgilendirme 2]] |
| 9 | UG görüşmelerinden tespitler | [[Banka Ug]], [[Enerji UG]], [[Takas UG]] |
| 10 | Temel tespitler | [[DWH Sunum Aralık 2024]], [[Başlangıç Yaklaşımı]] |
| 11–12 | Önerilen hedef mimari, katmanlar | [[Başlangıç Yaklaşımı]], [[DWH Hedef Mimarisi v2]] |
| 13 | Rapor yerleşim ilkesi | [[Başlangıç Yaklaşımı#Faz 3 — Operasyonel rapor göçü ölçekte]] |
| 14 | Fiziksel yerleşim ve kapasite | [[Fiziksel Topoloji - Teknik Taraf#DWH yerleşim adayları]] |
| 15 | ETL aracı değerlendirmesi | [[ETL Tool Comparison]] |
| 16 | Pilot önerisi | [[Proje Planı#Pilot seçimi]] |
| 17–18 | Yol haritası, Faz 0 ilk 30 gün | [[Proje Planı]], [[Başlangıç Yaklaşımı#Fazlar]] |
| 19 | Ekip ve danışmanlık modeli | [[Proje Planı]], [[Komtaş Future-Ready Data Platform Teklifi Ağustos 2026]] |
| 20 | Riskler | [[Başlangıç Yaklaşımı#Risk kaydı (ilk gün)]] |
| 21 | Karar beklenen konular | [[Başlangıç Yaklaşımı#İlk yönlendirme komitesine götürülecek kararlar]] |
| 22 | Açık sorular | [[Aktif Sorular]] |
| 23 | Kapanış | — |
