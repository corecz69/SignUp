# Sign Language Learning App - Development Plan

## Project Overview
Building a comprehensive sign language learning platform for Czech high school that teaches sign interpreters. The app will replace YouTube-based learning with organized, searchable video content.

## Current State Assessment
- **Backend**: Well-developed with complete CRUD operations, missing authentication
- **Frontend**: Early stage with React issues, no API integration
- **Database**: Excellent domain model, needs migration management
- **Integration**: No connection between FE/BE layers

## Development Strategy
Incremental approach focusing on:
1. Fix critical issues first
2. Build core functionality
3. Connect frontend to backend
4. Add advanced features
5. Polish and optimize

---

## Phase 1: Foundation Fixes (Week 1)

### Step 1.1: Fix Critical React Issues
**Priority**: 🔴 Critical
**Effort**: 1 day

```
Fix the React syntax errors and anti-patterns identified in the frontend:
- Add missing key props in sign.map() operations
- Fix invalid JSX comments (// to {/* */})
- Ensure all components follow React best practices
- Test that all existing components render without console errors

Files to modify:
- fe/src/routes/app/debug/signs.tsx
- fe/src/components/cards/sign-card.tsx
- All other card components that have similar issues

Expected outcome: Clean React codebase with no console warnings
```

### Step 1.2: Implement Basic Authentication Backend
**Priority**: 🔴 Critical
**Effort**: 2-3 days

```
Set up Spring Security with JWT authentication for the backend:
- Add Spring Security starter dependency
- Create SecurityConfig with JWT support
- Implement UserDetailsService using existing User entity
- Create AuthController with login/register endpoints
- Add JWT token generation and validation
- Secure all existing endpoints with proper roles
- Add password encoding (BCrypt)

New files:
- be/src/main/java/com/signup/config/SecurityConfig.java
- be/src/main/java/com/signup/security/JwtTokenProvider.java
- be/src/main/java/com/signup/security/JwtAuthenticationFilter.java
- be/src/main/java/com/signup/controller/AuthController.java
- be/src/main/java/com/signup/dto/auth/LoginRequest.java
- be/src/main/java/com/signup/dto/auth/LoginResponse.java

Expected outcome: Secure backend with working login/register endpoints
```

### Step 1.3: Create Basic API Client for Frontend
**Priority**: 🔴 Critical
**Effort**: 1-2 days

```
Create TypeScript API client to connect frontend to backend:
- Set up axios for HTTP requests
- Create API client with proper TypeScript types
- Implement authentication state management
- Create API service classes for each entity type
- Add error handling and loading states
- Set up environment configuration for API base URL

New files:
- fe/src/api/apiClient.ts
- fe/src/api/auth.ts
- fe/src/api/signs.ts
- fe/src/api/categories.ts
- fe/src/types/api.ts
- fe/src/hooks/useAuth.ts

Expected outcome: Frontend can communicate with backend APIs
```

---

## Phase 2: Core Authentication Flow (Week 2)

### Step 2.1: Build Login/Register UI
**Priority**: 🔴 Critical
**Effort**: 2 days

```
Create authentication user interface:
- Design login form with Material-UI
- Design register form with form validation
- Implement protected route wrapper
- Add authentication context provider
- Create logout functionality
- Handle authentication errors gracefully

Files to modify:
- fe/src/routes/login.tsx
- fe/src/routes/register.tsx
- fe/src/contexts/AuthContext.tsx
- fe/src/components/ProtectedRoute.tsx

Expected outcome: Users can login, register and access protected areas
```

### Step 2.2: Implement Real Routing Navigation
**Priority**: 🟡 High
**Effort**: 1-2 days

```
Replace all console.log navigation with actual TanStack Router navigation:
- Update all card components to use navigate() instead of console.log
- Create proper route definitions for sign details, category details, etc.
- Implement breadcrumb navigation
- Add back/forward navigation support
- Test all navigation flows work correctly

Files to modify:
- fe/src/components/cards/sign-card.tsx
- fe/src/components/cards/category-card.tsx
- All other card components
- Add new route files for detail pages

Expected outcome: Full navigation functionality throughout the app
```

