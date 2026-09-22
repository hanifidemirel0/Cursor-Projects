---
title: Obase Takasbank Değerlendirme Raporu Ağustos 2024
created: 2026-09-22
source: Takasbank_Değerlendirme_Raporu_V102_OBASE.pdf (IMG_7785–IMG_7792.JPEG fotoğraflarından)
section: Kendi Notlarım
tags:
  - dwh
  - ods
  - takasbank
  - obase
  - değerlendirme
---

# Obase Takasbank Değerlendirme Raporu Ağustos 2024

Obase’nin **20.08.2024** tarihli *Takasbank Değerlendirme Raporu* için hazırlanmış kaynak notu. Raporun önerileri Obase’ye aittir; kurumun onaylanmış kararı veya güncel sistem durumu olarak kabul edilmemelidir. İlgili bağlam: [[Firmalarla Yapılan DWH Görüşmeleri]] ve [[DWH Sunum Aralık 2024]].

> [!info] Kaynak ve kapsam
> Sekiz ekran fotoğrafı PDF’nin **16 sayfasını** (her fotoğrafta iki sayfa) gösteriyor. Tüm sayfalar ayrı görsellere ayrıldı; üç mimari diyagram ayrıca çıkarıldı. PDF’nin kendisi bu klasörde bulunmadığından metin fotoğraflardan aktarılmıştır. Fotoğrafların sonuncusunda basılı sayfa numarası 17; aşağıdaki bölüm numaraları PDF görüntüleyicisindeki **1–16 sayfa sırasını** izler.

> [!note] Okuma sınırı
> Küçük diyagram etiketleri için özgün görseller korunmuştur. Raporun teknik ve kapasite iddiaları 2024 tarihli kaynak beyanlarıdır; bu not onları bağımsız olarak doğrulamaz.

## Rapor özeti

- **Kısa vadeli Obase önerisi:** ODS ile operasyonel veriye hızlı erişim ve KALE üzerindeki raporlama yükünü azaltma.
- **DWH yaklaşımı:** iş birimlerinin ileri analiz/raporlama ihtiyacı netleştikçe ikinci fazda değerlendirme.
- **Diğer öneriler:** donanım/yazılım optimizasyonu, veri akışlarının ve kalitesinin yönetilmesi, veri mühendisi/analisti rolleri ve eğitim.
- **Taslak plan:** Faz 1 ODS ve performans; Faz 2 DWH değerlendirme, olası kurulum ve devreye alma.

## Sayfa 1 — Kapak

![[_sources/Obase Değerlendirme Raporu/page-01.jpg]]

**Obase — Takasbank Değerlendirme Raporu**, **20.08.2024**. Kapaktaki “Your Knowledge Base” ibaresi Obase markasının parçasıdır.

## Sayfa 2 — Yönetici özeti

![[_sources/Obase Değerlendirme Raporu/page-02.jpg]]

Rapor, Takasbank’ın mevcut veri yönetimi altyapısını ve gelecekteki gereksinimlerini değerlendirmek için hazırlanmıştır. **BES ve diğer operasyonel sistemlerde veri büyümesi**, kapasite artışlarına rağmen performans riski olarak görülür. **Kısa vadede ODS entegrasyonu** önerilir: operasyonel veriye hızlı/esnek erişim, performans sorunlarını azaltma ve veri işleme süreçlerini hızlandırma hedeflenir. **Orta ve uzun vadede DWH**, iş birimlerinden gelecek yeni analiz/raporlama taleplerine göre değerlendirilir. Veri mühendisi ve veri analisti rolleri ile eğitim programı da önerilir.

## Sayfa 3 — İçindekiler

![[_sources/Obase Değerlendirme Raporu/page-03.jpg]]

Raporun ana bölümleri: **1. Mevcut Sistem Yapısı; 2. Sistem Mimarisi; 3. Değerlendirme Raporu ve Çözüm Mimarisi**. Son bölümde mevcut durum/karşılaştırma, veri ambarı ihtiyacı, sonuç ve öneriler, çözüm mimarisi, organizasyon, eğitim ve taslak proje planı yer alır.

## Sayfa 4 — Mevcut sistem yapısı

![[_sources/Obase Değerlendirme Raporu/page-04.jpg]]

