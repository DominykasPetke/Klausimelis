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

## API dokumentacija

### GET topics

Grąžina visas sistemoje esančias sritis. Grąžinamoje informacijoje yra srities ID, pavadinimas, aprašymas bei vartotojo, kuris šią sritį sukūrė, duomenys.

#### Užklausos URL

`/api/v1/topics`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 500 |
| Reikia autentifikacijos? | Ne |

#### Pavyzdinė užklausa

`GET /api/v1/topics`

#### Pavyzdinis atsakymas

```
[
    {
        "id": 1,
        "name": "Matematika",
        "description": "Paskaičiuokime, protingieji kurmiai",
        "user": {
            "id": 1,
            "username": "QuantumLTU"
        }
    }
]
```

### GET topics/{topic_ID}

Grąžina vieną nurodytą sistemoje esančią sritį. Grąžinamoje informacijoje yra srities ID, pavadinimas, aprašymas bei vartotojo, kuris šią sritį sukūrė, duomenys.

#### Užklausos URL

`/api/v1/topics/{topic_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 404, 500 |
| Reikia autentifikacijos? | Ne |

#### Pavyzdinė užklausa

`GET /api/v1/topics/1`

#### Pavyzdinis atsakymas

```
{
    "id": 1,
    "name": "Matematika",
    "description": "Paskaičiuokime, protingieji kurmiai",
    "user": {
        "id": 1,
        "username": "QuantumLTU"
    }
}
```

### POST topics

Sukuria sritį. Užklausos kūne JSON formatu nurodomas srities pavadinimas bei aprašymas. Grąžinamoje informacijoje yra srities ID, pavadinimas, aprašymas bei vartotojo, kuris šią sritį sukūrė, duomenys. Būtina turėti administratoriaus privilegijas šio veiksmo atlikimui.

#### Užklausos URL

`/api/v1/topics`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 201, 400, 401, 403, 500 |
| Reikia autentifikacijos? | Taip |

#### Parametrai

| Parametras | Būtinas? | Aprašas | Pavyzdys | 
| - | - | - | - |
| `name` | Taip | Srities pavadinimas | `"Geografija"` |
| `description` | Ne | Srities aprašymas | `"Visa mūsų Žemė"` |

#### Pavyzdinė užklausa

```
POST /api/v1/topics
Authorization: Bearer {TOKEN}

