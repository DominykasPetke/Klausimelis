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
- Front-end: Vue

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

### GET topics/{topic_ID}/themes/{theme_ID}/questions

Grąžina visus temoje esančius klausimus. Grąžinamoje informacijoje yra klausimo ID, klausimas bei vartotojo, kuris šį klausimą sukūrė, duomenys. Taip pat, jei vartotojas yra prisijungęs, grąžinami atsakymo variantai ir teisingas atsakymas.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes/{theme_ID}/questions`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 404, 500 |
| Reikia autentifikacijos? | Ne |

#### Pavyzdinė užklausa

```
GET /api/v1/topics/1/themes/1/questions
Authorization: Bearer {TOKEN}
```

#### Pavyzdinis atsakymas

```
[
    {
        "id": 20,
        "question": "Kokia yra trikampio kampų suma?",
        "answers": [
            {
                "answer": "180 laipsnių",
                "is_correct": true
            },
            {
                "answer": "0 laipsnių"
            }
        ],
        "user": {
            "id": 1,
            "username": "QuantumLTU"
        }
    }
]
```

### GET topics/{topic_ID}/themes/{theme_ID}/questions/{question_ID}

Grąžina vieną temoje esantį klausimą. Grąžinamoje informacijoje yra klausimo ID, klausimas bei vartotojo, kuris šį klausimą sukūrė, duomenys. Taip pat, jei vartotojas yra prisijungęs, grąžinami atsakymo variantai ir teisingas atsakymas.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes/{theme_ID}/questions/{question_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 404, 500 |
| Reikia autentifikacijos? | Ne |

#### Pavyzdinė užklausa

`GET /api/v1/topics/1/themes/1/questions/20`

#### Pavyzdinis atsakymas

```
{
    "id": 20,
    "question": "Kokia yra trikampio kampų suma?",
    "user": {
        "id": 1,
        "username": "QuantumLTU"
    }
}
```

### POST topics/{topic_ID}/themes/{theme_ID}/questions

Sukuria klausimą. Užklausos kūne JSON formatu nurodomas klausimas bei atsakymo klausimų masyvas, kuriame bent vienas atsakymas turi būti pažymėtas teisingu. Grąžinamoje informacijoje yra klausimo ID, klausimas, atsakymo variantai bei vartotojo, kuris šį klausimą sukūrė, duomenys. Jei veiksmą atlieka mokytojas, tai klausimus galima kurti tik savo sukurtose temose.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes/{theme_ID}/questions`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 201, 400, 401, 403, 500 |
| Reikia autentifikacijos? | Taip |

#### Parametrai

| Parametras | Būtinas? | Aprašas | Pavyzdys | 
| - | - | - | - |
| `question` | Taip | Klausimas | `"Kiek yra 2 + 2?"` |
| `answers` | Taip | Galimi klausimo atsakymo variantai | `[{"answer": "4", "is_correct": true}]` |

#### Pavyzdinė užklausa

```
POST /api/v1/topics/1/themes/1/questions
Authorization: Bearer {TOKEN}

{
    "question": "Klausimas",
    "answers": [
        {
            "answer": "Neteisingas ats"
        },
        {
            "answer": "Teisingas ats",
            "is_correct": true
        }
    ]
}
```

#### Pavyzdinis atsakymas

```
{
    "id": 35,
    "question": "Klausimas",
    "answers": [
        {
            "answer": "Neteisingas ats"
        },
        {
            "answer": "Teisingas ats",
            "is_correct": true
        }
    ]
}
```

### PUT topics/{topic_ID}/themes/{theme_ID}/questions/{question_ID}

