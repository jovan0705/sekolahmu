# sekolahmu

## 1. API LOGIN & REGISTER
### LOGIN - [POST] - http://localhost:3000/user/login
```
body = {
    email: string,
    password: string
}

output = {
    access_token: string (access token using jsonwebtoken)
}
```
#### LOGIN CASES
```
body = {
    email: "admin@mail.com"
    password: "admin"
}

output = {
    access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY0NDI1OTQyMH0.kRyN-SpXABfsaKBvcoPPwDzVZHNuBpMzbJWcKY8RPls
}
```
### REGISTER - [POST] - http://localhost:3000/user/register
```
body = {
    name: string,
    email: string,
    password: string,
    role: string
}

output = {
    "id": integer,
    "name": string,
    "email": string,
    "role": "string"
}

Errors {
    Name cannot be empty
    Email already registered,
    Email cannot be empty,
    Password cannot be empty,
    role cannot be empty
}
```
#### REGISTER CASES
```
body = {
    "name": "admin",
    "email": "admin@mail.com",
    "password": "admin",
    "role": "admin"
}

output = {
    "id": 6,
    "name": "admin",
    "email": "admin@mail.com",
    "role": "admin"
}
```

## 2. API Create Class 
### [POST] - http://localhost:3000/class/add
Description: Admin can create Classes, other user cant, the filter is provided using authorization, where only admin can pass through.
When creating class, at the same time seats are created too.

```
headers = {
    access_token: string
}
body = {
    rows: integer,
    column: integer
}
output = {
    "message": "Success create Class"
}

error {
    Class does not exist
}
```

## 3. API Check-in Check-out
### Check-in  - [PUT] - http://localhost:3000/class/checkIn/:classId
```
headers = {
    access_token: string
}
params = integer

output = {
    class_id: integer,
    rows: integer,
    columns: integer,
    teacher: string,
    available_seats: array of string,
    occupied_seats: array of objects,
    message: string
}

error {
    Class does not exist
}
```
#### Check-in CASES
```
the message can handle situation such as {
    Student = {
        You're already seated (tidak diminta, namun harus ada pengecekan mengenai apakah student sudah check in atau belum)
        Hi <name>, your seat is <seat>
        Hi <name>, the class is fully seated
    }
    Teacher = {
        Teacher going in to class
        Another teacher is teaching inside the class (tidak diminta, namun apabila ada pengajar dengan id lain, akan tabrakan, sehingga dibuat)
        Teacher already checked in to class (tidak diminta, namun kalau sudah check in juga harus bisa ter-handle)
    }
}
```
```
headers = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6Im5hdm9qMiIsImVtYWlsIjoibmF2b2oyQG1haWwuY29tIiwicm9sZSI6InBlbmdhamFyIiwiaWF0IjoxNjQ0MjU3MTQ1fQ.9hVD8v7P3ChepTHSi_b3kDo3D9v8zquvxTyeyUPhDgo" (teacher access token)

params = "3"

output = "{
    "class_id": 3,
    "rows": 3,
    "columns": 4,
    "teacher": "in",
    "available_seats": [
        "C1",
        "D1",
        "B2",
        "C2",
        "D2",
        "B3",
        "C3",
        "D3",
        "A2",
        "A3"
    ],
    "occupied_seats": [
        {
            "seat": "A1",
            "student_name": "Siti"
        },
        {
            "seat": "B1",
            "student_name": "Jojon"
        }
    ],
    "message": "Teacher going in..."
}"
```
### Check-out - [PUT] - http://localhost:3000/class/checkOut/:classId
```
headers = {
    access_token: string
}
params = integer

output = {
    class_id: integer,
    rows: integer,
    columns: integer,
    teacher: string,
    available_seats: array of string,
    occupied_seats: array of objects,
    message: string
}

error {
    Class does not exist
}
```
#### Check-out CASES
```
the message can handle situation such as { (message pada checkout tidak diminta, namun diberikan untuk mempermudah melihat apa yang sedang terjadi)
    Student = {
        Hi <name>, you are not seated yet
        Hi <name>, <seat> is now available for other students
    }
    Teacher = {
        Teacher going out from class
        Another teacher is teaching inside the class
        Teacher already not in class
    }
}
```
```
headers = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6Im5hdm9qMiIsImVtYWlsIjoibmF2b2oyQG1haWwuY29tIiwicm9sZSI6InBlbmdhamFyIiwiaWF0IjoxNjQ0MjU3MTQ1fQ.9hVD8v7P3ChepTHSi_b3kDo3D9v8zquvxTyeyUPhDgo" (teacher access token)

params = "3"

output = "{
    "class_id": 3,
    "rows": 3,
    "columns": 4,
    "teacher": "in",
    "available_seats": [
        "C1",
        "D1",
        "B2",
        "C2",
        "D2",
        "B3",
        "C3",
        "D3",
        "A2",
        "A3"
    ],
    "occupied_seats": [
        {
            "seat": "A1",
            "student_name": "Siti"
        },
        {
            "seat": "B1",
            "student_name": "Jojon"
        }
    ],
    "message": "Teacher getting out..."
}"
```

## 4. API Get Class List
### [GET] - http://localhost:3000/class
```
Description = get all class list
headers = {
    access_token: string
}

output = [{
    class_id: integer,
    rows: integer,
    columns: integer,
    teacher: string,
    available_seats: array of string,
    occupied_seats: array of objects,
    message: string
},
{
    class_id: integer,
    rows: integer,
    columns: integer,
    teacher: string,
    available_seats: array of string,
    occupied_seats: array of objects,
    message: string
},
...
]
```
#### GET CLASS LIST CASE
```
    headers = {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6Ikpvam9uIiwiZW1haWwiOiJzdHVkZW50QG1haWwuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE2NDQyNTU4OTl9.kUp1f8Lzoo3CrI9qcPjHbdlIB5HNU86JvZHlmAkkryo"
    }

    output = [
    {
        "class_id": 3,
        "rows": 3,
        "columns": 4,
        "teacher": "out"
    },
    {
        "class_id": 4,
        "rows": 1,
        "columns": 1,
        "teacher": "in"
    }
]
```

## 5. API Get Class Detail by Id
### [GET] - http://localhost:3000/class/detail/:classId
```
headers = {
    access_token: string
}
params = integer

output = {
    class_id: integer,
    rows: integer,
    columns: integer,
    teacher: string,
    available_seats: array of string,
    occupied_seats: array of objects,
    message: string
}

error {
    Class does not exist
}
```

#### Get Class detail by Id Case 
```
headers = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6Im5hdm9qMiIsImVtYWlsIjoibmF2b2oyQG1haWwuY29tIiwicm9sZSI6InBlbmdhamFyIiwiaWF0IjoxNjQ0MjU3MTQ1fQ.9hVD8v7P3ChepTHSi_b3kDo3D9v8zquvxTyeyUPhDgo" (teacher access token)

params = "3"

output = {
    "class_id": 3,
    "rows": 3,
    "columns": 4,
    "teacher": "in",
    "available_seats": [
        "C1",
        "D1",
        "B2",
        "C2",
        "D2",
        "B3",
        "C3",
        "D3",
        "A2",
        "A3"
    ],
    "occupied_seats": [
        {
            "seat": "A1",
            "student_name": "Siti"
        },
        {
            "seat": "B1",
            "student_name": "Jojon"
        }
    ]
}
```