### Step 2.3: Create Entity Detail Pages
**Priority**: 🟡 High
**Effort**: 2-3 days

```
Build detail pages for each entity type:
- Sign detail page with video player and full information
- Category detail page with list of signs
- Subject detail page with categories
- User profile page
- Add proper loading states and error handling for each page

New files:
- fe/src/routes/app/sign/$signId.tsx
- fe/src/routes/app/category/$categoryId.tsx
- fe/src/routes/app/subject/$subjectId.tsx
- fe/src/routes/app/user/$userId.tsx
- fe/src/components/VideoPlayer.tsx

Expected outcome: Users can view detailed information for any entity
```

---

## Phase 3: Core Features (Week 3-4)

### Step 3.1: Implement Basic Search
**Priority**: 🟡 High
**Effort**: 3-4 days

```
Add search functionality to find signs and content:
- Create search backend endpoint with full-text search
- Add search UI component with Material-UI
- Implement search filters (category, subject, etc.)
- Add search result highlighting
- Implement search history/suggestions
- Add pagination for search results

Backend files:
- be/src/main/java/com/signup/service/SearchService.java
- be/src/main/java/com/signup/controller/SearchController.java
- be/src/main/java/com/signup/dto/search/SearchRequest.java

Frontend files:
- fe/src/components/SearchBar.tsx
- fe/src/routes/app/search.tsx
- fe/src/api/search.ts

Expected outcome: Users can search and find signs by text
```

### Step 3.2: Implement Video Upload and Streaming
**Priority**: 🟡 High
**Effort**: 2-3 days

```
Enhance video handling for optimal streaming:
- Optimize video file storage and retrieval
- Add video upload UI for admin users
- Implement video player with controls
- Add video thumbnail generation
- Optimize streaming for different device types
- Add video format validation

Files to modify:
- be/src/main/java/com/signup/service/FileStorageService.java
- be/src/main/java/com/signup/controller/FileController.java
- fe/src/components/VideoPlayer.tsx
- fe/src/components/VideoUpload.tsx

Expected outcome: Smooth video upload and playback experience
```

### Step 3.3: Build Admin Dashboard
**Priority**: 🟡 High
**Effort**: 3-4 days

```
Create admin interface for content management:
- Admin dashboard with statistics
- Sign management (create, edit, delete)
- Category management interface
- User management for teachers
- Bulk operations for content
- Content moderation tools

New files:
- fe/src/routes/app/admin/dashboard.tsx
- fe/src/routes/app/admin/signs/manage.tsx
- fe/src/routes/app/admin/users/manage.tsx
- fe/src/components/admin/SignForm.tsx
- fe/src/components/admin/UserManagement.tsx

Expected outcome: Admins can manage all content through web interface
```

---

## Phase 4: Enhanced Learning Features (Week 5-6)

### Step 4.1: Implement Learning Progress Tracking
**Priority**: 🟢 Medium
**Effort**: 3-4 days

```
Add learning analytics and progress tracking:
- Track user learning progress per sign/category
- Create progress dashboard for students
- Add favorite signs functionality
- Implement learning streaks and achievements
- Create progress reports for teachers
- Add study session analytics

Backend additions:
- be/src/main/java/com/signup/entity/LearningProgress.java
- be/src/main/java/com/signup/service/ProgressService.java

Frontend additions:
- fe/src/routes/app/progress.tsx
- fe/src/components/ProgressChart.tsx
- fe/src/hooks/useProgress.ts

Expected outcome: Students can track learning progress and achievements
```

### Step 4.2: Build Private Collections System
**Priority**: 🟢 Medium
**Effort**: 2-3 days

