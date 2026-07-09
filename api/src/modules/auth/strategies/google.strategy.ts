import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID") as string,
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET") as string,
      callbackURL: `${configService.get("OAUTH_CALLBACK_URL_BASE")}/auth/google/callback`,
      scope: ["email", "profile"], // ← added
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: displayName,
      avatar: photos?.[0]?.value,
      provider: "google",
      providerId: id,
    };
    done(null, user);
  }
}
