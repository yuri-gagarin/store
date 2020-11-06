import React, {} from "react";
import { Message } from "semantic-ui-react";

interface Props {
  clearError: () => void;
  error: Error;
  messages?: string[];
}
const ErrorBar: React.FC<Props> = ({ clearError, error, messages }): JSX.Element => {

  return (
    <Message 
      error
      onDismiss={clearError}
      header={error.message}
      list={[messages]}
    /> 
  );
};

export default ErrorBar;
