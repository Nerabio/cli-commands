import "reflect-metadata";
import { App } from "../src/app";
import { ConfigService } from "../src/services/config.service";
import { ConfigApp } from "../src/interfaces/config-app.interface";

describe("App", () => {
  let configService: ConfigService;
  let app: App;

  beforeEach(() => {
    configService = {
      getInstance: jest
        .fn()
        .mockReturnValue({ userName: "TestUser" } as ConfigApp),
    } as unknown as ConfigService;
    app = new App(configService);
  });

  it("should initialize config from ConfigService", () => {
    expect(app.configService).toBe(configService);
    expect(app.configService.getInstance).toHaveBeenCalled();
  });

  it("should log the correct message when run is called", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    await app.run({} as any); // Pass an empty object as IocContainer is not used in the method
    expect(consoleLogSpy).toHaveBeenCalledWith("Hello, TestUser!");
    consoleLogSpy.mockRestore();
  });
});
