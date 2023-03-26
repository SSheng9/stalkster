import { createMessage } from "@stalkster/core/database"

export async function main(event) {
    const sub = event.requestContext.authorizer?.jwt.claims.sub;
    const username = event.requestContext.authorizer?.jwt.claims.username;

    const { content } = JSON.parse(event.body);
    const chatId = event.pathParameters.chatId
    console.log("Mcontent",content )
    console.log("Mid", chatId)

    // console.log(event)
    // console.log({name})
    const message = await createMessage(chatId, content, sub, username)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message      
            }
        ),
    };
}