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
class Yeelight {
    private client: Socket;
    private readonly MULTICAST_ADDR: string = '239.255.255.250';
    private readonly SSDP_PORT: number = 1982;
    private readonly CONTROL_PORT: number = 55443;

    constructor() {
        this.client = dgram.createSocket('udp4');
        this.initialize();
    }

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

    public handleDiscoveryResponse(callback: (info: DeviceInfo) => void): void {
        this.client.on('message', (msg, rinfo) => {
            console.log(`Received message from ${rinfo.address}:${rinfo.port}`);
            const response = this.parseDiscoveryResponse(msg.toString());
            console.log('Device info:', response);
            callback(response);
        });
    }

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

    public setPower(ip: string, powerState: string, effect: string = "smooth", duration: number = 500): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_power', [powerState, effect, duration]);
    }

    public setBrightness(ip: string, brightness: number): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_bright', [brightness, 'smooth', 500]);
    }

    public setColorTemperature(ip: string, temperature: number): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_ct_abx', [temperature, 'smooth', 500]);
    }

    public setRGB(ip: string, rgb: number): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_rgb', [rgb, 'smooth', 500]);
    }

    public setHSV(ip: string, hue: number, sat: number): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_hsv', [hue, sat, 'smooth', 500]);
    }

    public setName(ip: string, name: string): Promise<CommandResult> {
        return this.sendCommand(ip, 'set_name', [name]);
    }
}

export default Yeelight;
