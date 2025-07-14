import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import type { StatsResponse } from "../types";

interface Props {
  stats: StatsResponse[];
}

const StatsList: React.FC<Props> = ({ stats }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Statistics</Typography>
      <List>
        {stats.map((item, idx) => (
          <ListItem
            key={idx}
            sx={{
              flexDirection: "column",
              alignItems: "start",
              borderBottom: "1px solid #eee",
              mb: 2,
              pb: 2,
            }}
          >
            <Typography variant="subtitle2">Shortlink: {item.shortlink}</Typography>
            <Typography variant="body2" color="text.secondary">Original: {item.originalUrl}</Typography>
            <Typography variant="body2" color="text.secondary">Created: {new Date(item.createdAt).toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Expiry: {new Date(item.expiry).toLocaleString()}</Typography>
            <Typography variant="body2">Total Clicks: {item.totalClicks}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Click Logs:</Typography>
            <ul style={{ marginTop: 0 }}>
              {item.clickDetails.map((click, i) => (
                <li key={i} style={{ fontSize: "0.85rem", color: "#555" }}>
                  {new Date(click.timestamp).toLocaleString()} - {click.source} - {click.location || "Unknown"}
                </li>
              ))}
            </ul>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default StatsList;
