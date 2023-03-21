// import { Time } from "@stalkster/core/time";

export async function handler(event, context) {
  // const time = new Time();
  return {
    statusCode: 200,
    body: JSON.stringify({
      // time: time.now(),
      message: "Hello from Lambda!!!",
    }),
  };
}
