# Klausimėlis

Projekto tikslas - sukurti mokomąją sistemą, leidžiančią mokiniams atsakinėti į klausimus įvairiose srityse.
Klausimai būtų testinio tipo, su keliais atsakymų variantais.

Veikimo principas – pačią kuriamą platformą sudaro dvi dalys: internetinė aplikacija, kuria naudosis naudotojai, bei aplikacijų programavimo sąsaja (angl. trump. API).

## Objektai

- Klausimas (question)
- Tema (klausimų rinkinys, klausimynas) (theme)
- Sritis (topic)

## Funkciniai reikalavimai

Neregistruotas vartotojas (svečias) gali:

- Matyti sričių sąrašą;
- Matyti srities temas;
- Matyti temos klausimus.

Mokinys gali:

- Matyti klausimo atsakymo variantus.
- Atsakinėti į klausimus.

Mokytojas savo srityje(-se) gali:

- Kurti klausimų rinkinius.
- Kurti klausimus ir jų atsakymo variantus jų sukurtose temose.
- Redaguoti savo sukurtus klausimus bei atsakymus.

Administratorius gali:

- Kurti sritis
- Redaguoti sritis
- Patvirtinti mokytojus.

Užsiregistravęs vartotojas automatiškai yra mokinys, reikia administratoriaus patvirtinimo, kad taptų mokytoju.

## Technologijos

- Back-end: Node.js + ExpressJS
- Duomenų bazė: MariaDB (MySQL)
- Front-end: Bulma + JavaScript moduliai duomenų užkrovimui bei papildomai stilizacijai.

## Sistemos architektūra

![Sistemos architektūros paveikslas](https://i.imgur.com/riNftod.png)
