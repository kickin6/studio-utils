/**
 * popup.js
 *
 * Handles UI interactions in the popup for the Workflow Auto-Save Chrome Extension.
 * Manages settings updates and timer display.
 */

document.addEventListener("DOMContentLoaded", () => {
  const enableCheckbox = document.getElementById("enableAutoSave");
  const intervalInput = document.getElementById("interval");
  const saveButton = document.getElementById("saveSettings");
  const timerDisplay = document.getElementById("timerDisplay");

  /**
   * Updates the timer display with the remaining time and changes background color based on urgency.
   *
   * @param {number} seconds - Remaining time in seconds.
   */
  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;

    if (seconds <= 10) {
      timerDisplay.style.backgroundColor = "#FF0000";
      timerDisplay.style.color = "white";
    } else if (seconds <= 30) {
      timerDisplay.style.backgroundColor = "#FFA500";
      timerDisplay.style.color = "black";
    } else {
      timerDisplay.style.backgroundColor = "#00FF00";
      timerDisplay.style.color = "black";
    }
  }

  // Retrieve current settings from the background script
  chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
    enableCheckbox.checked = response.isEnabled;
    intervalInput.value = response.interval;
    updateTimerDisplay(response.remainingSeconds);
  });

  /**
   * Handles the save settings action.
   */
  saveButton.addEventListener("click", () => {
    const isEnabled = enableCheckbox.checked;
    const interval = parseInt(intervalInput.value, 10);

    chrome.runtime.sendMessage(
      {
        action: "updateSettings",
        isEnabled,
        interval,
      },
      (response) => {
        if (response.success) {
          // Settings updated successfully
        }
      }
    );
  });

  // Listen for timer updates from the background script
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "timerUpdate") {
      updateTimerDisplay(request.remainingSeconds);
    }
  });
});
