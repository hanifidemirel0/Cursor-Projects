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

- Kaynak sistem kataloğu: [[Sistemler ve Servisler#5. PowerDesigner|PowerDesigner]]
- [[Sistemler ve Servisler#2. Goldengate|Goldengate]]
- **DSS:** DWH tarafındaki POC sürecinde kullanılmak üzere oluşturulmuş bir ortam. Prod'un eşleniği; read-only senkron. DSS'de test yapılmıyor. ([[Ortamlar hakkında]])
- **Data maskeleme:** **Informatica TDM** ürünü aracılığıyla yapılıyor. ([[Ortamlar hakkında]])
  - Informatica tarafında **TDM dışında lisans yok**; veri alma aracı seçenekleri GoldenGate ve ODI: [[Sistemler ve Servisler#2. Goldengate|Goldengate]]
- **[[Sistemler ve Servisler#4. ODS|ODS]] / tvsods:** ODS için `tvsods` DB'si oluşturulmuş. Şu an [[Sistemler ve Servisler#3. Kale|Kale]] ile anlık senkron. ([[Ortamlar hakkında]]) → Bu senkron kopyanın mimari katman olmaktan çıkması ve kapatılması önerildi; ham güncel-durum ihtiyacı `sur` üstündeki replikadan karşılanır: [[Sistemler ve Servisler#4. ODS|ODS]]
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

- **kale** Exadata: makinenin adı da kale, DB'nin adı da kale. [[Sistemler ve Servisler#4. ODS|ODS]] şu an bu makinede.
- **sur** Exadata: [[Sistemler ve Servisler#1. DWH|DWH]] bu makinede. Aynı makinede DSS, PREPROD, TRUVA, LAMBDA, EFES; ayrıca SUR, CEKSUR, ALPHA, GAMMA, BETA, OMEGA, PATARA, EPSILON, KARTAL.
- **hisar** Exadata: HISAR, TABYA, CEKDB, ARSIVDB. Sunumda ODVM ODS HISAR altında, ODVM DWH ARSIVDB altında gösterilmiş: [[DWH Sunum Temmuz 2025]].
- 1 Exadata yaklaşık **200 TB**; kaledb yaklaşık **10 TB**.
- kaledb'nin 2 replikası daha var: biri kale Exadata üstünde, diğeri sur Exadata üstünde.
- Aralık 2024 kapasite görüntüsü ([[DWH Sunum Aralık 2024#Slayt 9 — Exadata kapasite kullanım istatistikleri: disk]]): boş disk kale ~%90, sur ~%77, hisar ~%81; CPU günlük tepe kale ~%25, sur ~%6–12, hisar ~%2–3 (tek tepe ~%12–13); bellek üçünde ~%60–70. Anlık görüntüdür, kapasite onayı değildir.

## Kale replikası - doğrulanacak gerçekler

[[Başlangıç Yaklaşımı]] gün içi operasyonel raporlamayı `sur` üstündeki Kale replikasından vermeyi öneriyor. Bunun için DBA ekibiyle doğrulanacak ve buraya işlenecek gerçekler (soru kaydı: [[Aktif Sorular]] madde 14):

- **Data Guard türü:** fiziksel standby mı; **Active Data Guard** lisansı var mı; standby **read-only açık** mı (open mode) yoksa yalnızca mount'ta mı?
- **Apply modu ve lag:** real-time apply mı, yoksa belirli saatlerde mi (DSS/PREPROD gibi 07:00'de kopartılan bir desen mi)? Tipik ve en kötü apply lag; gün sonu batch sırasındaki lag.
- **Rol:** bu replika DR amaçlı mı (switchover/failover senaryosu raporlama yükünü etkiler), yoksa raporlama/offload için mi ayrıldı?
- **Erişim:** standby'a servis adı / bağlantı havuzu var mı; React ve Team Developer bağlantıları read-only servise yönlendirilebilir mi?
- **Flashback / AS OF SCN:** standby üstünde SCN-tutarlı okuma (`AS OF SCN`) için undo retention yeterli mi; DWH gün sonu çıkarımı hangi SCN'i referans alacak?
- **GoldenGate kaynağı:** ileride S0 ihtiyacı çıkarsa extract'ın standby'dan (downstream / ADG kaynaklı extract) alınabilirliği ve lisans kapsamı.

## DWH yerleşim adayları

Önceki sunumlar DWH'ı `sur`'a, ODS'i `kale`'ye koydu ([[DWH Sunum Temmuz 2025#Slayt 8 — Exadata yerleşimi]]). [[Başlangıç Yaklaşımı]] yerleşimi izolasyon testine bağlıyor; adaylar:

- **sur:** DWH için önceden işaret edilen makine; ancak DSS, PREPROD, TRUVA, LAMBDA, EFES ve on kadar başka DB ile paylaşılıyor. Test/preprod yük desenleri ve gece flashback snapshot'ları (04:00–07:00) DWH gün sonu penceresiyle çakışır.
- **hisar:** HISAR, TABYA, CEKDB, ARSIVDB barındırıyor; Aralık 2024 görüntüsünde CPU ~%2–3 ile en boş makine. **ARSIVDB ile aynı makinede** olması, tarihçenin DWH'a taşınması ve Kale saklama penceresinin daraltılması hedefiyle uyumlu. Temmuz 2025 sunumunda da ODVM DWH ARSIVDB altında gösterilmişti.
- **kale:** hedef değil; boşaltılmaya çalışılan makine.

Test sonucu (IO/CPU izolasyonu, gün sonu penceresi çakışması, HA/DR etkisi) bu bölüme işlenir; karar [[Proje Planı]] "Araç ve kapasite" maddesinde takip edilir.

İlgili notlar: [[Başlangıç Yaklaşımı]] · [[Aktif Sorular]] · [[Aktarım #1]] · [[Takasbank Genel Bilgilendirme 2]] · [[PowerDesigner Bilgilendirme]] · [[Ortamlar hakkında]]
