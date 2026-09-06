---
title: Takasbank İş Alanları ve Temel Varlıklar
created: 2026-09-06T22:50:00
updated: 2026-09-06T22:50:00
tags:
  - takasbank
  - dwh
  - is-mimarisi
  - veri-modelleme
status: researched
---

# Takasbank İş Alanları ve Temel Varlıklar

Bu not, Takasbank'ın **kamuya açık ve doğrulanmış iş alanları ile kalıcı iş kavramlarının** sahibidir. İç sistemler, ortamlar ve kaynak yerleşimi [[Fiziksel Topoloji - Teknik Taraf]]; hedef veri mimarisi [[DWH Hedef Mimarisi v2]]; cevap bekleyen kurum içi konular [[Aktif Sorular]] notlarındadır.

> [!info] Araştırma sınırı
> Kaynaklar 6 Eylül 2026 itibarıyla incelendi. Resmî sayfalar iş rolünü ve süreçleri doğrular; iç tablo adlarını, kaynak sistemleri, veri hacmini, SLA'yı veya veri otoritesini doğrulamaz.

## Kurumun çekirdek işi

Takasbank sıradan bir ticari banka değil; mevduat kabul etmeyen bir yatırım bankası ve sistemik öneme sahip **işlem sonrası finansal piyasa altyapısıdır**. Çekirdek değer önerisi:

- merkezi takas ve mutabakat,
- belirli piyasalarda merkezi karşı taraf (MKT/CCP),
- risk, marjin, teminat, garanti fonu ve temerrüt yönetimi,
- ödeme ve kıymet transferi,
- belirli saklama ve kurumsal aksiyon hizmetleri,
- piyasa ve fon platformu işletimi,
- enerji ve emtia piyasalarına merkezi uzlaştırma/teminat hizmeti,
- piyasa altyapısına bağlı kimlik, numaralandırma ve raporlama hizmetleridir.

> [!warning] MKT her hizmette yoktur
> Takasbank'ın bir piyasada takas, nakit uzlaştırma veya teminat hizmeti vermesi, o piyasadaki yükümlülüklere MKT garantisi verdiği anlamına gelmez. `piyasa × hizmet × geçerlilik dönemi` ayrı modellenmelidir.

## Kurumsal roller

### Merkezi takas kuruluşu ve nitelikli MKT

Takasbank, MKT hizmeti verdiği piyasalarda açık teklif, sözleşme yenileme veya başka bağlayıcı yöntemle satıcıya karşı alıcı, alıcıya karşı satıcı olur. Risk; üye teminatları, garanti fonları ve Takasbank'ın tahsis edilmiş sermayesiyle korunur.

Doğrulanmış MKT kapsamı; Borsa İstanbul Pay, Borçlanma Araçları, Vadeli İşlem ve Opsiyon, Para ve Swap piyasaları, Takasbank Ödünç Pay Piyasası ve belirli tezgâh üstü türevleri içerir. Kapsam ve kurallar zamanla değiştiği için sabit kod listesi değil, geçerlilik tarihli referans veri olmalıdır.

### Ödeme ve menkul kıymet mutabakat sistemi işletmecisi

TCMB, Takasbank'ın Pay Piyasası Takas Sistemi, Borçlanma Araçları Piyasası Takas Sistemi ve Çek Takas Sistemi rollerini 6493 sayılı Kanun kapsamındaki ödeme ve menkul kıymet mutabakat sistemleri arasında listeler.

### Ulusal numaralandırma kuruluşu ve LEI LOU

Takasbank;

- ulusal numaralandırma kuruluşu olarak ISIN ve ilişkili CFI/FISN tanımlayıcılarını,
- GLEIF tarafından akredite Local Operating Unit olarak LEI kayıtlarını

yönetir. Bu iki rol, `finansal araç` ve `tüzel taraf` ana verilerinde kurum içi anahtarların yanında resmî tanımlayıcıların da tarihçeli tutulmasını gerektirir.

### Saklama rolü ve MKK sınırı

Takasbank belirli alanlarda saklama, fon payı izleme ve kurumsal aksiyon hizmeti verir. Ancak kaydileştirilmiş sermaye piyasası araçlarının merkezi saklama kuruluşu **MKK'dır**. MKK kayıtları ile Takasbank'ın takas havuzu, hesap, yükümlülük ve hareket kayıtları aynı varlık değildir; mutabakatla bağlanır.

