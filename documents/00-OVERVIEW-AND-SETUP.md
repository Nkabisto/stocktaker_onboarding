# Stocktaker Management System - Implementation Roadmap

## 📋 Overview

This is a comprehensive, step-by-step implementation guide for building your Stocktaker Management System. Each phase is designed to be implemented and fully tested before moving to the next, ensuring stable, incremental progress.

## 🎯 Project Goals

- Multi-step user registration workflow
- Clerk authentication integration
- PostgreSQL data persistence
- 120+ field form with progress saving
- Calendar booking dashboard
- Professional UI/UX

## 📂 Project Structure

```
root/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand state management
│   │   ├── utils/             # API helpers
│   │   ├── tests/             # Test components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                   # Environment variables
│   ├── index.html
│   └── package.json
├── server/                     # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Database & configuration
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth & validation
│   │   ├── routes/            # API routes
│   │   └── tests/             # Test scripts
│   ├── app.js                 # Main server file
│   ├── .env                   # Server environment variables
│   └── package.json
├── .env.local                  # Clerk keys (root)
└── package.json               # Root package file
```

## 📅 Implementation Phases

### Phase 1: Database Setup & User Synchronization (2-3 hours)
- PostgreSQL connection
- Schema creation
- Clerk webhook integration
- User synchronization

### Phase 2: User Status Check & Routing (2-3 hours)
- Protected routes
- Instructions page
- User status API
- Navigation logic

### Phase 3: Multi-step Form Foundation (3-4 hours)
- Zustand state management
- Form layout components
- Progress tracking
- Navigation components

### Phase 4: Form Implementation (6-8 hours)
- Step 1: Personal Information (25 fields)
- Step 2: Address Information (20 fields)
- Step 3: Employment History (25 fields)
- Step 4: Availability & Transport (25 fields)
- Step 5: Banking & Emergency (25 fields)
- Validation with Zod

### Phase 5: Form Submission & Auto-login (2-3 hours)
- Save to PostgreSQL
- Update user status
- Auto-login implementation
- Success handling

### Phase 6: Dashboard & Calendar (4-5 hours)
- Dashboard layout
- Calendar component
- Booking functionality
- Complete user flow

**Total Estimated Time: 19-26 hours**

## 🔧 Prerequisites & Setup

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18+
   ```

2. **PostgreSQL** (v14 or higher)
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # Windows: Download from postgresql.org
   ```

3. **npm or yarn**
   ```bash
   npm --version  # Should be 9+
   ```

### Clerk Account Setup

1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Get API keys from Dashboard → API Keys
4. Configure OAuth providers (optional)
5. Set up webhook endpoint (we'll do this in Phase 1)

### Database Setup

```bash
# Create database
psql postgres
CREATE DATABASE stocktaker_db;
CREATE USER stocktaker_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE stocktaker_db TO stocktaker_user;
\q
```

### Environment Variables Setup

Create these files with your actual values:

**Root `.env.local`:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

**Server `.env`:**
```env
DATABASE_URL=postgresql://stocktaker_user:your_password@localhost:5432/stocktaker_db
CLERK_WEBHOOK_SECRET=whsec_xxxxx
PORT=5000
NODE_ENV=development
```

**Client `.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Install Dependencies

**Backend:**
```bash
cd server
npm init -y
npm install express pg dotenv cors svix body-parser @clerk/clerk-sdk-node
npm install --save-dev nodemon
```

**Frontend:**
```bash
cd client
npm create vite@latest . -- --template react
npm install react-router-dom @clerk/clerk-react axios react-hook-form zod @hookform/resolvers zustand date-fns react-calendar
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Tailwind CSS Configuration

**client/tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**client/src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Package.json Scripts

**Server package.json:**
```json
{
  "scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js"
  }
}
```

**Client package.json:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## ✅ Pre-flight Checklist

Before starting Phase 1, verify:

- [ ] Node.js installed (v18+)
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] Clerk account created
- [ ] API keys obtained
- [ ] Environment files created
- [ ] Dependencies installed (both client & server)
- [ ] Tailwind CSS configured
- [ ] Both servers can start without errors

### Test Your Setup

```bash
# Test PostgreSQL
psql -U stocktaker_user -d stocktaker_db -c "SELECT version();"

# Test Node.js
node --version
npm --version

# Test server starts
cd server
npm run dev
# Should see: ✓ Server running on port 5000

# Test client starts (in new terminal)
cd client
npm run dev
# Should see: ➜ Local: http://localhost:5173/
```

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🚀 Next Steps

Once your setup is complete, proceed to:
- **Phase 1**: Database Setup & User Synchronization (see `01-PHASE-1-DATABASE-SETUP.md`)

---

**Note:** Each phase document includes:
- Clear objectives
- Complete code with comments
- Testing instructions
- Verification checklists
- Troubleshooting tips
