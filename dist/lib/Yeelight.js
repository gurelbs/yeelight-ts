"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram = __importStar(require("dgram"));
const net = __importStar(require("net"));
/**
 * Represents a Yeelight device.
 */
class Yeelight {
    constructor() {
        this.MULTICAST_ADDR = '239.255.255.250';
        this.SSDP_PORT = 1982;
        this.CONTROL_PORT = 55443;
        this.client = dgram.createSocket('udp4');
        this.initialize();
    }
    initialize() {
        this.client.on('error', (err) => {
            console.error('Client error:', err);
            this.client.close();
        });
        this.client.on('listening', () => {
            const address = this.client.address();
            console.log(`UDP Client listening on ${address.address}:${address.port}`);
            this.client.setBroadcast(true);
            this.client.setMulticastTTL(128);
            this.client.addMembership(this.MULTICAST_ADDR);
        });
        this.client.bind(this.SSDP_PORT);
    }
    sendDiscovery() {
        const message = Buffer.from(`M-SEARCH * HTTP/1.1\r\n` +
            `HOST: ${this.MULTICAST_ADDR}:${this.SSDP_PORT}\r\n` +
            `MAN: "ssdp:discover"\r\n` +
            `ST: wifi_bulb\r\n` +
            `MX: 2\r\n` +
            `\r\n`);
        this.client.send(message, 0, message.length, this.SSDP_PORT, this.MULTICAST_ADDR, (err) => {
            if (err) {
                console.error('Failed to send message:', err);
            }
            else {
                console.log("Discovery message sent");
            }
        });
    }
    handleDiscoveryResponse(callback) {
        this.client.on('message', (msg, rinfo) => {
            console.log(`Received message from ${rinfo.address}:${rinfo.port}`);
            const response = this.parseDiscoveryResponse(msg.toString());
            console.log('Device info:', response);
            callback(response);
        });
    }
    parseDiscoveryResponse(response) {
        const lines = response.split('\r\n');
        const result = {};
        lines.forEach(line => {
            if (line.includes(':')) {
                const [key, value] = line.split(':');
                result[key.trim().toLowerCase()] = value.trim();
            }
        });
        return result;
    }
    sendCommand(ip, method, params) {
        return new Promise((resolve, reject) => {
            const socket = net.createConnection(this.CONTROL_PORT, ip, () => {
                const id = Math.floor(Math.random() * 10000);
                const command = {
                    id,
                    method,
                    params
                };
                socket.write(`${JSON.stringify(command)}\r\n`);
            });
            socket.on('data', (data) => {
                console.log('Received data:', data.toString());
                resolve(JSON.parse(data.toString()));
                socket.end();
            });
            socket.on('error', (err) => {
                console.error('Socket error:', err);
                reject(err);
                socket.end();
            });
        });
    }
    setPower(ip, powerState, effect = "smooth", duration = 500) {
        return this.sendCommand(ip, 'set_power', [powerState, effect, duration]);
    }
    setBrightness(ip, brightness) {
        return this.sendCommand(ip, 'set_bright', [brightness, 'smooth', 500]);
    }
    setColorTemperature(ip, temperature) {
        return this.sendCommand(ip, 'set_ct_abx', [temperature, 'smooth', 500]);
    }
    setRGB(ip, rgb) {
        return this.sendCommand(ip, 'set_rgb', [rgb, 'smooth', 500]);
    }
    setHSV(ip, hue, sat) {
        return this.sendCommand(ip, 'set_hsv', [hue, sat, 'smooth', 500]);
    }
    setName(ip, name) {
        return this.sendCommand(ip, 'set_name', [name]);
    }
}
exports.default = Yeelight;
