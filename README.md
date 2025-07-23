# Mute Words for Reddit

A Chrome extension that filters Reddit posts and comments based on user-specified mute words.

## Features

- **Smart Filtering**: Hide both posts (by title) and comments (by content) containing specified mute words
- **Easy Management**: Quick-add words via popup or manage complete list through options page  
- **Real-time Filtering**: Content filtered as you browse, including dynamically loaded content
- **Statistics Tracking**: Track how many posts and comments have been filtered over time
- **Case-insensitive Matching**: Words matched regardless of capitalization
- **Chrome Sync**: Mute word list syncs across your Chrome browsers

## Installation

### From Chrome Web Store
[Extension will be available here once published]

### For Development
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension directory
5. The extension should now appear in your Chrome toolbar

## Usage

1. **Quick Add**: Click the extension icon while on Reddit to quickly add mute words
2. **Manage Words**: Right-click the extension and select "Options" to manage your complete mute word list
3. **View Statistics**: Click the extension icon to see how many posts and comments have been filtered
4. **Browse Normally**: Unwanted content will be automatically hidden as you browse Reddit

## Supported Sites

- old.reddit.com (Classic Reddit) - Full support for posts and comments
- www.reddit.com (New Reddit) - Post title filtering only

## Privacy

- All data stored locally in your browser
- No external servers or data transmission
- Optional Chrome sync for mute words across devices
- See [Privacy Policy](privacy-policy.md) for full details

## Development

### Project Structure
```
reddit-mute-words/
├── manifest.json          # Extension configuration
├── content.js            # Main filtering logic
├── popup.html/js         # Extension popup interface
├── options.html/js       # Options page for managing mute words
├── privacy-policy.md     # Privacy policy for store submission
└── store-description.md  # Chrome Web Store listing content
```

### Key Files
- `content.js`: Content script that runs on Reddit pages and performs filtering
- `popup.js`: Popup interface for quick word management and statistics
- `options.js`: Full options page for comprehensive mute word management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both old and new Reddit
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For bug reports or feature requests, please use the GitHub Issues page or contact through the Chrome Web Store.