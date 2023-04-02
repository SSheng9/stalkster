import { createChat } from "@stalkster/core/database"
// import { getUsernameFromIdentityId} from "@tsconfig/core/src/userInfo"



// function getUserId(event) {
//     if (!event.requestContext.authorizer?.iam) {
//       return 
//     }
//     const authProvider = event.requestContext.authorizer.iam.cognitoIdentity.amr.findLast(ref => ref.includes(':'))
//     const parts = authProvider.split(':');
//     return parts[parts.length - 1];
//   }
  
export async function main(event) {

    // const sub = event.requestContext.authorizer?.jwt.claims.sub;
    // const username = event.requestContext.authorizer?.jwt.claims.username;
    
    // console.log("sub",sub)

    // console.log(event.requestContext.authorizer)
    const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId
    // const username = await getUsernameFromIdentityId(event)
    // console.log({username})

    // const userPoolUserId = getUserId(event)
    const { name } = JSON.parse(event.body);
    const chat = await createChat(name, identityPoolUserId, "SSheng")
    // const { name } = JSON.parse(event.body);
    // console.log(event)
    // console.log({name})
    // const chat = await createChat(name, sub, username)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                chat      
                // userPoolUserId,
                // IdentityPoolId
            }
        ),
    };
}