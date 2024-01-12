import { Request } from 'express';

export abstract class MailService {
  abstract send(req: Request, options: any): any;
}
