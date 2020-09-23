import React, { useState, useEffect, useRef }  from "react";
import { Button, Form, TextArea } from "semantic-ui-react";
// type definitions //
import { FormState } from "../type_definitions/bonusVideoTypes";
// helpers //
import { checkSetValues } from "../../../helpers/validationHelpers";

interface Props {
  bonusVideoData: IBonusVideoData;
  handleCreateBonusVideo(data: FormState): void;
  handleUpdateBonusVideo(data: FormState): void;
}

const BonusVideoForm: React.FC<Props> = ({ bonusVideoData, handleCreateBonusVideo, handleUpdateBonusVideo }): JSX.Element => {
  const { description, youTubeURL, vimeoURL } = bonusVideoData;
  // local form state //
  const [ newForm, setNewForm ] = useState<boolean>(true)
  const [ formState, setFormState ] = useState<FormState>({ description, youTubeURL, vimeoURL });
  // form ref //
  const bonusVideoFormRef = useRef<HTMLDivElement>(document.createElement("div"));
  
  const handleYouTubeURLChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setFormState({
      ...formState,
      youTubeURL: e.target.value
    });
  };
  const handleVimeoURLChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setFormState({
      ...formState,
      vimeoURL: e.target.value
    });
  };
  const hadnleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({
      ...formState,
      description: e.target.value
    });
  };
  
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newForm) {
      handleCreateBonusVideo(formState);
    } else {
      handleUpdateBonusVideo(formState);
    }
  };

  useEffect(() => {
    checkSetValues(bonusVideoData) ? setNewForm(false) : setNewForm(true);
  },  [ bonusVideoData ]);

  useEffect(() => {
    if (bonusVideoFormRef.current) {
      const elem = bonusVideoFormRef.current.getBoundingClientRect();
      window.scrollTo({
        top: elem.bottom,
        behavior: "smooth"
      })
    }
  }, [ bonusVideoFormRef.current ]);
  
  return (
    <div id="createBonusVideoForm" ref={bonusVideoFormRef}>
      <Form>
        <Form.Field>
          <label>Video YouTube URL:</label>
          <input 
            id="bonusVideoYoutubeInput"
            onChange={handleYouTubeURLChange} 
            placeholder="YouTube URL here ..." 
            value={formState.youTubeURL}
          />
        </Form.Field>
        <Form.Field>
          <label>Video Vimeo URL:</label>
          <input 
            id="bonusVideoVimeoInput"
            onChange={handleVimeoURLChange} 
            placeholder="Vimeo URL here..." 
            value={formState.vimeoURL}
          />
        </Form.Field>
        <Form.Field
          id="bonusVideoDescInput"
          control={TextArea}
          label='Video Description'
          onChange={hadnleDescriptionChange}
          placeholder='Video description here...'
          value={formState.description}
         />
         {
           newForm 
            ? <Button id="bonusVideoFormCreate" type='submit' onClick={handleSubmit} content= "Save New Bonus Video" />
            : <Button id="bonusVideoFormUpdate" type='submit' onClick={handleSubmit} content= "Update Bonus Video" />
         }  
      </Form>
    </div>
  );
};

export default BonusVideoForm;