---
title: ETL Araç Değerlendirmesi
aliases: [ETL Araç Değerlendirmesi]
created: 2026-09-28
updated: 2026-10-12
status: proposed-evaluation-framework
tags: [dwh, etl, procurement, architecture]
---

# ETL Araç Değerlendirmesi

Bankanın kurum içi veri ambarı ve operasyonel raporlaması için beş çözümü aynı gereksinimler üzerinden karşılaştırıyoruz. Değerlendirme; ürünün yanında gerekli bileşenleri, ekibi, desteği ve toplam maliyeti kapsar.

**[Türkçe değerlendirme matrisini aç](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Arac-Degerlendirme.xlsx).**

## Kararlaştırılan yapı

Karşılaştırma ayrıntılı, puanlama bölüm düzeyinde tutulur. Excel üç sekmeden oluşur:

- **Puanlama:** sekiz ölçüt, ağırlıklar, beş adayın puanları, zorunlu koşullar ve otomatik sonuç.
- **Karşılaştırma:** on bölümde beş çözüm yan yana. Her bölümde yaklaşım, ek bileşen/sınır, banka açısından sonuç ve istenecek kanıt/test anlatılır.
- **Kaynaklar:** resmî belge bağlantıları, sürüm ve erişim sınırlamaları ile kurum içi dayanaklar.

Kullanıcıyla kararlaştırılan bölümler:

1. **Çözüm kapsamı ve mimari:** ürün, sürüm, bileşenler, işlem yeri ve sorumluluk sınırları. Puan dışı.
2. **Zorunlu koşullar:** kurum içi çalışma, desteklenebilir/güvenli işletim ve kabul edilen veri teslimi. Geçer/kalır; puan dışı.
3. **Kaynak entegrasyonu ve veri hareketi:** ilk yük, değişiklik yakalama, silmeler, dosyalar/API ve kaynak koruması.
4. **Dönüşüm ve Exadata verimliliği:** SQL/motor yürütme, veri hareketi, toplam süre ve kaynak rekabeti.
5. **Veri doğruluğu, tarihçe ve mutabakat:** geç düzeltme, mükerrerlik, iş tarihi, tutar ve kontrollü yeniden yayın.
6. **Zamanlama, operasyonel raporlar ve kurtarma:** iş takvimi, hazır sinyali, teslim süresi, restart ve felaket kurtarma.
7. **Güvenlik, metaveri ve denetlenebilirlik:** erişim, sırlar, hassas veri, denetim ve kaynaktan rapora iz.
8. **Geliştirme, test ve değişiklik yönetimi:** review, Git, otomatik test, ortam geçişi ve geri dönüş.
9. **İşletim modeli, destek ve yaşam döngüsü:** ekip, nöbet, olay sahipliği, yama/yükseltme ve devir.
10. **Beş yıllık maliyet ve çıkış eforu:** aynı kapsamda maliyet ve başka çözüme geçiş bağımlılıkları.

03–10 numaralı bölümler ağırlıklı puanlanır. Ağırlıklar ilk 12 ölçütün yeniden gruplanmasıyla türetildi; toplam %100. Önceki sade sürümde birlikte tutulan geliştirme/destek ve kurtarma/işletim başlıkları ayrıldı. Güncel ağırlıklar ve eski ölçütlerle eşleştirme Excel’de yer alır; henüz kurul onayı değildir.

Bir bölümün güçlü alt özelliği kritik eksiğini gizlememeli. Asgari kabul koşulları ikinci bölümde ele alınır. Sekizinci bölüm değişiklik yapmanın niteliğini, dokuzuncu bölüm hizmeti sürdürecek ekibi ve desteği ölçer. Altıncı bölüm kurtarma/teslim kabiliyetini, onuncu bölüm bunun maliyetini ölçer; aynı bulguya farklı başlıklarda aynı gerekçeyle tekrar puan vermeyin.

