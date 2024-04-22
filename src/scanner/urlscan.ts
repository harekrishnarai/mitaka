import { err, ok, Result } from "neverthrow";
import { z } from "zod";

import type { ScannableType } from "~/types";

import { Base } from "./base";

const Response = z.object({
  result: z.string(),
});

const ErrorResponse = z.object({
  message: z.string(),
  status: z.number(),
});

export class URLScan extends Base {
  public baseURL: string;
  public name: string;
  public supportedTypes: ScannableType[] = ["ip", "domain", "url"];
  public apiKey: string | undefined = undefined;

  public constructor() {
    super();
    this.baseURL = "https://urlscan.io";
    this.name = "urlscan.io";
  }

  public setAPIKey(apiKey: string | undefined): void {
    this.apiKey = apiKey;
  }

  public async scanByIP(ip: string): Promise<Result<string, string>> {
    return await this.scan(ip);
  }

  public async scanByDomain(domain: string): Promise<Result<string, string>> {
    return await this.scan(domain);
  }

  public async scanByURL(url: string): Promise<Result<string, string>> {
    return await this.scan(url);
  }

  private async scan(
    query: string,
    isPublic = true,
  ): Promise<Result<string, string>> {
    if (this.apiKey === undefined) {
      return err("Please set your urlscan.io API key via the option.");
    }

    const body = JSON.stringify({
      public: isPublic ? "on" : "off",
      url: query,
    });
    const headers = {
      "API-KEY": this.apiKey,
      "content-type": "application/json",
    };

    const res = await fetch(`${this.baseURL}/api/v1/scan/`, {
      method: "POST",
      headers,
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      const parsed = ErrorResponse.parse(data);
      return err(parsed.message);
    }

    const parsed = Response.parse(data);
    return ok(`${parsed.result}loading`);
  }
}
