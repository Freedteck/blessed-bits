import { PinataSDK } from "pinata";

const jwt = import.meta.env.VITE_PINATA_JWT;
const gateway = import.meta.env.VITE_PINATA_GATEWAY_URL;
const pinataConfig = new PinataSDK({
  pinataJwt: jwt,
  pinataGateway: gateway,
});

export { pinataConfig };
