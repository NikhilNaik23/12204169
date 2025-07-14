import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Divider, List, ListItem } from "@mui/material";
import type { ShortenResponse } from "../types";

const Stats = () => {
  const location = useLocation();
  const results: ShortenResponse[] = location.state?.results;

  if (!results || results.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No data found. Please shorten a URL first.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Shortened URLs</Typography>
      <Divider sx={{ my: 2 }} />
      <List>
        {results.map((res, idx) => (
          <ListItem key={idx} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Typography variant="body1">
              <strong>Short Link:</strong>{" "}
              <a href={res.shortlink} target="_blank" rel="noreferrer">
                {res.shortlink}
              </a>
            </Typography>
            <Typography variant="body2">
              <strong>Expiry:</strong> {new Date(res.expiry).toLocaleString()}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Stats;
