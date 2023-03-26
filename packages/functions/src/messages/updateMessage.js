import { updateMessage } from "@stalkster/core/database"

export async function main(event) {
    const id = event.pathParameters.messageId
    const { content } = JSON.parse(event.body);
    const sub = event.requestContext.authorizer?.jwt.claims.sub;


    console.log("id",id)
    console.log("name", {content})
    console.log('sub', sub)
    const update = await updateMessage(id, content, sub)
    // console.log('result', update)
    return {
        statusCode: 200,
              body: JSON.stringify(
            {
                update      
            }
        ),
    };
}