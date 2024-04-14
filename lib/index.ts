import http = require("node:http");
import bodyParser = require("body-parser");

export type App = {
  port: number;
};

export type Method =
  | "*"
  | "GET"
  | "POST"
  | "PATCH"
  | "PUT"
  | "OPTIONS"
  | "HEAD"
  | "DELETE";

export type MethodNames =
  | "*"
  | "get"
  | "post"
  | "patch"
  | "put"
  | "delete"
  | "options"
  | "head";

// export type UseFn = (url: string, method: string, handler: Callback) => Callback;

export type GljivaWebFrameworkType = {
  [method in MethodNames]: (url: string, handler: Callback) => void;
} & {
  listen: (port: number, callback?: (app: App) => void) => http.Server;
  use: (url: string, method: string, handler: Callback) => void;
};

export type NextFunction = () => {};

export type _Response = Response & {
  json: (data: any) => void;
  end: (data?: any) => void;
};

export type Callback = (
  req: Request,
  res: _Response,
  next: NextFunction
) => void;

const middlewares: any[] = [
  {
    url: null,
    method: "POST",
    handler: bodyParser.json(),
  },
];

const endpoints: any[] = [
  {
    url: "/favicon.ico",
    method: "GET",
    handler: (req, res) => {
      // Define a simple SVG favicon
      const svgFavicon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <rect width="100%" height="100%" fill="green" />
      </svg>`;

      // Set the content type to 'image/svg+xml'
      // @ts-ignore
      res.setHeader("Content-Type", "image/svg+xml");

      // Send the SVG favicon
      res.end(svgFavicon);
    },
  },
];

export class GljivaWebFramework {
  private server: http.Server;

  constructor() {
    this.server = http.createServer(this.handleRequest);
  }

  private handleRequest(req, _res) {
    const allMiddlewares = [...middlewares, ...endpoints];

    const res = Object.assign(_res, {
      json(data: any) {
        _res.setHeader("Content-Type", "application/json");
        return _res.end(JSON.stringify(data));
      },
      send(data: string) {
        _res.setHeader("Content-Type", "text/html; charset=utf-8");
        return _res.end(data);
      },
    });

    let middlewareCounter = 0;
    function nextFunction() {
      while (middlewareCounter < allMiddlewares.length) {
        // console.log(
        //   "Next Function While Loop- Current Counter:",
        //   middlewareCounter
        // );
        if (match(req, allMiddlewares[middlewareCounter])) {
          // console.log("match", allMiddlewares[middlewareCounter]);

          return allMiddlewares[middlewareCounter++].handler(
            req,
            res,
            nextFunction
          );
        } else {
          middlewareCounter++;
        }
      }
      // If we are here then no middleware matched!!!!
    }

    try {
      return nextFunction();
    } catch (error) {
      console.error("500", error);
      res.json({ code: 500 });
    }
  }

  public listen(port: number, callback?: (app: App) => void) {
    return this.server.listen(port, () => callback({ port }));
  }
}

// if the request is a match for the middleware or not
function match(req, { url, method }) {
  if (!url && !method) return true;
  if (!url && (req.method === method || method === "*")) return true;
  if (method !== "*" && req.method !== method) return false;
  if (req.url !== url) return false;
  return true;
}

// decorators

export function Test(args) {
  return function (Class) {
    console.log(`inject`, args, Class);
  };
}

export function Module(args) {
  return function (Class) {
    console.log(`Module`, args, Class);
  };
}
export function Controller(args) {
  return function (Class) {
    console.log(`Controller`, args, Class);
  };
}

export function Test2(...args) {
  return function (Class) {
    console.log(`inject2`, args, Class);
  };
}

export function Middleware({
  url,
  method,
  type = "middleware",
}: {
  url: string | null;
  method: Method;
  type?: "middleware" | "endpoint";
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): any {
    // console.log("@Middleware", { target, propertyKey, descriptor });

    const targetStore = type === "middleware" ? middlewares : endpoints;

    targetStore.push({
      url,
      method,
      handler: descriptor.value,
    });

    console.log(`Registered new middleware ${method} \t ${url}`);

    return null;
  };
}

export function Get(url: string | null = "/") {
  return Middleware({ url, method: "GET", type: "endpoint" });
}
export function Post(url: string | null = "/") {
  return Middleware({ url, method: "POST", type: "endpoint" });
}
export function Put(url: string | null = "/") {
  return Middleware({ url, method: "PUT", type: "endpoint" });
}
export function Patch(url: string | null = "/") {
  return Middleware({ url, method: "PATCH", type: "endpoint" });
}
export function Delete(url: string | null = "/") {
  return Middleware({ url, method: "DELETE", type: "endpoint" });
}
