# Dynamic Form Builder & CRUD System

A full-stack application for building dynamic forms, managing collections, and performing CRUD operations on any schema, using React (frontend), Node.js/Express (backend), and MongoDB.

---

## 📁 Project Directory Structure

```
CRUD/
│
├── backend/
│   ├── models/                # Mongoose schemas and DB connection
│   │   ├── FormBuilderSchema.js   # Schema for form builder configurations
│   │   ├── User.js                # User schema
│   │   └── db.js                  # MongoDB connection logic
│   ├── routes/                # Express route handlers
│   │   ├── DynamicRoutes.js       # Dynamic CRUD for any collection
│   │   ├── formBuilderRoutes.js   # CRUD for form builder configs
│   │   └── userRoutes.js          # CRUD for users
│   ├── utils/
│   │   └── modelGenerator.js      # (Optional) Dynamic Mongoose model generator
│   ├── server.js              # Main Express server entry point
│   └── package.json           # Backend dependencies and scripts
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DynamicForm/       # Dynamic form rendering
│   │   │   ├── FormBuilder/       # Form builder UI
│   │   │   ├── Layout/            # App layout and sidebar
│   │   │   ├── Table/             # Dynamic data tables
│   │   │   └── UserForm/          # User CRUD form
│   │   ├── routes/            # Route definitions
│   │   │   └── routes.jsx
│   │   ├── config.js          # API endpoints config
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies and scripts
│   └── vite.config.js         # Vite config
│
├── .gitignore
├── README.md                  # Project documentation
└── ...
```

---

## 📄 File/Folder Purposes

### Backend

- **models/FormBuilderSchema.js**: Stores form schema definitions (collection name + fields).
- **models/User.js**: User schema for user management.
- **models/db.js**: Connects to MongoDB using environment variables.
- **routes/formBuilderRoutes.js**: CRUD API for form builder configurations.
- **routes/DynamicRoutes.js**: Generic CRUD API for any collection (dynamic).
- **routes/userRoutes.js**: CRUD API for users.
- **utils/modelGenerator.js**: (Optional) Utility to generate Mongoose models dynamically.
- **server.js**: Sets up Express, connects routes, and starts the server.

### Frontend

- **components/FormBuilder/**: UI for creating/editing form schemas.
- **components/DynamicForm/**: Renders forms dynamically based on schema.
- **components/Table/**: Displays data for any collection in a table.
- **components/UserForm/**: User CRUD form and table.
- **components/Layout/**: Sidebar and layout for navigation.
- **routes/routes.jsx**: Defines all frontend routes.
- **config.js**: Centralizes backend API endpoints.
- **App.jsx / main.jsx**: App entry and router setup.

---

## 🌐 API Endpoints & Routes

### Backend API Endpoints

#### 1. **Form Builder (Form Configurations)**
- `POST   /api/formbuilders`  
  Create a new form schema.  
  **Body:** `{ collectionName, schema: [ { field, type, label, required, options } ] }`

- `GET    /api/formbuilders`  
  Get all form schemas.

- `GET    /api/formbuilders/:collectionName`  
  Get schema for a specific collection.

- `PUT    /api/formbuilders/:id`  
  Update a form schema by ID.

- `DELETE /api/formbuilders/:id`  
  Delete a form schema by ID.

#### 2. **Dynamic Data (Any Collection)**
- `POST   /api/dynamic/:collection`  
  Create a new record in a dynamic collection.  
  **Body:** `{ ...fields }`

- `GET    /api/dynamic/:collection`  
  Get all records from a collection.

- `GET    /api/dynamic/:collection/:id`  
  Get a single record by ID.

- `PUT    /api/dynamic/:collection/:id`  
  Update a record by ID.

- `DELETE /api/dynamic/:collection/:id`  
  Delete a record by ID.

#### 3. **Users**
- `POST   /api/users`  
  Create a user.

- `GET    /api/users`  
  Get all users.

- `GET    /api/users/:id`  
  Get a user by ID.

- `PUT    /api/users/:id`  
  Update a user by ID.

- `DELETE /api/users/:id`  
  Delete a user by ID.

---

### Frontend Routes

Defined in `src/routes/routes.jsx`:

| Path                                 | Component           | Purpose                                 |
|---------------------------------------|---------------------|-----------------------------------------|
| `/`                                  | FormBuilder         | Main form builder page                  |
| `/forms`                             | FormBuilder         | Form builder (list/create)              |
| `/forms/:id/edit`                    | FormBuilder         | Edit a form schema                      |
| `/dynamic/:collectionName`           | DynamicForm         | Create new record for collection        |
| `/dynamic/:collectionName/:id`       | DynamicForm         | Edit record for collection              |
| `/users`                             | UserForm            | User management                         |
| `/table/:collectionName`             | Table               | Table view for any collection           |

---

## 🔄 How Dynamic Routing & API Calls Work

- **Form Builder**:  
  - User creates a new form schema (fields, types, etc.) via `/forms`.
  - Schema is saved in MongoDB (`FormBuilder` collection).
  - Each schema defines a new logical collection.

- **Dynamic Forms**:  
  - When accessing `/dynamic/:collectionName`, frontend fetches the schema for `collectionName` from `/api/formbuilders/:collectionName`.
  - The form is rendered dynamically based on the schema fields.
  - Submitting the form sends data to `/api/dynamic/:collectionName` (POST for create, PUT for update).

- **Dynamic Tables**:  
  - `/table/:collectionName` fetches all records from `/api/dynamic/:collectionName`.
  - Table columns are generated from the schema fields.

- **Editing Records**:  
  - `/dynamic/:collectionName/:id` fetches the record and schema, pre-fills the form, and updates via PUT.

- **Adding New Collections**:  
  - Creating a new form schema in the builder automatically enables new routes and APIs for that collection.

---

## 🚦 Example Flow

1. **Create a Form Schema**:  
   - Go to `/forms`, define fields, and save.
2. **Add Data**:  
   - Go to `/dynamic/yourCollection`, fill the form, submit.
3. **View/Edit Data**:  
   - Go to `/table/yourCollection`, view, edit, or delete records.
4. **APIs**:  
   - All CRUD operations are available for any collection, dynamically.

---

## 🛠️ Environment Setup

1. **Backend**
   - `cd backend && npm install`
   - Create `.env` with:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/
     dDBNAME=crud
     ```
   - `npm run dev`

2. **Frontend**
   - `cd frontend && npm install`
   - `npm run dev`

---

## 📚 Summary

- **Dynamic**: Any number of collections/forms can be created at runtime.
- **Extensible**: Add new field types or validation easily.
- **API-Driven**: All CRUD operations are exposed via RESTful endpoints.
- **Single Source of Truth**: Form schemas drive both UI and backend validation.

---