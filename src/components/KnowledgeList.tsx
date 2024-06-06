// components/KnowledgeList.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  List,
  ListItem,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  TextField,
} from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebaseConfig";
import CommentList from "./CommentList";

interface Knowledge {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Props {
  knowledge: Knowledge[];
}

const KnowledgeList: React.FC<Props> = ({ knowledge }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredKnowledge, setFilteredKnowledge] =
    useState<Knowledge[]>(knowledge);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const filtered = knowledge.filter((item) => {
      const titleMatches = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const startDateMatches = startDate
        ? new Date(item.createdAt) >= new Date(startDate)
        : true;
      const endDateMatches = endDate
        ? new Date(item.createdAt) <= new Date(endDate)
        : true;
      return titleMatches && startDateMatches && endDateMatches;
    });
    setFilteredKnowledge(filtered);
  }, [searchTerm, startDate, endDate, knowledge]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "knowledge", id));
    router.replace(router.asPath); // Recarrega a página para atualizar a lista
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Knowledge Base
      </Typography>
      {user && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/new")}
          style={{ marginBottom: "1rem" }}
        >
          Add New Knowledge
        </Button>
      )}
      <Box mb={2}>
        <TextField
          label="Search Knowledge"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <TextField
          label="Start Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <TextField
          label="End Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>
      <List>
        {knowledge.map((item) => (
          <ListItem key={item.id} alignItems="flex-start" disableGutters>
            <Card
              variant="outlined"
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">{item.content}</Typography>
                {user && (
                  <Box mt={2}>
                    <CommentList knowledgeId={item.id} />
                  </Box>
                )}
              </CardContent>
              {user && (
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => router.push(`/edit/${item.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              )}
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default KnowledgeList;