## İş alanları

### 1. İşlem, takas ve MKT

Temel süreç zinciri:

1. işlem veya sözleşmenin kabulü,
2. gerekiyorsa MKT'nin araya girmesi ve yeni bacakların oluşması,
3. pozisyon ve risk hesaplama,
4. brüt yükümlülüklerin netleştirilmesi,
5. nakit ve/veya kıymet talimatlarının oluşması,
6. DvP, PvP veya piyasa kuralına uygun mutabakat,
7. kısmi gerçekleşme, başarısızlık veya temerrüt yönetimi.

Piyasa davranışı tek tip değildir:

- Borçlanma araçlarında aynı gün (`T+0`), en az `T+1` veya değer tarihli mutabakat görülebilir.
- Swap işlemlerinde anapara akışları PvP, günlük değişim teminatı ve fonlama akışları ayrı süreçlerdir.
- Pay Piyasası kamuya açık mevcut prosedüründe `T+2` bulunurken Borsa İstanbul Grubu, `T+1` hazırlıklarının 31 Aralık 2026'ya kadar tamamlanmasını istemiştir.

Bu nedenle işlem tarihi, takas günü, değer tarihi ve gerçekleşme tarihi ayrı kavramlardır.

### 2. Takasbank'ın işlettiği piyasalar ve platformlar

- **Takasbank Para Piyasası:** Üyelerin TL arz ve taleplerinin eşleştiği organize piyasa. Takasbank kotasyon vermez veya taraf olarak işlem yapmaz; prosedürdeki yükümlülükleri garanti eder.
- **Ödünç Pay Piyasası:** Pay ve borsa yatırım fonu katılma paylarının teminat karşılığında ödünç alınıp verildiği, Takasbank'ın MKT olduğu piyasa.
- **TEFAS:** Yatırım fonu katılma paylarının dağıtım kuruluşları üzerinden alım-satımını; takas, mutabakat ve saklamayı otomatik ve MKK ile entegre yürüten platform.
- **BEFAS:** Emeklilik fonlarının işlem gördüğü platform. Teminat değerleme ve uygulama kuralları geçerlilik tarihli değişir.

`piyasa`, `platform işletmecisi`, `hizmet sağlayıcı` ve `MKT rolü` tek bir alan altında birleştirilmemelidir.

### 3. Enerji, emtia ve kıymetli madenler

Takasbank; EPİAŞ elektrik, doğal gaz, vadeli enerji ve yenilenebilir enerji kaynak garanti piyasalarında ağırlıklı olarak nakit uzlaştırma ve teminat yönetimi sağlar. Tipik olaylar; avans/fatura borcu, alacak, nakit ödeme, teminat yatırma-çekme, değerleme, teminat tamamlama çağrısı, faiz tahakkuku ve temerrüt bedelidir.

TÜRİB Elektronik Ürün Senedi piyasasında 13 Ocak 2025'te devreye alınan yapıyla işlem takası, risk, teminat ve temerrüt yönetimi kapsamı genişlemiştir. Kıymetli Madenler Piyasasında merkezi takas ve ilgili saklama/teminat akışları bulunur.

Enerji miktarı, emtia miktarı, kıymet adedi ve para tutarı aynı ölçü birimiyle modellenmez; `ölçü birimi` kurumsal referans veridir.

### 4. Saklama, fonlar ve kurumsal aksiyonlar

- Belirli kıymetlerin fiziksel saklaması,
- borçlanma araçlarında itfa ve kupon/kira sertifikası ödemeleri,
- paylarda temettü ve sermaye işlemleri,
- kolektif yatırım kuruluşlarının varlık ve değerleme kontrolleri,
- bireysel emeklilik fon paylarının katılımcı bazında, devlet katkısı ve diğer paylardan ayrıştırılmış izlenmesi

bu alanın başlıca süreçleridir.

Fon değerleme sürecinde işletmeci bildirimiyle bağımsız hesaplanan değer karşılaştırılabilir; fark ve uyum sonucu ayrı olaydır. Katılımcı, fon, emeklilik şirketi, kurucu, işletmeci ve dağıtıcı aynı `müşteri` tipi değildir.

### 5. Ödeme, transfer, çek ve bankacılık hizmetleri

