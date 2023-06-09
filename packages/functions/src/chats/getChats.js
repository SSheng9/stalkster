import { getChats } from "@stalkster/core/database"

export async function main(event) {
    const chats = await getChats()
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
            chats: chats     
            }
        ),
    };
}