Ağırlık ve puanların güncel kaydı Excel’dir. Bu not yöntemi açıklar. [Önceki ayrıntılı İngilizce Excel](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Evaluation.xlsx) referans ve ayrıntılı maliyet/test şablonu olarak korunmuştur. İki dosya otomatik eşitlenmez; güncel özet değerlendirmeyi Türkçe dosyada yürütün.

## Nasıl kullanılır?

1. **Kapsamı sabitleyin.** Aynı kaynaklar, veri, iş kuralları, teslim süresi ve hedef çıktı ile karşılaştırın. Bu çalışma, ana veri ambarı/hedefin Oracle Exadata olarak kaldığı varsayımını kullanır. Başka hedef mimarisi ayrı karardır.
2. **Ağırlıkları testten önce onaylayın.** Sarı ağırlık hücreleri değiştirilebilir. Toplam 100 olmalı; tüm adaylar aynı ağırlıklarla değerlendirilmelidir.
3. **Her ölçüte 0–5 puan girin.** Boş hücre değerlendirilmedi demektir. Fiyat veya test sonucu bilinmiyorsa tahmini puanla doldurmayın.
4. **Dayanak kaydını ekleyin.** Her araç için sekiz puanın gerekçesini, ilgili test sonuçlarını ve karşılaştırılabilir maliyet hesabını içeren tek bir değerlendirme kaydı kullanın. Dosya adı, kayıt numarası veya kurum içi bağlantısını Excel’e girin.
5. **Zorunlu koşulları sonuçlandırın.** Her grup için “Bekliyor”, “Uygun” veya “Uygun değil” seçin. Onay kaydı, ilgili kişiler ve tarihleri içersin.
6. **Uygun adayların sonuçlarını karşılaştırın.** Ağırlıklarda makul değişiklikler yapıldığında tercih değişiyor mu inceleyin; kararı ve gerekçeyi kaydedin.

Puan ölçeği:

- **0:** gereksinimi karşılamıyor.
- **1:** ciddi eksikler veya sürdürülemeyen çözümler var.
- **2:** kısmen karşılıyor; önemli manuel iş veya kısıt var.
- **3:** gereksinimi desteklenebilir, tekrar edilebilir şekilde karşılıyor.
- **4:** önceden tanımlanmış, ölçülebilir bir iyileşme sağlıyor.
- **5:** önceden tanımlanmış üstün sonucu temsilî yük ve hata koşullarında kanıtlıyor.

Ondalıklı puan kullanılabilir; gerekçesi kayıtta bulunmalıdır. Maliyet için yüksek puan, aynı kapsamda daha düşük toplam maliyet anlamına gelir. Maliyet bantlarını değerlendirme öncesinde belirleyin.

**Sonuç = Σ(ağırlık × puan) / 5.** Örneğin tüm ölçütler 3 ise sonuç 60/100 olur. Excel, sekiz geçerli puan, toplamı 100 olan geçerli ağırlıklar ve dayanak referansı tamamlanmadan toplamı göstermez. Sıfır, gerçek bir puandır.

“Karşılaştırılabilir” durumu, üç koşul grubunun uygun olması, onay referansı ve puanların tamamlanmasıyla oluşur. Kayıt içeriğini Excel denetlemez; değerlendiriciler inceler. Bu durum satın alma veya üretime geçiş onayı değildir.

## Üç zorunlu koşul grubu

**1. Tamamen kurum içinde çalışma.** Kullanıcının 28.09.2026 tarihinde teyit ettiği şart: çalıştırma, yönetim/kontrol, metaveri ve loglar kurum içinde kalacak. Telemetri, geliştirme araçları, zamanlayıcı, katalog, CI/CD, gizli bilgiler, lisans doğrulama, teşhis, yedek ve felaket kurtarma dahil değerlendirin. Yerel ajanla bulut yönetimine bağlanan çözüm bu şartı sağlamaz.