- TL ödemeleri TETS ve TCMB EFT/EST/RPS altyapılarıyla,
- döviz ödemeleri SWIFT ve muhabir banka hesaplarıyla,
- piyasa kaynaklı borç/alacaklar Takasbank nezdindeki üye hesaplarıyla

yürütülebilir.

Çek Takas Sistemi; ibraz, iade, netleştirme, teminat ve mutabakat yaşam döngüsüne sahiptir. Nakit kredi, nakit teminat faizi ve üye cari hesapları da işlem sonrası süreçlerle ilişkilendirilebilen, fakat ayrı grain gerektiren bankacılık olaylarıdır.

### 6. Kamusal teminat ve koşullu ödeme altyapıları

- **Kamusal Teminat Yönetim Platformu:** Elektronik teminat mektubu/kefalet senedi kabul, iade, süre uzatma, gelir kaydetme ve raporlama süreçleri.
- **Kitle fonlaması escrow hizmeti:** Fonların şart gerçekleşene kadar bloke edilmesi, serbest bırakılması veya iadesi.
- **TaşıtTakas/TapuTakas benzeri koşullu ödeme hizmetleri:** Ödeme ile mülkiyet devri kilometre taşlarının ilişkilendirilmesi.
- **BiGA ve Altın Transfer Sistemi:** Dijital birim, transfer, itfa, sistem bakiyesi ve fiziksel altın karşılığının sürekli mutabakatı.

Bu süreçler MKT işlem fact'lerine eklenmez; ortak taraf, hesap, para birimi, zaman ve teslimat durumu sözleşmelerini paylaşan ayrı veri ürünleridir.

### 7. Düzenleyici veri ve tanımlayıcılar

Türev bildirimleri, kaldıraçlı işlem kayıtları, ISIN/CFI/FISN ve LEI yaşam döngüsü; kurumun altyapı rollerinin parçasıdır. Bildirim verisinde:

- ilk bildirilen hâl,
- düzeltme/iptal sürümü,
- kabul/red cevabı,
- bildirim zamanı,
- kural ve şema sürümü

değişmez denetim iziyle tutulmalıdır.

## Kurumsal temel varlıklar

### Taraf, rol ve üyelik

- **Taraf:** Tüzel kişi, gerçek kişi veya kurum.
- **Rol:** Üye, MKT üyesi, piyasa katılımcısı, yatırımcı, ihraççı, fon kurucusu, dağıtıcı, emeklilik şirketi, enerji katılımcısı, muhabir banka gibi bağlama bağlı kimlik.
- **Üyelik:** Tarafın belirli piyasa/hizmette belirli tarih aralığındaki yetkisi; doğrudan/genel MKT üyeliği gibi alt türleri olabilir.

Birden çok kaynak anahtarı `party_xref` ile tek kurumsal tarafa bağlanır. LEI güçlü bir tanımlayıcıdır ama her taraf için mevcut değildir ve tek başına eşleme stratejisi olamaz.

### Hesap

Hesabın sahibi ve rolü zamanla değişebilir. Portföy/müşteri, serbest/bloke, nakit/kıymet, takas, saklama, teminat ve garanti fonu hesap rolleri ayrı tutulur. Kaynak hesap numarası kurumsal hesabın kendisi değil, kaynak kimliğidir.

### Piyasa, platform ve hizmet

- **Piyasa/işlem yeri:** İşlemin ekonomik bağlamı.
- **Platform:** İşlemin veya hizmetin işletildiği altyapı.
- **Hizmet kabiliyeti:** Takas, MKT, risk, teminat, saklama, ödeme gibi sunulan işlev.
- **Piyasa-hizmet ataması:** Başlangıç/bitiş tarihi ve düzenleyici dayanakla versiyonlanan ilişki.

### Finansal araç, sözleşme, fon ve teminat varlığı

Finansal araç; ISIN/CFI/FISN, ihraççı, varlık sınıfı, para birimi ve dayanakla tanımlanır. Türev sözleşme, fon, emtia, enerji ürünü ve teminat varlığı ortak referans çatısını paylaşabilir ancak aynı alt tip değildir.

### İşlem, pozisyon ve netleştirme

