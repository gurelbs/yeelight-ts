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
npm install yeelight-ts
```

## Usage

Here’s how to get started with the Yeelight TypeScript API Wrapper:

### Set Brightness

enter a value between 1 and 100

```typescript
import Yeelight from "yeelight-ts";

const yeelight = new Yeelight();
const IP = "192.168.1.166"; // Change this to your Yeelight's IP address

yeelight.setBrightness(IP, 50)

// expected log: 
```

### Turn On / Off

// yeelight.setPower(IP, 'on')
// yeelight.setPower(IP, 'off')