Bankacılık geliştirme sürecinde **8 farklı ekip** bulunduğu belirtilir; Hazine, Piyasa Sistemleri, Ödeme Sistemleri, Takas, Saklama, Alt Yapı, Mimari ve Raporlama adları geçer. Bankacılık sistemleri **Oracle** üzerinde, raporlama **PL/SQL** ile yürütülür. Veri sözlüğü ve diyagramlar sınırlı; tabloların bir kısmı **PowerDesigner** içindedir, tamamı değildir. Ekibin kendi şema modülü, banka şemasında arşivleme ve raporların çok kaynaktan veri kullanması anlatılır. **Dinamik rapor yazma genellikle yoktur**; ana veri tabanı yükünü azaltmak hedeflenir. **TEFAS talimat tablosu** aktif kullanılır. BES, enerji ve Borsa verileri farklı şemalarda tutulur; yaklaşık **7.000 tablonun** analiz edilmesi gerektiği belirtilir.

**KALE** merkezî veri tabanıdır; raporlama KALE’den yapılır. **DSS** üzerinde o tarihte yalnız uygulama testleri yapıldığı yazılır. **GoldenGate lisansı** mevcut olduğu ve DataGuard/GoldenGate’in hibrit çalışabileceği rapor beyanıdır. BIST/BIDB tarafında veri alışverişinin yaklaşık **%90 okuma / %10 yazma** olduğu; BIDB ve replika üzerinden KALE’ye günsonu verisi aktarıldığı belirtilir. **Çek fotoğrafları CEKDB’de CLOB alanlarında** tutulur; object storage’a taşıma ayrı proje olarak planlanır. Üye bilgileri birden çok tabloda olduğundan tekilleştirilmiş üye görüntüsü bulunmadığı kaydedilir.

## Sayfa 5 — Mevcut veri akışı diyagramı

![[_sources/Obase Değerlendirme Raporu/page-05.jpg]]

Diyagram, **KALE**, **Arşiv DB**, **DSS**, operasyonel işlemler ve raporlama ile **Aktif DB → BI DB → Replica BI DB** hattını birlikte gösterir. Kaynak çizim, BIST DWH ve uygulama bağlantılarını da içerir. Okların ayrıntılı yönleri için kırpılmış özgün diyagram kullanılmalıdır.

![[_sources/Obase Değerlendirme Raporu/mevcut-veri-akisi.jpg]]

## Sayfa 6 — Mevcut akışın bileşenleri

![[_sources/Obase Değerlendirme Raporu/page-06.jpg]]

**KALE (Oracle)** operasyonel veri işleme ve depolamanın merkezidir. **Arşiv DB** eski veriyi uzun süre saklar; raporda “+10 yıl” ifadesi kullanılır. **DSS**, KALE’den aktarılan **T-1** veriyle karar destek/analiz ortamı olarak açıklanır. **Aktif DB** operasyonel veriyi en az 15, en çok 30 gün tutar. **BI DB** iş zekâsı verisini işler; **DataGuard** ile replika üretilir. **BI DB APP** veri işleme uygulaması, **BIST DWH** ise BIST verisinin analiz/depolama alanı olarak anlatılır. Bu tanımlar raporun mimari anlatımıdır; güncel işletim durumunu teyit etmez.

## Sayfa 7 — Replica BI DB ve KALE diyagramı

![[_sources/Obase Değerlendirme Raporu/page-07.jpg]]

**Replica BI DB**, BI DB’den gelen replike veri ve anlık **T+0** güncelleme için açıklanır. Main App, Borsa ana sisteminde veri manipülasyonu için gösterilir. İkinci diyagram **KALE çevresindeki uygulama ve entegrasyonları** görselleştirir.

![[_sources/Obase Değerlendirme Raporu/kale-entegrasyonlari.jpg]]

## Sayfa 8 — KALE entegrasyonlarının açıklaması

![[_sources/Obase Değerlendirme Raporu/page-08.jpg]]

Raporda KALE ile ilişkilendirilen kaynaklar/uygulamalar: **BES, TEFAS, TPP, ÖPP, KMTEM/KITEFON, TAPUTAKAS, ENERJİ, TURB, PYSF**, üyeler ve operasyon; ayrıca **FTP**, **API**, **CEKDB**, **BIST DWH** ve **MSTR**. Sağ sayfa her birinin KALE ile veri alışverişindeki rolünü açıklar. Bunlar raporun verdiği etiketlerdir; bazı açılımlar ve sistem işlevleri ayrıca doğrulanmamıştır.

