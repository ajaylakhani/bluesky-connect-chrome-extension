# Client Implementation Guide

This guide explains how to integrate the Bluesky Connect extension with your website or web application, allowing you to authenticate users through their Bluesky accounts.

## Overview

The Bluesky Connect extension provides a bridge between websites and the Bluesky social network via the AT Protocol. When a user installs the extension and authenticates with their Bluesky account, your website can access their authentication credentials to make authorized API requests to Bluesky on their behalf.

## Detecting the Extension

Before attempting to use the extension, you should check if it's installed and available:

```javascript
function isBlueskyConnectAvailable() {
  return 'atpSession' in window || document.addEventListener('atp-authenticated', () => {}, { once: true });
}
```

## Authentication Events

The extension dispatches custom events to notify your page about authentication changes:

### Login Event

The `atp-authenticated` event is fired when a user successfully logs in or when your page loads with an existing session:

```javascript
document.addEventListener('atp-authenticated', function(event) {
  // event.detail contains user info
  const { handle, did } = event.detail;
  console.log(`User authenticated: ${handle}`);
  
  // Your code to update UI or enable Bluesky features
  updateAuthState(true, handle, did);
});
```

### Logout Event

The `atp-logged-out` event is fired when a user logs out:

```javascript
document.addEventListener('atp-logged-out', function() {
  console.log('User logged out');
  
  // Your code to update UI or disable Bluesky features
  updateAuthState(false);
});
```

## Accessing Authentication Credentials

When a user is authenticated, the extension injects the `atpSession` object into the `window` object, which you can use to make authenticated requests:

```javascript
function getAtpSession() {
  if (window.atpSession) {
    return {
      did: window.atpSession.did,
      handle: window.atpSession.handle,
      accessJwt: window.atpSession.accessJwt,
      refreshJwt: window.atpSession.refreshJwt
    };
  }
  return null;
}
```

## Making Authenticated Requests

Once you have the authentication credentials, you can make requests to the AT Protocol API:

```javascript
async function fetchBlueskyProfile() {
  const session = getAtpSession();
  if (!session) {
    console.error('No ATP session available');
    return null;
  }
  
  try {
    const response = await fetch('https://bsky.social/xrpc/app.bsky.actor.getProfile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessJwt}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Bluesky profile:', error);
    return null;
  }
}
```

## Complete Integration Example

Here's a full example showing how to integrate with the Bluesky Connect extension:

```javascript
// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
  initBlueskyConnect();
});

// Initialize Bluesky Connect integration
function initBlueskyConnect() {
  // Check if already authenticated at page load
  if (window.atpSession) {
    handleAuthenticated(window.atpSession);
  }
  
  // Listen for authentication events
  document.addEventListener('atp-authenticated', function(event) {
    handleAuthenticated(window.atpSession);
  });
  
  document.addEventListener('atp-logged-out', function() {
    handleLogout();
  });
  
  // Update UI to reflect current state
  updateUI();
}

// Handle authenticated user
function handleAuthenticated(session) {
  console.log(`Authenticated as: ${session.handle}`);
  
  // Update UI elements
  document.getElementById('auth-status').textContent = `Logged in as: ${session.handle}`;
  document.getElementById('auth-button').style.display = 'none';
  document.getElementById('user-actions').style.display = 'block';
  
  // Fetch additional user data if needed
  fetchUserProfile();
}

// Handle logout
function handleLogout() {
  console.log('User logged out');
  
  // Update UI elements
  document.getElementById('auth-status').textContent = 'Not logged in';
  document.getElementById('auth-button').style.display = 'block';
  document.getElementById('user-actions').style.display = 'none';
}

// Fetch user profile data
async function fetchUserProfile() {
  const session = window.atpSession;
  if (!session) return;
  
  try {
    const response = await fetch(`https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=${session.did}`, {
      headers: {
        'Authorization': `Bearer ${session.accessJwt}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch profile');
    
    const profile = await response.json();
    document.getElementById('user-name').textContent = profile.displayName;
    document.getElementById('user-bio').textContent = profile.description;
    
    // Additional profile data handling...
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
}

