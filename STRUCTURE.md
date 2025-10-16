# Project Structure Documentation

## 📁 Directory Structure

```
auto-reply-wa-group/
│
├── src/                          # Source code directory
│   ├── cli/                      # CLI interface modules
│   │   └── menu.js              # Interactive menu system
│   │
│   ├── config/                   # Configuration modules
│   │   └── config.js            # Central configuration
│   │
│   ├── core/                     # Core business logic
│   │   ├── WhatsAppClient.js    # WhatsApp connection handler
│   │   └── GroupManager.js      # Group management utilities
│   │
│   ├── utils/                    # Utility modules
│   │   └── logger.js            # Logging utility
│   │
│   └── index.js                  # Main entry point
│
├── data/                         # Data directory
│   ├── iklan.txt                # Advertisement files
│   ├── iklan2.txt               # (Multiple ads supported)
│   └── group.js                 # Group links (optional)
│
├── auth_info_baileys_*/         # Session data (auto-generated)
├── qrcodes/                     # QR code storage (auto-generated)
├── logs/                        # Log files (auto-generated)
│
├── .env                         # Environment configuration
├── .env.example                 # Example configuration
├── .gitignore                   # Git ignore rules
│
├── package.json                 # Node.js dependencies
├── start.sh                     # Quick start script
│
├── README.md                    # Main documentation
├── README_NEW.md               # Updated documentation
├── SETUP_GUIDE.md              # Detailed setup guide
└── STRUCTURE.md                # This file
```

## 🔧 Module Description

### Core Modules

#### `src/core/WhatsAppClient.js`
**Purpose**: Main WhatsApp bot client

**Key Features**:
- Connection management
- QR code authentication
- Message handling
- Auto-reply functionality
- Load distribution across instances
- Error handling and recovery

**Key Methods**:
- `start()`: Initialize and start the bot
- `handleMessagesUpsert()`: Process incoming messages
- `handleConnectionUpdate()`: Handle connection status
- `loadIklanFiles()`: Load advertisement content
- `attemptKeyRepair()`: Fix decryption issues

#### `src/core/GroupManager.js`
**Purpose**: Manage WhatsApp group operations

**Key Features**:
- Join groups from invite links
- Extract invite codes from URLs
- Batch group joining
- Rate limiting protection

**Key Methods**:
- `joinGroup()`: Join single group
- `joinGroupsFromLinks()`: Join multiple groups
- `getJoinedGroups()`: List all groups
- `extractInviteCode()`: Parse invite links

### CLI Modules

#### `src/cli/menu.js`
**Purpose**: Interactive command-line interface

**Key Features**:
- Interactive menu system
- Advertisement management
- Session management
- Bot configuration
- Status monitoring

**Key Methods**:
- `showMainMenu()`: Display main menu
- `startSingleInstance()`: Start one bot
- `startMultipleInstances()`: Start multiple bots
- `manageAdvertisements()`: Ad CRUD operations
- `manageSessions()`: Session management
- `viewStatus()`: Display bot status

### Configuration Modules

#### `src/config/config.js`
**Purpose**: Centralized configuration management

**Key Features**:
- Environment variable parsing
- Path management
- Default values
- Configuration validation

**Exports**:
- `bot`: Bot configuration
- `paths`: Directory paths
- `logger`: Logger settings
- `loadIklanFiles()`: Helper function

### Utility Modules

#### `src/utils/logger.js`
**Purpose**: Logging utility with colored output

**Key Features**:
- Colored console output
- Timestamp formatting
- Instance identification
- Multiple log levels

**Methods**:
- `info()`: Information messages
- `success()`: Success messages
- `warn()`: Warning messages
- `error()`: Error messages
- `getPinoLogger()`: Get Pino instance

## 🔄 Data Flow

### Message Processing Flow

```
1. WhatsApp Message Received
   ↓
2. WhatsAppClient.handleMessagesUpsert()
   ↓
3. Check if message is from group
   ↓
4. Calculate target instance (load distribution)
   ↓
5. Process if message is for this instance
   ↓
6. Add random delay (rate limiting)
   ↓
7. Read message
   ↓
8. Select advertisement (rotation)
   ↓
9. Send reply
   ↓
10. Log result
```

### Instance Distribution Algorithm

```javascript
// Extract numeric ID from group JID
const groupId = jid.split('@')[0];
const lastDigits = groupId.slice(-6);
const numericId = parseInt(lastDigits, 10);

// Calculate target instance
const targetInstance = (numericId % totalInstances) + 1;

// Process if this instance
if (targetInstance === instanceId) {
    // Handle message
}
```

### Advertisement Rotation

