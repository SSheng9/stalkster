import { createMessage } from "@stalkster/core/database"

export async function main(event) {
    // const sub = event.requestContext.authorizer?.jwt.claims.sub;
    // const username = event.requestContext.authorizer?.jwt.claims.username;

    const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId

    const { content, content_type } = JSON.parse(event.body);
    const chatId = event.pathParameters.chatId
    // console.log("Mcontent",content )
    // console.log("Mid", chatId)

    // console.log(event)
    // console.log({name})
    const message = await createMessage(chatId, content, identityPoolUserId, "SSheng", content_type)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message      
            }
        ),
    };
}