// Update UI based on current authentication state
function updateUI() {
  const isAuthenticated = !!window.atpSession;
  
  document.getElementById('auth-status').textContent = isAuthenticated 
    ? `Logged in as: ${window.atpSession.handle}` 
    : 'Not logged in';
    
  document.getElementById('auth-button').style.display = isAuthenticated ? 'none' : 'block';
  document.getElementById('user-actions').style.display = isAuthenticated ? 'block' : 'none';
}
```

## HTML Structure Example

```html
<div class="bluesky-auth">
  <p id="auth-status">Checking authentication status...</p>
  
  <button id="auth-button" onclick="alert('Please log in with the Bluesky Connect extension')">
    Login with Bluesky
  </button>
  
  <div id="user-actions" style="display: none;">
    <h3 id="user-name"></h3>
    <p id="user-bio"></p>
    
    <!-- Actions that require authentication -->
    <button onclick="postToBluesky()">Post to Bluesky</button>
    <button onclick="fetchBlueskyFeed()">View Feed</button>
  </div>
</div>
```

## Security Considerations

1. **Token Handling**: Never store or transmit the user's JWT tokens outside of your site. They should only be used for direct API calls to Bluesky.

2. **HTTPS Required**: Ensure your website uses HTTPS to protect user credentials during transmission.

3. **Scoped Access**: Only request the minimum permissions needed for your application.

4. **User Consent**: Clearly inform users about what actions you'll take on their behalf.

## Troubleshooting

### Common Issues

1. **Authentication Not Working**
   - Check if the extension is installed and enabled
   - Verify the user is logged in (check extension popup)
   - Check browser console for errors

2. **JWT Token Expired**
   - JWT tokens have an expiration time. If you get a 401 error, it might mean the token has expired.
   - The user may need to log out and log in again.

3. **Content Script Not Loaded**
   - The extension's content script might not be loaded on all pages
   - Add a small delay before checking for `window.atpSession`

## API Reference

The AT Protocol API documentation is available at [atproto.com/docs](https://atproto.com/docs).

## Testing

### Using the Test Page

The repository includes a `test-page.html` file specifically designed for testing the extension integration. This page provides:

1. **Visual Authentication Status** - Shows whether a user is currently authenticated
2. **User Information Display** - When authenticated, displays the user's handle and DID
3. **Event Logging System** - Records and displays all authentication events in real-time
4. **Manual Testing Controls** - Buttons to check authentication state or clear the event log

To use the test page:

1. Clone the repository and open `test-page.html` in your browser
2. The page will automatically check for an existing authentication session
3. Use the Bluesky Connect extension popup to log in/out
4. Watch the event log to see authentication events as they happen
5. Use the "Check Auth State" button to manually verify the current status

The test page serves as both a verification tool and a working example implementation. You can examine its source code to understand the practical implementation of the concepts described in this guide.

### Key Code Sections in Test Page

```javascript
// Check current auth state
function checkAuthState() {
  // This will trigger appropriate events if we have window.atpSession set by content script
  if (window.atpSession) {
    logEvent('Found existing session', 'normal');
    updateAuthDisplay(true, {
      handle: window.atpSession.handle,
      did: window.atpSession.did
    });
  } else {
    logEvent('No session found', 'normal');
    updateAuthDisplay(false);
  }
}

// Listen for authentication events from content script
document.addEventListener('atp-authenticated', function(event) {
  logEvent(`Logged in as: ${event.detail.handle}`, 'login');
  updateAuthDisplay(true, event.detail);
});

document.addEventListener('atp-logged-out', function() {
  logEvent('Logged out', 'logout');
  updateAuthDisplay(false);
});
```

The test page is particularly useful for debugging integration issues and for providing a visual confirmation that the extension is working correctly.

---

For more information or support, please open an issue on the [GitHub repository](https://github.com/ajaylakhani/bluesky-connect/issues).
