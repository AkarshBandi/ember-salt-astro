import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: "http://localhost:4001/graphql", token: "5873e3efd6d6c03a20d77fe17257388b1003983b", queries,  });
export default client;
  