---
title: Takasbank Genel Bilgilendirme 2
created: 2026-09-06T01:59:00
source: OneNote
notebook: My Notebook
section: Toplantı Notları / Deniz Gür
tags:
  - dwh
  - takasbank
  - toplantı
  - mstr
  - ods
---

# Takasbank Genel Bilgilendirme 2

Sunday, 6 September 2026, 1:59 am

## Kaynak sistem kataloğu

[[PowerDesigner]] üzerinde tutuluyor. ER yok; veri gizliliği bilgisi, açıklama, primary key vb. var. Aytaç toplantısı: [[PowerDesigner Bilgilendirme]]

BT mimari tarafında ilgili kontak: **Aytaç**.

## [[ODS]]

ODS için **tvsods** DB'si oluşturulmuş.

## Ortamlar

- **tvstruva:** Bakımı düzgün yapılan bir test ortamı. Gün sonu işlemleri burada da yapılıyor. Erişim için 1 hafta geçerli şifre alınabiliyor.
- **Preprod:** Her akşam 9:30'da üyelerin bağlantıları kesiliyor, gün sonu süreçleri başlıyor. Snapshot'lar alınıyor ve tarihçelendiriliyor. Ayrıca bazı hesaplamalar yapılıyor ve özet tablolar besleniyor. Bazı komisyon hesaplamaları da sonuçlandırılıyor.
  - Sabah 6 gibi doluyor (tüm gün sonu işlemleri bittikten sonra). Her sabah eziliyor. Erişmek için her gün şifre almak lazım.
- **DSS:** Var. (DWH POC ortamı: [[Fiziksel Topoloji - Teknik Taraf]])

Scheduling için Automic kullanan ekipler var; biz de kullanabiliriz.

## Raporlama ve uygulamalar

Operasyonel kullanıcılar **Team Developer** denen bir uygulama kullanıyor işleri için. Bunun üzerinden raporlanan raporlar var. Bunlar peyderpey web tarafına aktarılıyor; orayı da uygulama geliştirme (UG) ekipleri yönetiyor.

Nihai hedef MSTR'a taşımak. Operasyonel çok fazla rapor var.

Üyeler terminal ekranlarına erişebiliyor; onlara açılan raporlar da var.

Takasbank'ta operasyonel ekipler aslında iş birimleri demektir.

## Pilot

[[DWH]]'e taşımak için pilot proje adayı: üyelere çok fazla dosya göndermeyi gerektiren bir proje var.

## Açık sorular

- Üst yönetime nasıl raporlar veriliyor?
- SPK, MASAK raporları: kritik ve saat bazında SLA var. Birçok farklı piyasadan veriler birleştiriliyor. (Kaynak seçimiyle ilişkili.)
- Hangi raporlar [[Kale]]'den verilmeli, hangileri [[ODS]]'den, hangileri [[DWH]]'den? Tek tek analiz etmek lazım. Öncesinde ilgili UG ve operasyonel ekiplerle görüşmek lazım.
- En çok kullanılan raporlar nasıl çıkartılabilir?

İlgili notlar: [[Takasbank Genel Bilgilendirme]] · [[Aktif Sorular]] · [[Fiziksel Topoloji - Teknik Taraf]] · [[PowerDesigner Bilgilendirme]]
