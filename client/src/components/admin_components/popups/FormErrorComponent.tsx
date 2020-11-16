import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { Message } from "semantic-ui-react";
// css imports //
import "./css/formErrorComponent.css";

type ErrorResponse = {
  responseMsg: string;
  messages?: string[];
}
type FormErrorCompState = {
  visible: boolean;
  header: string;
  errors: string[];
}
interface Props {
  error: AxiosError<ErrorResponse>;
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
      header: "",
      errors: []
    })
  }

  useEffect(() => {
    if (error && error.response) {
      if(error.response.data && error.response.data.messages) {
        const { responseMsg, messages } = error.response.data; 
        setFormErrorCompState({
          visible: true,
          header: responseMsg,
          errors: [ ...messages ]
        })
      } else  {
        // set a general error //
        setFormErrorCompState({
          visible: true,
          header: "An error occured",
          errors: [ "Please try again"]
        })
      }
    }
  }, [error]);
  
  return (
    formErrorCompState.visible ?
    <div className="formErrorComponentHolder">
      <Message
        onDismiss={handleDismiss}
        error
        header={formErrorCompState.header}
        list={formErrorCompState.errors}
      />
    </div>
    : null
  );
};

export default FormErrorComponent;