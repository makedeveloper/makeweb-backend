# Make Developer

Make Developer is a platform to provide equal opportunities to all the students interested in improving ,
testing , showcasing their development skills.It is a platform where students can make a team for their projects 
or can be a part of a project in which they are interested.


## Features Included in  Make Developer

* Runway
* Resources 
* Projects : Make Developer will provide such a platform where one can add a project , show interest in contributing other projects and thus we will try our best to create best team so that everyone associated with this will get benefitted.
* Q & A :  Make Developer  has a Q&A section where skilled developers , mentors even students who had followed the same problem and able to come out of it will be always ready to help you in completing your journey.
* Blogs : 

## Installation

Please install [nodejs](https://nodejs.org/en/download/) and [mongoDB](https://www.mongodb.com/try/download/community) on your system, otherwise you will not be able to run the backend and ajax wont work. Along with that, if you want to see the data that is being stored in the database, install [mongoDB compass](https://www.mongodb.com/try/download/compass)

To run Backend 

```bash
clone this repo 
```
Determine a private key to be used in the backend. Ideally, the key should be a secure alphanumeric key. *The same key must be used in every subsequent initialization of the backend* 

Then run this command in the cloned directory
```bash
set jwtPrivateKey=<Your Private Key> //for windows
export jwtPrivateKey=<Your Private Key> //for linux and mac
node --no-deprecation index.js
```

APIs will be served on port 4500

## API Structure

### Registration  
endpoint: /register  
type: POST  
request-data:
```
{
    "fullname": "David Feachen",
    "username": "david123",
    "email": "david@gmail.com",
    "password": "123456Az",
    "confirm_password": "123456Az"
}
```
response-data:  
```
{
    "username": "david789"
}
```
response-header:  
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjA2MGM0NjJhY2ZiYzQ4YzRiM2NmNTQiLCJpYXQiOjE1OTQyMzE4Nzl9.3H578cjtratWVaSien93nRLdqhRgKJmqmbdZr4Mc6yQ
```
  
### Login  
endpoint: /login  
type: POST  
request-data:
```
{
    "email": "david@gmail.com",
    "password": "123456Az"
}
```
response-data:  
```
{
    "username": "david789"
}
```
response-header:  
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjA2MGM0NjJhY2ZiYzQ4YzRiM2NmNTQiLCJpYXQiOjE1OTQyMzE4Nzl9.3H578cjtratWVaSien93nRLdqhRgKJmqmbdZr4Mc6yQ
```
  
## Projects
### Create a new project
endpoint: /project/new  
type: POST  
request-header: x-auth-token  
request-data:
```
{
    "name": "Make Developer",
    "isInitiated": true,
    "link": "https://makedeveloper.tech", // send this attribute only if isInitiated = true
    "stacks": ["MERN", "MEAN"],
    "fieldOfStudy": ["Web Dev", "Machine Learning"],
    "lookingFor": "mentor",         // send one of [mentor, mentee, both]
    "idea": "Open source collaboration"
}
```
response-data: 
```
"5f05fdbb2fe6272c7822b026" //ID of the newly created project
```
### View all projects 
endpoint: /project/all  
type: GET  
request-header: Not Required  
response-data: array of json objects, each object being one project  
```
// sample response
[
    {
        "stacks": [
            "MERN",
            "MEAN"
        ],
        "_id": "5f07411154dd016500a8d585",
        "name": "Make Developer",
        "idea": "Open source collaboration"
    },
    {
        "stacks": [
            "MERN",
            "MEAN"
        ],
        "_id": "5f07411754dd016500a8d586",
        "name": "Make Web",
        "idea": "Open source collaboration"
    }
]
```
  
### View all projects of current user
endpoint: /project  
type: GET  
request-header: x-auth-token  
response-data: array of json objects, each object being one project
```
// sample response
[
    {
        "stacks": [
            "MERN",
            "MEAN"
        ],
        "fieldOfStudy": [
            "Web Dev",
            "Machine Learning"
        ],
        "_id": "5f05fd8f2fe6272c7822b023",
        "name": "Make Developer",
        "isInitiated": true,
        "link": "http://domain.com",
        "lookingFor": "mentor",
        "idea": "Open source collaboration",
        "userId": "5efb94ea93f42e431cb8bde4",
        "__v": 0
    },
    {
        "stacks": [
            "MERN",
        ],
        "fieldOfStudy": [
            "Web Dev",
        ],
        "_id": "5f0611532acfbc48c4b3cf61",
        "name": "Make Developer",
        "isInitiated": true,
        "link": "http://domain.com",
        "lookingFor": "mentor",
        "idea": "Open source collaboration",
        "userId": "5efb94ea93f42e431cb8bde4",
        "__v": 0
    }
]
```
### View particular project  
endpoint: /project/< projectID >  
type: GET  
request-header: Not Required  
response-data: json object of the project
```
{
    "projectDetails": {
        "stacks": [
            "MERN",
            "MEAN"
        ],
        "fieldOfStudy": [
            "Web Dev",
            "Machine Learning"
        ],
        "_id": "5f07411154dd016500a8d585",
        "name": "Make Developer",
        "isInitiated": true,
        "link": "http://domain.com",
        "lookingFor": "mentor",
        "idea": "Open source collaboration",
        "userId": "5efb94ea93f42e431cb8bde4",
        "__v": 0
    },
    "comments": [
        {
            "comment": "A sample test comment",
            "timestamp": "2020-07-10T12:30:19.762Z",
            "username": "Dave123"
        },
        {
            "comment": "Another sample comment",
            "timestamp": "2020-07-10T12:30:19.762Z",
            "username": "Sarah121"
        }
    ]
}
```
## Join Project
### Join an existing project
endpoint: /collaborator/join  
type: POST  
request-header: x-auth-token  
request-data:
```
{
    "projectId": "5f07411154dd016500a8d585",
    "stacks": ["MERN", "MEAN"],
    "fieldOfStudy": ["Web Dev", "Machine Learning"],
    "experienceLevel": 5,
    "joinAs": "mentee",
    "note": "sample"        //optional. Do NOT send if note is empty
}
```
response-data: `HTTP status 201 (Content Created)`
    
### Create a join request for admin to assign later
endpoint: /collaborator/request  
type: POST  
request-header: x-auth-token  
request-data:
```
{
    "stacks": ["MERN", "MEAN"],
    "fieldOfStudy": ["Web Dev", "Machine Learning"],
    "experienceLevel": 5,
    "joinAs": "mentee",
    "note": "sample"    //optional. Do NOT send if note is empty
}
```
response-data: `HTTP status 201 (Content Created)`

## Comment
### Add new comment
endpoint: /comment/< projectId >  
type: POST  
request-header: x-auth-token  
request-data:
```
{
    "comment": "Another sample comment",
    "timestamp": "2020-07-10T12:30:19.762+00:00"    // must be Javascript Date object
}
```
response-data: `HTTP status 201 (Content Created)`

This is our basic UI for the front page (For Frontend visit this repo : [makeweb-frontend](https://github.com/makedeveloper/makeweb-frontend)

![makeproject 001](https://user-images.githubusercontent.com/43684300/86630089-ffe98280-bfe9-11ea-92df-9eb525aecb9d.jpeg)
