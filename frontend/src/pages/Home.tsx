import { Container, Paper, Typography, Divider } from "@mui/material";
import ShortenForm from "../components/ShortenForms";
import ShortenedLinks from "../components/ShortenedLinks";
import { useState } from "react";
import type { ShortenResponse } from "../types";

const HomePage = () => {
  const [shortened, setShortened] = useState<ShortenResponse[]>([]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          URL Shortener
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <ShortenForm onShortenComplete={setShortened} />
        {shortened.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <ShortenedLinks results={shortened} />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default HomePage;
