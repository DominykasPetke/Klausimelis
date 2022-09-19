# Klausimėlis

Projekto tikslas - sukurti mokomąją sistemą, leidžiančią mokiniams atsakinėti į klausimus įvairiose srityse.
Klausimai būtų testinio tipo, su keliais atsakymų variantais.

Veikimo principas – pačią kuriamą platformą sudaro dvi dalys: internetinė aplikacija, kuria naudosis naudotojai, bei aplikacijų programavimo sąsaja (angl. trump. API).

## Objektai

- Klausimas
- Tema (klausimų rinkinys, klausimynas)
- Sritis

## Funkciniai reikalavimai

Neregistruotas vartotojas (svečias) gali:

- Matyti sričių sąrašą;
- Matyti srities klausimų rinkinius;
- Matyti klausimų rinkinio klausimus.

Mokinys gali:

- Matyti klausimo atsakymo variantus.
- Atsakinėti į klausimus.

Mokytojas savo srityje(-se) gali:

- Kurti klausimų rinkinius.
- Kurti klausimus ir jų atsakymo variantus jų sukurtuose klausimų rinkiniuose.
- Redaguoti savo sukurtus klausimus bei atsakymus.

Administratorius gali:

- Kurti sritis
- Redaguoti sritis
- Patvirtinti mokytojus bei priskirti jiems jų mokymo sritis.

Užsiregistravęs vartotojas automatiškai yra mokinys, reikia administratoriaus patvirtinimo, kad taptų mokytoju.
Mokytojas ne savo mokymo srityje turi tokias pačias privilegijas, kaip mokinys.

## Technologijos

- Back-end: Node.js + ExpressJS
- Duomenų bazė: MariaDB (MySQL)
- Front-end: Bulma + JavaScript moduliai duomenų užkrovimui bei papildomai stilizacijai.

## Sistemos architektūra

![Sistemos architektūros paveikslas](https://i.imgur.com/riNftod.png)
