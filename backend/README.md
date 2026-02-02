# AWS backend (Lambda + API Gateway + DynamoDB)

## 1) DynamoDB
- Table name: `QuizQuestions`
- Primary key: `id` (string)
- TTL attribute: `expiresAt` (number, epoch seconds)

## 2) Lambda functions
Use Node.js and set environment variable:
- `TABLE_NAME=QuizQuestions`

Deploy two functions:
- `POST /quiz` → create quiz and return `{ id }`
- `GET /quiz/{id}` → return `{ questions }`

Code samples in:
- `backend/createQuiz.js`
- `backend/getQuiz.js`

## 3) API Gateway
- Enable CORS
- Routes:
  - `POST /quiz` → create lambda
  - `GET /quiz/{id}` → get lambda

## 4) Frontend config
Set the API base URL in:
- `assets/js/api-config.js`

Example:
```
window.API_BASE_URL = "https://abcd1234.execute-api.us-east-1.amazonaws.com/prod";
```

Then create questions in `crear.html` to get:
`https://quiz.deaftech.com.mx/?id=XXXX`
