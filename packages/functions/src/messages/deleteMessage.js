import { deleteMessage } from "@stalkster/core/database"

export async function main(event) {
    // const sub = event.requestContext.authorizer?.jwt.claims.sub;
    const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId

    const id = event.pathParameters.messageId
    console.log('dId', id)
    const deleted = await deleteMessage(id, identityPoolUserId)
    console.log('delete', deleted)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
            content: deleted 
            }
        ),
    };
}