// pages/edit/[id].tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TextField, Button, Container, Typography } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import ProtectedRoute from "../../components/ProtectedRoute";

const EditKnowledge = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchKnowledge = async () => {
        const docRef = doc(db, "knowledge", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
        }
      };
      fetchKnowledge();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const docRef = doc(db, "knowledge", id as string);
    await updateDoc(docRef, {
      title,
      content,
    });
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <Container>
        <Typography variant="h4" gutterBottom>
          Edit Knowledge
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
            Update
          </Button>
        </form>
      </Container>
    </ProtectedRoute>
  );
};

export default EditKnowledge;
