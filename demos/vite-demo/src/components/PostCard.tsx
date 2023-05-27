import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { createComment, getComments } from "../api/comment/commentApi";
import { getUser } from "../api/user/userApi";
import UserListItem from "./UserListItem";

export interface PostCardProps {
  id?: number;
  userId?: number;
  title?: string;
  body?: string;
}

export function PostCard(props: PostCardProps) {
  const { id, userId, title, body } = props;
  const [showComments, setShowComments] = React.useState<boolean>(false);
  const [comment, setComment] = React.useState("");

  const { data: user } = useQuery({
    queryFn: () => getUser({ userId: userId! }),
    queryKey: ["users", userId],
    enabled: !!userId
  });

  const {
    data: comments,
    status: commentsStatus,
    refetch: refetchComments
  } = useQuery({
    queryFn: () => getComments({ postId: id, sort: "id", order: "desc" }),
    queryKey: ["comments", id],
    enabled: showComments
  });

  const createCommentMutation = useMutation(createComment, {
    onSuccess: () => {
      refetchComments();
      setComment("");
    }
  });

  function handleAddComment() {
    if (id) {
      createCommentMutation.mutate({
        data: {
          body: comment,
          postId: id
        }
      });
    }
  }

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={!user ? `Post ID: ${id}` : ""}
      ></CardHeader>

      {user && (
        <CardContent>
          <Box display="flex" columnGap={2}>
            <Avatar />
            <Box>
              <Typography component={Link} to={`/user/${user?.model.id}`}>
                {user?.model.name}
              </Typography>
              <Typography>{`Post ID: ${id}`}</Typography>
            </Box>
          </Box>
        </CardContent>
      )}

      <CardContent>
        <Typography variant="body1" color="text.secondary" paragraph>
          {body}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          variant="text"
          color="primary"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </Button>
      </CardActions>

      <Collapse in={showComments}>
        <Box sx={{ p: 2, pt: 0 }}>
          <Divider />

          {commentsStatus === "loading" ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50px"
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography
                variant="h6"
                component="div"
                color="text.primary"
                my={2}
              >
                {`Comments (${comments?.model.length})`}
              </Typography>
              <List>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="h6" color="text.primary">
                        Leave a comment
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={2} mt={2}>
                        <TextField
                          label="Leave a comment"
                          variant="outlined"
                          multiline
                          fullWidth
                          minRows={2}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddComment}
                          disabled={
                            !comment.length || createCommentMutation.isLoading
                          }
                          sx={{
                            width: "100%",
                            maxWidth: 200,
                            mx: "auto"
                          }}
                        >
                          Submit
                        </Button>
                      </Stack>
                    }
                    secondaryTypographyProps={{
                      component: "div"
                    }}
                  />
                </ListItem>
                {comments?.model.reverse().map((comment) => (
                  <UserListItem
                    key={comment.id}
                    name={comment.name}
                    primary={comment.body}
                    secondary={`Comment ID: ${comment.id}, Post ID: ${comment.postId}`}
                  />
                ))}
              </List>
            </>
          )}
        </Box>
      </Collapse>
    </Card>
  );
}
