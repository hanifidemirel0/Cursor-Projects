---
title: Veri Maskeleme
created: 2026-11-27
section: Toplantı Notları
tags:
  - toplantı
  - dwh
  - maskeleme
  - takasbank
---

# Veri Maskeleme

Friday, 27 November 2026

## Konuşulanlar

Veri envanterinde hassas veri olarak işaretlenen kolonlar prod-kale ortamında zaten maskeli tutuluyor. Bunlar için tekrar maskeleme yapılmaz. Hassas veriler genelde şifreler ve secret değerlerdir.

TC kimlik no gibi bilgiler hassas veri olarak geçmiyor. Bu yüzden kale ortamında maskelenmiyor.

## Alınan kararlar

1. Prod DWH ortamına İZV ekibindeki herkes kendilerine has kullanıcılarla bağlanabilir. Süresiz bağlantı ihtiyacı bu şekilde giderilir.
2. TCKN gibi hassas olarak nitelendirilmeyen, KVKK kapsamında kişisel veri olarak nitelendirilen verilerin maskelenmesi için ekstra bir katman olarak view yöntemi uygulanır. Kişisel veriye erişme ihtiyacı olduğunda farklı bir kullanıcı için günlük erişim talebi açılır.
3. Dev ve Test ortamlarına veri aktarımı TDM üzerinden yapılır. DWH için güncel veri envanteri tutulur. Aktarırken envanter üzerindeki gizlilik seviyesi bilgisi kullanılır.

İlgili notlar: [[Aktif Sorular]] · [[PowerDesigner Bilgilendirme]] · [[Ortamlar hakkında]] · [dwh-veri-maskeleme.pdf](../../../outputs/dwh-veri-maskeleme/dwh-veri-maskeleme.pdf)
