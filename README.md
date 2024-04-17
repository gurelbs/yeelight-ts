# Yeelight TypeScript API Wrapper

**Author:** Gurel Ben Shabat ([https://github.com/gurelbs](https://github.com/gurelbs))

This package provides a robust TypeScript library for controlling Yeelight smart devices over your local network. It simplifies the process of device discovery and command transmission, leveraging Node.js and TypeScript for a type-safe, event-driven architecture.

## Features

* **Device Discovery:** Automatically locate Yeelight devices on your local network using SSDP.
* **Control Commands:** Send commands to control power, brightness, color, and more.
* **Type Safety:** Built with TypeScript for enhanced code reliability and maintainability.
* **Event-Driven:** Utilizes Node.js's EventEmitter for real-time device interaction.
* **Easy Integration:** Designed for easy integration into any Node.js or TypeScript project.

### Installation

Install the package via npm:

```bash
npm install yeelight-ts
```

### Usage

Here's how to get started with the Yeelight TypeScript API Wrapper:

**1. Project Setup:**

Create a new project directory and initialize a Node.js project:

```bash
mkdir yeelight
cd yeelight
npm init -y
```

**2. Install Dependencies:**

Install the `yeelight-ts` library and a development server like `nodemon` (optional, but recommended for automatic code reloading):

```bash
npm install yeelight-ts
npm install -g nodemon
```

**3. Create an Entry Point:**

Create a file named `index.ts` and add the following code:

```typescript
import { Yeelight } from "yeelight-ts";

const yeelight = new Yeelight();
const IP = "192.168.x.x"; // Change this to your Yeelight's IP address

yeelight.setBrightness(IP, 50); // Example: Set brightness (1-100)

// Other control commands (uncomment to use):
// yeelight.setPower(IP, 'on'); // Turn on the light
// yeelight.setColorTemperature(IP, 6500); // Set cooler white
// yeelight.setRGB(IP, 0xFF0000);  // Set red color
// yeelight.setHSV(IP, 180, 100);  // Set purple color
// yeelight.setName(IP, 'Living Room Lamp'); // Set device name
```

**4. Run the Application:**

Start the application using `nodemon` for automatic code reloading during development:

```bash
nodemon index.ts
```

### API Documentation

The `Yeelight` class provides the following methods:

* `sendDiscovery()`: Sends a discovery message to find Yeelight devices on the network.
* `handleDiscoveryResponse(callback)`: Handles the discovery response from a Yeelight device and calls the provided callback function with the device information. (Refer to the source code for event-driven usage)
* `sendCommand(ip, method, params)`: Sends a command to a Yeelight device with the specified IP address, method, and parameters. Returns a promise that resolves to the command result.
* `setPower(ip, powerState, effect, duration)`: Sets the power state of a Yeelight device.
* `setBrightness(ip, brightness)`: Sets the brightness of a Yeelight device.
* `setColorTemperature(ip, temperature)`: Sets the color temperature of a Yeelight device.
* `setRGB(ip, rgb)`: Sets the RGB color of a Yeelight device.
* `setHSV(ip, hue, sat)`: Sets the HSV color of a Yeelight device.
* `setName(ip, name)`: Sets the name of a Yeelight device.
* `isInRange(value)`: Checks if a value is within the valid range (1-100).

**Note:** This is a basic overview. Refer to the actual source code for detailed descriptions and parameter types.

### Keywords

yeelight, smart-home, home-automation, lighting, smart-lighting, typescript, nodejs, yeelight-control, ssdp, iot, internet-of-things, smart-bulbs, yeelight-sdk, led-control, typescript-api
