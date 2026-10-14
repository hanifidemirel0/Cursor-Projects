---
title: Sistemler ve Servisler
tags:
  - dwh
  - kavram
  - replikasyon
  - oracle
  - etl
  - kaynak
  - kale
  - ods
  - powerdesigner
  - veri-sahiplendirme
---

# Sistemler ve Servisler

[[#1. DWH|DWH]] · [[#2. Goldengate|Goldengate]] · [[#3. Kale|Kale]] · [[#4. ODS|ODS]] · [[#5. PowerDesigner|PowerDesigner]]

## 1. DWH

Takasbank veri ambarı. OneNote notlarından derlenen amaç ve açık sorular.

### 1.1 Amaç

1. [[Sistemler ve Servisler#3. Kale|Kale]] üzerindeki yükü azaltmak; Exadata'yı sürekli büyütmek çözüm değil.
2. Yapay zeka: veriyi DWH'dan okumak daha hızlı ve temiz olacak. Semantik layer ileride AI için faydalı.
3. MSTR'da self-servis BI (sürükle-bırak) henüz yok; grain'i düzgün tablolarla önü açılacak.

### 1.2 Mevcut raporlama

Operasyonel kullanıcılar (iş birimleri) **Team Developer** kullanıyor; raporlar peyderpey UG'nin yönettiği web tarafına aktarılıyor. Nihai hedef MSTR. Üyelerin terminal ekranlarına açılan raporlar da var. ([[Takasbank Genel Bilgilendirme 2]])

### 1.3 Mimari

- Başlangıç duruşu, fazlar ve yönlendirme kararları: [[Başlangıç Yaklaşımı]]
- Güncel hedef: [[DWH Hedef Mimarisi v2]]
- Korunan ilk taslak: [[DWH Mimari Tasarım]]

İş alanları ve kurumsal varlık modeli: [[Takasbank İş Alanları ve Temel Varlıklar]]

Mantıksal veri modeli: [[DWH Logical Data Model]]

### 1.4 Açık sorular

[[Aktif Sorular]]

### 1.5 Plan

[[Proje Planı]]

## 2. Goldengate

Bu bölüm **veri alma (ingestion) aracı** kararının sahibidir. ODS tanımı [[Sistemler ve Servisler#4. ODS|ODS]], katman sözleşmesi [[DWH Hedef Mimarisi v2]], ortam gerçekleri [[Fiziksel Topoloji - Teknik Taraf]] notlarındadır.

### 2.1 Başlangıç notları


- **GoldenGate:** Bakımı ve yönetimi zor, ama tablo bazında filtreleme yapılabilir.


- **GoldenGate heterojen kaynakları destekliyor** (Postgre, SQL Server dahil).


### 2.2 Kısıtlar pazarın çoğunu baştan eliyor

Ürün listesine geçmeden önce; aşağıdaki dört gerçek, değerlendirmeye girmeden seçenekleri kesiyor:

1. **Veri kurum dışına çıkamaz** (düzenlemeye tabi piyasa altyapısı kurumu). Bu, SaaS ingestion katmanının tamamını eler: Fivetran, Airbyte Cloud, Matillion, Rivery.
2. **Kaynak ve hedef ikisi de Exadata.** Compute zaten satın alınmış durumda; doğru desen **hedefe pushdown yapan ELT**. Kendi ağır dönüşüm motorunu getiren araçlar compute'u ikinci kez satın almak olur.
3. **Ekip profili Oracle DBA + PL/SQL**, Python/Kafka platform ekibi değil. Streaming platformu gerektiren her seçenek gizli bir kadro maliyeti taşır.
4. **Satın alma süreci yavaş.** 

### 2.3 Kategoriler

#### 2.3.1 Oracle-native

GoldenGate, ODI,, external table / `SQL*Loader`. Tek tedarikçi, tek destek sözleşmesi, Exadata'ya pushdown, DBA'ler için yeni öğrenme yok. Detaylı kırılım aşağıda.

#### 2.3.2 Klasik kurumsal ETL suit'leri

Informatica PowerCenter / IDMC, IBM DataStage, SAP Data Services, Ab Initio, Talend (artık Qlik).



#### 2.3.3 Bağımsız CDC / replikasyon ürünleri

Not'ta eksik olan kategori, ve ilginç olan:

- **Qlik Replicate** (eski Attunity) ve **Quest SharePlex** — log tabanlı Oracle CDC. Bankalarda yaygın olma sebebi tam olarak GoldenGate'ten **çok daha kolay işletilmeleri**. Kendi notumuz GG için "bakımı zor" diyor; bu ürünler o şikâyetin evrensel olmasından doğdu.
- Ayrıca: IBM InfoSphere Data Replication, Precisely Connect CDC, Striim, Fivetran HVR (SaaS connector'ları değil, on-prem çalışan ürün).

#### 2.3.4 Açık kaynak

**Debezium** → Kafka → Kafka Connect ile landing. Lisans maliyeti sıfır, mühendislik maliyeti gerçek: Kafka ve onu sahiplenen bir ekip gerekiyor. Debezium'un Oracle connector'ı ya **XStream** (GoldenGate lisansı ister — ) kullanır. Sadece Takasbank'ta hâlihazırda ekibiyle işleyen bir Kafka varsa mantıklı ki yok



### 2.4 GoldenGate vs ODI — aynı işi yapmıyorlar

Bunlar alternatif değil, **farklı rollerde** araçlar. Oracle da ikisini birlikte konumlandırıyor (ODI, GG'nin beslediği journal tablolarını JKM ile tüketebiliyor).

- **GoldenGate = CDC / replikasyon.** Log tabanlı, satır seviyesi, düşük gecikme. Dönüşüm yapmaz, iş akışı yönetmez.
- **ODI = ELT / orkestrasyon.** Batch, dönüşüm yapar, küme bazlı SQL üretip **hedef veritabanında** çalıştırır. Dosya ve JDBC kaynaklarını doğrudan destekler.

Doğrulanması gereken kaynak adaylarına göre kapsama:

| Kaynak | GoldenGate | ODI |
|---|---|---|
| [[Sistemler ve Servisler#3. Kale\|Kale]] | Log tabanlı CDC, tablo bazında filtre | Batch; log tabanlı CDC'si GG olmadan yok |
| Arşiv, ÇekDB | Var | Var |
| BIST DB | Pratikte hayır (başka kurumun log'una erişim) | Zamanlanmış çekim — doğal yer |
| CSV / FTP | **Yok** — GG kaynak olarak transaction log okur | Native dosya desteği |
| Postgre / MSSQL | Var | JDBC ile var |
| LND→CORE→ODS/DM/PUB dönüşümleri | Yok | Asıl işi |

Sonuç: **GoldenGate tek başına yetmez** (dosya bacağını ve tüm dönüşümü kapatamaz). **ODI tek başına yetebilir**; tek zayıf noktası prod Kale'de log tabanlı CDC.

### 2.5 Seçeneklerin bizim durumumuza göre puanı

| Seçenek | Dosya/FTP | Heterojen | Gün içi | İşletme yükü | Satın alma |
|---|---|---|---|---|---|
| ODI | Native | JDBC | Sadece batch | Orta | Yeni lisans |
| GoldenGate | Yok | Var | Var | Yüksek | Yeni lisans |
| Qlik Replicate / SharePlex | Kısıtlı | Var | Var | Düşük–orta | Yeni tedarikçi |
| Informatica PowerCenter / IDMC | Native | Var | CDC opsiyonuyla | Orta | **Mevcut tedarikçi** |
| Debezium + Kafka | Yok | Var | Var | Yüksek | Lisans bedava, işletmesi pahalı |
| External table + PL/SQL + dbt | Native | Gateway ile | Yok | Düşük | **Maliyetsiz** |

### 2.6 Kale bacağı: CDC'ye gerçekten ihtiyaç var mı

ODI'nin Kale'de GG'siz CDC seçenekleri trigger veya timestamp/watermark kolonu. Prod Exadata OLTP'sine trigger koymak kötü fikir; watermark ise kaynakta güvenilir değişiklik tarihi olmasını gerektirir — geçmiş dataya update gelebildiği için ([[Aktif Sorular]]) bu Kale'de şüpheli.



### 2.7 Gecikme sınıfı araçtan önce gelir

[[DWH Hedef Mimarisi v2]] her veri ürününü ayrı sınıflandırır:

- **S0:** olay yakın gerçek zamanlı,
- **S1:** gün içi mikro-batch,
- **S2:** gün sonu,
- **S3:** planlı dosya/harici besleme,
- **S4:** backfill/replay.

GoldenGate veya başka CDC ürünü yalnızca S0/S1 gereksinimi kaynak ve iş SLA'sıyla kanıtlanan akışlarda değerlendirilir. Bir kritik raporun saat bazında SLA'sı olması, bütün DWH'ın streaming olması gerektiği anlamına gelmez.



### 2.8 Araç ne olursa olsun yapılmayacaklar

- Prod Kale'ye **trigger** veya **materialized view log** koymak — ikisi de canlı işlem sistemine yazma yükü ekler.
- Prod Kale'yi **doğrudan dblink** ile sorgulamak.

Kale'yi okuyan her yol `sur` üstündeki replikayı kullanır; diğer kaynaklar kendi onaylı landing yolundan gelir.

İlgili notlar: [[Sistemler ve Servisler#4. ODS|ODS]] · [[DWH Hedef Mimarisi v2]] · [[DWH Mimari Tasarım]] · [[Fiziksel Topoloji - Teknik Taraf]] · [[Aktif Sorular]] · [[Proje Planı]] ([[Ortamlar hakkında]])

## 3. Kale

Takasbank'ın **ana veritabanı**. Tüm verinin yaklaşık **%90**'ı burada tutuluyor. Diğer kaynaklar: Arşiv, ÇekDB.

- Birden fazla şemada üye tablosu olabiliyor (DQ sorunu).
- Her piyasanın kendi üye tablosu da olabiliyor.
- DWH'ın birinci amacı Kale yükünü azaltmak.

Bkz. [[Takasbank Genel Bilgilendirme]], [[Sistemler ve Servisler#5. PowerDesigner|PowerDesigner]], [[Sistemler ve Servisler#4. ODS|ODS]], [[Sistemler ve Servisler#1. DWH|DWH]], [[Aktif Sorular]].

## 4. ODS

Operational Data Store. Takasbank hedef mimarisinde kurumsal core'un **güncel-durum projeksiyonu**.

### 4.1 Kapsam kararı

Mevcut `tvsods` DB'si [[Sistemler ve Servisler#3. Kale|Kale]] ile anlık senkron bir kopya. Bu **ODS değil**: hiçbir şeyi entegre etmiyor ve `kaledb`'nin zaten iki replikası varken ([[Fiziksel Topoloji - Teknik Taraf]]) aynı verinin üçüncü kopyasını, yükünü azaltmaya çalıştığımız makinede tutuyor.

ODS yeniden tanımlandı: Kale'nin aynası değil, **çok kaynaklı** entegre katman.

Kaynaklar: [[Sistemler ve Servisler#3. Kale|Kale]] · Arşiv · ÇekDB · **BIST DB** (Borsa'nın veri ambarı) · **FTP ile gelen CSV dosyaları** · muhtemel Postgre / MSSQL kaynakları.

### 4.2 Katman sınırları

Üç farklı sorumluluk birbirine karıştırılmaz:

- **Landing (`LND_<kaynak>`)** — Kaynağın ne teslim ettiğini kanıtlar ve replay sağlar.
- **Kurumsal core (`CORE_*`)** — Entegre anlamı, kimlik çözümlemeyi ve bitemporal tarihçeyi sahiplenir.
- **ODS (`ODS_*`)** — Core'un şu anda geçerli kaydını operasyonel tüketim için projekte eder.

Detaylı katman sözleşmesi ve yükleme desenleri: [[DWH Hedef Mimarisi v2]]

### 4.3 Kararlar

> [!important] Başlangıç yaklaşımı kararı (Ekim 2026, onay bekliyor)
> Kaynak: [[Başlangıç Yaklaşımı#Mimari duruş]] madde 2–3.
>
> - **`tvsods` kapatılır.** Entegre etmeyen, Kale'nin üçüncü kopyası olan ve boşaltılmaya çalışılan `kale` makinesinde duran bu veritabanı mimari katman değildir; taşınmaz, emekli edilir.
> - **Ham güncel-durum standby'dan verilir.** Kale yapıları üstünde gün içi "izleme" tipi raporlar ve Team Developer sorguları, `sur` üstündeki Kale read-only replikasına yönlendirilir; yeni araç ve modelleme gerekmez. Ön koşul olan ADG/açılış modu doğrulaması: [[Aktif Sorular]] madde 14.1.
> - **Ölçülmüş SLA gerektirene kadar ayrı fiziksel ODS yok.** Entegre güncel-durum, DWH içindeki core üstünde `ODS_*` view/MV projeksiyonudur ve yalnızca gerçek operasyonel SLA'sı kanıtlanan konu alanında açılır. Ayrı ODS veritabanı/makinesi sorusu (4.3 son madde ve [[Aktif Sorular]] madde 4.3) bu kanıt gelene kadar askıdadır.
>
> Bu karar [[Obase Takasbank Değerlendirme Raporu Ağustos 2024]]'nin "önce ODS" önerisini ve [[DWH Sunum Temmuz 2025]]'teki "ODS kale Exadata'da" yerleşimini değiştirir; [[DWH Hedef Mimarisi v2]]'nin "ODS = core projeksiyonu" tanımıyla uyumludur.

- **ODS koşullu rapor verir.** "Güncel veri lazım, tam tarihçe lazım değil" sınıfı raporlar adaydır. Rapor envanteri ve SLA olmadan ODS tablosu açılmaz: [[Proje Planı]].
- **Current view tarihçe değildir.** “Dün saat 10'da ne biliyorduk?” sorusu ODS'den değil bitemporal core'dan cevaplanır.
- **ODS mart değildir.** Yoğun aggregate, metrik ve yıldız şema `DM_*` katmanına aittir.
- **ODS işlem sistemi değildir.** Canlı takas/ödeme/teminat defterine yazmaz ve kaynak uygulamanın komut işlevini üstlenmez.
- **Fiziksel yerleşim açık karardır.** Hedef; kapasite, HA, workload ve gecikme testiyle belirlenir: [[Aktif Sorular]].

### 4.4 Kaynak kapsamı

Kaynak adayları ve ingestion yolları [[Sistemler ve Servisler#2. Goldengate|Goldengate]], hassasiyet/sahiplik bilgisi [[Sistemler ve Servisler#5. PowerDesigner|PowerDesigner]], kurum içi kapsam boşlukları [[Aktif Sorular]] notlarındadır.

Kaynak türü ODS'e doğrudan bağlantı vermez. Bütün veri önce landing ve kurumsal sözleşmeden geçer. Dış kurum ambarından gelen besleme, sunduğu grain ve yayın penceresiyle alınır; ODS onu yapay biçimde işlem seviyesine dönüştürmez.

### 4.5 Sonuçları

- **Replikasyon:** Dataguard sadece Oracle→Oracle; Postgre/MSSQL/CSV'yi hiç alamaz. Yani heterojen bir yol her hâlükârda gerekiyor: [[Sistemler ve Servisler#2. Goldengate|Goldengate]]
- **Maskeleme sınırı yukarı taşındı:** hassas veri artık DWH değil **ODS** sınırında iniyor. Her kaynağın PowerDesigner hassasiyet eşlemesi landing'den önce yapılmalı: [[Sistemler ve Servisler#5. PowerDesigner|PowerDesigner]] · [[Aktif Sorular]]
- **BIST DB bir OLTP kaynağı değil**, başka bir kurumun ambarı: grain'ini ve tazeleme penceresini devralırsın, real-time alınamaz. Conformed dış besleme olarak ele alınır.

Hedef: [[Sistemler ve Servisler#1. DWH|DWH]]

## 5. PowerDesigner

Kaynak sistem kataloğu / veri sahiplendirme aracı. ER modeli tutulmuyor.

- Amaç: **veri sahiplendirme** (hassas veri flag'i, veri sahibi). Açıklama, primary key vb. de var.
- Her UG'nin kendi veri modeli var.
- Kurumsal mimari, düzenli **fark raporu** ile güncel tutuyor; bütün tablolar ve kolonlar içeride.
- BT mimari kontak: **Aytaç**.

Kaynak: [[PowerDesigner Bilgilendirme]] · [[Takasbank Genel Bilgilendirme 2]]
