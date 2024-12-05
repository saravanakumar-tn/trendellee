import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

const CategoryEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput required source="name" />
        <TextInput required source="slug" />
      </SimpleForm>
    </Edit>
  );
};

export default CategoryEdit;
