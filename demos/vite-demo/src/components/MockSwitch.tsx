import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import useAcquireMock from "../hooks/useAcquireMock";

export default function MockSwitch() {
  const { mockingEnabled, setMockingEnabled } = useAcquireMock();

  return (
    <FormControlLabel
      control={
        <Switch
          color="success"
          checked={mockingEnabled}
          onChange={() =>
            setMockingEnabled((mockingEnabled) => !mockingEnabled)
          }
        />
      }
      label={mockingEnabled ? "Mocking enabled" : "Mocking disabled"}
      sx={{
        ml: "auto",
        color: mockingEnabled ? "success.light" : "warning.light",
        bgcolor: "grey.900",
        px: 3,
        py: 0.5,
        borderRadius: 5,
        width: 250
      }}
    />
  );
}
