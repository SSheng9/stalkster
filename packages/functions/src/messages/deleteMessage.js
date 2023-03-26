import { deleteMessage } from "@stalkster/core/database"

export async function main(event) {
    const sub = event.requestContext.authorizer?.jwt.claims.sub;
    const id = event.pathParameters.messageId
    console.log('dId', id)
    const deleted = await deleteMessage(id, sub)
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