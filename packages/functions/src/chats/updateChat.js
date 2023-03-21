import { updateChat } from "@stalkster/core/src/database"

export async function main(event) {
    const id = event.pathParameters.chatId
    const { name } = JSON.parse(event.body);

    console.log("id",id)
    console.log("name", {name})
    const update = await updateChat(id, name)
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