```
Enhance private collections functionality:
- Create/edit/delete private collections UI
- Add signs to collections interface
- Share collections between users
- Collection organization and sorting
- Import/export collection functionality

Files to develop:
- fe/src/routes/app/collections/index.tsx
- fe/src/routes/app/collections/$collectionId.tsx
- fe/src/components/CollectionCard.tsx
- fe/src/components/AddToCollection.tsx

Expected outcome: Users can organize signs into personal collections
```

### Step 4.3: Advanced Search Features
**Priority**: 🟢 Medium
**Effort**: 4-5 days

```
Implement advanced search capabilities:
- Search by sign components (hand shapes, movements)
- Visual search filters using the SignComponent entities
- Advanced filtering UI with multiple criteria
- Search suggestions and autocomplete
- Saved search functionality
- Search analytics for admins

Backend enhancements:
- Enhanced SearchService with component search
- Complex query builder for multi-criteria search

Frontend additions:
- fe/src/components/AdvancedSearchFilters.tsx
- fe/src/components/SignComponentPicker.tsx

Expected outcome: Users can find signs by physical characteristics and movements
```

---

## Phase 5: Polish and Production (Week 7-8)

### Step 5.1: Error Handling and Testing
**Priority**: 🟡 High
**Effort**: 3-4 days

```
Implement comprehensive error handling and testing:
- Add React error boundaries throughout app
- Implement global error handling in backend
- Create comprehensive test suite for API endpoints
- Add frontend component testing
- Implement proper logging and monitoring
- Add data validation and sanitization

Testing files:
- be/src/test/java/com/signup/controller/
- be/src/test/java/com/signup/service/
- fe/src/tests/components/
- fe/src/tests/api/

Expected outcome: Robust application with comprehensive error handling
```

### Step 5.2: Performance Optimization
**Priority**: 🟢 Medium
**Effort**: 2-3 days

```
Optimize application performance:
- Implement React component memoization
- Add lazy loading for routes and components
- Optimize database queries with proper indexing
- Add caching for frequently accessed data
- Optimize video streaming and compression
- Add loading skeletons and better UX

Performance improvements:
- Database indexing for search queries
- React.memo for expensive components
- Code splitting with dynamic imports
- Image/video optimization

Expected outcome: Fast, responsive application with excellent user experience
```

### Step 5.3: Production Deployment Setup
**Priority**: 🟢 Medium
**Effort**: 2-3 days

```
Prepare application for production deployment:
- Set up proper database migrations with Liquibase
- Configure production environment variables
- Add Docker configuration for easy deployment
- Set up CI/CD pipeline basics
- Configure production-ready Spring profiles
- Add health checks and monitoring endpoints

New files:
- be/src/main/resources/db/changelog/
- docker-compose.yml
- Dockerfile (backend and frontend)
- .github/workflows/ci.yml

Expected outcome: Application ready for production deployment
```

---

## Implementation Prompts for Each Step

### Step 1.1 Prompt:
```
Fix critical React issues in the sign language app frontend. The current code has missing key props in map operations and invalid JSX comments.

Issues to fix:
1. In fe/src/routes/app/debug/signs.tsx line 24-30: Add key prop to SignCard in signs.map()
2. In fe/src/components/cards/sign-card.tsx line 20: Change //TODO to {/* TODO */}
3. Review all card components for similar issues

Test that components render without console warnings. Maintain existing functionality while fixing syntax.
```

### Step 1.2 Prompt:
```
Implement JWT authentication for the Spring Boot backend of the sign language app. The User entity already exists with roles (ADMIN, TEACHER, GRADUATE, STUDENT).

Create:
1. SecurityConfig with JWT authentication
2. JwtTokenProvider for token generation/validation
3. AuthController with login/register endpoints
4. Secure existing endpoints with role-based access
5. Use BCrypt for password encoding

Integrate with existing User entity and UserService. Test with REST endpoints.
```

