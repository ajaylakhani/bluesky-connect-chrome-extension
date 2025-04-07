// background.js - Persistent background script for the extension

// Initialize when the background script loads
function initialize() {
  // Listen for tab creation to ensure new tabs get authentication state
  chrome.tabs.onCreated.addListener(function(tab) {
    // Wait a moment for the tab to load before attempting to send a message
    setTimeout(() => {
      syncAuthStateToTab(tab.id);
    }, 500);
  });
  
  // Handle when tabs are updated (e.g., navigation to new page)
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Only sync when the page has completed loading
    if (changeInfo.status === 'complete') {
      syncAuthStateToTab(tabId);
    }
  });
  
  // Listen for messages from popup or content scripts
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'ATP_LOGIN' || message.action === 'ATP_LOGOUT') {
      // Forward the message to all tabs
      forwardAuthMessageToAllTabs(message);
    }
  });
}

// Sync the current auth state to a specific tab
function syncAuthStateToTab(tabId) {
  chrome.storage.local.get(['atpSession'], function(result) {
    if (result.atpSession) {
      // Send login message to the tab
      chrome.tabs.sendMessage(tabId, {
        action: 'ATP_LOGIN',
        session: result.atpSession
      }).catch(() => {
        // Ignore errors - content script might not be ready yet
      });
    }
  });
}

// Forward authentication messages to all tabs
function forwardAuthMessageToAllTabs(message) {
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {
        // Ignore errors for tabs that can't receive messages
      });
    });
  });
}

// Initialize the background script
initialize();

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('AT Protocol extension installed or updated:', details.reason);
});