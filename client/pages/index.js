import buildClient from "../api/build-client";

const Index = ({ currentUser }) => {
    return currentUser ? <h1>You are logged in</h1> : <h1>Your are NOT logged in</h1>
}

Index.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');

    return data;
};

export default Index;