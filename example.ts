import Yeelight from "yeelight-ts";

const yeelight = new Yeelight();
const IP = "192.168.1.166"; // Change this to your Yeelight's IP address

yeelight.setBrightness(IP, 50)        
// yeelight.setBrightness(IP, 1)

// yeelight.setPower(IP, 'on')
// yeelight.setPower(IP, 'off')
