
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebaseConfig";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
} from "@mui/material";

interface Comment {
  id: string;
  userId: string;
  username: string;
  comment: string;
  createdAt: Timestamp;
}

interface Props {
  knowledgeId: string;
}

const CommentList: React.FC<Props> = ({ knowledgeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (showComments) {
      const q = query(
        collection(db, "knowledge", knowledgeId, "comments"),
        orderBy("createdAt", "asc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const commentsData: Comment[] = [];
        querySnapshot.forEach((doc) => {
          commentsData.push({ id: doc.id, ...doc.data() } as Comment);
        });
        setComments(commentsData);
      });
      return () => unsubscribe();
    }
  }, [knowledgeId, showComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    if (user) {
      await addDoc(collection(db, "knowledge", knowledgeId, "comments"), {
        userId: user.uid,
        username: user.displayName || "Anonymous",
        comment: newComment,
        createdAt: Timestamp.now(),
      });
      setNewComment("");
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowComments(!showComments)}
        style={{ marginBottom: "1rem" }}
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </Button>
      {showComments && (
        <>
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id}>
                <Box>
                  <Typography variant="body1">{comment.comment}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    - {comment.username} at{" "}
                    {comment.createdAt.toDate().toLocaleString()}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
          {user ? (
            <Box mt={2}>
              <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCommentSubmit}
                style={{ marginTop: "1rem" }}
              >
                Submit
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              You need to be logged in to comment.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default CommentList;