```javascript
// Load all .txt files from data/
iklanList = [...list of ads];
iklanIndex = 0;

// On each message
const ad = iklanList[iklanIndex];
iklanIndex = (iklanIndex + 1) % iklanList.length;

// Send ad
sendMessage(ad);
```

## 🎨 CLI Menu Structure

```
Main Menu
├── 🚀 Start Bot
│   ├── Single Instance
│   └── Multiple Instances
│
├── 📝 Manage Advertisements
│   ├── List Advertisements
│   ├── Add New Advertisement
│   ├── Edit Advertisement
│   └── Delete Advertisement
│
├── 👥 Join Groups from Links
│   ├── Load from file
│   └── Enter manually
│
├── 🔑 Manage Sessions
│   ├── List Sessions
│   ├── Delete Session
│   └── Delete All Sessions
│
├── ⚙️ Settings
│   └── View current settings
│
├── 📊 View Status
│   └── Display bot statistics
│
└── ❌ Exit
```

## 🔐 Session Management

### Session Storage

Each bot instance maintains its own authentication session:

```
auth_info_baileys_1/    # Instance 1 session
auth_info_baileys_2/    # Instance 2 session
auth_info_baileys_3/    # Instance 3 session
...
```

### Session Files

```
auth_info_baileys_*/
├── creds.json          # Authentication credentials
└── app-state-sync-*    # Sync state files
```

**Important**: 
- Never share these files
- Each contains unique authentication
- Backup regularly
- Don't commit to git

## 📦 Dependencies

### Core Dependencies

- **baileys**: WhatsApp Web API
- **inquirer**: Interactive CLI prompts
- **chalk**: Terminal string styling
- **qrcode-terminal**: QR code rendering
- **node-cache**: In-memory caching
- **pino**: Fast logging library

### Development Flow

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production
npm start
```

## 🔄 Update Process

### Adding New Features

1. Create new module in appropriate directory
2. Import in relevant files
3. Add to CLI menu if user-facing
4. Update documentation
5. Test thoroughly

### Adding New CLI Menu Option

```javascript
// In src/cli/menu.js

// 1. Add to choices array
choices: [
    // ... existing choices
    { name: '🆕 New Feature', value: 'new_feature' },
]

// 2. Add case in switch statement
switch (action) {
    // ... existing cases
    case 'new_feature':
        await this.handleNewFeature();
        break;
}

// 3. Implement handler method
async handleNewFeature() {
    // Your implementation
}
```

## 🧪 Testing Checklist

Before deploying:

- [ ] Bot can connect to WhatsApp
- [ ] QR code displays correctly
- [ ] Messages are received
- [ ] Replies are sent
- [ ] Advertisements rotate correctly
- [ ] Multiple instances work
- [ ] Load distribution functions
- [ ] CLI menu navigates properly
- [ ] Sessions persist after restart
- [ ] Error handling works
- [ ] Logs are readable

## 📈 Scalability Considerations

### Horizontal Scaling

- Run multiple instances on different servers
- Use different WhatsApp accounts per instance
- Distribute groups evenly

### Performance Optimization

- Adjust delay values based on load
- Monitor memory usage
- Use PM2 for process management
- Implement log rotation

### Rate Limiting

- Respect WhatsApp's limits
- Add random delays
- Monitor for 429 errors
- Implement backoff strategy

## 🐛 Common Issues & Solutions

### Issue: Bot disconnects frequently
**Solution**: Check internet, increase delays, verify account status

### Issue: Decryption errors
**Solution**: Automatic repair implemented, wait 30s, or reset session

### Issue: QR code not showing
**Solution**: Check terminal UTF-8 support, resize window

### Issue: Not receiving messages
**Solution**: Verify bot is in group, check instance distribution

## 📚 Code Style Guide

### Naming Conventions

- **Classes**: PascalCase (`WhatsAppClient`)
- **Functions**: camelCase (`handleMessage`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_DELAY`)
- **Files**: camelCase (`whatsappClient.js`)

### Import Order

1. Node built-ins
2. External dependencies
3. Internal modules
4. Config files
5. Utils

### Comment Style

```javascript
/**
 * Function description
 * @param {type} name - Description
 * @returns {type} Description
 */
```

## 🔮 Future Enhancements

Potential features to add:

- [ ] Web dashboard
- [ ] Database integration
- [ ] Scheduled messages
- [ ] Custom commands
- [ ] Message templates
- [ ] Analytics & reporting
- [ ] Webhook support
- [ ] API endpoint
- [ ] Multi-language support
- [ ] Message filtering rules

---

**Last Updated**: October 2025
**Version**: 2.0.0
