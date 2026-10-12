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

**[Sade Türkçe değerlendirme matrisini aç](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Arac-Degerlendirme.xlsx).**

## Ne sadeleşti?

Excel iki sekmeden oluşur:

- **Puanlama:** yedi ölçüt, ağırlıklar, beş adayın puanları, zorunlu koşullar ve otomatik sonuç.
- **Araç Özeti:** her aracın değerlendirme odağı, ek bileşenleri ve karar öncesinde doğrulanacak noktalar.

Önceki 12 ölçüt, ilişkili başlıklar birleştirilerek yediye indirildi. Birleştirilen ölçütlerin ağırlıkları toplandı; toplam yine %100. Eşleştirme ikinci sekmede görülebilir. Birleşik ölçüt puanı, kapsamındaki bütün ihtiyaçları dikkate almalıdır; örneğin iyi geliştirme deneyimi, yetersiz desteği gizlememelidir.

Ağırlık ve puanların güncel kaydı Excel’dir. Bu not yöntemi açıklar. [Önceki ayrıntılı İngilizce Excel](../../outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Evaluation.xlsx) referans ve ayrıntılı maliyet/test şablonu olarak korunmuştur. İki dosya otomatik eşitlenmez; güncel özet değerlendirmeyi Türkçe dosyada yürütün.

## Nasıl kullanılır?

1. **Kapsamı sabitleyin.** Aynı kaynaklar, veri, iş kuralları, teslim süresi ve hedef çıktı ile karşılaştırın. Bu çalışma, ana veri ambarı/hedefin Oracle Exadata olarak kaldığı varsayımını kullanır. Başka hedef mimarisi ayrı karardır.
2. **Ağırlıkları testten önce onaylayın.** Sarı ağırlık hücreleri değiştirilebilir. Toplam 100 olmalı; tüm adaylar aynı ağırlıklarla değerlendirilmelidir.
3. **Her ölçüte 0–5 puan girin.** Boş hücre değerlendirilmedi demektir. Fiyat veya test sonucu bilinmiyorsa tahmini puanla doldurmayın.
4. **Dayanak kaydını ekleyin.** Her araç için yedi puanın gerekçesini, ilgili test sonuçlarını ve karşılaştırılabilir maliyet hesabını içeren tek bir değerlendirme kaydı kullanın. Dosya adı, kayıt numarası veya kurum içi bağlantısını Excel’e girin.
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

**Sonuç = Σ(ağırlık × puan) / 5.** Örneğin tüm ölçütler 3 ise sonuç 60/100 olur. Excel, yedi geçerli puan, toplamı 100 olan geçerli ağırlıklar ve dayanak referansı tamamlanmadan toplamı göstermez. Sıfır, gerçek bir puandır.

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

Araç özellikleri için ikinci sekmeyi kullanın. Ürünlere henüz banka testi, fiyat veya nihai puan atanmamıştır.

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

Bu sadeleştirme, **28.09.2026 tarihli araştırmayı** kullanır; ürün desteği ve ticari koşullar için yeni bir doğrulama değildir. Önceki araştırmanın resmî kaynakları Excel’de araç adlarının hücre notlarında korunmuştur. Başlıca bağlantılar:

- [ODI mimarisi](https://docs.oracle.com/en/middleware/fusion-middleware/data-integrator/14.1.2/odiun/overview-oracle-data-integrator.html).
- [PowerCenter Oracle dönüşüm davranışı](https://docs.informatica.com/data-integration/powercenter/10-5-9/advanced-workflow-guide/pushdown-optimization-and-transformations/update-strategy-transformation.html).
- [dbt Oracle kurulumu](https://docs.getdbt.com/docs/local/connect-data-platform/oracle-setup), [Oracle adaptörü](https://github.com/oracle/dbt-oracle).
- [Cloudera kurum içi referans mimarisi](https://docs.cloudera.com/cdp-reference-architectures/latest/cdp-pvc-base-ra/topics/ra-cdpdc-abstract.html).
- [Spark JDBC](https://spark.apache.org/docs/latest/sql-data-sources-jdbc.html).

Excel formülleri; puan/ağırlık değişimi, eksik dayanak, sıfır puan ve başarısız zorunlu koşul senaryolarıyla kontrol edildi. İki sekmenin görünümü incelendi; geçici test girişleri temizlendi. Kontroller üretim aracının hesaplama motorunda yapıldı; Microsoft Excel uygulamasında çalışma ayrıca test edilmedi.
