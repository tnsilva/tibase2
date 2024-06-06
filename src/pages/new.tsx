// pages/new.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextField, Button, Container, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { signIn, useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";

const NewKnowledge = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  //   const { data: session, status } = useSession();
  const router = useRouter();

  //   useEffect(() => {
  //     if (status === "unauthenticated") {
  //       signIn("google");
  //     }
  //   }, [status]);

  //   if (status === "loading") {
  //     return <div>Loading...</div>;
  //   }

  //   if (!session) {
  //     return null;
  //   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "knowledge"), {
      title,
      content,
      createdAt: new Date(),
    });
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <Container>
        <Typography variant="h4" gutterBottom>
          Add New Knowledge
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            required
            margin="normal"
            multiline
            rows={4}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Container>
    </ProtectedRoute>
  );
};

export default NewKnowledge;
