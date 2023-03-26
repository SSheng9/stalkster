import { useAuthenticator } from "@aws-amplify/ui-react";

export default function Profile(){

    const { user, signOut } = useAuthenticator((context) => [context.user]);

    return (
        <div>
            <h1>Profile</h1>
            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
            <p>username: {user?.username}</p>
            <p>email: {user?.attributes.email}</p>
            <button onClick={signOut}  className={`px-4 py-2 mt-4 text-white bg-green-500 font-semibold rounded`}>Sign Out</button>
        </div>
    )
}