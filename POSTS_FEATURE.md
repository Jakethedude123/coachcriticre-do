# Posts Feature Implementation

## Overview
A comprehensive social media-style posts feature for the CoachCritic platform, allowing coaches to share insights, tips, and transformations with the community.

## Features Implemented

### 🏠 Main Posts Page (`/posts`)
- **LinkedIn-style feed layout** with modern, professional design
- **"Start a Post" box** with placeholder text: "Share a tip, transformation, or insight..."
- **Expandable post creation** with text input, image upload, and tag selection
- **Filter dropdown** for "All Posts," "My Posts," and "Followed Tags"
- **Real-time feed** displaying posts from all coaches

### ✍️ Post Creation
- **Text content** (required, max 1000 characters)
- **Image upload** (optional, 5MB limit, one image per post)
- **Tag selection** from existing site tag system (max 3 tags)
- **Preview functionality** for images and selected tags
- **Validation** for content length and file types

### 📱 Post Display
- **Coach profile photo, name, and rating badge**
- **Selected tags** with color-coded styling
- **Text content** with proper formatting
- **Image display** (if present) with click tracking
- **Timestamp** using relative time formatting
- **"Pro Verified" badge** for Pro-tier users
- **Like, comment, and share buttons**

### 💬 Interaction Features
- **Like/unlike posts** with real-time counter updates
- **Comment system** with user avatars and timestamps
- **Post deletion** (coach can delete their own posts)
- **Profile visit tracking** when clicking coach names/avatars
- **Image click tracking** for analytics

### 📊 Analytics Integration
- **Post Performance component** in Analytics dashboard
- **Pro-tier analytics** showing:
  - Post views
  - Image clicks
  - Profile visits generated
  - Likes, comments, shares
  - Engagement rate
- **Basic user experience** with blurred values and upgrade prompts
- **Real-time analytics updates** after post publication

### 🔍 Coach Profile Integration
- **Posts tab** accessible from coach profiles (`/coaches/profile/[id]/posts`)
- **Posts link** in coach profile details
- **Individual coach post feeds** showing all posts from a specific coach

### 🏷️ Tag System
- **Comprehensive tag categories**:
  - Training & Technique (Form Tips, Progressive Overload, etc.)
  - Competition (Meet Day, Weight Cutting, etc.)
  - Lifestyle (Mindset, Goal Setting, etc.)
  - Specialized (Female Athletes, Natural Bodybuilding, etc.)
  - Coaching (Client Success, Programming, etc.)
- **Tag filtering** for personalized feeds
- **Visual tag display** with consistent styling

## Technical Implementation

### Database Structure
```typescript
interface Post {
  id: string;
  coachId: string;
  coachName: string;
  coachAvatar?: string;
  coachRating?: number;
  content: string;
  imageUrl?: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likes: string[];
  comments: Comment[];
  analytics: PostAnalytics;
  isProUser: boolean;
}
```

### API Endpoints
- `POST /api/posts` - Create new post
- `GET /api/posts` - Fetch posts with filters
- `GET /api/posts/[id]` - Get individual post
- `PATCH /api/posts/[id]` - Like/unlike, comment
- `DELETE /api/posts/[id]` - Delete post
- `GET /api/posts/[id]/performance` - Get post analytics (Pro only)
- `POST /api/posts/[id]/track-image-click` - Track image clicks
- `POST /api/posts/[id]/track-profile-visit` - Track profile visits

### Firebase Integration
- **Firestore collections**: `posts`
- **Storage**: Image uploads to `posts/{coachId}/` directory
- **Real-time updates**: Post analytics and engagement tracking
- **Security rules**: Coaches can only delete their own posts

### Components
- `PostCard` - Individual post display with interactions
- `CreatePostModal` - Post creation interface
- `PostPerformance` - Analytics dashboard component
- `PostsPage` - Main posts feed page

## User Experience

### For Coaches
1. **Create Posts**: Click "Start a Post" → Add content, image, tags → Publish
2. **View Analytics**: Access Post Performance in Analytics dashboard (Pro only)
3. **Manage Posts**: Delete own posts, view engagement metrics
4. **Engage**: Like and comment on other coaches' posts

### For Users
1. **Browse Feed**: View all posts or filter by followed tags
2. **Interact**: Like posts, add comments, visit coach profiles
3. **Discover**: Find coaches through engaging content and tags
4. **Follow**: Track specific tags for personalized content

### Pro vs Basic Features
- **Basic**: Create and view posts, basic engagement
- **Pro**: Full analytics, detailed performance metrics, advanced insights

## Navigation Integration
- **Navbar**: "Posts" link added to main navigation
- **Coach Profiles**: "View Posts" button on coach profile pages
- **Analytics**: Post Performance section in dashboard

## Styling & Design
- **Consistent with platform**: Uses existing color scheme and design patterns
- **Dark mode support**: Full dark/light theme compatibility
- **Responsive design**: Works on all device sizes
- **Professional appearance**: LinkedIn-inspired layout with modern UI elements

## Future Enhancements
- Post sharing functionality
- Advanced filtering and search
- Post scheduling
- Rich text editing
- Video uploads
- Post templates
- Engagement notifications
- Post insights and recommendations 