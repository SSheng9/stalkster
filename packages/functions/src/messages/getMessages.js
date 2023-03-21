import { getMessages } from "@stalkster/core/src/database"

export async function main(event) {
    
    const chatId = event.pathParameters.chatId
    console.log(event)
    console.log("id",chatId)


    const messages = await getMessages(chatId)
    console.log("messages",messages)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                messages: messages     
            }
        ),
    };
}