Redaguoja klausimą. Užklausos kūne JSON formatu nurodomas klausimas bei atsakymo klausimų masyvas, kuriame bent vienas atsakymas turi būti pažymėtas teisingu. Grąžinamoje informacijoje yra klausimo ID, klausimas, atsakymo variantai bei vartotojo, kuris šį klausimą sukūrė, duomenys. Jei veiksmą atlieka mokytojas, tai galima redaguoti tik savo sukurtus klausimus.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes/{theme_ID}/questions/{question_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | - | 
| Atsako kodai | 204, 400, 401, 403, 404, 500 |
| Reikia autentifikacijos? | Taip |

#### Parametrai

| Parametras | Būtinas? | Aprašas | Pavyzdys | 
| - | - | - | - |
| `question` | Taip | Klausimas | `"Kiek yra 2 + 2?"` |
| `answers` | Taip | Galimi klausimo atsakymo variantai | `[{"answer": "4", "is_correct": true}]` |

#### Pavyzdinė užklausa

```
PUT /api/v1/topics/1/themes/28
Authorization: Bearer {TOKEN}

{
    "question": "Kokia yra penkiakampio kampų suma?",
    "answers": [
        {
            "answer": "180 laipsnių"
        },
        {
            "answer": "0 laipsnių"
        },
        {
            "answer": "540 laipsnių",
            "is_correct": true
        }
    ]
}
```

#### Pavyzdinis atsakymas

```
```

### DELETE topics/{topic_ID}/themes/{theme_ID}/questions/{question_ID}

Ištrina klausimą. Būtina turėti bent mokytojo privilegijas šio veiksmo atlikimui. Jei veiksmą atlieka mokytojas, tai turi būti tas pats vartotojas, kuris sukūrė šį klausimą.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/themes/{theme_ID}/questions/{question_ID}`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | - | 
| Atsako kodai | 204, 401, 403, 404, 500 |
| Reikia autentifikacijos? | Taip |

#### Pavyzdinė užklausa

```
DELETE /api/v1/topics/1/themes/1/33
Authorization: Bearer {TOKEN}
```

#### Pavyzdinis atsakymas

```
```

### GET topics/{topic_ID}/questions

Grąžina visus srityje esančius klausimus. Grąžinamoje informacijoje yra klausimo ID, klausimas, vartotojo, kuris šį klausimą sukūrė, duomenys, bei temos, kurioje kiekvienas klausimas yra, informacija. Taip pat, jei vartotojas yra prisijungęs, grąžinami atsakymo variantai ir teisingas atsakymas.

#### Užklausos URL

`/api/v1/topics/{topic_ID}/questions`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 404, 500 |
| Reikia autentifikacijos? | Ne |

#### Pavyzdinė užklausa

```
GET /api/v1/topics/1/questions
Authorization: Bearer {TOKEN}
```

#### Pavyzdinis atsakymas

```
[
    {
        "id": 20,
        "question": "Kokia yra trikampio kampų suma?",
        "answers": [
            {
                "answer": "180 laipsnių",
                "is_correct": true
            },
            {
                "answer": "0 laipsnių"
            }
        ],
        "user": {
            "id": 1,
            "username": "QuantumLTU"
        },
        "theme": {
            "id": 1,
            "name": "Geometrija",
            "description": "Visokios įdomios formos"
        }
    }
]
```

### GET user

Grąžina vartotojo, kurio JWT token'ą turime, duomenis. Grąžinamoje informacijoje yra vartotojo slapyvardis, elektroninis paštas, ID ir rolės ID.

#### Užklausos URL

`/api/v1/user`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 401, 500 |
| Reikia autentifikacijos? | Taip |

#### Pavyzdinė užklausa

```
GET /api/v1/user
Authorization: Bearer {TOKEN}
```

#### Pavyzdinis atsakymas

```
{
    "username": "Studis",
    "id": 4,
    "email": "studentai@klausimelis.lt",
    "role": 0
}
```

### GET user/{user_ID}

Grąžina vartotojo duomenis. Jei tai yra tas pats vartotojas, kurio JWT token'ą turime, grąžinamoje informacijoje yra vartotojo slapyvardis, elektroninis paštas, ID ir rolės ID. Jei tai yra ne tas vartotojas arba mes esame neprisijungę, tada gaunama tik vartotojo ID ir slapyvardis.

#### Užklausos URL

`/api/v1/user/3`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 404, 500 |
| Reikia autentifikacijos? | Ne |

#### Pavyzdinė užklausa

`GET /api/v1/user/3`

#### Pavyzdinis atsakymas

```
{
    "id": 3,
    "username": "Mokytojas"
}
```

### POST login

Prisijungiama prie sistemos. Užklausos kūne JSON formatu nurodomas vartotojo el. paštas bei slaptažodis. Alternatyviai, galima autentifikuotis ir JWT token'u, taip gaunant naują token'ą. 

#### Užklausos URL

`/api/v1/login`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 200, 401, 500 |
| Reikia autentifikacijos? | Ne |

#### Parametrai

| Parametras | Būtinas? | Aprašas | Pavyzdys | 
| - | - | - | - |
| `email` | Taip | Naudotojo elektroninis paštas | `"dompet2@ktu.lt"` |
| `password` | Taip | Naudotojo slaptažodis  | `"theverysecretpassword"` |

#### Pavyzdinė užklausa

```
POST /api/v1/login

{
    "email": "dompet2@ktu.lt",
    "password": "theverysecretpassword"
}
```

#### Pavyzdinis atsakymas

```
{
    "id": 1,
    "username": "QuantumLTU",
    "email": "dompet2@ktu.lt",
    "role": 0,
    "token": "{TOKEN}"
}
```

### POST register

Priregistruojama prie sistemos. Užklausos kūne JSON formatu nurodomas vartotojo el. paštas, slapyvardis bei slaptažodis. Alternatyviai, galima autentifikuotis ir JWT token'u, taip gaunant naują token'ą. 

#### Užklausos URL

`/api/v1/register`

#### Užklausos informacija

| | Reikšmė |
| - | - |
| Atsako formatas | JSON | 
| Atsako kodai | 201, 400, 403, 500 |
| Reikia autentifikacijos? | Ne |

#### Parametrai

| Parametras | Būtinas? | Aprašas | Pavyzdys | 
| - | - | - | - |
| `email` | Taip | Naudotojo elektroninis paštas | `"dompet2@ktu.lt"` |
| `password` | Taip | Naudotojo slaptažodis  | `"theverysecretpassword"` |
| `username` | Taip | Naudotojo slapyvardis  | `"Dėstytojas"` |


#### Pavyzdinė užklausa

```
POST /api/v1/register

{
    "username": "Dėstytojas",
    "email": "destai@klausimelis.lt",
    "password": "password123"
}
```

#### Pavyzdinis atsakymas

```
{
    "id": 6,
    "email": "destai@klausimelis.lt",
    "username": "Dėstytojas"
}
```
## Sistemos wireframe
Sistemos wireframe paveikslas:
![Sistemos wireframe](https://i.imgur.com/buQVLTB.png)

Realus sistemos vaizdas:
![Realus vaizdas](https://i.imgur.com/on8uRIR.png)

## Išvados
Sistemą sukurti pavyko.
Su API sudėtingiausia buvo užtikrinti, jog įvedus netinkamus duomenis sistema grąžintų tinkamą klaidą.
Prisijungimo srityje sudėtingiausia buvo išsiaiškinti kaip veikia `passport` biblioteka.
Klientinėje dalyje trūko testavimo, taip pat dizainas buvo paprastas, nes dirbti su klientine dalimi, man, asmeniškai, nėra pats mėgstamiausias dalykas.