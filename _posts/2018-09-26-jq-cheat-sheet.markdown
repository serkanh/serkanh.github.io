---
layout: post
title:  "jq Cheat Sheet "
date:   2018-09-26 10:40:00
categories: jq,cli 
---
##### To follow the examples you can download the [sample json file](/download/example.json). Generated via https://www.json-generator.com/#


##### Get the first 2 elements of the a given array  

````

➜  cat assets/example.json | jq '.[:2]'
[
  {
    "_id": "5babe2f088e7e9921a13e74b",
    "index": 0,
    "guid": "e3440a1a-c657-4f27-9f34-f42fc45ca458",
    "isActive": false,
    "balance": "$2,402.13",
    "picture": "http://placehold.it/32x32",
    "age": 33,
    "eyeColor": "blue",
    "name": "Mildred Sexton",
    "gender": "female",
    "company": "HOPELI",
    "email": "mildredsexton@hopeli.com",
    "phone": "+1 (953) 555-2073",
    "address": "781 Whitney Avenue, Fruitdale, Maryland, 5417",
    "about": "Dolore aliquip ad officia elit qui commodo occaecat. Irure ipsum incididunt elit duis minim eu duis quis aliquip incididunt exercitation. Incididunt excepteur velit pariatur pariatur.\r\n",
    "registered": "2015-09-20T02:42:27 +04:00",
    "latitude": -60.076234,
    "longitude": -150.210389,
    "tags": [
      "aliqua",
      "incididunt",
      "ipsum",
      "ipsum",
      "fugiat",
      "magna",
      "eiusmod"
    ],
    "friends": [
      {
        "id": 0,
        "name": "Lorraine Potter"
      },
      {
        "id": 1,
        "name": "Lamb Barber"
      },
      {
        "id": 2,
        "name": "Finch Santos"
      }
    ],
    "greeting": "Hello, Mildred Sexton! You have 7 unread messages.",
    "favoriteFruit": "banana"
  },
  {
    "_id": "5babe2f042d8e766498685c7",
    "index": 1,
    "guid": "86e6083d-24e8-4b51-aafe-82edeacfd8ed",
    "isActive": false,
    "balance": "$1,254.83",
    "picture": "http://placehold.it/32x32",
    "age": 27,
    "eyeColor": "blue",
    "name": "Judith Hunter",
    "gender": "female",
    "company": "FIBEROX",
    "email": "judithhunter@fiberox.com",
    "phone": "+1 (838) 510-3504",
    "address": "253 Orange Street, Gila, Vermont, 7709",
    "about": "Minim magna amet labore ex est elit amet officia amet anim. Elit aliqua ipsum do sit dolor laborum qui quis nulla. Amet non sit minim amet ea mollit elit ex pariatur.\r\n",
    "registered": "2014-03-26T07:07:10 +04:00",
    "latitude": 59.112031,
    "longitude": -47.288141,
    "tags": [
      "ea",
      "minim",
      "mollit",
      "est",
      "excepteur",
      "eu",
      "dolor"
    ],
    "friends": [
      {
        "id": 0,
        "name": "Flora Richard"
      },
      {
        "id": 1,
        "name": "Courtney Holden"
      },
      {
        "id": 2,
        "name": "Skinner Villarreal"
      }
    ],
    "greeting": "Hello, Judith Hunter! You have 3 unread messages.",
    "favoriteFruit": "banana"
  }
]

````

##### Show only specific key/value pairs (ex: name, age)

````
➜  cat download/example.json | jq '.[] | {name:.name,age:.age}'
{
  "name": "Mildred Sexton",
  "age": 33
}
{
  "name": "Judith Hunter",
  "age": 27
}
{
  "name": "Morton Harrell",
  "age": 28
}
{
  "name": "Sherri Bowers",
  "age": 22
}
{
  "name": "Lambert Stark",
  "age": 33
}
{
  "name": "Jessie Turner",
  "age": 27
}
````


