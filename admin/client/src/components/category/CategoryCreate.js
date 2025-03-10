import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

const CategoryCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" required />
        <TextInput source="slug" required />
      </SimpleForm>
    </Create>
  );
};

export default CategoryCreate;
