---
title: Fiziksel Topoloji - Teknik Taraf
created: 2026-09-04T12:44:00
source: OneNote
notebook: My Notebook
section: Kendi Notlarım
tags:
  - dwh
  - altyapi
  - ortam
---

# Fiziksel Topoloji - Teknik Taraf

Friday, 4 September 2026, 12:44 pm

Kaynak görüntü: ![[_sources/fiziksel-topoloji.jpg]]

- Kaynak sistem kataloğu: [[PowerDesigner]]
- [[Dataguard vs Goldengate]]
- **DSS:** DWH tarafındaki POC sürecinde kullanılmak üzere oluşturulmuş bir ortam. Prod'un eşleniği; read-only senkron. DSS'de test yapılmıyor. ([[Ortamlar hakkında]])
- **Data maskeleme:** **Informatica TDM** ürünü aracılığıyla yapılıyor. ([[Ortamlar hakkında]])
  - Informatica tarafında **TDM dışında lisans yok**; veri alma aracı seçenekleri GoldenGate ve ODI: [[Dataguard vs Goldengate]]
- **Automic:** Scheduling için kullanan ekipler var; DWH tarafında da kullanılabilir. ([[Takasbank Genel Bilgilendirme 2]])
- **[[ODS]] / tvsods:** ODS için `tvsods` DB'si oluşturulmuş. Şu an [[Kale]] ile anlık senkron. ([[Ortamlar hakkında]]) → Bu senkron kopyanın mimari katman olmaktan çıkması ve yerleşimin bu makineden taşınması kararlaştırıldı: [[ODS]]
- **tvstruva:** Bakımı düzgün yapılan test ortamı. Gün sonu işlemleri burada da yapılıyor. Erişim için ~1 hafta geçerli şifre alınabiliyor.
- **PREPROD** ([[Aktarım #1]]): T-1 datası, gece 4'te backup alınıyor. Preprod ve Test aynı instance üzerinde. Son testler PREPROD'da yapılıyor. ([[Ortamlar hakkında]])
- **PREPROD gün sonu** ([[Takasbank Genel Bilgilendirme 2]]): Her akşam 9:30'da üyelerin bağlantıları kesiliyor; gün sonu başlıyor. Snapshot'lar alınıp tarihçelendiriliyor; özet tablolar ve bazı komisyon hesaplamaları besleniyor. Sabah ~6'da doluyor, her sabah eziliyor; erişim için her gün şifre almak lazım.
  - Onur ve Deniz notları farklı kesitleri anlatıyor olabilir; henüz tek timeline'da birleştirilmedi.
- **Gün sonu — Ozan** ([[Ortamlar hakkında]]): PREPROD için Oracle **flashback** ile snapshot alınıyor; gece 4'te başlayıp 7'de bitiyor, gün sonu işlemleri 3 gibi bitiyor. DSS de aynı şekilde. DSS ve PREPROD saat 7'de Kale'den kopartılıyor. İşlemler operasyon tarafından **manuel** tetikleniyor, bittiğinde mail geliyor; DB ekibi bir yere flag atabilir.
  - Deniz'in 9:30 / sabah ~6 anlatımıyla aynı timeline'a henüz oturtulmadı.
- **Önemli şemalar:** Banka,

> OneNote sayfasında liste `Banka,` ile kesilmişti. Tam liste [[Aktarım #1]] aktarım notunda: Banka, hareket, kurgun, doviz, saklama.

## Donanım / yerleşim

Kaynak: [[Ortamlar hakkında]]

- **kale** Exadata: makinenin adı da kale, DB'nin adı da kale. [[ODS]] şu an bu makinede.
- **sur** Exadata: [[DWH]] bu makinede.
- 1 Exadata yaklaşık **200 TB**; kaledb yaklaşık **10 TB**.
- kaledb'nin 2 replikası daha var: biri kale Exadata üstünde, diğeri sur Exadata üstünde.

İlgili notlar: [[Aktif Sorular]] · [[Aktarım #1]] · [[Takasbank Genel Bilgilendirme 2]] · [[PowerDesigner Bilgilendirme]] · [[Ortamlar hakkında]]
