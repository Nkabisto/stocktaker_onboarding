# Stocktaker System - Quick Reference Guide

## 🚀 Quick Start Commands

### Initial Setup
```bash
# Create PostgreSQL database
psql postgres
CREATE DATABASE stocktaker_db;
CREATE USER stocktaker_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE stocktaker_db TO stocktaker_user;
\q

# Install backend dependencies
cd server
npm init -y
npm install express pg dotenv cors svix body-parser @clerk/clerk-sdk-node
npm install --save-dev nodemon

# Install frontend dependencies
cd client
npm create vite@latest . -- --template react
npm install react-router-dom @clerk/clerk-react axios react-hook-form zod @hookform/resolvers zustand date-fns react-calendar
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Running the Application
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend  
cd client
npm run dev

# Terminal 3 (if using ngrok for webhooks):
ngrok http 5000
```

## 📁 Complete File Structure

```
root/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormCheckbox.jsx
│   │   │   ├── FormContainer.jsx
│   │   │   ├── FormInput.jsx
│   │   │   ├── FormNavigation.jsx
│   │   │   ├── FormSelect.jsx
│   │   │   ├── FormTextarea.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StepWrapper.jsx
│   │   ├── pages/
│   │   │   ├── form-steps/
│   │   │   │   ├── PersonalInfoStep.jsx
│   │   │   │   ├── AddressInfoStep.jsx
│   │   │   │   ├── EmploymentInfoStep.jsx
│   │   │   │   ├── AvailabilityInfoStep.jsx
│   │   │   │   └── BankingInfoStep.jsx
│   │   │   ├── InstructionsPage.jsx
│   │   │   └── MultiStepForm.jsx
│   │   ├── store/
│   │   │   └── formStore.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── schema.sql
│   │   ├── controllers/
│   │   │   ├── userController.js
│   │   │   └── webhookController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── verifyWebhook.js
│   │   ├── routes/
│   │   │   ├── users.js
│   │   │   └── webhooks.js
│   │   └── tests/
│   │       ├── test-db-connection.js
│   │       └── test-user-api.js
│   ├── app.js
│   ├── .env
│   └── package.json
│
├── .env.local
└── README.md
```

## 🔑 Environment Variables

### Root `.env.local`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

### Server `.env`
```env
DATABASE_URL=postgresql://stocktaker_user:password@localhost:5432/stocktaker_db
CLERK_WEBHOOK_SECRET=whsec_xxxxx
PORT=5000
NODE_ENV=development
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

## 🗄️ Database Schema Quick Reference

### Users Table
```sql
id VARCHAR(255) PRIMARY KEY         -- Clerk userId
email VARCHAR(255) UNIQUE NOT NULL
first_name VARCHAR(100)
last_name VARCHAR(100)
has_completed_form BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Form Submissions Table
```sql
id SERIAL PRIMARY KEY
user_id VARCHAR(255) REFERENCES users(id)
form_data JSONB NOT NULL DEFAULT '{}'
step_completed INTEGER DEFAULT 0
is_complete BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## 🌐 API Endpoints Reference

### User Endpoints
```
GET    /api/users/:userId/status           - Get user status
POST   /api/users/upsert                   - Create/update user
GET    /api/users/:userId/form-progress    - Get form progress
POST   /api/users/form-progress            - Save form progress
```

### Webhook Endpoints
```
POST   /api/webhooks/clerk                 - Clerk webhook handler
```

### Health Check
```
GET    /health                             - Server health check
```

## 📊 Form Steps Overview

| Step | Section | Fields | Focus Area |
|------|---------|--------|------------|
| 1 | Personal Info | 25 | Basic identity, contact details |
| 2 | Address | 20 | Residential & postal addresses |
| 3 | Employment | 25 | Work history, experience |
| 4 | Availability | 25 | Schedule, transport, travel |
| 5 | Banking & Refs | 25 | Payment, emergency contacts, references |

## 🧪 Testing Commands

### Database Tests
```bash
# Test database connection
cd server
node src/tests/test-db-connection.js

# Query users
psql -U stocktaker_user -d stocktaker_db -c "SELECT * FROM users;"

# Query form submissions
psql -U stocktaker_user -d stocktaker_db -c "SELECT * FROM form_submissions;"

# Run schema
psql -U stocktaker_user -d stocktaker_db -f src/config/schema.sql
```

### API Tests
```bash
# Health check
curl http://localhost:5000/health

