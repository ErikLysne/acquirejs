import React from "react";
import { AcquireMockContext } from "../providers/AcquireMockProvider";

const useAcquireMock = () => React.useContext(AcquireMockContext);
export default useAcquireMock;
