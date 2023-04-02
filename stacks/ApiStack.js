import { Api, Cognito, use} from "sst/constructs";
import { MediaAssets } from "./MediaAssets";

import * as iam from "aws-cdk-lib/aws-iam";

export function API({ stack } ) {

  const { bucket } = use(MediaAssets)

  const auth = new Cognito(stack, "Auth", {
    login: ["email", "username"],
  });

    // const api = new Api(stack, "Api", {
      // authorizers: {
      //   jwt: {
      //     type: "user_pool",
      //     userPool: {
      //       id: auth.userPoolId,
      //       clientIds: [auth.userPoolClientId],
      //     },
      //   },
      // },
      
  
    // defaults: {
    //   authorizer: "jwt",
    const api = new Api(stack, "Api", {
      defaults: {
        authorizer: "iam",
      function: {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
        },
      },
    },

    routes: {
      // "GET /": "packages/functions/src/lambda.handler",
      // "GET /test": "packages/functions/src/anotherFunction.main",

      "GET /chats": {
        function: "packages/functions/src/chats/getChats.main",
        authorizer:"none",
      },
      "POST /chats": "packages/functions/src/chats/createChat.main",
      "PUT /chats/{chatId}":  "packages/functions/src/chats/updateChat.main",
      "DELETE /chats/{chatId}": "packages/functions/src/chats/deleteChat.main",

      "GET /chats/{chatId}/messages": {
        function: "packages/functions/src/messages/getMessages.main",
        authorizer:"none",
      },
      "POST /chats/{chatId}/messages": "packages/functions/src/messages/createMessage.main",
      "PUT /chats/{chatId}/messages/{messageId}":  "packages/functions/src/messages/updateMessage.main",
      "DELETE /chats/{chatId}/messages/{messageId}": "packages/functions/src/messages/deleteMessage.main",

    },
  });
  

  // Allow authenticated users invoke API
  // auth.attachPermissionsForAuthUsers(stack, [
  //   api,

  // Allow authenticated users invoke API
  // And CRUD images
  auth.attachPermissionsForAuthUsers(stack, [
    api,
    new iam.PolicyStatement({
      actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/public/*",
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
        bucket.bucketArn + "/protected/${cognito-identity.amazonaws.com:sub}/*",
      ]
    }),
    new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/protected/*",
      ]
    })
  ]);

  // Allow unauthenticated users to access images
  auth.attachPermissionsForUnauthUsers(stack, [
    new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/public/*",
        bucket.bucketArn + "/protected/*",
      ]
    })
    
  ]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    // IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId,
  });


  // stack.addOutputs({
  //   Sheng: "^_^",
  //   ApiEndpoint: api.url,
  // });

  return {api, auth}
}
