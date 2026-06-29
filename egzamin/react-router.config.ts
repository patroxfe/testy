import type { Config } from "@react-router/dev/config";

const basePath = process.env.BASE_PATH || "/";
const basename =
  basePath === "/"
    ? "/"
    : basePath.endsWith("/")
      ? basePath
      : `${basePath}/`;

export default {
  ssr: false,
  basename,
} satisfies Config;
