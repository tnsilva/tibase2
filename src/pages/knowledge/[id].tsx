// pages/knowledge/[id].tsx
import { GetServerSideProps } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import CommentList from "../../components/CommentList";
import { Box, Typography, Card, CardContent } from "@mui/material";

interface Knowledge {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Props {
  knowledge: Knowledge;
}

const KnowledgePage: React.FC<Props> = ({ knowledge }) => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h4">{knowledge.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {new Date(knowledge.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" style={{ marginTop: "1rem" }}>
            {knowledge.content}
          </Typography>
        </CardContent>
      </Card>
      <Box mt={4}>
        <CommentList knowledgeId={knowledge.id} />
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const docRef = doc(db, "knowledge", id as string);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }

  const data = docSnap.data();

  return {
    props: {
      knowledge: {
        id: docSnap.id,
        title: data!.title,
        content: data!.content,
        createdAt: data!.createdAt.toDate().toISOString(),
      },
    },
  };
};

export default KnowledgePage;