{
    "name": "Geografija",
    "description": "Visa mūsų Žemė"
}
```

#### Pavyzdinis atsakymas

```
{
    "id": 25,
    "name": "Geografija",
    "description": "Visa mūsų Žemė",
    "user": {
        "id": 1,
        "username": "QuantumLTU"
    }
}
```

### PATCH topics/{topic_ID}

Redaguoja sritį. Užklausos kūne JSON formatu nurodomas naujas srities pavadinimas ir/arba aprašymas. Būtina turėti administratoriaus privilegijas šio veiksmo atlikimui.

#### Užklausos URL

`/api/v1/topics/{topic_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | - | 
| Atsako kodai | 204, 400, 401, 403, 404, 500 |
| Reikia autentifikacijos? | Taip |

#### Parametrai

Privaloma nusiųsti bent vieną parametrą.

| Parametras | Būtinas? | Aprašas | Pavyzdys | 
| - | - | - | - |
| `name` | Ne | Srities pavadinimas | `"Geografija"` |
| `description` | Ne | Srities aprašymas | `"Visa mūsų Žemė"` |

#### Pavyzdinė užklausa

```
PATCH /api/v1/topics/25
Authorization: Bearer {TOKEN}

{
    "name": "Geografija",
    "description": "Visa mūsų Žemė"
}
```

#### Pavyzdinis atsakymas

```
```

### DELETE topics/{topic_ID}

Ištrina sritį ir visus duomenis susijusius su šia sritimi. Būtina turėti administratoriaus privilegijas šio veiksmo atlikimui.

#### Užklausos URL

`/api/v1/topics/{topic_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | - | 
| Atsako kodai | 204, 401, 403, 404, 500 |
| Reikia autentifikacijos? | Taip |

#### Pavyzdinė užklausa

```
DELETE /api/v1/topics/25
Authorization: Bearer {TOKEN}
```

#### Pavyzdinis atsakymas

```
```

### GET topics/{topic_ID}/themes

Grąžina visas srityje esančias temas. Grąžinamoje informacijoje yra temos ID, pavadinimas, aprašymas bei vartotojo, kuris šią temą sukūrė, duomenys.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 404, 500 |
| Reikia autentifikacijos? | Ne |

#### Pavyzdinė užklausa

`GET /api/v1/topics/1/themes`

#### Pavyzdinis atsakymas

```
[
    {
        "id": 1,
        "name": "Geometrija",
        "description": "Visokios įdomios formos",
        "user": {
            "id": 1,
            "username": "QuantumLTU"
        }
    }
]
```

### GET topics/{topic_ID}/themes/{theme_ID}

Grąžina vieną nurodytą srityje esančią temą. Grąžinamoje informacijoje yra temos ID, pavadinimas, aprašymas bei vartotojo, kuris šią temą sukūrė, duomenys.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes/{theme_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 404, 500 |
| Reikia autentifikacijos? | Ne |

#### Pavyzdinė užklausa

`GET /api/v1/topics/1/themes/1`

#### Pavyzdinis atsakymas

```
{
    "id": 1,
    "name": "Geometrija",
    "description": "Visokios įdomios formos",
    "user": {
        "id": 1,
        "username": "QuantumLTU"
    }
}
```

### POST topics/{topic_ID}/themes

Sukuria temą. Užklausos kūne JSON formatu nurodomas temos pavadinimas bei aprašymas. Grąžinamoje informacijoje yra temos ID, pavadinimas, aprašymas bei vartotojo, kuris šią temą sukūrė, duomenys. Būtina turėti bent mokytojo privilegijas šio veiksmo atlikimui.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 201, 400, 401, 403, 500 |
| Reikia autentifikacijos? | Taip |

#### Parametrai

| Parametras | Būtinas? | Aprašas | Pavyzdys | 
| - | - | - | - |
| `name` | Taip | Temos pavadinimas | `"Europa"` |
| `description` | Ne | Temos aprašymas | `"Europietizmas"` |

#### Pavyzdinė užklausa

```
POST /api/v1/topics/1/themes
Authorization: Bearer {TOKEN}

{
    "name": "Europa",
    "description": "Europietizmas"
}
```

#### Pavyzdinis atsakymas

```
{
    "id": 28,
    "name": "Europa",
    "description": "Europietizmas",
    "user": {
        "id": 1,
        "username": "QuantumLTU"
    }
}
```

### PATCH topics/{topic_ID}/themes/{theme_ID}

Redaguoja temą. Užklausos kūne JSON formatu nurodomas naujas temos pavadinimas ir/arba aprašymas. Būtina turėti bent mokytojo privilegijas šio veiksmo atlikimui. Jei veiksmą atlieka mokytojas, tai turi būti tas pats vartotojas, kuris sukūrė šią temą.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes/{theme_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | - | 
| Atsako kodai | 204, 400, 401, 403, 404, 500 |
| Reikia autentifikacijos? | Taip |

#### Parametrai

Privaloma nusiųsti bent vieną parametrą.

| Parametras | Būtinas? | Aprašas | Pavyzdys | 
| - | - | - | - |
| `name` | Ne | Temos pavadinimas | `"Europa"` |
| `description` | Ne | Temos aprašymas | `"Europietizmas"` |

#### Pavyzdinė užklausa

```
PATCH /api/v1/topics/1/themes/28
Authorization: Bearer {TOKEN}

{
    "name": "Europa",
    "description": "Europietizmas"
}
```

#### Pavyzdinis atsakymas

```
```

### DELETE topics/{topic_ID}/themes/{theme_ID}

Ištrina temą ir visus duomenis susijusius su šia tema. Būtina turėti bent mokytojo privilegijas šio veiksmo atlikimui. Jei veiksmą atlieka mokytojas, tai turi būti tas pats vartotojas, kuris sukūrė šią temą.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes/{theme_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | - | 
| Atsako kodai | 204, 401, 403, 404, 500 |
| Reikia autentifikacijos? | Taip |

#### Pavyzdinė užklausa

```
DELETE /api/v1/topics/1/themes/28
Authorization: Bearer {TOKEN}
```

#### Pavyzdinis atsakymas

```
```

