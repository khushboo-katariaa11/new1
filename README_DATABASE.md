# 🗄️ Database Access Guide

## 🚀 Quick Setup

### 1. **Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub/Google or email

### 2. **Create New Project**
1. Click "New Project"
2. Choose your organization
3. Enter project details:
   - **Name**: `learning-management-system`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project"

### 3. **Get Your Database Credentials**
Once your project is ready (takes ~2 minutes):

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Project API Key** (anon/public key)

### 4. **Update Environment Variables**
Update your `.env` file with your credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. **Run Database Migrations**
In your Supabase dashboard:

1. Go to **SQL Editor**
2. Click "New Query"
3. Copy and paste each migration file content from `supabase/migrations/`
4. Run them in order (they're numbered)

## 📊 **Database Access Methods**

### **Option 1: Supabase Dashboard (Recommended for beginners)**
- Go to your project dashboard
- Click **Table Editor** to view/edit data
- Click **SQL Editor** to run custom queries
- Click **Authentication** to manage users

### **Option 2: Direct Database Connection**
Get your database URL from **Settings** → **Database**:
```
postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres
```

### **Option 3: API Access (What your app uses)**
Your app automatically connects using the environment variables.

## 🔧 **Database Structure**

### **Tables Created:**
- `users` - User profiles and accessibility settings
- `courses` - Course information and metadata
- `enrollments` - Student course enrollments
- `payments` - Payment transactions (60/40 split)
- `reviews` - Course reviews and ratings
- `certificates` - Completion certificates
- `streaks` - Learning streak tracking
- `achievements` - User achievements

### **Key Features:**
- **Row Level Security (RLS)** - Users can only access their own data
- **Real-time subscriptions** - Live updates
- **Automatic revenue calculations** - 40% platform, 60% instructor
- **Accessibility settings storage** - Applied instantly

## 🎯 **Quick Test**

1. **Sign up a test user** in your app
2. **Check the `users` table** in Supabase dashboard
3. **Verify accessibility settings** are stored correctly

## 🔐 **Security Notes**

- **Never share your service role key** publicly
- **Use anon key** for client-side applications
- **RLS policies** protect user data automatically
- **Environment variables** keep credentials secure

## 📱 **Mobile/Desktop Access**

You can also access your database via:
- **Supabase CLI** (command line)
- **Database clients** like pgAdmin, DBeaver
- **Mobile apps** like Supabase Studio

## 🆘 **Troubleshooting**

### **Can't connect?**
- Check your environment variables
- Verify project URL and API key
- Ensure project is not paused

### **Migrations failing?**
- Run migrations in order
- Check for syntax errors
- Verify you have proper permissions

### **Data not showing?**
- Check RLS policies
- Verify user authentication
- Look at browser console for errors

## 🎉 **You're Ready!**

Your learning management system now has a production-ready database with:
- ✅ User authentication with accessibility features
- ✅ Course management and enrollment
- ✅ Payment processing with revenue splits
- ✅ Real-time updates and notifications
- ✅ Secure data access with RLS

Start by creating a test account and exploring the features!