**2. Güvenlik, destek ve işletim onayı.** Kesin ürün/sürüm/bileşen listesi ve lisanslar, yazılı destek kapsamı, erişim ve denetim kontrolleri, işletim ekibi, sorumlular ve çalışma talimatları kabul edilmiş olmalı. Önceki G02, G06 ve G08 bu gruptadır.

**3. Doğruluk, süre ve kurtarma testleri.** İş mutabakatı, geçmiş düzeltmeler, kaynak yük sınırı, teslim süresi, yeniden çalıştırma, felaket kurtarma ve izlenebilir/kontrollü yayın testleri kabul edilmiş olmalı. Önceki G03, G04, G05 ve G07 bu gruptadır. Başarısız kalite kontrolünde yayının durması da test edilir.

Her grubun **bütün alt koşulları** sağlanmadan “Uygun” seçilmez. Bir alt koşul başarısızsa grup “Uygun değil”; çözülmemişse “Bekliyor” kalır. Yüksek puan, başarısız koşulu telafi etmez.

## Beş adayın kapsamı

- **Informatica:** tamamen yerel PowerCenter teklifi. Bulut yönetimli ürünler kapsam dışıdır. Mevcut Informatica TDM kullanımı PowerCenter veya CDC lisansı bulunduğunu göstermez.
- **ODI:** yerel ajanlar/depolar ve seçilen bilgi modülleri dahil çözüm. Gerekirse CDC ayrıca fiyatlanır; GoldenGate dahil varsayılmaz.
- **dbt + Exadata:** önceki araştırmada belirlenen dbt Core v1 ve dbt-oracle yolu. Veri alımı, zamanlama ve işletim bileşenleri ayrıca tanımlanır. Kesin sürüm uyumu ve destek sorumlusu doğrulanır; farklı dbt dağıtımları ayrıca değerlendirilir.
- **Cloudera:** kesin kurum içi ürün paketi ve servisleri. Dağıtık platformun ek maliyeti ve Oracle hedefe yükleme yolu dahil edilir.
- **Spark:** kurum içi işleme motoru ile gerekli veri alımı, zamanlama, depolama, güvenlik, izleme ve destek bileşenlerinin tamamı.

Araçların ayrıntılı karşılaştırması için ikinci sekmeyi kullanın. “Banka açısından” satırları mimari yorumdur; ek bileşen ve test satırları istenen çözüm/kanıtı tarif eder. Bunlar ölçülmüş ürün sonucu değildir. Ürünlere henüz banka testi, fiyat veya nihai puan atanmamıştır.

## Kanıt kaydı ve bölüm puanı

Her adayın değerlendirme kaydı şu bilgileri içermeli:

- Kesin ürün/sürüm/bileşen listesi ve kullanılan üretim/test/DR kaynakları.
- Bölüm numarası, bankanın gereksinimi ve test öncesinde kabul edilen 3/4/5 puan eşikleri.
- Test veya teklif referansı, gözlenen sonuç, sınırlar, bölüm puanı ve gerekçesi.
- Zorunlu koşulların her alt maddesi için sonuç, onaylayan kişi ve tarih.
- Açık eksikler, giderme planı ve önerilen bileşen değişirse etkilenen test/maliyetler.

Ortak testlerde iş verisi, kaynak erişimi, çıktı tanımı ve teslim hedefi sabit tutulur. Banka ekibinin gerçekleştirdiği değişiklik ve kurtarma tatbikatı da kanıt sayılır. Tedarikçinin sunumu ölçülmüş performans veya banka kabulü yerine geçmez. Eşikler henüz kararlaştırılmamıştır; bu matris bir kazanan ilan etmez.

## Adil karşılaştırma ve sorumluluk

Süre ve maliyet hesabına veri alımı, taşıma, dönüşüm, kontroller ve yayın dahil edilir. Yalnızca dönüşüm süresini karşılaştırmayın. Her adaya eşdeğer uzman ayar süresi tanıyın; üretim, test ve felaket kurtarma kapsamlarını eşitleyin.

