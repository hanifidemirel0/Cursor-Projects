---
title: DWH Oracle POC Yetkileri
created: 2026-09-11T06:31:00
section: Kendi Notlarım
tags:
  - dwh
  - oracle
  - yetki
  - poc
---

# DWH Oracle POC Yetkileri

POC için [[DWH]] Oracle kullanıcısının yetki isteği. Ortam ve makine gerçekleri [[Fiziksel Topoloji - Teknik Taraf]], katman sözleşmesi [[DWH Hedef Mimarisi v2]], faz kapsamı [[Proje Planı]] notlarındadır.

> [!info] Kime gider
> DBA'ya gönderilecek paket: hedef DB'de **kendi şemasında nesne kurup yükleyebilen** bir uygulama kullanıcısı + Kale **replikasından salt okuma**. `DBA`, `RESOURCE`, `SELECT ANY TABLE` ve prod [[Kale]] yazma/okuma **istenmez**.

## Kullanıcının işi

POC, SUR Exadata üzerindeki DWH veritabanında dikey bir dilim kurar: `CTL_*`, `LND_<kaynak>`, ince `CORE_*` / `DM_*` tabloları, PL/SQL yükleme ve mutabakat. Yazma yalnızca kendi şemasına. Kaynak okuma prod Kale değil, SUR üstündeki Kale replikasından ([[DWH Hedef Mimarisi v2]]).

**DSS bu kullanıcının yazma hedefi değildir.** DSS prod eşleniği, read-only senkron; DSS'de test yapılmıyor ([[Fiziksel Topoloji - Teknik Taraf]]).

Tek şema yeter (`DWH_POC` placeholder). Katman şemaları (`CTL`, `LND_KALE`, `CORE`, `DM_…`) üretim modelidir; POC'de ayrı şema istenmez.

## İstenmeyen yetkiler

Bunlar bilinçli olarak listede yok:

- `DBA`, `SYSDBA`, `SYSOPER`, `DATAPUMP_IMP_FULL_DATABASE`, `EXP_FULL_DATABASE`
- `RESOURCE` (modern Oracle'da `UNLIMITED TABLESPACE` taşır)
- `UNLIMITED TABLESPACE` — yerine **tek tablespace kotası**
- `SELECT ANY TABLE`, `INSERT ANY TABLE`, `UPDATE ANY TABLE`, `DROP ANY TABLE`, `GRANT ANY PRIVILEGE`, `GRANT ANY OBJECT PRIVILEGE`
- Prod [[Kale]] üzerinde herhangi bir nesne yetkisi
- `CREATE USER`, `ALTER USER`, `CREATE TABLESPACE`, `ALTER SYSTEM`
- `CREATE DATABASE LINK` — link'i DBA açar, sabit hedefe
- `UTL_HTTP` / `UTL_TCP` / `UTL_SMTP`
- `EXEMPT ACCESS POLICY`, `BECOME USER`
- GoldenGate / Data Guard yönetimi

## 1. Hedef: DWH (SUR) — şema sahibi

DBA'nın oluşturacağı rol + kullanıcı. İsimler DBA konvansiyonuna uyar; buradaki `DWH_POC` / `DWH_POC_OWNER` / `DWH_POC_DATA` placeholder.

```sql
-- DBA çalıştırır. Tablespace adı mevcut DWH non-prod TS'ine bağlanır.
CREATE TABLESPACE dwh_poc_data DATAFILE SIZE 8G AUTOEXTEND ON NEXT 1G MAXSIZE 100G;

CREATE ROLE dwh_poc_owner;

GRANT CREATE SESSION          TO dwh_poc_owner;
GRANT ALTER SESSION           TO dwh_poc_owner;  -- parallel DML, NLS, enable parallel
GRANT CREATE TABLE            TO dwh_poc_owner;
GRANT CREATE VIEW             TO dwh_poc_owner;
GRANT CREATE SEQUENCE         TO dwh_poc_owner;
GRANT CREATE PROCEDURE        TO dwh_poc_owner;  -- package / function / procedure
GRANT CREATE TRIGGER          TO dwh_poc_owner;
GRANT CREATE TYPE             TO dwh_poc_owner;
GRANT CREATE SYNONYM          TO dwh_poc_owner;
GRANT CREATE MATERIALIZED VIEW TO dwh_poc_owner;
GRANT QUERY REWRITE           TO dwh_poc_owner;

-- Automic hazır değilse geçici; Automic gelince CREATE JOB geri alınır
GRANT CREATE JOB              TO dwh_poc_owner;

CREATE USER dwh_poc IDENTIFIED BY "<DBA-sets>"
  DEFAULT TABLESPACE dwh_poc_data
  TEMPORARY TABLESPACE temp
  PROFILE <existing_nonprod_app_profile>
  ACCOUNT UNLOCK;

ALTER USER dwh_poc QUOTA UNLIMITED ON dwh_poc_data;
GRANT dwh_poc_owner TO dwh_poc;
ALTER USER dwh_poc DEFAULT ROLE dwh_poc_owner;
```

`CREATE TABLE` kendi şemasında indeks, partition, HCC ve constraint için yeter. Ayrı `CREATE INDEX` sistem yetkisi yok.

`CREATE JOB` yalnızca Automic hesabı henüz yoksa. Hedef: job'lar Automic'te, DB kullanıcısı `CREATE JOB` taşımaz ([[Fiziksel Topoloji - Teknik Taraf]]).

### Paketler (PUBLIC'ten alınmış olabilir)

Bankalarda PUBLIC'ten düşürülmüş olanlar için ayrıca:

```sql
GRANT EXECUTE ON SYS.DBMS_STATS    TO dwh_poc_owner;
GRANT EXECUTE ON SYS.DBMS_METADATA TO dwh_poc_owner;
GRANT EXECUTE ON SYS.DBMS_MVIEW    TO dwh_poc_owner;
GRANT EXECUTE ON SYS.DBMS_CRYPTO   TO dwh_poc_owner;  -- kayit_hash
GRANT EXECUTE ON SYS.DBMS_LOCK     TO dwh_poc_owner;
GRANT EXECUTE ON SYS.DBMS_SCHEDULER TO dwh_poc_owner; -- CREATE JOB ile birlikte
```

`SELECT_CATALOG_ROLE` istenmez; `USER_*` / `ALL_*` yeterli.

## 2. Kaynak: Kale replikası — salt okuma

Ayrı, zayıf hesap. Prod Kale'ye bağlanmaz. Hedef: SUR üstündeki Kale replikası. İlk şema adayları: `BANKA`, `HAREKET`, `KURGUN`, `DOVIZ`, `SAKLAMA` ([[Aktarım #1]]). Tablo listesi envanter bitene kadar şema `SELECT` yerine **isimlendirilmiş tablo `SELECT`** tercih edilir.

```sql
CREATE ROLE dwh_poc_src_read;
GRANT CREATE SESSION TO dwh_poc_src_read;

-- Örnek; gerçek nesneler PowerDesigner / UG envanterinden gelir
-- GRANT SELECT ON banka.<tablo> TO dwh_poc_src_read;
-- AS OF SCN / flashback okuma kullanılacaksa aynı tablolara:
-- GRANT FLASHBACK ON banka.<tablo> TO dwh_poc_src_read;

CREATE USER dwh_poc_src IDENTIFIED BY "<DBA-sets>"
  PROFILE <existing_nonprod_readonly_profile>
  ACCOUNT UNLOCK;

GRANT dwh_poc_src_read TO dwh_poc_src;
```

Kaynak kullanıcıda `INSERT` / `UPDATE` / `DELETE` / `CREATE TABLE` yok.

### DB link (DBA açar)

POC kullanıcısına `CREATE DATABASE LINK` verilmez. DBA, DWH'dan Kale replikasına **private** link açar; remote user `dwh_poc_src`'tir.

```sql
-- DWH tarafında, dwh_poc şemasında, DBA:
CREATE DATABASE LINK kale_repl
  CONNECT TO dwh_poc_src IDENTIFIED BY "<same>"
  USING '<kale_replica_tns>';

-- Link dwh_poc'un olsun diye DBA bu cümleyi dwh_poc olarak veya
-- CREATE DATABASE LINK yetkisini geçici kullanıp hemen geri alarak çalıştırır.
```

## 3. Dosya landing (CSV / FTP varsa)

SQL*Loader veya external table için DBA Oracle DIRECTORY nesnesini açar; işletim sistemi path'ini DWH ekibi seçmez, güvenlik/OS ekibi verir.

```sql
CREATE OR REPLACE DIRECTORY dwh_poc_in AS '<os_path_approved>';
GRANT READ, WRITE ON DIRECTORY dwh_poc_in TO dwh_poc_owner;
GRANT EXECUTE ON SYS.UTL_FILE TO dwh_poc_owner;  -- yalnızca DIRECTORY ile kullanılacak
```

İlk pilot dosyasız Oracle kaynağıysa bu madde atlanır ([[Proje Planı]] Faz 1).

## Rol ayrımı (POC sonrası, şimdi istenmez)

Hedef model ([[DWH Hedef Mimarisi v2]]):

| Rol | Kim | Yetki |
|---|---|---|
| Şema sahibi / ETL servis | `dwh_poc` → sonra ayrı servis hesabı | nesne DDL + DML, kendi şeması |
| İnsan geliştirici | named user | ETL hesabına proxy veya dar `SELECT`/`DEBUG` |
| Analist / MSTR | ayrı read rolü | yalnızca `PUB_*` / `DM_*` |
| Automic | servis hesabı | `CREATE SESSION` + ilgili paket `EXECUTE`; `CREATE JOB` yok |

POC'de tek named/app kullanıcı kabul; üretimde insan ve servis hesabı ayrılır.

## DBA'ya kısa istek metni

> SUR Exadata DWH veritabanında POC için uygulama şeması istiyoruz.
>
> 1. Dedicated tablespace + kota (UNLIMITED TABLESPACE değil).
> 2. Rol: `CREATE SESSION`, `ALTER SESSION`, `CREATE TABLE/VIEW/SEQUENCE/PROCEDURE/TRIGGER/TYPE/SYNONYM/MATERIALIZED VIEW`, `QUERY REWRITE`. Automic yoksa geçici `CREATE JOB`.
> 3. `DBA` / `RESOURCE` / `SELECT ANY TABLE` / prod Kale yetkisi yok.
> 4. Kale **replikasına** salt-okunur ayrı kullanıcı; ihtiyaç duyulan tablolara `SELECT` (+ gerekirse `FLASHBACK`). Private DB link'i DBA açsın.
> 5. CSV landing varsa DBA'nın açtığı DIRECTORY üzerinde `READ/WRITE`.
>
> Amaç: landing + kontrol tabloları + ince core/mart kurulumu. DSS'e yazılmayacak.

İlgili notlar: [[Fiziksel Topoloji - Teknik Taraf]] · [[DWH Hedef Mimarisi v2]] · [[Proje Planı]] · [[Dataguard vs Goldengate]] · [[Aktarım #1]]
