# Yeelight TypeScript API Wrapper

This package provides a robust TypeScript library for controlling Yeelight smart devices over your local network. It simplifies the process of device discovery and command transmission, leveraging Node.js and TypeScript for a type-safe, event-driven architecture.

## Features

- **Device Discovery**: Automatically locate Yeelight devices on your local network using SSDP.
- **Control Commands**: Send commands to control power, brightness, color, and more.
- **Type Safety**: Built with TypeScript for enhanced code reliability and maintainability.
- **Event-Driven**: Utilizes Node.js's EventEmitter for real-time device interaction.
- **Easy Integration**: Designed for easy integration into any Node.js or TypeScript project.

## Installation

Install the package via npm:

```bash
npm install yeelight-typescript-wrapper
```

## Usage

Here’s how to get started with the Yeelight TypeScript API Wrapper:

### Discovering Devices

```typescript
import Yeelight from 'yeelight-typescript-wrapper';

const light = new Yeelight();

light.on('listening', () => {
    light.discoverDevices();
});

light.on('deviceDiscovered', (deviceInfo) => {
    console.log('Discovered Device:', deviceInfo);
    // Example of turning on a light if the IP is known:
    const ip = deviceInfo.location.split('//')[1].split(':')[0];
    light.sendCommand(ip, 'set_power', ['on', 'smooth', 500], (response) => {
        console.log('Light turned on:', response);
    });
});
```

### Handling Errors

```typescript
light.on('error', (error) => {
    console.error('Error:', error);
});
```

## API Reference

- `discoverDevices()`: Broadcasts a search on the local network to find Yeelight devices.
- `sendCommand(ip: string, method: string, params: Array<string | number>, callback: (response: any) => void)`: Sends a command to a specific Yeelight device.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements. Please adhere to the existing coding style and add unit tests for any new or changed functionality.

## Support

If you encounter any issues or require assistance, please file an issue on the GitHub project page.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

### Customization and Further Development

- **Modify the Installation Section**: If your package name or installation commands differ, update accordingly.
- **Enhance Usage Examples**: Add more examples to cover all functionalities provided by your API.
- **Expand API Reference**: Provide detailed documentation for each function, including parameters, expected results, and possible errors.
- **Setup Guidelines**: If there are prerequisites or configuration steps needed before using the API, document these steps.

This `README.md` is structured to provide users with quick start information, detailed usage examples, and links to further help or contribute to the project. Make sure all instructions are clear and that links to your repository are correct before publishing.
