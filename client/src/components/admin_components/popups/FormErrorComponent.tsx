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
  header: string;
  errors: string[];
}
interface Props {
  error: AxiosError<ErrorResponse>;
  handleClearError: () => void;
}
const FormErrorComponent: React.FC<Props> = ({ error, handleClearError }): JSX.Element | null => {
  const [ formErrorCompState, setFormErrorCompState ] = useState<FormErrorCompState>({
    header: "",
    errors: []
  });

  const handleDismiss = () => {
    handleClearError();
    /*
    setFormErrorCompState({
      header: "",
      errors: []
    })
    */
  }

  useEffect(() => {
    if (error && error.response) {
      if(error.response.data && error.response.data.messages) {
        console.log(38)
        const { responseMsg, messages } = error.response.data; 
        setFormErrorCompState({
          header: responseMsg,
          errors: [ ...messages ]
        })
      } else  {
        // set a general error //
        setFormErrorCompState({
          header: "An error occured",
          errors: [ "Please try again"]
        })
      }
    }
  }, [error]);
  
  return (
    <div className="formErrorComponentHolder">
      <Message
        onDismiss={handleDismiss}
        error
        header={formErrorCompState.header}
        list={formErrorCompState.errors}
      />
    </div>
  );
};

export default FormErrorComponent;