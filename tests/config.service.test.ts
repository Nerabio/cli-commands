import "reflect-metadata";
import { ConfigService } from "../src/services/config.service";
import { ConfigApp } from "../src/interfaces/config-app.interface";

describe("ConfigService", () => {
  let configService: ConfigService;

  beforeEach(() => {
    process.env.USER_NAME = "TestUser";
    configService = new ConfigService();
  });

  afterEach(() => {
    delete process.env.USER_NAME;
  });

  it("should initialize config with environment variables", () => {
    const config: ConfigApp = configService.getInstance();
    expect(config.name).toBe("TestUser");
  });

  it("should return the correct config value for a given key", () => {
    const value = configService.getConfigValue("name");
    expect(value).toBe("TestUser");
  });

  it("should return undefined for a non-existent config key", () => {
    const value = configService.getConfigValue(
      "nonExistentKey" as keyof ConfigApp
    );
    expect(value).toBeUndefined();
  });

  it("should update the config with new values", () => {
    configService.updateConfig({ name: "UpdatedUser" });
    const config: ConfigApp = configService.getInstance();
    expect(config.name).toBe("UpdatedUser");
  });

  it("should log a warning if a non-existent config key is requested", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    configService.getConfigValue("nonExistentKey" as keyof ConfigApp);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Config key "nonExistentKey" not found'
    );
    consoleWarnSpy.mockRestore();
  });

  it("should log info when config is updated", () => {
    const consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    configService.updateConfig({ name: "UpdatedUser" });
    expect(consoleInfoSpy).toHaveBeenCalledWith("Configuration updated:", {
      name: "UpdatedUser",
    });
    consoleInfoSpy.mockRestore();
  });

  it("should throw an error if required config key is missing", () => {
    delete process.env.USER_NAME;
    expect(() => new ConfigService()).toThrow(
      "Config validation error: 'name' is required"
    );
  });
});
