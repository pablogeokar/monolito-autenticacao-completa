import { z } from "zod";
import { userService } from "./user.module";
import type { FastifyTypedInstance } from "types";

export default async function routes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      schema: {
        description: "List users",
        tags: ["users"],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              password: z.string(),
            })
          ),
          404: z.null().describe("Users not found"),
        },
      },
    },
    async () => {
      const users = await userService.getAll();
      return users;
    }
  );

  app.get(
    "/:id",
    {
      schema: {
        description: "User by ID",
        tags: ["users"],
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            password: z.string(),
          }),
          404: z.null().describe("User not found"),
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const user = await userService.getById(id);
      return user;
    }
  );

  app.post(
    "/",
    {
      schema: {
        description: "Create a new user",
        tags: ["users"],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z
            .object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              password: z.string(),
            })
            .describe("User created"),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Users not found"),
        },
      },
    },
    async (req, res) => {
      const user = await userService.create(req.body);

      if (!user) return res.status(404).send({ message: "User not found" });

      return res.status(201).send(user);
    }
  );
}
