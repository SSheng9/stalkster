import { API } from "./stacks/ApiStack";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
  config(_input) {
    return {
      name: "stalkster",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(API).stack(FrontendStack);
  }
} 