# Test user API (requires auth)
node src/tests/test-user-api.js
```

### Frontend Tests
```bash
# Open in browser
http://localhost:5173

# Check localStorage
# Open DevTools → Application → Local Storage → http://localhost:5173
# Look for: stocktaker-form-storage
```

## 🐛 Common Issues & Solutions

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql     # Linux
```

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in server/.env
PORT=5001
```

### Clerk Webhooks Not Working
```bash
# Ensure ngrok is running
ngrok http 5000

# Update Clerk dashboard with new ngrok URL
# https://dashboard.clerk.com → Webhooks

# Check webhook secret in server/.env
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

### Form State Not Persisting
```javascript
// Clear localStorage and test again
localStorage.clear();
// Or specifically:
localStorage.removeItem('stocktaker-form-storage');
```

### CORS Errors
```javascript
// Check server/app.js CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 📝 Useful Code Snippets

### Query Database from Node
```javascript
const { query } = require('./src/config/database');
const result = await query('SELECT * FROM users LIMIT 5');
console.log(result.rows);
```

### Get Clerk Token in Frontend
```javascript
import { useAuth } from '@clerk/clerk-react';

function MyComponent() {
  const { getToken } = useAuth();
  
  const fetchData = async () => {
    const token = await getToken();
    // Use token for API calls
  };
}
```

### Update Form Store
```javascript
import useFormStore from './store/formStore';

function MyComponent() {
  const { updateFormData, formData } = useFormStore();
  
  const handleUpdate = () => {
    updateFormData('personalInfo', {
      firstName: 'John',
      lastName: 'Doe'
    });
  };
}
```

### Protected API Call
```javascript
import { userAPI, setAuthToken } from './utils/api';

const token = await getToken();
setAuthToken(token);
const response = await userAPI.getStatus(userId);
```

## 🎯 Phase Completion Checklist

### Phase 1: Database ✓
- [ ] PostgreSQL installed and running
- [ ] Database and user created
- [ ] Schema applied
- [ ] Test script passes
- [ ] Webhooks configured
- [ ] User sync working

### Phase 2: Routing ✓
- [ ] API endpoints responding
- [ ] Auth middleware working
- [ ] Instructions page displays
- [ ] Protected routes functional
- [ ] User created on signup

### Phase 3: Form Foundation ✓
- [ ] Zustand store working
- [ ] Form components render
- [ ] Navigation functional
- [ ] Progress bar updates
- [ ] State persists

### Phase 4: Form Fields
- [ ] Step 1 fields implemented
- [ ] Step 2 fields implemented
- [ ] Step 3 fields implemented
- [ ] Step 4 fields implemented
- [ ] Step 5 fields implemented
- [ ] Validation working

### Phase 5: Submission
- [ ] Form submits successfully
- [ ] Data saved to database
- [ ] User status updated
- [ ] Auto-login works
- [ ] Redirect to dashboard

### Phase 6: Dashboard
- [ ] Dashboard renders
- [ ] Calendar displays
- [ ] Booking system works
- [ ] Full flow complete

## 💻 VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- PostgreSQL (by Chris Kolkman)
- ESLint
- Prettier
- Auto Rename Tag
- Path Intellisense

## 🔗 Important URLs

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health Check: `http://localhost:5000/health`
- ngrok URL: `https://xxxx.ngrok.io` (changes each time)

### Clerk Dashboard
- Dashboard: `https://dashboard.clerk.com`
- Webhooks: `https://dashboard.clerk.com/apps/[app-id]/webhooks`
- Users: `https://dashboard.clerk.com/apps/[app-id]/users`

### PostgreSQL
- Default Port: `5432`
- Connection: `postgresql://user:pass@localhost:5432/stocktaker_db`

## 📚 Documentation Links

- [Main Roadmap](./IMPLEMENTATION-SUMMARY.md)
- [Phase 0: Setup](./00-OVERVIEW-AND-SETUP.md)
- [Phase 1: Database](./01-PHASE-1-DATABASE-SETUP.md)
- [Phase 2: Routing](./02-PHASE-2-USER-STATUS-ROUTING.md)
- [Phase 3: Form Foundation](./03-PHASE-3-FORM-FOUNDATION.md)

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

---

**Pro Tip:** Bookmark this page for quick access to commands and references during development!
