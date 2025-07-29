import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input(
    z.object({
      name: z.string().min(1, "Project name is required"),
      repoUrl: z.string().url("Invalid repository URL"),
      githubToken: z.string().optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    console.log("input", input);
    return true;
  })
});