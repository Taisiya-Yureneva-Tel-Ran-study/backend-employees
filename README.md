# Node.js intro

## HW #8 backend

### Initial code of Employees Back-End
#### "express" WEB Service for processing CRUD requests from React application

##### Protocol
- GET / : returns all employees stored in the memory map or empty array
- GET /[id]: returns employee with the specified id or error 404
- POST / : adds a new employee with the parameters specified in body to the map and returns the employee. If id is not specified, new guid is generated. If id is specified it is checked if it is already exist in the map.
- PATCH /[id] : updates the employee with the specified id and returns the updated employee. If the employee does not exist, error is returned.
- DELETE /[id] : removes employee with the specified id from the map. If the employee does not exist, error is returned.