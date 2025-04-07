# Installing Bluesky Connect Chrome Extension

## Official Website Installation Guide

For the most up-to-date installation instructions with visual guides, please visit our official website:
[https://ajaylakhani.co.uk/bluesky-connect-chrome-extension/](https://ajaylakhani.co.uk/bluesky-connect-chrome-extension/)

## Option 1: One-Click Installation (Chrome Web Store)
*Coming soon - the extension will be available on the Chrome Web Store*

## Option 2: Manual Installation from Release

1. Go to the [Releases page](https://github.com/ajaylakhani/bluesky-connect-chrome-extension/releases)
2. Download the latest `.zip` file 
3. Unzip the file to a location on your computer
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" by toggling the switch in the top-right corner
6. Click the "Load unpacked" button
7. Select the unzipped extension folder
8. The extension should now appear in your browser toolbar

## Option 3: Build from Source

If you prefer to build the extension yourself:

1. Clone this repository:
   ```
   git clone https://github.com/ajaylakhani/bluesky-connect.git
   ```

2. Navigate to the project directory:
   ```
   cd bluesky-connect
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Build the extension:
   ```
   npm run build
   ```

5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the `dist` folder from the project directory

## Verification

After installation, you should see the Bluesky Connect icon in your browser toolbar. Click it to log in with your Bluesky credentials.

## Having Issues?

If you encounter any problems during installation, please [open an issue](https://github.com/ajaylakhani/bluesky-connect/issues) on our GitHub repository.
