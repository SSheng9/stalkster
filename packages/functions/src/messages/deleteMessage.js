import { deleteMessage } from "@stalkster/core/src/database"

export async function main(event) {
    const id = event.pathParameters.messageId
    console.log('dId', id)
    const deleted = await deleteMessage(id)
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