## Overview

This project is a Student Records REST API built using Node.js, Express, MongoDB, and Mongoose. It allows users to create, retrieve, update, and delete student records stored in a MongoDB database.

The API was tested using `curl.exe` in Windows PowerShell. The server runs on port `5001`.

## 1. Create a Student Record (POST)

**Endpoint:** `POST /api/students`

**Command:**

```powershell
'{"fullName":"Alex Santos","course":"BSIT","yearLevel":2,"section":"IT-2A"}' | curl.exe -i -X POST http://localhost:5001/api/students -H "Content-Type: application/json" -d "@-"
```

**Explanation:**

- `-X POST` sends a request to create a new student record.
- `-H "Content-Type: application/json"` specifies that the request body contains JSON.
- `-d "@-"` reads the JSON data supplied through the PowerShell pipe.
- The JSON body contains the student's full name, course, year level, and section.

**Expected result:** `201 Created`

The API returns the newly created student document, including its MongoDB-generated `_id` and `createdAt` timestamp.

## 2. Retrieve All Student Records (GET)

**Endpoint:** `GET /api/students`

**Command:**

```powershell
curl.exe -i http://localhost:5001/api/students
```

**Explanation:**

- `GET` retrieves the student records stored in the database.
- `/api/students` is the endpoint for retrieving all students.

**Expected result:** `200 OK`

The API returns a JSON array containing the saved student records.

## 3. Update a Student Record (PUT)

**Endpoint:** `PUT /api/students/:id`

**Command:**

```powershell
'{"yearLevel":3,"section":"IT-3A"}' | curl.exe -i -X PUT http://localhost:5001/api/students/6ae21488806dfc17eff1fb61 -H "Content-Type: application/json" -d "@-"
```

**Explanation:**

- `-X PUT` sends an update request.
- The student ID in the URL identifies the record to update.
- The JSON body specifies the new year level and section.

**Expected result:** `200 OK`

The API returns the updated student document. In this test, the year level changed from `2` to `3`, and the section changed from `IT-2A` to `IT-3A`.

Replace the example ID with the ID of the student you want to update.

## 4. Delete a Student Record (DELETE)

**Endpoint:** `DELETE /api/students/:id`

**Command:**

```powershell
curl.exe -i -X DELETE http://localhost:5001/api/students/6ae21488806dfc17eff1fb61
```

**Explanation:**

- `-X DELETE` sends a request to delete a student record.
- The student ID identifies the record to remove from MongoDB.

**Expected result:** `200 OK`

The API returns a confirmation message and the deleted student document.

### Invalid DELETE Request

The following command was also tested:

```powershell
curl.exe -i -X DELETE http://localhost:5001/api/students/
```

**Result:** `404 Not Found`

The request did not include a student ID, so it did not match the expected delete route. The API returned a route-not-found message.

## 5. Test Results Summary

HTTP Method  Endpoint  Status  Result 

POST    `/api/students`      201 Created  Student record created 
GET     `/api/students`      200 OK       Student records retrieved 
PUT     `/api/students/:id`  200 OK       Student record updated 
DELETE  `/api/students/:id`  200 OK       Student record deleted 

## Conclusion

The CRUD tests demonstrate that the API can create, retrieve, update, and delete student records through HTTP requests. The successful responses confirm that the tested endpoints processed the requests and returned JSON responses.

For the final laboratory submission, verify the health endpoint, input validation, invalid ID handling, and missing-record responses. Also confirm that saved records appear in MongoDB Compass and remain available after restarting the server.
