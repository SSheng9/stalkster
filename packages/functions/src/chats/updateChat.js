import { updateChat } from "@stalkster/core/database"

export async function main(event) {
    const id = event.pathParameters.chatId
    const { name } = JSON.parse(event.body);
    // const sub = event.requestContext.authorizer?.jwt.claims.sub;

    const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId


    console.log("id",id)
    console.log("name", {name})
    // console.log("sub", sub)
    const update = await updateChat(id, name, identityPoolUserId)
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