import { createChat } from "@stalkster/core/database"

export async function main(event) {

    const sub = event.requestContext.authorizer?.jwt.claims.sub;
    const username = event.requestContext.authorizer?.jwt.claims.username;
    console.log("sub",sub)

    const { name } = JSON.parse(event.body);
    // console.log(event)
    // console.log({name})
    const chat = await createChat(name, sub, username)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                chat      
            }
        ),
    };
}