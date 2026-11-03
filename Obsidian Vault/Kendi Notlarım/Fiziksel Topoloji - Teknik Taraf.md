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
- **[[Sistemler ve Servisler#4. ODS|ODS]] / tvsods:** ODS için `tvsods` DB'si oluşturulmuş. Şu an [[Sistemler ve Servisler#3. Kale|Kale]] ile anlık senkron. ([[Ortamlar hakkında]]) → ODS kararıyla (02.11.2026) ayrı ODS veritabanı olmayacak; ODS, DWH içindeki GoldenGate beslemeli `ODS_` şemalarıdır ve `tvsods` hedefte yer almaz: [[Sistemler ve Servisler#4.1 Karar|ODS]]
- **tvstruva:** Bakımı düzgün yapılan test ortamı. Gün sonu işlemleri burada da yapılıyor. Erişim için ~1 hafta geçerli şifre alınabiliyor.
- **PREPROD** ([[Aktarım #1]]): T-1 datası, gece 4'te backup alınıyor. Preprod ve Test aynı instance üzerinde. Son testler PREPROD'da yapılıyor. ([[Ortamlar hakkında]])
- **PREPROD gün sonu** ([[Takasbank Genel Bilgilendirme 2]]): Her akşam 9:30'da üyelerin bağlantıları kesiliyor; gün sonu başlıyor. Snapshot'lar alınıp tarihçelendiriliyor; özet tablolar ve bazı komisyon hesaplamaları besleniyor. Sabah ~6'da doluyor, her sabah eziliyor; erişim için her gün şifre almak lazım.
  - Onur ve Deniz notları farklı kesitleri anlatıyor olabilir; henüz tek timeline'da birleştirilmedi.
- **Gün sonu — Ozan** ([[Ortamlar hakkında]]): PREPROD için Oracle **flashback** ile snapshot alınıyor; gece 4'te başlayıp 7'de bitiyor, gün sonu işlemleri 3 gibi bitiyor. DSS de aynı şekilde. DSS ve PREPROD saat 7'de Kale'den kopartılıyor. İşlemler operasyon tarafından **manuel** tetikleniyor, bittiğinde mail geliyor; DB ekibi bir yere flag atabilir.
  - Deniz'in 9:30 / sabah ~6 anlatımıyla aynı timeline'a henüz oturtulmadı.
- **Önemli şemalar:** Banka,

> OneNote sayfasında liste `Banka,` ile kesilmişti. Tam liste [[Aktarım #1]] aktarım notunda: Banka, hareket, kurgun, doviz, saklama.

## GoldenGate lisansları

Kaynak: Hanifi'nin 02.11.2026 tarihli aktarımı.

- **Takasbank:** **336 CPU**'luk GoldenGate lisansı var.
- **Borsa İstanbul:** **975 CPU**'luk GoldenGate lisansı var.
- İki kurum arasında GoldenGate ile veri akışı kurulabilir.

Bu bilgi [[Obase Takasbank Değerlendirme Raporu Ağustos 2024]]'teki "GoldenGate mevcut" ifadesini doğrular. Sürüm, destek sözleşmesi ve 336 CPU'nun hangi sunuculara dağıtılacağı DBA ile netleşecek: [[Aktif Sorular]] madde 14.2. Kullanım kararı: [[Sistemler ve Servisler#4.1 Karar|ODS kararı]].

## Zamanlayıcı

Kaynak: Hanifi'nin 02.11.2026 ve 03.11.2026 tarihli aktarımları.

- **Automic DWH zamanlayıcısı seçenekleri arasında değil; sebebi lisans sorunları.** Kurumda Automic kullanan ekipler var ([[Takasbank Genel Bilgilendirme 2]]), ancak lisans nedeniyle DWH için masada değil.
- DWH zamanlayıcısı/orkestrasyon aracı için **henüz karar verilmedi**; diğer seçenekler **değerlendirilmeye devam ediyor**; Ekim 2026'da orkestrasyon gereksinimi için farklı seçeneklerin değerlendirmesi yapıldı. Açık soru: [[Aktif Sorular]] madde 16.

## Donanım / yerleşim

Kaynak: [[Ortamlar hakkında]]

- **kale** Exadata: makinenin adı da kale, DB'nin adı da kale. Bugünkü `tvsods` bu makinede; hedef ODS DWH veritabanı içinde: [[Sistemler ve Servisler#4. ODS|ODS]].
- **sur** Exadata: [[Sistemler ve Servisler#1. DWH|DWH]] bu makinede. Aynı makinede DSS, PREPROD, TRUVA, LAMBDA, EFES; ayrıca SUR, CEKSUR, ALPHA, GAMMA, BETA, OMEGA, PATARA, EPSILON, KARTAL.
- **hisar** Exadata: HISAR, TABYA, CEKDB, ARSIVDB. Sunumda ODVM ODS HISAR altında, ODVM DWH ARSIVDB altında gösterilmiş: [[DWH Sunum Temmuz 2025]].
- 1 Exadata yaklaşık **200 TB**; kaledb yaklaşık **10 TB**.
- kaledb'nin 2 replikası daha var: biri kale Exadata üstünde, diğeri sur Exadata üstünde.
- Aralık 2024 kapasite görüntüsü ([[DWH Sunum Aralık 2024#Slayt 9 — Exadata kapasite kullanım istatistikleri: disk]]): boş disk kale ~%90, sur ~%77, hisar ~%81; CPU günlük tepe kale ~%25, sur ~%6–12, hisar ~%2–3 (tek tepe ~%12–13); bellek üçünde ~%60–70. Anlık görüntüdür, kapasite onayı değildir.

## Kale replikası - doğrulanacak gerçekler

[[Başlangıç Yaklaşımı]] gün içi operasyonel raporlamayı `sur` üstündeki Kale replikasından vermeyi önermişti; ODS kararından sonra bu rol açık ([[Aktif Sorular]] madde 4.8), replika batch çıkarım ve olası GoldenGate kaynağı olarak önemini koruyor. Bunun için DBA ekibiyle doğrulanacak ve buraya işlenecek gerçekler (soru kaydı: [[Aktif Sorular]] madde 14):

- **Data Guard türü:** fiziksel standby mı; **Active Data Guard** lisansı var mı; standby **read-only açık** mı (open mode) yoksa yalnızca mount'ta mı?
- **Apply modu ve lag:** real-time apply mı, yoksa belirli saatlerde mi (DSS/PREPROD gibi 07:00'de kopartılan bir desen mi)? Tipik ve en kötü apply lag; gün sonu batch sırasındaki lag.
- **Rol:** bu replika DR amaçlı mı (switchover/failover senaryosu raporlama yükünü etkiler), yoksa raporlama/offload için mi ayrıldı?
- **Erişim:** standby'a servis adı / bağlantı havuzu var mı; React ve Team Developer bağlantıları read-only servise yönlendirilebilir mi?
- **Flashback / AS OF SCN:** standby üstünde SCN-tutarlı okuma (`AS OF SCN`) için undo retention yeterli mi; DWH gün sonu çıkarımı hangi SCN'i referans alacak?
- **GoldenGate kaynağı:** `ODS_` beslemesi için extract'ın prod Kale'den mi standby'dan mı (downstream / ADG kaynaklı extract) alınacağı, prod'da supplemental logging gereği ve 336 CPU lisansın extract/replicat sunucularına dağılımı.

## DWH yerleşim adayları

Önceki sunumlar DWH'ı `sur`'a, ODS'i `kale`'ye koydu ([[DWH Sunum Temmuz 2025#Slayt 8 — Exadata yerleşimi]]). ODS kararıyla (02.11.2026) ODS, DWH veritabanı içinde; yerleşim tek karardır. [[Başlangıç Yaklaşımı]] yerleşimi izolasyon testine bağlıyor; adaylar:

- **sur:** DWH için önceden işaret edilen makine; ancak DSS, PREPROD, TRUVA, LAMBDA, EFES ve on kadar başka DB ile paylaşılıyor. Test/preprod yük desenleri ve gece flashback snapshot'ları (04:00–07:00) DWH gün sonu penceresiyle çakışır.
- **hisar:** HISAR, TABYA, CEKDB, ARSIVDB barındırıyor; Aralık 2024 görüntüsünde CPU ~%2–3 ile en boş makine. **ARSIVDB ile aynı makinede** olması, tarihçenin DWH'a taşınması ve Kale saklama penceresinin daraltılması hedefiyle uyumlu. Temmuz 2025 sunumunda da ODVM DWH ARSIVDB altında gösterilmişti.
- **kale:** hedef değil; boşaltılmaya çalışılan makine.

Test sonucu (IO/CPU izolasyonu, gün sonu penceresi çakışması, HA/DR etkisi) bu bölüme işlenir; karar [[Proje Planı]] "Araç ve kapasite" maddesinde takip edilir.

İlgili notlar: [[Başlangıç Yaklaşımı]] · [[Aktif Sorular]] · [[Aktarım #1]] · [[Takasbank Genel Bilgilendirme 2]] · [[PowerDesigner Bilgilendirme]] · [[Ortamlar hakkında]]
