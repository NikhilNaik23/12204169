import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { shortenURL } from "../api";
import type { ShortenInput, ShortenResponse } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  onShortenComplete: (results: ShortenResponse[]) => void;
}

const ShortenForm: React.FC<Props> = ({ onShortenComplete }) => {
  const [forms, setForms] = useState<ShortenInput[]>([
    { url: "", validity: undefined, shortcode: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (
    index: number,
    field: keyof ShortenInput,
    value: string
  ) => {
    const updated = [...forms];
    if (field === "validity" && value === "") {
      updated[index][field] = undefined;
    } else if (field === "validity") {
      updated[index][field] = parseInt(value);
    } else {
      updated[index][field] = value;
    }
    setForms(updated);
  };

  const handleAdd = () => {
    if (forms.length >= 5) return;
    setForms([...forms, { url: "", validity: undefined, shortcode: "" }]);
  };

  const handleRemove = (index: number) => {
    const updated = forms.filter((_, i) => i !== index);
    setForms(updated);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const results: ShortenResponse[] = [];

      for (let form of forms) {
        if (!form.url.trim()) continue;
        try {
          const res = await shortenURL(form);
          results.push(res);
        } catch (innerErr: any) {
            console.log(innerErr)
        }
      }

      if (results.length > 0) {
        onShortenComplete(results);
        navigate("/stats", { state: { results } });
      } else {
        setError("No URLs were shortened. Please check inputs.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5">URL Shortener</Typography>
      {forms.map((form, index) => (
        <Grid container spacing={2} alignItems="center" key={index} sx={{ my: 1 }}>
          <Grid item xs={5}>
            <TextField
              fullWidth
              label="URL"
              value={form.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Validity (mins)"
              type="number"
              value={form.validity ?? ""}
              onChange={(e) => handleChange(index, "validity", e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Custom Shortcode"
              value={form.shortcode}
              onChange={(e) => handleChange(index, "shortcode", e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => handleRemove(index)}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      {error && <Typography color="error">{error}</Typography>}
      <Button onClick={handleAdd} disabled={forms.length >= 5} startIcon={<Add />}>
        Add URL
      </Button>
      <Button onClick={handleSubmit} disabled={loading} variant="contained" sx={{ ml: 2 }}>
        Shorten
      </Button>
    </Box>
  );
};

export default ShortenForm;