- **İşlem/sözleşme:** Gerçekleşen ekonomik anlaşma.
- **MKT bacağı:** MKT sonrası oluşan yasal bacak.
- **Pozisyon:** Hesap/üye/araç bazında belirli zamandaki açık ekonomik durum.
- **Netleştirme grubu ve sürümü:** Hangi brüt kalemlerin hangi kuralla net yükümlülüğe dönüştüğünü açıklar.

### Yükümlülük, talimat ve hareket

- **Yükümlülük:** Tarafın belirli tarih ve varlıkta teslim etmesi gereken borç/alacak.
- **Talimat:** Mutabakat sistemine gönderilen emir.
- **Hareket:** Nakit veya kıymetin fiilî transfer olayı.
- **Bağlı bacak grubu:** DvP/PvP bacaklarını birlikte izler.

Yükümlülük ile hareket birleştirilmez; bir yükümlülük birden çok kısmi hareketle kapanabilir.

### Risk, teminat ve temerrüt

Risk maruziyeti, limit, başlangıç/değişim teminatı, stres kaybı, teminat tamamlama çağrısı, teminat lotu/hareketi/değerlemesi, iskonto oranı, garanti fonu katkısı ve temerrüt kaynağı ayrı varlık ve olaylardır. Kural, fiyat kaynağı ve katsayı sürümü hesap sonucuyla birlikte saklanır.

### Saklama, bakiye ve kurumsal aksiyon

Bakiye belirli bir anın durumudur; hareket olaydır. Kurumsal aksiyon, hak sahipliği ve ödeme ayrı grain'lerdir. Takasbank iç kaydı ile MKK/TCMB/muhabir banka dış kaydı mutabakat çifti olarak ilişkilendirilir.

## DWH konu alanları

Kurumsal veri ürünleri piyasa veya UG organizasyonuna göre değil, tekrar kullanılabilir iş kabiliyetine göre ayrılmalıdır. Buradaki amaç şu:

Her piyasa veya UG ekibi için ayrı ve bağımsız üye, hesap, teminat, ödeme modeli kurulmamalı. Çünkü bu kavramlar birçok piyasada ortaktır.

Örneğin Pay Piyasası ve Borçlanma Araçları Piyasası:

Ortak party/üye modelini kullanır.
Ortak ödeme ve mutabakat kavramlarını paylaşır.
Fakat piyasalara özel kuralları ve raporları ayrı veri ürünlerinde sunabilir.
Yani:

Kurumsal core: iş kabiliyetlerine göre düzenlenir (üyelik, takas, ödeme, teminat).
Mart/veri ürünü: belirli piyasa veya rapor ihtiyacına özel olabilir.

İş kabiliyetleri:

1. taraf, üyelik ve hesap,
2. referans veri, piyasa ve hizmet,
3. işlem, sözleşme ve pozisyon,
4. takas, netleştirme ve mutabakat,
5. ödeme ve kıymet hareketi,
6. MKT risk, teminat, garanti fonu ve temerrüt,
7. saklama ve kurumsal aksiyon,
8. fon ve emeklilik,
9. enerji, emtia ve kıymetli madenler,
10. çek, kredi ve diğer bankacılık olayları,
11. escrow ve koşullu ödeme,
12. düzenleyici bildirim ve numaralandırma,
13. ücret, komisyon ve finansal mutabakat.

Kurum içi kaynak sistemlerinin bu alanlara eşlemesi henüz doğrulanmadı: [[Aktif Sorular]].

## Resmî kaynaklar

