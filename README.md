# Bluesky Connect

A Chrome extension that allows websites to authenticate and interact with the Bluesky social network using the AT Protocol.

## Features

- Simple authentication with your Bluesky account
- Securely store AT Protocol credentials
- Seamless integration with websites that support the AT Protocol
- Clear session management
- Support for app passwords for enhanced security

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation
1. Download the latest release from the [Releases page](https://github.com/ajaylakhani/bluesky-connect/releases)
2. Unzip the file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the unzipped folder
6. The Bluesky Connect extension should now appear in your extensions list

## Usage

1. Click on the Bluesky Connect icon in your browser toolbar
2. Enter your Bluesky handle or email and password
   - For enhanced security, consider using an [app password](https://bsky.app/settings/app-passwords)
3. Click "Connect to Bluesky"
4. Once connected, your authentication will be shared with sites that support the AT Protocol

## For Developers

If you want to integrate Bluesky Connect with your website, check the [Client Implementation Guide](CLIENT_IMPLEMENTATION.md) for details on how to detect and use the authenticated session.

### Test Page

The repository includes a `test-page.html` file that provides a simple interface for testing the extension's functionality:

1. After installing the extension, open `test-page.html` in your browser
2. The page will display your current authentication status
3. Log in/out using the extension popup to see real-time updates on the test page
4. The event log section tracks authentication events as they occur
5. Use the "Check Auth State" button to manually verify the current authentication status

This test page provides a practical demonstration of how websites can integrate with the extension and serves as a working example of the integration patterns described in the Client Implementation Guide.

## Building from Source

1. Clone the repository:
   ```
   git clone https://github.com/ajaylakhani/bluesky-connect.git
   cd bluesky-connect
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the extension:
   ```
   npm run build
   ```

4. The built extension will be in the `dist` directory, which you can load as an unpacked extension in Chrome.

## Security Considerations

- The extension stores authentication tokens in Chrome's `storage.local` API, which is isolated to the extension
- Authentication is only shared with websites when they explicitly request it
- Using an app password instead of your main password is recommended for enhanced security
- No data is sent to any servers other than the official Bluesky API endpoints

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Acknowledgments

- Built on the [AT Protocol](https://atproto.com/)
- Icons by [Font Awesome](https://fontawesome.com/)
