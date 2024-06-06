// pages/index.tsx
import { GetServerSideProps } from "next";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import KnowledgeList from "@/components/KnowledgeList";

interface Knowledge {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface Props {
  knowledge: Knowledge[];
}

const Home: React.FC<Props> = ({ knowledge }) => {
  return <KnowledgeList knowledge={knowledge} />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const q = query(collection(db, "knowledge"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const knowledge = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      createdAt: data.createdAt.toDate().toISOString(), // Serializando a data como ISO string
    };
  });

  return {
    props: {
      knowledge,
    },
  };
};

export default Home;