- [Takasbank 1 Ocak–31 Mart 2026 Ara Dönem Faaliyet Raporu](https://www.takasbank.com.tr/documents/faaliyet-rapor/takasbank_march_2026_unconsolidated-interim-annual-report.pdf)
- [Takasbank yıllık raporlar dizini](https://www.takasbank.com.tr/en/about-us/investor-relations/annual-reports)
- [Central Counterparty (CCP)](https://www.takasbank.com.tr/en/services/services-provided/central-counterparty-ccp)
- [Takasbank kilometre taşları](https://www.takasbank.com.tr/en/about-us/introduction/milestones)
- [Borçlanma Araçları Piyasası](https://www.takasbank.com.tr/en/services/markets-to-which-services-are-provided/debt-securities-market/brief-information)
- [Swap Piyasası](https://www.takasbank.com.tr/en/services/markets-to-which-services-are-provided/swap-market/brief-information)
- [Tezgâh Üstü Türevler](https://www.takasbank.com.tr/en/services/markets-to-which-services-are-provided/otc-derivatives/brief-information)
- [Takasbank Para Piyasası](https://www.takasbank.com.tr/en/services/markets-operated/takasbank-money-market/brief-information)
- [Ödünç Pay Piyasası](https://www.takasbank.com.tr/en/services/markets-operated/securities-lending-market/brief-information)
- [TEFAS](https://www.takasbank.com.tr/en/services/markets-operated/turkiye-electronic-fund-trading-platform/brief-information)
- [BEFAS duyuruları](https://www.takasbank.com.tr/en/services/markets-operated/pension-fund-trading-platform/general-letters)
- [Elektrik Piyasası](https://www.takasbank.com.tr/en/services/markets-to-which-services-are-provided/electricity-market/brief-information)
- [Organize Doğal Gaz Piyasası](https://www.takasbank.com.tr/en/services/markets-to-which-services-are-provided/organized-natural-gas-market/brief-information)
- [TÜRİB Elektronik Ürün Senedi Piyasası](https://www.takasbank.com.tr/en/services/markets-to-which-services-are-provided/electronic-warehouse-receipt-ewr/brief-information)
- [Saklama](https://www.takasbank.com.tr/en/services/services-provided/custody/brief-information)
- [Fiziksel saklama ve MKK sınırı](https://www.takasbank.com.tr/en/services/services-provided/custody/physical-custody)
- [Bireysel Emeklilik Fon Sistemi](https://www.takasbank.com.tr/en/services/services-provided/private-pension-fund-system/brief-information)
- [Fon Değerleme ve Raporlama](https://www.takasbank.com.tr/en/services/services-provided-1/fund-valuation-and-reporting)
- [Pay kurumsal aksiyonları](https://www.takasbank.com.tr/en/services/services-provided/custody/share-certificates-exercise-of-corporate-action-rights)
- [Borçlanma aracı kurumsal aksiyonları](https://www.takasbank.com.tr/en/services/services-provided/custody/exercise-of-debt-securities-corporate-action-rights)
- [TL ödeme ve transfer](https://www.takasbank.com.tr/en/services/services-provided-1/trlfx-payment-and-transfer/trl-payment-and-transfer)
- [Döviz ödeme ve transfer](https://www.takasbank.com.tr/en/services/services-provided-1/trlfx-payment-and-transfer/fx-payment-and-transfer)
- [Takasbank Çek Takas Sistemi](https://www.takasbank.com.tr/en/services/services-provided-1/takasbank-cheque-clearing-system)
- [Nakit kredi](https://www.takasbank.com.tr/en/services/services-provided/cash-credit/brief-information)
- [Kamusal Teminat Yönetimi](https://www.takasbank.com.tr/en/services/services-provided/public-collateral-management-service/brief-information)
- [Kitle Fonlaması Emanet Yetkilisi](https://www.takasbank.com.tr/en/services/services-provided/crowdfunding-escrow-agent-service)
- [TaşıtTakas](https://www.takasbank.com.tr/en/services/services-provided-1/tasittakas-service)
- [TapuTakas](https://www.takasbank.com.tr/en/services/services-provided-1/taputakas-service)
- [BiGA Transfer Altyapısı](https://www.takasbank.com.tr/en/services/services-provided/biga-transfer-infrastructure)
- [ISIN](https://www.takasbank.com.tr/en/services/services-provided-1/numbering/isin-international-securities-identification-number)
- [LEI](https://www.takasbank.com.tr/en/services/services-provided-1/numbering/lei-legal-entity-identifier)
- [TCMB — Takasbank ödeme ve menkul kıymet mutabakat sistemleri](https://www.tcmb.gov.tr/wps/wcm/connect/TR/TCMB+TR/Main+Menu/Temel+Faaliyetler/Odeme+Sistemleri/Turkiyedeki+Odeme+Sistemleri/Istanbul+Takas+ve+Saklama+Bankasi+A.S.+%28TAKASBANK%29)
- [MKK transfer hizmetleri](https://www.mkk.com.tr/en/depository-services/transfer-services)
- [Borsa İstanbul T+1 geçiş hazırlığı duyurusu](https://www.borsaistanbul.com/files/duyuru-38907-TR.pdf)

İlgili notlar: [[DWH]] · [[DWH Hedef Mimarisi v2]] · [[Aktif Sorular]]
