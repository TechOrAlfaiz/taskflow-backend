# TaskFlow Backend

Node.js, Express aur MongoDB par bana task-management practice project.

## Features

- User registration aur login
- Argon2 password hashing
- JWT authentication
- Har user ke liye private tasks
- Task create, list, fetch, completion update aur delete
- Pagination aur completed/pending filtering
- Request validation aur JSON error handling
- Authentication rate limiting aur 10 KB JSON body limit

## Local setup

1. `npm install` chalao.
2. `.env.example` ki copy `.env` naam se banao.
3. MongoDB connection URI aur random JWT secret set karo.
4. `npm run dev` se server start karo.

JWT secret generate karne ke liye:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

## Commands

```bash
npm run dev
npm start
npm test
```

## API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Server health |
| POST | `/api/auth/register` | Account create |
| POST | `/api/auth/login` | JWT token |
| GET | `/api/auth/check` | Token verification |
| POST | `/api/tasks` | Task create |
| GET | `/api/tasks` | Apne tasks list |
| GET | `/api/tasks/:id` | Apna task fetch |
| PATCH | `/api/tasks/:id` | Task completion update |
| DELETE | `/api/tasks/:id` | Apna task delete |

Task endpoints aur auth-check endpoint ke liye header:

```text
Authorization: Bearer YOUR_TOKEN
```

List query example:

```text
/api/tasks?page=1&limit=10&completed=false
```

PATCH body example:

```json
{
  "completed": true
}
```

## Verification

- 9 automated tests passing.
- Manual checks: CRUD, pagination, filtering, rate limiting, persistence aur cross-user access rejection.
- Automated tests abhi full database integration suite nahi hain.

## Scope

Ye local practice project hai. Rate-limit counters memory mein hain aur server restart par reset hote hain. Deployment, refresh tokens, password reset aur email verification current scope mein nahi hain.

`.env`, passwords aur access tokens Git mein commit na karein.