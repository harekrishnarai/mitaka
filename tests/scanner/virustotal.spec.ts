import { VirusTotal } from "~/scanner";

describe("VirusTotal", function () {
  const subject = new VirusTotal();

  it("should support url", function () {
    expect(subject.supportedTypes).toEqual(["url"]);
  });

  describe("when apiKey is undefined", function () {
    it("should raise an error", async function () {
      subject.setAPIKey("dummy");
      // eslint-disable-next-line neverthrow/must-use-result
      const res = await subject.scanByURL("http://example.com");
      expect(res.isErr()).toBe(true);
    });
  });
});
