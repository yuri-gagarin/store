import React, { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
// css imports //
import "./css/formErrorComponent.css";
import { AxiosError } from "axios";

type ErrorResponse = {
  responseMsg: string;
  messages: string[];
}
type FormErrorCompState = {
  visible: boolean;
  header: string;
  errors: string[];
}
interface Props {
  error: AxiosError<ErrorResponse> | Error;
  handleClearError: () => void;
}
const FormErrorComponent: React.FC<Props> = ({ error }): JSX.Element | null => {
  const [ formErrorCompState, setFormErrorCompState ] = useState<FormErrorCompState>({
    visible: false,
    header: "",
    errors: []
  });

  const handleDismiss = () => {
    setFormErrorCompState({
      visible: false,

    })
  }

  useEffect(() => {
    if (error instanceof AxiosError)
    if (error && error.response) {
      if(error.response.data) {
        const { responseMsg, messages } = error.response.data; 
      }
      
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