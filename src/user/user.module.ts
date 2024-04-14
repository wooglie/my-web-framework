import { Module } from "../../lib";
import { UserController } from "./user.controller";

@Module({
  controllers: [UserController],
})
export class UserModule {}