Toplam maliyet; başlangıç kurulumu ve sonraki beş yılın lisans, bağlayıcı/CDC, altyapı, personel, destek, güvenlik, eğitim, yükseltme ve çıkış maliyetlerini kapsar. Aynı para birimi ve varsayımlar kullanılmalı. Açık kaynak lisansı toplam hizmet maliyetinin sıfır olduğu anlamına gelmez; mevcut Exadata kapasitesi de sınırsız kabul edilmez.

Mimari ekip kapsamı ve teknik öneriyi, iş/veri sahipleri doğruluğu, kaynak sahipleri ve DBA’ler kaynak etkisini, güvenlik ekibi yerellik ve erişimi, hizmet sahibi işletim/kurtarmayı değerlendirir. Satın alma ve finans teklif/maliyeti doğrular. Yetkili karar mercii seçimi onaylar. Roller için [[DWH Ownership Operating Model]], kurum bağlamı için [[Fiziksel Topoloji - Teknik Taraf]] ve [[PowerDesigner Bilgilendirme]] kullanılır.

## Gerektiğinde ayrıntıya inmek için

Aşağıdaki mevcut İngilizce ekler, test ve satın alma çalışmasında ayrıntı gerektiğinde kullanılabilir. Bu not ve Türkçe Excel, sade değerlendirme akışının güncel tarifidir.

- [[ETL Proof of Concept and Acceptance]] — test senaryoları ve kabul koşulları.
- [[ETL Vendor RFI and Commercial Evaluation]] — tedarikçi soruları ve maliyet kapsamı.
- [[ETL Selection Decision Record]] — karar, gerekçe ve onay kaydı.

Program aksiyonları [[Proje Planı]], kurumsal açık sorular [[Aktif Sorular]] içinde tutulur.

## Kaynaklar ve kontrol

Karşılaştırmanın resmî kaynakları **12.10.2026 tarihinde yeniden incelendi**. PowerCenter’ın bazı sayfaları doğrudan erişimde 403 döndürdüğü için arama dizininden doğrulandı; bu sınırlama kaynak kaydında belirtilir. Eski sürüme ait belgeler ve “latest” bağlantıları teklif edilen sürümün desteği olarak kabul edilmez. Resmî destek matrisi, lisans ve fiyat için yazılı teklif gerekir. Bölüm/aday bazındaki kaynak kodları Excel’in Kaynaklar sekmesine bağlanır. Başlıca bağlantılar:

- [ODI mimarisi](https://docs.oracle.com/en/middleware/fusion-middleware/data-integrator/14.1.2/odiun/overview-oracle-data-integrator.html).
- [PowerCenter Oracle dönüşüm davranışı](https://docs.informatica.com/data-integration/powercenter/10-5-9/advanced-workflow-guide/pushdown-optimization-and-transformations/update-strategy-transformation.html).
- [dbt Oracle kurulumu](https://docs.getdbt.com/docs/local/connect-data-platform/oracle-setup), [Oracle adaptörü](https://github.com/oracle/dbt-oracle).
- [Cloudera kurum içi referans mimarisi](https://docs.cloudera.com/cdp-reference-architectures/latest/cdp-pvc-base-ra/topics/ra-cdpdc-abstract.html).
- [Spark JDBC](https://spark.apache.org/docs/latest/sql-data-sources-jdbc.html).

Excel formülleri beş adayın tamamında; puan/ağırlık değişimi, eksik dayanak/onay, sıfır ve aralık dışı puan ile başarısız zorunlu koşul senaryolarıyla kontrol edildi. Üç sekmenin ve on karşılaştırma bölümünün görünümü incelendi; geçici test girişleri temizlendi. Kontroller dosyayı oluşturan aracın hesaplama motorunda yapıldı; Microsoft Excel uygulamasında çalışma ayrıca test edilmedi.
