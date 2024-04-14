import { Get, GljivaWebFramework, Middleware, Module } from "../lib";
import { UserModule } from "./user/user.module";

@Module({ imports: [UserModule] })
class Server extends GljivaWebFramework {
  @Middleware({
    url: null,
    method: "*",
  })
  public requestLogger(req, res, next) {
    console.log(
      `${req.method} \t${req.url} ${!!req.body ? JSON.stringify(req.body) : ""}`
    );
    next();
  }

  @Middleware({
    url: null,
    method: "*",
    type: "endpoint",
  })
  public notFound(req, res) {
    console.log(`404 \t${req.url}`);
    return res.status(23).json({ code: 404 });
  }
}

new Server().listen(8000, ({ port }) => {
  console.log(`server started on port ${port}`);
});
