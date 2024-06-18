import { createParamDecorator } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';

export class UserClaims {
  pubKey: PublicKey;
}

export const RequestUser = createParamDecorator((data, req) => {
  return req.args[0].user as UserClaims;
});
