# Chat API Implementation Guide

## Overview
This document describes the implementation of the structured chat API with thread_id management and agent selection features.

## API Endpoint
```
POST: /api/v1/chats/structured
```

## Request Body Structure

### First Message (New Chat Session)
```json
{
    "query": "hi"
}
```

### Subsequent Messages (With Thread ID)
```json
{
    "query": "tell me more",
    "thread_id": "ebc2dfc3-8cb7-4fd5-8372-afa8fe00d110"
}
```

### With Agent Selection
```json
{
    "query": "explain DBMS",
    "thread_id": "ebc2dfc3-8cb7-4fd5-8372-afa8fe00d110",
    "agent_name": "dbms_agent"
}
```

## Implementation Details

### 1. Thread ID Management
- **First Message**: `thread_id` is NOT sent in the request
- **Subsequent Messages**: `thread_id` received from the first response is sent with all following messages
- Thread ID is stored in React Context and persists throughout the chat session
- Thread ID is reset when starting a new chat

### 2. Agent Selection
- Users can optionally select a specialized agent from a dropdown menu
- Available agents:
  - **DBMS Agent** (`dbms_agent`) - Database Management Expert
  - **Python Agent** (`python_agent`) - Python Programming Expert
  - **Java Agent** (`java_agent`) - Java Programming Expert
  - **Web Development Agent** (`web_agent`) - Web Development Expert
  - **ML Agent** (`ml_agent`) - Machine Learning Expert
  - **No Agent (Default)** - General AI assistant

- The selected agent is stored in React Context
- Agent selection is optional - users can use the default behavior without selecting an agent
- The agent selection persists across messages in the same chat session

### 3. UI/UX Features

#### Agent Selection Dropdown
- Located in the navigation bar next to the model selector
- Visual indicator (blue dot) when an agent is selected
- Highlighted button with blue background when an agent is active
- Dropdown shows all available agents with descriptions
- Click outside to close the dropdown

#### Thread ID (Hidden from User)
- Thread ID is managed internally and not displayed in the UI
- Automatically included in requests after the first message
- Reset when starting a new chat session

## Modified Files

### 1. `/src/services/apiService.js`
Added new method `structuredChat()`:
```javascript
static async structuredChat(query, threadId = null, agentName = null)
```

### 2. `/src/config/chatResponse.js`
Updated `runChat()` function to accept `threadId` and `agentName` parameters:
```javascript
async function runChat(prompt, threadId = null, agentName = null)
```

### 3. `/src/context/Context.jsx`
Added state management for:
- `threadId` - Current chat session thread ID
- `selectedAgent` - Currently selected agent

Updated functions:
- `newChat()` - Resets thread ID when starting new chat
- `onSent()` - Passes thread ID and selected agent to API

### 4. `/src/components/Chat/Chat.jsx`
Added:
- Agent selection dropdown UI
- Agent list with descriptions
- Click-outside handler to close dropdown
- Visual indicators for selected agent

### 5. `/src/components/Chat/Chat.css`
Added styles for:
- Agent dropdown animations
- Selected state styles
- Hover effects

## Usage Example

### 1. Start a New Chat
```javascript
// User sends first message - no thread_id
POST /api/v1/chats/structured
{
    "query": "hi"
}

// Server responds with thread_id
Response: {
    "response": "Hello! How can I help you?",
    "thread_id": "ebc2dfc3-8cb7-4fd5-8372-afa8fe00d110",
    "course": "General"
}
```

### 2. Continue the Chat
```javascript
// Subsequent messages include thread_id
POST /api/v1/chats/structured
{
    "query": "tell me about Python",
    "thread_id": "ebc2dfc3-8cb7-4fd5-8372-afa8fe00d110"
}
```

### 3. Use a Specialized Agent
```javascript
// User selects Python Agent from dropdown
POST /api/v1/chats/structured
{
    "query": "explain list comprehensions",
    "thread_id": "ebc2dfc3-8cb7-4fd5-8372-afa8fe00d110",
    "agent_name": "python_agent"
}
```

## Environment Configuration

Make sure your `.env` file contains:
```env
VITE_API_URL=http://localhost:8000/api/v1/chats/structured
```

Or update the base URL in `apiService.js` if using a different endpoint.

## Testing

1. **First Message**: Send a message without agent - verify thread_id is NOT sent
2. **Second Message**: Verify thread_id from first response is sent
3. **Agent Selection**: Select an agent and verify agent_name is sent
4. **New Chat**: Click "New Chat" and verify thread_id is reset
5. **No Agent**: Test without selecting an agent - verify agent_name is NOT sent

## Notes

- Thread ID management is completely transparent to the user
- Agent selection is optional and user-controlled
- The system gracefully handles missing thread_id or agent_name
- All parameters are conditionally included based on state
