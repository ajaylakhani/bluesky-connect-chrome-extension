// popup.js
document.addEventListener('DOMContentLoaded', function() {
  // Element references
  const loginForm = document.getElementById('login-form');
  const userInfo = document.getElementById('user-info');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');
  const userHandle = document.getElementById('user-handle');
  const userDid = document.getElementById('user-did');
  const userPds = document.getElementById('user-pds');
  
  // Add animation effect for button loading state
  function showLoading(button, isLoading, text = 'Connect to Bluesky') {
    if (isLoading) {
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (text || 'Processing...');
      button.disabled = true;
    } else {
      if (button === loginButton) {
        button.innerHTML = `<i class="fas fa-sign-in-alt"></i> ${text}`;
      } else {
        button.innerHTML = `<i class="fas fa-sign-out-alt"></i> Disconnect`;
      }
      button.disabled = false;
    }
  }
  
  // Function to try and get PDS info from DID
  function getPdsInfo(did) {
    fetch(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${did}`)
      .then(response => {
        if (!response.ok) return null;
        return response.json();
      })
      .then(data => {
        if (data && data.pds) {
          userPds.textContent = new URL(data.pds).hostname;
        }
      })
      .catch(() => {
        // Silently fail - PDS info is optional
      });
  }
  
  // Check if user is already logged in
  function checkLoginStatus() {
    chrome.storage.local.get(['atpSession'], function(result) {
      if (result.atpSession) {
        try {
          const session = JSON.parse(result.atpSession);
          showLoggedInState(session);
        } catch (e) {
          chrome.storage.local.remove(['atpSession']);
          showLoginState();
        }
      } else {
        showLoginState();
      }
    });
  }
  
  // Initialize the popup
  checkLoginStatus();
  
  // Handle login button click
  loginButton.addEventListener('click', function() {
    const identifier = identifierInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validate input fields
    if (!identifier || !password) {
      errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter both handle and password';
      return;
    }
    
    errorMessage.textContent = '';
    showLoading(loginButton, true, 'Connecting...');
    
    // Normalize handle if needed
    const normalizedIdentifier = identifier.startsWith('@') ? identifier.substring(1) : identifier;
    
    // Call AT Protocol login API
    fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: normalizedIdentifier,
        password
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || 'Authentication failed');
        });
      }
      return response.json();
    })
    .then(data => {
      // After successful login, try to get PDS info from DID
      getPdsInfo(data.did);
      
      const session = {
        did: data.did,
        handle: data.handle,
        accessJwt: data.accessJwt,
        refreshJwt: data.refreshJwt
      };
      
      // Store session data in chrome.storage.local
      chrome.storage.local.set({
        atpSession: JSON.stringify(session),
        atpLoginTimestamp: Date.now()
      }, function() {
        // Notify all tabs about login using Chrome messaging system
        notifyAllTabs({ action: 'ATP_LOGIN', session: JSON.stringify(session) });
        showLoggedInState(session);
      });
    })
    .catch(error => {
      errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Login failed'}`;
      showLoading(loginButton, false);
    });
  });
  
  // Improved logout that properly notifies all tabs
  logoutButton.addEventListener('click', function() {
    // Update UI to show loading
    logoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    logoutButton.disabled = true;
    
    // Notify all tabs about logout BEFORE removing session
    notifyAllTabs({ action: 'ATP_LOGOUT', timestamp: Date.now() });
    
    // Remove session data from chrome.storage.local
    chrome.storage.local.remove(['atpSession', 'atpLoginTimestamp'], function() {
      // Close the popup
      window.close();
    });
  });
  
  // Improved function to notify all tabs using Chrome messaging
  function notifyAllTabs(message) {
    // Get all tabs
    chrome.tabs.query({}, function(tabs) {
      // Send message to each tab
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {
          // Ignore errors for tabs that can't receive messages
          // This is expected for tabs where content script isn't loaded
        });
      });
    });
    
    // Also notify the background script about the state change
    chrome.runtime.sendMessage(message).catch(() => {
      // Ignore if background script isn't ready
    });
  }
  
  // Handle Enter key for login form
  passwordInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      loginButton.click();
    }
  });
  
  // Update UI for login state
  function showLoginState() {
    loginForm.style.display = 'block';
    userInfo.style.display = 'none';
    identifierInput.focus();
  }
  
  // Update UI for logged in state
  function showLoggedInState(session) {
    loginForm.style.display = 'none';
    userInfo.style.display = 'block';
    userHandle.textContent = session.handle;
    userDid.textContent = session.did;
  }
});