---
title: Inmon vs Kimball
tags:
  - dwh
  - modelleme
---

# Inmon vs Kimball

[[DWH]] inşa yaklaşımı. [[Aktif Sorular]]: parça parça (öncelik nasıl?) vs topyekün.

Kısaca: **Inmon** önce kurumun tek, entegre ambarını kurar; **Kimball** önce iş biriminin kullanacağı rapor tablolarını kurar.

**Data mart:** tek bir iş konusu veya birim için hazırlanmış, raporlamaya yönelik veri kümesi. [[DWH]]’ın tamamı değil; örneğin bir piyasa veya UG ekibinin tabloları. Inmon’da ambarın üzerine çıkar; Kimball’da ambar bu mart’ların birleşimidir.

**Domain ile aynı değil.** Domain iş sınırı / sahiplik (bu konu kimin, anlamı kim tanımlıyor — ör. hisse piyasası, UG ekibi). Data mart teslimat: o konu için rapor tabloları. Pratikte sık örtüşürler (bir piyasa → bir mart), ama birebir değil: bir domain’de birden fazla mart olabilir (farklı grain: takas vs risk); bir mart iki domain’in `üye` tanımını karıştırmamalı.

## Inmon (yukarıdan aşağı)

Bill Inmon’un yaklaşımı. Önce **kurumsal veri ambarı** (EDW) kurulur.

Kaynak sistemlerden gelen veri burada **normalize** edilir (aynı kavram tek yerde, tekrar yok). Amaç: kurumun tek, tutarlı gerçeği.

Raporlama için ayrı **data mart**’lar bu ambarın üzerine, ihtiyaç oldukça çıkarılır. Analist star schema görür; asıl depo 3NF’dir.

Teslimat daha geç başlar: önce entegrasyon, sonra mart. Karşılığında bir kavram (ör. üye) her yerde aynı tanımı taşır.

Takasbank sorusuna denk gelen taraf: **topyekün** — önce bütün resmi oturt, sonra parçaları üret.

## Kimball (aşağıdan yukarı)

Ralph Kimball’un yaklaşımı. Önce **iş konusu / rapor ihtiyacı** seçilir; onun **star schema**’sı kurulur (fact + dimension).

Her mart kendi başına işe yarar. Mart’lar **conformed dimension** ile bağlanır (aynı `üye`, `tarih`, `piyasa` her mart’ta aynı anahtar ve anlam). Ambar, bu mart’ların birleşimidir.

İlk rapor daha çabuk çıkar. Disiplin bozulursa mart’lar birbirinden kopuk silo olur.

Takasbank sorusuna denk gelen taraf: **parça parça** — önce öncelikli mart, sonra diğerleri; tutarlılık dimension sözleşmesine bağlıdır.

## Takasbank hedef kararı

**İteratif kurumsal core + Kimball veri ürünleri:** [[DWH Hedef Mimarisi v2]].

- Inmon tarafı: taraf/rol/üyelik, hesap, piyasa-hizmet ve olay ilişkileri bitemporal kurumsal core'da bir kez çözülür.
- Kimball tarafı: her öncelikli iş sonucu grain'i açık mart/veri ürünü olarak dikey teslim edilir.
- Topyekûn enterprise model beklenmez; core seçilen veri ürünü geldikçe büyür.
- İlk taslak ve kararın evrimi: [[DWH Mimari Tasarım]].

### Tam Inmon ve tam Kimball'dan farkı

**Tam Inmon akışı:**

```text
Bütün kaynaklar → Kurumsal normalize EDW → Data martlar → Raporlar
```

Önce kurum genelindeki taraf, hesap, işlem, piyasa, teminat gibi kavramların tamamı modellenir. Ardından raporlama martları oluşturulur.
Takasbank örneğinde:

1. Bütün piyasalar incelenir.
2. Kurum çapında party, account, instrument, trade, settlement modeli tamamlanır.
3. Tüm kaynaklar bu modele bağlanır.
4. En son Fon Bilgilendirme veya SPK martı oluşturulur.
Avantajı yüksek kurumsal tutarlılıktır. Dezavantajı, ilk kullanılabilir raporun çok geç çıkabilmesidir.

**Tam Kimball akışı:**

```text
Kaynaklar → Öncelikli dimensional martlar → Raporlar
```

Önce iş değeri yüksek bir süreç seçilir ve doğrudan yıldız şeması kurulur. Kurumsal bütünlük, conformed dimension’lar üzerinden sağlanır.

Örneğin:

1. Fon Bilgilendirme seçilir.
2. fact_fon_bildirimi, dim_fon, dim_uye, dim_tarih oluşturulur.
3. MSTR, CSV ve webservis yayına alınır.
4. Sonraki projelerde aynı dimension’lar tekrar kullanılır.

Burada ayrı bir normalize kurumsal core bulunmaz. DWH, uyumlu martların toplamıdır.

İlk sonuç hızlı çıkar. Fakat disiplin bozulursa her piyasanın farklı üye, hesap veya fon tanımı oluşabilir.
**Takasbank için önerilen akış:**

```text
Kaynak → Landing → Gerekli kurumsal core dilimi → Mart/veri ürünü
```

- Inmon gibi bağımsız ve tarihçeli bir kurumsal core vardır.
- Core'un tamamı baştan kurulmaz; seçilen veri ürününün ihtiyaç duyduğu kapsam geliştirilir.
- Kimball gibi öncelikli iş sonucu aynı dikey dilimde mart ve yayın katmanına kadar tamamlanır.
- Sonraki projede core yeniden kurulmaz; mevcut taraf, rol, üyelik, hesap ve piyasa sözleşmeleri genişletilir.

Örneğin Fon Bilgilendirme pilotunda yalnızca gereken `party`, `membership`, `fund`, `account` ve bildirim olayları core'da modellenir; fon martı, CSV ve webservis aynı dilimde teslim edilir. Böylece ne çıktı üretmeden bütün EDW'ın tamamlanması beklenir ne de doğrudan kaynaktan beslenen bağımsız mart siloları oluşturulur.

Temel fark
Inmon: Önce kurumsal modelin büyük bölümünü tamamla, sonra değer üret.
Kimball: Doğrudan mart üret; kurumsal uyumu conformed dimension’larla sağla.
Önerilen: İş sonucunu hemen seç, fakat martın altında ihtiyaç kadar kurumsal ve tarihçeli core oluştur.
Böylece ne uzun süre çıktı üretmeyen topyekûn EDW projesine ne de birbirinden kopuk martlara dönüşen hızlı raporlama projelerine saplanılmış olur.

İlgili notlar: [[DWH]] · [[DWH Hedef Mimarisi v2]] · [[Aktif Sorular]] · [[Takasbank Genel Bilgilendirme]]