##### Query based on gender field 
````
➜  cat assets/example.json | jq '.[]|select(.gender=="male")' 
{
  "_id": "5babe2f0c2aa2072304da586",
  "index": 2,
  "guid": "81be2a22-04e2-43c1-9c38-14b01802612f",
  "isActive": false,
  "balance": "$2,737.55",
  "picture": "http://placehold.it/32x32",
  "age": 28,
  "eyeColor": "brown",
  "name": "Morton Harrell",
  "gender": "male",
  "company": "GLEAMINK",
  "email": "mortonharrell@gleamink.com",
  "phone": "+1 (934) 471-3056",
  "address": "341 Hall Street, Lloyd, Georgia, 6420",
  "about": "Id irure ipsum elit cupidatat. Qui do commodo quis consectetur ea sint pariatur minim. Enim consequat ex incididunt quis consectetur est nostrud proident velit Lorem nulla laboris mollit. Non duis id nisi eiusmod.\r\n",
  "registered": "2016-11-20T04:59:36 +05:00",
  "latitude": -72.735366,
  "longitude": 173.475387,
  "tags": [
    "mollit",
    "nisi",
    "dolor",
    "amet",
    "minim",
    "eu",
    "non"
  ],
  "friends": [
    {
      "id": 0,
      "name": "Wendy Horne"
    },
    {
      "id": 1,
      "name": "Terrell Cantrell"
    },
    {
      "id": 2,
      "name": "Gallagher Brock"
    }
  ],
  "greeting": "Hello, Morton Harrell! You have 10 unread messages.",
  "favoriteFruit": "apple"
}
{
  "_id": "5babe2f047ed2184c3ffdd15",
  "index": 4,
  "guid": "7da190d7-1b3f-4c13-ad85-c8ea74ec961a",
  "isActive": true,
  "balance": "$2,428.25",
  "picture": "http://placehold.it/32x32",
  "age": 33,
  "eyeColor": "green",
  "name": "Lambert Stark",
  "gender": "male",
  "company": "BEADZZA",
  "email": "lambertstark@beadzza.com",
  "phone": "+1 (968) 526-3075",
  "address": "498 Remsen Street, Deltaville, Kentucky, 362",
  "about": "Deserunt nulla dolor eiusmod consectetur nostrud non. Sint ea officia velit aliqua occaecat id ad. Dolor non adipisicing irure dolore id eu esse anim pariatur sint irure. Id nisi anim ipsum aute quis nisi ex exercitation velit nostrud proident cupidatat. Consectetur culpa minim cillum officia aliqua do culpa pariatur sit excepteur adipisicing. Exercitation commodo dolor reprehenderit reprehenderit aliqua ad sint amet est mollit aute. Fugiat aliqua laboris cupidatat duis enim tempor voluptate ipsum nulla exercitation.\r\n",
  "registered": "2018-09-10T10:10:26 +04:00",
  "latitude": 10.212328,
  "longitude": 15.899575,
  "tags": [
    "non",
    "exercitation",
    "veniam",
    "proident",
    "excepteur",
    "velit",
    "in"
  ],
  "friends": [
    {
      "id": 0,
      "name": "Trina Guerrero"
    },
    {
      "id": 1,
      "name": "Flynn Sullivan"
    },
    {
      "id": 2,
      "name": "Cochran Wolf"
    }
  ],
  "greeting": "Hello, Lambert Stark! You have 7 unread messages.",
  "favoriteFruit": "strawberry"
}
````

##### Query male and active users

````
➜ cat assets/example.json | jq '.[]|select(.gender=="male" and .isActive==true )'

{
  "_id": "5babe2f047ed2184c3ffdd15",
  "index": 4,
  "guid": "7da190d7-1b3f-4c13-ad85-c8ea74ec961a",
  "isActive": true,
  "balance": "$2,428.25",
  "picture": "http://placehold.it/32x32",
  "age": 33,
  "eyeColor": "green",
  "name": "Lambert Stark",
  "gender": "male",
  "company": "BEADZZA",
  "email": "lambertstark@beadzza.com",
  "phone": "+1 (968) 526-3075",
  "address": "498 Remsen Street, Deltaville, Kentucky, 362",
  "about": "Deserunt nulla dolor eiusmod consectetur nostrud non. Sint ea officia velit aliqua occaecat id ad. Dolor non adipisicing irure dolore id eu esse anim pariatur sint irure. Id nisi anim ipsum aute quis nisi ex exercitation velit nostrud proident cupidatat. Consectetur culpa minim cillum officia aliqua do culpa pariatur sit excepteur adipisicing. Exercitation commodo dolor reprehenderit reprehenderit aliqua ad sint amet est mollit aute. Fugiat aliqua laboris cupidatat duis enim tempor voluptate ipsum nulla exercitation.\r\n",
  "registered": "2018-09-10T10:10:26 +04:00",
  "latitude": 10.212328,
  "longitude": 15.899575,
  "tags": [
    "non",
    "exercitation",
    "veniam",
    "proident",
    "excepteur",
    "velit",
    "in"
  ],
  "friends": [
    {
      "id": 0,
      "name": "Trina Guerrero"
    },
    {
      "id": 1,
      "name": "Flynn Sullivan"
    },
    {
      "id": 2,
      "name": "Cochran Wolf"
    }
  ],
  "greeting": "Hello, Lambert Stark! You have 7 unread messages.",
  "favoriteFruit": "strawberry"
}
````
##### Search for string in key values.

````
➜  cat assets/example.json | jq '.[]|select(.address | contains("781 Whitney"))'  
{
  "_id": "5babe2f088e7e9921a13e74b",
  "index": 0,
  "guid": "e3440a1a-c657-4f27-9f34-f42fc45ca458",
  "isActive": false,
  "balance": "$2,402.13",
  "picture": "http://placehold.it/32x32",
  "age": 33,
  "eyeColor": "blue",
  "name": "Mildred Sexton",
  "gender": "female",
  "company": "HOPELI",
  "email": "mildredsexton@hopeli.com",
  "phone": "+1 (953) 555-2073",
  "address": "781 Whitney Avenue, Fruitdale, Maryland, 5417",
  "about": "Dolore aliquip ad officia elit qui commodo occaecat. Irure ipsum incididunt elit duis minim eu duis quis aliquip incididunt exercitation. Incididunt excepteur velit pariatur pariatur.\r\n",
  "registered": "2015-09-20T02:42:27 +04:00",
  "latitude": -60.076234,
  "longitude": -150.210389,
  "tags": [
    "aliqua",
    "incididunt",
    "ipsum",
    "ipsum",
    "fugiat",
    "magna",
    "eiusmod"
  ],
  "friends": [
    {
      "id": 0,
      "name": "Lorraine Potter"
    },
    {
      "id": 1,
      "name": "Lamb Barber"
    },
    {
      "id": 2,
      "name": "Finch Santos"
    }
  ],
  "greeting": "Hello, Mildred Sexton! You have 7 unread messages.",
  "favoriteFruit": "banana"
}
````