## Sayfa 9 — Entegrasyonların devamı ve değerlendirmeye giriş

![[_sources/Obase Değerlendirme Raporu/page-09.jpg]]

API tarafında **EPİAŞ, MKK, Merkez Bankası, SWIFT, KKB, SBM, EGM, NVİ, Tapu ve KİK** gibi kaynaklar sayılır. CEKDB çek verisini, BIST DWH BIST verisini, **MSTR/MicroStrategy** raporlamayı temsil eder. Rapora göre veri hacmi özellikle **BES** nedeniyle büyümektedir; BES’in KALE verisinin yaklaşık **%80’i** olduğu iddia edilir. TEFAS/BIST büyümesi de vurgulanır. Rapor, **2027’ye kadar kapasite artışı gerekebileceğini**, Exadata’nın geçmişte **1/8’den 1/4 ölçeğe** çıkarıldığını belirtir; bu bir 2024 öngörüsüdür.

## Sayfa 10 — Performans ve veri kalitesi sorunları

![[_sources/Obase Değerlendirme Raporu/page-10.jpg]]

Rapor, KALE üzerindeki günlük raporlamanın operasyonel işlemleri yavaşlatabileceğini, özellikle **günsonu gibi kritik zamanlarda** risk yaratabileceğini belirtir. Veri yönetimi/kalitesinde merkezî rol KALE’dedir; veri temizliği iyi kabul edilse de farklı şemalardaki veri kaynakları, bütünlük, standardizasyon ve entegrasyonun yönetilmesi gerektiği savunulur. “Karşılaştırmalı Analiz” girişinde, diğer kurumların ODS ve DWH’ı birlikte ve modern ETL/depolama çözümleriyle kullandığı; Takasbank’ta **ODS değerlendirmesinin sürdüğü, DWH’ın ikinci faz olarak planlandığı** yazılır.

## Sayfa 11 — Organizasyon karşılaştırması ve DWH ihtiyacı

![[_sources/Obase Değerlendirme Raporu/page-11.jpg]]

Diğer kurumlarda veri mühendisleri, veri analistleri, ETL geliştiricileri ve güvenlik uzmanlarının birlikte çalıştığı belirtilir. Takasbank’ta **MSTR geliştiricileri dışındaki rollerin eksikliği** vurgulanır. MSTR’nin mevcut ihtiyaçları karşıladığı, ileri veri analitiği ve otomatik raporlamada gelişme alanı olduğu söylenir.

Obase’nin değerlendirmesi: hızlı büyüme ve performans gereksinimleri için **mevcut aşamada DWH yerine ODS** daha etkili olabilir. ODS kısa/orta vadede operasyonel veriye hızlı erişim sağlar; **DWH gereği daha sonra iş birimlerinin analitik taleplerine göre** ortaya çıkabilir. Fayda-maliyet anlatımında ODS’nin daha düşük yatırım ve hızlı sonuç sunacağı ileri sürülür. Bunlar sağlayıcının analizi olup kabul edilmiş kurum kararı olarak yazılmamıştır.

## Sayfa 12 — Sonuç ve öneriler

![[_sources/Obase Değerlendirme Raporu/page-12.jpg]]

Stratejik veri yönetimi, süreçlerin iyileştirilmesi, organizasyonun güçlendirilmesi ve teknoloji optimizasyonu önerilir. **ODS entegrasyonu** kısa vadeli öneridir. Buna ek olarak **donanım/yazılım optimizasyonları**, performans ölçümü ve izleme tavsiye edilir. Mevcut MSTR raporlamasının iş birimi ihtiyaçlarına göre gözden geçirilmesi, DWH kararının ikinci fazda yeniden değerlendirilmesi ve veri mühendisi/veri analisti rollerinin eklenmesi belirtilir.

## Sayfa 13 — Önerilen çözüm mimarisi

![[_sources/Obase Değerlendirme Raporu/page-13.jpg]]

Görsel, **Veri Kaynakları Girişleri → Kaynak Sistemler → ODS → Veri Ambarı → İş Zekâsı** katmanlarını gösterir. Kaynak tarafta **KALE, CEKDB, Replica DB, BIST DWH, ARSIV DB**; ODS tarafında operasyonel rapor ve ODS şeması; veri ambarı tarafında üretim/test alanları; iş zekâsında **MSTR** ve kullanıcılar yer alır. Raporda **Oracle teknolojilerinin kullanılabileceği** söylenir; kesin ürün seçimi olarak sunulmaz.

