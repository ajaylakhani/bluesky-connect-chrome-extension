// content.js - This script runs in the context of web pages

// Initialize authentication state when content script loads
function initializeAuthState() {
  chrome.storage.local.get(['atpSession'], function(result) {
    if (result.atpSession) {
      try {
        const session = JSON.parse(result.atpSession);
        // Apply authentication state to this tab
        applyAuthenticationState(session);
      } catch (e) {
        console.error('Failed to parse ATP session data:', e);
      }
    }
  });
}

// Apply the authentication state to the current tab
function applyAuthenticationState(session) {
  // Store session data for use by page interactions
  window.atpSession = session;
  
  // You can add code here to modify the page based on authenticated state
  // For example, adding authentication headers to API requests
  
  console.log('ATP authentication applied:', session.handle);
  
  // Dispatch an event that page scripts can listen for (if needed)
  document.dispatchEvent(new CustomEvent('atp-authenticated', {
    detail: { handle: session.handle, did: session.did }
  }));
}

// Clear authentication state from the current tab
function clearAuthenticationState() {
  // Remove the session data
  window.atpSession = null;
  
  console.log('ATP authentication cleared');
  
  // Dispatch an event that page scripts can listen for (if needed)
  document.dispatchEvent(new CustomEvent('atp-logged-out'));
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'ATP_LOGIN') {
    try {
      const session = JSON.parse(message.session);
      applyAuthenticationState(session);
    } catch (e) {
      console.error('Failed to parse ATP login message:', e);
    }
  } else if (message.action === 'ATP_LOGOUT') {
    clearAuthenticationState();
  }
});

// Initialize when content script loads
initializeAuthState();