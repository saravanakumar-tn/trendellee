import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

const RegionCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="code" required />
        <TextInput source="name" required />
      </SimpleForm>
    </Create>
  );
};

export default RegionCreate;