![[_sources/Obase Değerlendirme Raporu/oneri-mimarisi.jpg]]

## Sayfa 14 — Önerilen organizasyon

![[_sources/Obase Değerlendirme Raporu/page-14.jpg]]

Rapor, mevcut veri yönetimi organizasyonunu **bir yönetici ve iki MSTR geliştiricisi** olarak açıklar. ODS ve olası DWH için bunun yetersiz kalabileceğini değerlendirir. Önerilen yapı: **veri yönetimi yöneticisi**, mevcut **iki MSTR geliştiricisi**, **bir veri mühendisi** ve **bir veri analisti**. Veri mühendisi akış/entegrasyon, ODS ve performans; veri analisti iş birimlerinden gelen analiz ve raporlama talepleriyle ilişkilendirilir.

## Sayfa 15 — Eğitim ve ilk fazın başlangıcı

![[_sources/Obase Değerlendirme Raporu/page-15.jpg]]

Önerilen eğitimler: **veri entegrasyonu** (veri mühendisi, ETL/MSTR geliştiricileri), **veri ambarı yönetimi ve modelleme** (veri mühendisi, analist, ETL geliştiricisi) ve **genel veri yönetimi/ileri analitik** (tüm veri yönetimi ekibi). Konular veri akışları, ETL araçları, ODS, yıldız/kar tanesi şeması, kalite ve analitik süreçlerini kapsar.

**Taslak proje planı Faz 1 — ODS entegrasyonu ve performans iyileştirmeleri:** proje başlangıcı/kapsam/ekip; ODS için analiz ve teknik tasarım; ODS kurulumu, entegrasyon ve ilk testler. Roller yönetici, veri mühendisi, ETL geliştiricisi ve sistem yöneticisi olarak sayılır.

## Sayfa 16 — Taslak projenin devamı

![[_sources/Obase Değerlendirme Raporu/page-16.jpg]]

**Faz 1** devamında donanım/yazılım optimizasyonu ve ODS sonrası ilk performans iyileştirmeleri planlanır. **Faz 2 — Veri Ambarı Değerlendirme ve Kurulum:** iş birimleriyle ihtiyaçların yeniden incelenmesi; DWH gereksinim ve kaynaklarının değerlendirilmesi; ayrıntılı kurulum planı; kurulum ve mevcut sistemlerle entegrasyon; test/kullanıcı kabul/devreye alma; son performans iyileştirmeleri ve eğitim. “Taslak” plandaki görevler ve sorumlular öneridir; gerçekleşmiş iş olarak okunmamalıdır.

## Kaynak fotoğraflar

Orijinal JPEG dosyaları değiştirilmedi. Tam kare kopyalar:

- [[_sources/Obase Değerlendirme Raporu/IMG_7785.JPEG|IMG_7785 — PDF sayfa 1–2]]
- [[_sources/Obase Değerlendirme Raporu/IMG_7786.JPEG|IMG_7786 — PDF sayfa 3–4]]
- [[_sources/Obase Değerlendirme Raporu/IMG_7787.JPEG|IMG_7787 — PDF sayfa 5–6]]
- [[_sources/Obase Değerlendirme Raporu/IMG_7788.JPEG|IMG_7788 — PDF sayfa 7–8]]
- [[_sources/Obase Değerlendirme Raporu/IMG_7789.JPEG|IMG_7789 — PDF sayfa 9–10]]
- [[_sources/Obase Değerlendirme Raporu/IMG_7790.JPEG|IMG_7790 — PDF sayfa 11–12]]
- [[_sources/Obase Değerlendirme Raporu/IMG_7791.JPEG|IMG_7791 — PDF sayfa 13–14]]
- [[_sources/Obase Değerlendirme Raporu/IMG_7792.JPEG|IMG_7792 — PDF sayfa 15–16]]

İlgili notlar: [[Firmalarla Yapılan DWH Görüşmeleri]] · [[DWH Sunum Eylül 2024]] · [[DWH Sunum Aralık 2024]] · [[DWH Sunum Temmuz 2025]] · [[DWH]] · [[ODS]] · [[Kale]] · [[Dataguard vs Goldengate]] · [[Proje Planı]] · [[Aktif Sorular]]
