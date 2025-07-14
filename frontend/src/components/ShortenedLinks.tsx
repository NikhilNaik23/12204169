import React from "react";
import { Box, Typography, List, ListItem, Link } from "@mui/material";
import type { ShortenResponse } from "../types";

interface Props {
  results?: ShortenResponse[];
}

const ShortenedLinks: React.FC<Props> = ({ results = [] }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Shortened Links</Typography>
      {results.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No links shortened yet.
        </Typography>
      ) : (
        <List>
          {results.map((item, idx) => (
            <ListItem
              key={idx}
              sx={{
                flexDirection: "column",
                alignItems: "start",
                borderBottom: "1px solid #eee",
                pb: 1,
                mb: 1,
              }}
            >
              <Link
                href={item.shortlink}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ fontSize: "1rem", fontWeight: 500 }}
              >
                {item.shortlink}
              </Link>
              <Typography variant="caption" color="text.secondary">
                Expiry: {new Date(item.expiry).toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ShortenedLinks;
