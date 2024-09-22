/**
 * content.js
 *
 * This script is injected into web pages and manages the auto-save functionality.
 * It checks if the URL matches the desired pattern before activating.
 */

(() => {
  let isEnabled = false;

  /**
   * Checks if the current URL contains '/workflow/'.
   *
   * @returns {boolean} - True if the URL contains '/workflow/'.
   */
  function isWorkflowUrl() {
    return window.location.href.includes("/workflow/");
  }

  /**
   * Initializes the content script by setting up the message listener.
   */
  function initializeScript() {
    if (!isWorkflowUrl()) {
      // If the URL does not match, do not proceed.
      return;
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(handleMessage);

    // Check the initial state of isEnabled
    chrome.storage.sync.get(["isEnabled"], (result) => {
      isEnabled = result.isEnabled || false;
    });

    // Listen for changes to isEnabled in storage
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.isEnabled) {
        isEnabled = changes.isEnabled.newValue;
      }
    });

    console.log("Workflow Auto-Save content script loaded.");
  }

  /**
   * Simulates a click on the save button.
   */
  function clickSaveButton() {
    const saveButton = document.querySelector(
      '[data-test-id="workflow-save-button"] button'
    );
    if (saveButton) {
      saveButton.click();
    }
  }

  /**
   * Handles incoming messages from the background script.
   *
   * @param {Object} request - The message request object.
   * @param {Object} sender - The sender of the message.
   * @param {Function} sendResponse - Function to send a response.
   */
  function handleMessage(request, sender, sendResponse) {
    if (request.action === "autoSave" && isEnabled) {
      clickSaveButton();
      sendResponse({ success: true });
    }
  }

  initializeScript();
})();
