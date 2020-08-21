import React, { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
// css imports //
import "./css/formErrorComponent.css";
import { AxiosError } from "axios";

type ErrorResponse = {
  responseMsg: string;
  messages: string[];
}
interface Props {
  error: AxiosError<ErrorResponse> | null;
}
const FormErrorComponent: React.FC<Props> = ({ error }): JSX.Element | null => {
  const [ visible, setVisible ] = useState<boolean>(false);
  const [ header, setHeader ] = useState<string>("");
  const [ errors, setErrors ] = useState<string[]>([]);

  const handleDismiss = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (error) {
      const { responseMsg, messages } = (error.response!.data)
      setHeader(responseMsg);
      setErrors([ ...messages ]);
      setVisible(true);
    }
  }, [error]);
  
  return (
    visible ?
    <div className="formErrorComponentHolder">
      <Message
        onDismiss={handleDismiss}
        error
        header={header}
        list={errors}
      />
    </div>
    : null
  );
};

export default FormErrorComponent;