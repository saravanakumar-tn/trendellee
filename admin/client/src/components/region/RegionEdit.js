import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

const RegionEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput required source="code" />
        <TextInput required source="name" />
      </SimpleForm>
    </Edit>
  );
};

export default RegionEdit;
