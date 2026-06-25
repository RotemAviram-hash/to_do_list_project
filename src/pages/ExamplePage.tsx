import {

  Container,
} from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { useMemo } from "react";


async function fetchPosts () {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return await response.json();
}
async function fetchUsers () {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return await response.json();
}


function ExamplePage() {
  const { data : posts, error: postsError, isLoading: postsLoading,isError: postsIsError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    retry: 5
  });
   const { data : users, error: usersError, isLoading: usersLoading,isError: usersIsError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: 5
  });

  const userMap =useMemo(()=> new Map(users.map((user:any) => [user.id, user])),[users]);


  if (postsLoading || usersLoading) {
    return <div>Loading...</div>;
  }
  if (postsIsError) {
    return <div>Error: {postsError.message}</div>;
  }
  if (usersIsError) {
    return <div>Error: {usersError.message}</div>;
  }

  return (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <h1>Posts</h1>
    {posts.map((post: any) => (
      <div key={post.id} style={{ marginBottom: '20px' }}>
        <h2>{post.title}</h2>
        <h3>By: {(userMap.get(post.userId)as any)?.name || 'Unknown'}</h3>
        <p>{post.body}</p>

      </div>
    ))}
  </Container>
);
}

export default ExamplePage;
