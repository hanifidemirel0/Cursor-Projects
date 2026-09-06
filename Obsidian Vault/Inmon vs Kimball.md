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

Taslak karar (hibrit): [[DWH Mimari Tasarım]]

İlgili notlar: [[DWH]] · [[Aktif Sorular]] · [[Takasbank Genel Bilgilendirme]]
