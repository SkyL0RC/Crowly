# 🔐 WDK Security Architecture

## Güvenlik Prensibi

**Seed phrase ASLA backend'de saklanmaz!**

WDK dokümantasyonuna göre:
- Seed phrase en hassas kriptografik materyaldir
- Sadece işlem sırasında bellekte tutulur
- İşlem bitince `wdk.dispose()` ile temizlenir
- Veritabanında saklanması **GÜVENLİK RİSKİ**

## Yeni Mimari

### 1. Wallet Oluşturma (Generate)
```
Frontend:
1. Backend'den POST /api/wallet/create isteği
2. Backend WDK ile seed phrase üretir
3. Seed phrase SADECE response'da döner (1 kez)
4. Frontend seed phrase'i gösterir
5. Kullanıcı yedekler (종이에, metal plate'e)
6. Frontend seed phrase'i ASLA saklamaz

Backend DB:
- wallet_id
- address (public)
- network
- created_at
❌ SEED PHRASE YOK!
```

### 2. Wallet Import
```
Frontend:
1. Kullanıcı seed phrase girer
2. Backend'e gönderilir (HTTPS)
3. Backend WDK ile doğrular ve address çıkarır
4. Sadece address DB'ye kaydedilir
5. Seed phrase bellekten temizlenir

Backend:
const wdk = createWDKInstance(seedPhrase);
const account = await wdk.getAccount('ethereum', 0);
const address = await account.getAddress();

// DB'ye sadece address kaydet
await saveWallet({ address, network });

// Seed phrase'i temizle
wdk.dispose();
```

### 3. Transaction Gönderme
```
Frontend:
1. Kullanıcı transaction yapmak ister
2. Seed phrase KULLANICI'dan istenir (modal)
3. Seed phrase ile transaction imzalanır
4. İmzalı transaction backend'e gönderilir

Backend:
// Geçici WDK instance
const wdk = createWDKInstance(userProvidedSeedPhrase);
const account = await wdk.getAccount(network, 0);
const tx = await account.sendTransaction({ to, value });

// İşlem bitti, temizle
wdk.dispose();
```

### 4. Session Yönetimi
```
Option 1: Her işlemde seed phrase iste (en güvenli)
Option 2: Session'da encrypted tutma (risk++)
Option 3: WebCrypto API ile browser'da encrypted (orta)

ÖNERİLEN: Option 1
```

## Mevcut Kod Değişiklikleri

### Değiştirilecekler:
1. ❌ `encrypted_private_key` sütunu kaldırılacak
2. ✅ Sadece `address` ve metadata tutulacak
3. ✅ Transaction endpoints seed phrase parametre alacak
4. ✅ Her işlem sonrası `wdk.dispose()` çağrılacak

### Frontend Değişiklikleri:
1. Seed phrase LocalStorage'a kaydedilmeyecek
2. Her transaction'da kullanıcıdan istenecek
3. "Remember for session" özelliği eklenebilir (opsiyonel)

## Güvenlik Avantajları

✅ Backend hack'lense bile seed phrase yok
✅ WDK best practices'e uygun
✅ User'ın kontrolünde (non-custodial)
✅ Dispose() ile memory leak yok

## Trade-offs

⚠️ UX: Her işlemde seed phrase girme gerekir
✅ Çözüm: Session-based encrypted storage (opsiyonel)
✅ Çözüm: Hardware wallet desteği eklenebilir

## Migrasyon Planı

```sql
-- Eski seed phrase'leri temizle
ALTER TABLE wallets DROP COLUMN encrypted_private_key;

-- Sadece public data kalsın
-- address, network, network_type, public_key
```

## Örnek Flow

```javascript
// ❌ YANLIŞ (Eski)
localStorage.setItem('seedPhrase', encryptedSeed);

// ✅ DOĞRU (Yeni)
// Seed phrase sadece kullanıcıda
// Her işlemde tekrar girilir veya
// Encrypted session token ile 15dk boyunca cached
```
