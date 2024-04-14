import { Controller, Get, Middleware, Post } from "../../lib";

const wait = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

@Controller({})
export class UserController {
  @Post("/user")
  getUser(req, res) {
    console.log("body:", req.body);
    return res.json(req.body);
  }

  @Get("/users")
  getUsers(req, res) {
    console.log("preparing the list of users...");
    return res.json({ list: ["user1", "user2"], count: 2 });
  }

  @Get("/test")
  async test(req, res) {
    console.log("preparing the list of users...");
    // await wait(5);
    // return res.json({ list: ["user1", "user2"], count: 2 });

    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <span>hello</span>
      </body>
      </html>
    `);
  }
}
