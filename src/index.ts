import * as dgram from 'dgram';
import * as net from 'net';
import { Socket } from 'dgram';

interface DeviceInfo {
    location?: string;
    id?: string;
    model?: string;
    power?: string;
    bright?: string;
    color_mode?: string;
    ct?: string;
    rgb?: string;
    hue?: string;
    sat?: string;
    name?: string;
}

interface CommandResult {
    id: number;
    result?: string[];
    error?: { code: number; message: string };
}

/**
 * Represents a Yeelight device.
*/
/**
 * Represents a Yeelight device.
 */
export class Yeelight {
    private client: Socket;
    private readonly MULTICAST_ADDR: string = '239.255.255.250';
    private readonly SSDP_PORT: number = 1982;
    private readonly CONTROL_PORT: number = 55443;

    /**
     * Creates a new instance of the Yeelight class.
     */
    constructor() {
        this.client = dgram.createSocket('udp4');
        this.initialize();
    }

    /**
     * Initializes the Yeelight client.
     * Binds the client to the SSDP_PORT and sets up event listeners.
     */
    private initialize(): void {
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

    /**
     * Sends a discovery message to discover Yeelight devices on the network.
     */
    public sendDiscovery(): void {
        const message = Buffer.from(
            `M-SEARCH * HTTP/1.1\r\n` +
            `HOST: ${this.MULTICAST_ADDR}:${this.SSDP_PORT}\r\n` +
            `MAN: "ssdp:discover"\r\n` +
            `ST: wifi_bulb\r\n` +
            `MX: 2\r\n` +
            `\r\n`
        );

        this.client.send(message, 0, message.length, this.SSDP_PORT, this.MULTICAST_ADDR, (err) => {
            if (err) {
                console.error('Failed to send message:', err);
            } else {
                console.log("Discovery message sent");
            }
        });
    }

    /**
     * Handles the discovery response from a Yeelight device.
     * @param callback - The callback function to handle the device information.
     */
    public handleDiscoveryResponse(callback: (info: DeviceInfo) => void): void {
        this.client.on('message', (msg, rinfo) => {
            console.log(`Received message from ${rinfo.address}:${rinfo.port}`);
            const response = this.parseDiscoveryResponse(msg.toString());
            console.log('Device info:', response);
            callback(response);
        });
    }

    /**
     * Parses the discovery response from a Yeelight device.
     * @param response - The discovery response string.
     * @returns The parsed device information.
     */
    private parseDiscoveryResponse(response: string): DeviceInfo {
        const lines = response.split('\r\n');
        const result: DeviceInfo = {};
        lines.forEach(line => {
            if (line.includes(':')) {
                const [key, value] = line.split(':');
                result[key.trim().toLowerCase() as keyof DeviceInfo] = value.trim();
            }
        });
        return result;
    }

    /**
     * Sends a command to control a Yeelight device.
     * @param ip - The IP address of the device.
     * @param method - The method to execute.
     * @param params - The parameters for the method.
     * @returns A promise that resolves to the command result.
     */
    public sendCommand(ip: string, method: string, params: Array<string | number>): Promise<CommandResult> {
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

    /**
     * Sets the power state of a Yeelight device.
     * @param ip - The IP address of the device.
     * @param powerState - The power state to set.
     * @param effect - The effect to apply (default: "smooth").
     * @param duration - The duration of the effect in milliseconds (default: 500).
     * @returns A promise that resolves to the command result.
     */
    public setPower(ip: string, powerState: string, effect: string = "smooth", duration: number = 500): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_power', [powerState, effect, duration]);
    }

    /**
     * Sets the brightness of a Yeelight device.
     * @param ip - The IP address of the device.
     * @param brightness - The brightness value (1-100).
     * @returns A promise that resolves to the command result.
     */
    public setBrightness(ip: string, brightness: number): Promise<CommandResult> {
        if (this.isInRange(brightness)) {
            console.log(`${brightness} is in range.`);
        } else {
            console.log(`${brightness} is not in range. try a value between 1 and 100.`); 
        }
        return this.sendCommand(ip, 'set_bright', [brightness, 'smooth', 500]);
    }

    /**
     * Sets the color temperature of a Yeelight device.
     * @param ip - The IP address of the device.
     * @param temperature - The color temperature value.
     * @returns A promise that resolves to the command result.
     */
    public setColorTemperature(ip: string, temperature: number): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_ct_abx', [temperature, 'smooth', 500]);
    }

    /**
     * Sets the RGB color of a Yeelight device.
     * @param ip - The IP address of the device.
     * @param rgb - The RGB color value.
     * @returns A promise that resolves to the command result.
     */
    public setRGB(ip: string, rgb: number): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_rgb', [rgb, 'smooth', 500]);
    }

    /**
     * Sets the HSV color of a Yeelight device.
     * @param ip - The IP address of the device.
     * @param hue - The hue value.
     * @param sat - The saturation value.
     * @returns A promise that resolves to the command result.
     */
    public setHSV(ip: string, hue: number, sat: number): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_hsv', [hue, sat, 'smooth', 500]);
    }

    /**
     * Sets the name of a Yeelight device.
     * @param ip - The IP address of the device.
     * @param name - The name to set.
     * @returns A promise that resolves to the command result.
     */
    public setName(ip: string, name: string): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_name', [name]);
    }

    /**
     * Checks if a value is within the valid range (1-100).
     * @param value - The value to check.
     * @returns True if the value is within the range, false otherwise.
     */
    private isInRange(value: number): value is number {
        return value >= 1 && value <= 100;
    }
}