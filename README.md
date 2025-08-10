# Node.js intro

## HW #9 backend

### Employees Back-End "express" WEB Service for processing CRUD requests from React application with data storing in a file

##### Environment variables
- PORT - port number the service listens to
- empFileName - name of the file to store employees data

##### Protocol
- GET /employees : returns all employees stored in the memory map or an empty array
- GET /employees/[id]: returns employee with the specified id or error 404
- POST /employees : adds a new employee with the parameters specified in body to the map and returns the employee. If id is not specified, new guid is generated. If id is specified it is checked if it is already exist in the map.
- PATCH /employees/[id] : updates the employee with the specified id and returns the updated employee. If the employee does not exist, error is returned.
- DELETE /employees/[id] : removes employee with the specified id from the map. If the employee does not exist, error is returned.