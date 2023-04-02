import { deleteChat } from "@stalkster/core/database"

export async function main(event) {
    const id = event.pathParameters.chatId
    // const sub = event.requestContext.authorizer?.jwt.claims.sub;

    const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId


    console.log("id",id)
    const deleted = await deleteChat(id, identityPoolUserId)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
            chat: deleted 
            }
        ),
    };
}