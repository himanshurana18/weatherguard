/// <reference path="../../../types/passport-github2.d.ts" />
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { ConfigService } from "@nestjs/config";

type VerifyCallback = (error: any, user?: any) => void;

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get("GITHUB_CLIENT_ID") as string,
      clientSecret: configService.get("GITHUB_CLIENT_SECRET") as string,
      callbackURL: `${configService.get("OAUTH_CALLBACK_URL_BASE")}/auth/github/callback`,
      scope: ["user:email"], // ← added
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
      name: displayName || emails[0].value.split("@")[0],
      avatar: photos?.[0]?.value,
      provider: "github",
      providerId: id,
    };
    done(null, user);
  }
}
