import { updateMessage } from "@stalkster/core/src/database"

export async function main(event) {
    const id = event.pathParameters.messageId
    const { content } = JSON.parse(event.body);

    console.log("id",id)
    console.log("name", {content})
    const update = await updateMessage(id, content)
    console.log('result', update)
    return {
        statusCode: 200,
              body: JSON.stringify(
            {
                update      
            }
        ),
    };
}