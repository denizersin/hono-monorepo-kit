bir model olusturma akışım için LLM'e rule yazmak istiyorum. subscription entity'si üzerinden bir rule oluşturalım. bu rule ile yeni entityler oluşturacağım.



1-önceliklde db şeması ve ilişkileri tanımlanır@beautifulMention .
not: bazı kolonlar type içeriyor ve enum olanlar için yanında //enum notu bulunmakta.
enumlarimizi @beautifulMention 'dan elde ediyoruz.(bu dosyayi analiz et, map record ve key record arasindaki farki belirt) burasi dto adiminda da zod schemasi olustururken enum olarak validat edilmeli.
ek not:@beautifulMention  burada ise enumun key ve value degerlerini elde edebilecegimiz data servisi var. bunu frontend'de select datalari olarak vb kullanabilecegiz.

2-db şeması şekillendikten sonra export namespace TSchemaSubscription {} tanimlamasi yapilir.
burada backend'in ve frontend'in ihtiyac duyacagi model type'lari tanimlari, 
burada ayni zamanda crud islemlerini yapan repository katmani icin de type yazilir!
TSchemaSubscription icersinde tanimlanir: export namespace TSubscriptionRepository {}

burada translations, relation iceren kayitlar goze alinarak crud islemleri icin repository typelari yazilir ardindan. @beautifulMention  bu sekilde kullanilir!

3-@beautifulMention  katmani yazmaya baslanir. 2.adimda yapilanlarin yeterliligi dogrulanir

4-frontend icin validasyon yazilir!
 @beautifulMention  
uyarilar
-enum olan degerler icin z.enum ve SahredEnums helperlari ile enum degerleri elde edili
***yeni uyarilar analiz et.

5-bu validasyonlar kullanilarak route'lar yazilir@beautifulMention 