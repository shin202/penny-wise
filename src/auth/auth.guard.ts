import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }

    try {
      const payload = await this.jwtService.verify(token);

      request.user = payload;
    } catch (e) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['Authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
