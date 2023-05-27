import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { TableCellProps } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPosts } from "../api/post/postApi";
import { getUser } from "../api/user/userApi";
import { PostCard } from "../components/PostCard";

const TableLabelCell = (props: TableCellProps) => (
  <TableCell
    align="left"
    {...props}
    sx={{ fontWeight: "medium", ...props.sx }}
  />
);

const TableValueCell = (props: TableCellProps) => (
  <TableCell
    align="right"
    {...props}
    sx={{ fontWeight: "light", ...props.sx }}
  />
);

export default function UsersPage() {
  const { userId } = useParams<{ userId: string }>();

  const { data: user, status: userStatus } = useQuery({
    queryFn: () => getUser({ userId: +userId! }),
    queryKey: ["users", userId],
    enabled: !!userId
  });

  const { data: posts, status: postStatus } = useQuery({
    queryFn: () => getPosts({ sort: "id", order: "desc", userId: +userId! }),
    queryKey: ["posts-for-user", userId],
    enabled: !!userId
  });

  return (
    <Box m={2}>
      {userStatus === "loading" ? (
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
          <Box display="flex" columnGap={2} alignItems="center">
            <Avatar sx={{ width: 56, height: 56 }} />
            <Typography variant="h3" component="h2">
              {user?.model.name}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Table size="small" sx={{ maxWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="overline">Contact</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableLabelCell>Email</TableLabelCell>
                <TableValueCell>{user?.model.email}</TableValueCell>
              </TableRow>
              <TableRow>
                <TableLabelCell>Phone number</TableLabelCell>
                <TableValueCell>{user?.model.phone}</TableValueCell>
              </TableRow>
              <TableRow>
                <TableLabelCell>Website</TableLabelCell>
                <TableValueCell>{user?.model.website}</TableValueCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table size="small" sx={{ maxWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="overline">Company</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableLabelCell>Name</TableLabelCell>
                <TableValueCell>{user?.model.company.name}</TableValueCell>
              </TableRow>
              <TableRow>
                <TableLabelCell>Catch phrase</TableLabelCell>
                <TableValueCell>
                  {user?.model.company.catchPhrase}
                </TableValueCell>
              </TableRow>
              <TableRow>
                <TableLabelCell>BS</TableLabelCell>
                <TableValueCell>{user?.model.company.bs}</TableValueCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table size="small" sx={{ maxWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="overline">Address</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableLabelCell>Street</TableLabelCell>
                <TableValueCell>{user?.model.address.street}</TableValueCell>
                <TableLabelCell>Suite</TableLabelCell>
                <TableValueCell>{user?.model.address.suite}</TableValueCell>
              </TableRow>
              <TableRow>
                <TableLabelCell>City</TableLabelCell>
                <TableValueCell>{user?.model.address.city}</TableValueCell>
                <TableLabelCell>Zip code</TableLabelCell>
                <TableValueCell>{user?.model.address.zipcode}</TableValueCell>
              </TableRow>
            </TableBody>
          </Table>

          <Stack spacing={2} mt={4}>
            <Typography variant="h4" component="h3">
              Posts
            </Typography>
            {postStatus === "loading" ? (
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
              posts?.model.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  body={post.body}
                />
              ))
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}
