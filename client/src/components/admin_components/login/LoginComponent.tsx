import React, { useState, useEffect } from "react";
import { Form, Grid, Button } from "semantic-ui-react";
// css  imports //
import "./css/loginComp.css";

type LoginData = {
  loginText: string;
  typing: boolean;
}
type PasswordData = {
  passText: string;
  typing: boolean;
}
type LoginError = {
  content: string;
  pointing: string;
}
type PasswordError = {
  content: string;
  pointing: string;
}
type LoginErrorState = {
  error: boolean;
  details: LoginError;
}
type PassErrorState = {
  error: boolean;
  details: PasswordError
}
type FormData = {
  loginData: LoginData;
  passData: PasswordData;
}
// initial state //
const initLoginError: LoginErrorState = {
  error: false,
  details: {
    content: "",
    pointing: ""
  }
};
const initPassError: PassErrorState = {
  error: false,
  details: {
    content: "",
    pointing: ""
  }
};
const initFormData: FormData = {
  loginData: {
    loginText: "",
    typing: false
  },
  passData: {
    passText: "",
    typing: false
  }
};

const LoginComponent: React.FC<{}> = (props): JSX.Element => {
  const [ loginError, setLoginError ] = useState<LoginErrorState>(initLoginError);
  const [ passError, setPassError ] = useState<PassErrorState>(initPassError);
  const [ formData, setFormData ] = useState<FormData>(initFormData);
  // input listeners //
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ 
      ...formData,
      loginData: { typing: true, loginText: e.target.value }
    });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      passData: { typing: true, passText: e.target.value },
    });
  };
  // set errors if login is empty //
  useEffect(() => {
    if (formData.loginData.typing && formData.loginData.loginText.length === 0) {
      setLoginError({
        error: true,
        details: {
          content: "Login required",
          pointing: "below"
        }
      });
    } else {
      setLoginError({
        error: false,
        details: {
          content: "",
          pointing: ""
        }
      });
    }
  }, [formData.loginData]);
  // set errors if password is empty //
  useEffect(() => {
    if (formData.passData.typing && formData.passData.passText.length === 0) {
      setPassError({
        error: true,
        details: {
          content: "Password required",
          pointing: "below"
        }
      });
    } else {
      setPassError({
        error: false,
        details: {
          content: "",
          pointing: ""
        }
      });
    }
  }, [formData.passData]);

  return (
    <div className="loginCompHolder">
      <Grid columns={1} centered>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={10} computer={8}>
            <Form>
              <Form.Input
                error={ loginError.error ? loginError.details : null }
                fluid
                label='Login'
                placeholder='Login...'
                onChange={handleLoginChange}
              />
              <Form.Input
                error={ passError.error ? passError.details : null }
                fluid
                label='Password'
                placeholder='Password ...'
                onChange={handlePasswordChange}
              />
              <Button id="loginButton" inverted color="green" label="<" content="Login" />
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default LoginComponent;