### Step 1.3 Prompt:
```
Create TypeScript API client for the React frontend to connect to the Spring Boot backend. Set up axios with authentication headers and create service classes.

Build:
1. Base API client with axios configuration
2. Authentication service for login/register/logout
3. API services for Signs, Categories, Users entities
4. TypeScript types matching backend DTOs
5. Error handling and loading states
6. useAuth hook for authentication state

Configure for backend running on localhost:8080.
```

### Step 2.1 Prompt:
```
Build authentication UI for the React frontend using Material-UI. Create login and register forms with proper validation and error handling.

Implement:
1. Login form with email/password fields
2. Register form with all required User fields
3. AuthContext for global auth state management
4. ProtectedRoute component for secured areas
5. Navigation integration with TanStack Router
6. Loading states and error messaging

Connect to the API client created in previous step.
```

### Step 2.2 Prompt:
```
Replace all console.log navigation in React components with actual TanStack Router navigation. Update all card components to use proper routing.

Update:
1. SignCard - navigate to sign detail page
2. CategoryCard - navigate to category detail page
3. All other card components with navigation
4. Add route definitions for detail pages
5. Implement breadcrumb navigation
6. Test all navigation flows

Maintain existing component styling and functionality.
```

### Step 2.3 Prompt:
```
Create entity detail pages for the sign language app. Build pages for viewing detailed information about signs, categories, subjects, and users.

Create:
1. Sign detail page with video player and full information
2. Category detail page showing all signs in category
3. Subject detail page with categories list
4. User profile page
5. VideoPlayer component with controls
6. Loading states and error handling for each page

Connect to backend APIs and handle data fetching properly.
```

### Step 3.1 Prompt:
```
Implement search functionality for finding signs in the app. Create both backend search service and frontend search interface.

Backend:
1. SearchService with full-text search across signs and translations
2. SearchController with filtering capabilities
3. Search by category, subject, difficulty level
4. Paginated search results

Frontend:
1. SearchBar component with autocomplete
2. Search results page with filters
3. Search history and suggestions
4. Highlight search terms in results

Test search functionality thoroughly.
```

### Step 3.2 Prompt:
```
Enhance video handling system for optimal streaming and upload. Improve the existing FileStorageService and add video upload UI.

Backend improvements:
1. Optimize video streaming endpoint
2. Add video thumbnail generation
3. Support multiple video formats
4. Video compression and optimization

Frontend additions:
1. Enhanced VideoPlayer with controls
2. VideoUpload component for admins
3. Video thumbnail display
4. Upload progress and error handling

Ensure smooth video playback experience.
```

### Step 3.3 Prompt:
```
Build comprehensive admin dashboard for content management. Create interface for admins to manage signs, categories, users, and content.

Features:
1. Admin dashboard with statistics and overview
2. Sign management (CRUD operations)
3. Category and subject management
4. User management and role assignment
5. Bulk operations for content management
6. Content moderation tools

Use Material-UI for consistent design. Secure admin routes properly.
```

## Success Metrics

### Phase 1 Success:
- [ ] No React console warnings or errors
- [ ] Backend authentication working with JWT tokens
- [ ] Frontend can successfully call backend APIs

### Phase 2 Success:
- [ ] Users can login and access protected areas
- [ ] All navigation works without console.log
- [ ] Detail pages display entity information correctly

### Phase 3 Success:
- [ ] Search returns relevant results
- [ ] Videos upload and stream smoothly
- [ ] Admins can manage all content through web interface

### Phase 4 Success:
- [ ] Users can track learning progress
- [ ] Private collections work end-to-end
- [ ] Advanced search finds signs by characteristics

### Phase 5 Success:
- [ ] Application handles errors gracefully
- [ ] Performance is excellent on all devices
- [ ] Application is ready for production deployment

---

*This plan prioritizes fixing critical issues first, then building core functionality incrementally. Each step builds on the previous ones, ensuring no orphaned code and maintaining working functionality throughout development.*