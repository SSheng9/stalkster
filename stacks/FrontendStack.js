import { StaticSite, use } from "sst/constructs";
import { API } from "./ApiStack";
import { MediaAssets } from "./MediaAssets";

export function FrontendStack({ stack, app }) {
  const { api, auth } = use(API);
  const { bucket } = use(MediaAssets)

  const site = new StaticSite(stack, "ReactSite", {
    path: "frontend",
    buildOutput: "dist",
    buildCommand: "yarn build",
    // Pass in our environment variables
    environment: {
    //   VITE_SHENG: "^_^",
      VITE_API_URL: api.customDomainUrl || api.url,
      VITE_APP_REGION: app.region,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId ?? "",
      VITE_APP_S3_BUCKET_NAME: bucket.bucketName,

    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.url || "",
  });
}
