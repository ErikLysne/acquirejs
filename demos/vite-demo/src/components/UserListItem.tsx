import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";

export interface UserListItemProps {
  id?: number;
  name?: string;
  avatar?: string;
  primary?: string;
  secondary?: string;
}

export default function UserListItem(props: UserListItemProps) {
  const { name, avatar, primary, secondary } = props;

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={name} src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6" color="text.primary">
            {name}
          </Typography>
        }
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              display="block"
              variant="body1"
              color="text.secondary"
            >
              {primary}
            </Typography>
            <Typography
              component="span"
              display="block"
              variant="body2"
              color="text.secondary"
            >
              {secondary}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}
