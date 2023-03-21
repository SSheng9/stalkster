import { createMessage } from "@stalkster/core/src/database"

export async function main(event) {

    const { content } = JSON.parse(event.body);
    const chatId = event.pathParameters.chatId
    console.log("Mcontent",content )
    console.log("Mid", chatId)

    // console.log(event)
    // console.log({name})
    const message = await createMessage(chatId, content)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message      
            }
        ),
    };
}