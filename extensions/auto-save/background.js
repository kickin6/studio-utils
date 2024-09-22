/**
 * background.js
 *
 * Description: Background script responsible for managing auto-save functionality, timers,
 * and interaction with content scripts. It listens for messages from the popup
 * and handles auto-save tasks using Chrome's alarms API.
 */

let isEnabled = false;
let interval = 1;
let remainingSeconds = 0;

/**
 * Listener for when the extension is installed or updated.
 * Initializes settings and updates the alarm.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["isEnabled", "interval"], (result) => {
    isEnabled = result.isEnabled || false;
    interval = result.interval || 1;
    updateAlarm();
  });
});

/**
 * Listener for alarms.
 * Triggers auto-save or updates the timer based on the alarm name.
 *
 * @param {object} alarm - The alarm that was triggered.
 */
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoSaveAlarm") {
    triggerAutoSave();
  } else if (alarm.name === "timerAlarm") {
    updateTimer();
  }
});

/**
 * Triggers the auto-save action by sending a message to the content script.
 * Resets the timer after triggering.
 */
function triggerAutoSave() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "autoSave" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn(
              "Could not send message to content script:",
              chrome.runtime.lastError.message
            );
          } else if (response && response.success) {
            console.log("Auto-save successful");
          } else {
            console.log("Auto-save failed or not possible");
          }
        }
      );
    }
  });
  resetTimer();
}

/**
 * Listener for messages from other parts of the extension.
 * Handles updating settings and providing current settings.
 *
 * @param {object} request - The message request object.
 * @param {object} sender - The sender of the message.
 * @param {function} sendResponse - Function to send a response.
 * @returns {boolean} - Indicates if the response is asynchronous.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateSettings") {
    isEnabled = request.isEnabled;
    interval = request.interval;
    chrome.storage.sync.set({ isEnabled, interval });
    updateAlarm();
    sendResponse({ success: true });
  } else if (request.action === "getSettings") {
    sendResponse({ isEnabled, interval, remainingSeconds });
  }
  return true;
});

/**
 * Updates the auto-save alarm based on current settings.
 * Starts or stops the timer accordingly.
 */
function updateAlarm() {
  chrome.alarms.clear("autoSaveAlarm", () => {
    if (isEnabled) {
      chrome.alarms.create("autoSaveAlarm", { periodInMinutes: interval });
      resetTimer();
    } else {
      stopTimer();
    }
  });
}

/**
 * Resets the timer to the interval value and updates the badge.
 */
function resetTimer() {
  remainingSeconds = interval * 60;
  updateBadge();
  startTimer();
}

/**
 * Starts the timer alarm for updating the badge every second.
 */
function startTimer() {
  chrome.alarms.create("timerAlarm", { periodInMinutes: 1 / 60 });
}

/**
 * Stops the timer alarm and clears the badge.
 */
function stopTimer() {
  chrome.alarms.clear("timerAlarm");
  remainingSeconds = 0;
  updateBadge();
}

/**
 * Updates the remaining time, updates the badge, and sends a timer update message.
 */
function updateTimer() {
  if (remainingSeconds > 0) {
    remainingSeconds--;
    updateBadge();
    sendTimerUpdate();
  }
}

/**
 * Updates the extension badge text and color based on remaining time.
 */
function updateBadge() {
  if (!isEnabled) {
    chrome.action.setBadgeText({ text: "" });
    return;
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const text = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  chrome.action.setBadgeText({ text: text });

  let color, textColor;
  if (remainingSeconds <= 10) {
    color = "#FF0000";
    textColor = "white";
  } else if (remainingSeconds <= 30) {
    color = "#FFA500";
    textColor = "black";
  } else {
    color = "#00FF00";
    textColor = "black";
  }

  chrome.action.setBadgeBackgroundColor({ color: color });
  chrome.action.setBadgeTextColor({ color: textColor });
}

/**
 * Sends a message to update the timer display in the popup.
 */
function sendTimerUpdate() {
  chrome.runtime
    .sendMessage({
      action: "timerUpdate",
      remainingSeconds: remainingSeconds,
    })
    .catch(() => {});
}
