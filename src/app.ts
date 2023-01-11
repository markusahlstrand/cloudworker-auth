import { Router, bodyparser, Context } from "cloudworker-router";

import { Env } from "./types/Env";
import { RegisterRoutes } from "../build/routes";
import swagger from "../build/swagger.json";
import packageJson from "../package.json";
import swaggerUi from "./routes/swagger-ui";
import rotateKeys from "./routes/rotate-keys";

export const app = new Router<Env>();

app.get("/", async () => {
  return new Response(
    JSON.stringify({
      name: packageJson.name,
      version: packageJson.version,
    })
  );
});

app.get("/spec", async () => {
  return new Response(JSON.stringify(swagger));
});

app.get("/docs", swaggerUi);

app.post("/create-key", async (ctx: Context<Env>) => {
  await rotateKeys(ctx.env);

  return new Response("OK");
});

app.use(bodyparser);

RegisterRoutes(app);

app.use(app.allowedMethods());
