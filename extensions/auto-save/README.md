# Auto Save Chrome Extension

Automatically saves your workflows at regular intervals to prevent loss of work.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Permissions Explanation](#permissions-explanation)
- [Privacy Policy](#privacy-policy)
- [Explanation of Functionality](#explanation-of-functionality)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## Introduction

The **Auto Save Chrome Extension** enhances your workflow experience by automatically saving your work at user-defined intervals. This ensures that your progress is not lost due to unexpected issues or forgetfulness. It is particularly useful for web-based workflow applications that use a Save button.

## Features

- **Automatic Saving**: Saves workflows at regular intervals.
- **Customizable Interval**: Set the auto-save interval between 1 and 60 minutes.
- **Enable/Disable Auto Save**: Easily toggle the auto-save functionality.
- **Visual Timer**: Displays a countdown timer in the extension popup and badge.
- **Minimal Permissions**: Only requests necessary permissions to function.

## Installation

### Manual Installation

To install the extension manually:

1. **Download or Clone this Repository**:

   ```bash
   git clone https://github.com/kickin6/studio-utils.git
   ```

2. **Open Chrome Extension Management Page**:

   - Navigate to `chrome://extensions/` in your Chrome browser.
   - Enable **Developer mode** by toggling the switch in the top right corner.

3. **Load the Unpacked Extension**:

   - Click on **Load unpacked**.
   - Select the directory `extensions/auto-save`.

4. The extension should now appear in your list of installed extensions.

## Usage

1. **Access the Extension**:

   - Click on the Auto Save extension icon next to the Chrome address bar.

2. **Enable Auto Save**:

   - In the popup, check the **Enable Auto Save** checkbox.

3. **Set the Interval**:

   - Enter the desired auto-save interval in minutes (between 1 and 60).

4. **Save Settings**:

   - Click on **Save Settings** to apply your preferences.

5. **Visual Timer**:

   - The popup will display a countdown timer indicating the time remaining until the next auto-save.
   - The extension badge also shows the timer.

6. **Auto-Save Functionality**:

   - The extension will automatically trigger the save action on your workflow pages at the specified intervals.

7. **Disabling Auto Save**:

   - Uncheck the **Enable Auto Save** checkbox and click **Save Settings** to disable the auto-save feature.

## Permissions Explanation

The extension requests the following permissions:

- **Storage**: To save your settings (auto-save enabled state and interval).
- **Alarms**: To schedule periodic auto-save actions.
- **Host Permissions**:

  ```json
  "matches": [
    "http://*/workflow/*",
    "http://*/*/workflow/*",
    "http://*/*/*/workflow/*",
    "https://*/workflow/*",
    "https://*/*/workflow/*",
    "https://*/*/*/workflow/*"
  ]
  ```

  - These permissions allow the extension to operate on workflow pages that may have `/workflow/` at different depths in the URL path.
  - The extension only interacts with pages containing `/workflow/` in the URL.
  - This approach ensures functionality across different deployments and setups while minimizing access to unnecessary pages.

## Privacy Policy

The Auto Save Chrome Extension respects your privacy:

- **Data Collection**: The extension does not collect, transmit, or store any personal data or user information.
- **Data Usage**: All data, including your auto-save settings, are stored locally on your machine.
- **Permissions**: The extension only requests the minimum permissions necessary to function correctly.
- **Third-Party Services**: The extension does not use any third-party services or analytics tools.

## Explanation of Functionality

**Overview**:

The Auto Save extension is designed to enhance user productivity by automatically saving workflows within web-based applications that utilize a Save button.

**Content Script Injection**:

- The extension uses declarative content scripts specified in the `manifest.json` under the `content_scripts` field.
- The `matches` patterns are carefully selected to cover workflow pages that may have `/workflow/` at different depths in their URL paths:

  ```json
  "matches": [
    "http://*/workflow/*",
    "http://*/*/workflow/*",
    "http://*/*/*/workflow/*",
    "https://*/workflow/*",
    "https://*/*/workflow/*",
    "https://*/*/*/workflow/*"
  ]
  ```

- These patterns are necessary because workflows can be hosted at various URL structures, and this approach limits the extension's scope to only relevant pages.

**Content Script Behavior**:

- The content script includes a URL check to confirm that `/workflow/` is present in the URL before executing any actions.
- This ensures that the script operates only on intended pages and does not interfere with other websites.
- The extension interacts with the page by simulating a click on the Save button, identified by a specific data attribute commonly used in workflow applications.

**Permissions Justification**:

- **Minimal Permissions**: The extension requests only the permissions it needs to function effectively.
- **Host Permissions**: By specifying exact URL patterns, the extension avoids accessing unnecessary domains or pages.
- **User Control**: Users can enable or disable the auto-save feature and set their preferred interval, giving them full control over the extension's operation.

**Privacy and Data Handling**:

- The extension does not collect, transmit, or store any user data.
- All operations are performed locally within the user's browser.
- No personal or sensitive information is accessed or processed by the extension.

**Design Considerations**:

- **Functionality Across Setups**: By accommodating various URL structures, the extension ensures compatibility with different workflow applications and deployments.
- **User Experience**: The extension provides a seamless experience, automatically saving work without requiring additional user actions.
- **Compliance with Best Practices**: The extension is designed to comply with browser policies and best practices, including minimizing permissions and respecting user privacy.

## License

This project is licensed under the [MIT License](/LICENSE).

## Disclaimer

This extension is an independent tool designed to assist users with web-based workflow applications that utilize a Save button. All product names, logos, and brands are property of their respective owners.

THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. USE OF THE EXTENSION IS AT YOUR OWN RISK. IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE HELD LIABLE FOR ANY DAMAGES OR CLAIMS ARISING FROM THE USE OF THIS SOFTWARE. BY USING THE EXTENSION, YOU AGREE THAT YOU ARE SOLELY RESPONSIBLE FOR ANY CONSEQUENCES THAT MAY RESULT FROM ITS USE.
