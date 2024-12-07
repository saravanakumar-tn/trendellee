import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  UrlField,
} from "react-admin";

const PageEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <UrlField source="image" label="Image" content="Set Image" />
        <TextInput source="title" required />
        <TextInput source="short_description" required />
        <TextInput source="reading_time" required />
        <TextInput source="notes" multiline disabled />
        <TextInput source="html" required multiline />
        <ReferenceInput source="trend" reference="trends" required>
          <SelectInput disabled required />
        </ReferenceInput>
        <SelectInput
          source="status"
          choices={["raised", "under-review", "published"]}
        />
      </SimpleForm>
    </Edit>
  );
};

export default PageEdit;
