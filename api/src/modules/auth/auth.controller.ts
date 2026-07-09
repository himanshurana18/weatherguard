import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UserDocument } from "../../schemas/user.schema";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const user = await this.authService.validateOrCreateUser(req.user);
    const { access_token } = this.authService.generateToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${access_token}`);
  }

  @Get("github")
  @UseGuards(AuthGuard("github"))
  githubAuth() {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const user = await this.authService.validateOrCreateUser(req.user);
    const { access_token } = this.authService.generateToken(user);
    res.redirect(`${process.env.FRONTEND_URL}?token=${access_token}`);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: UserDocument) {
    return user;
  }
}
