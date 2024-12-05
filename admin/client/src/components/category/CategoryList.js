import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
} from "react-admin";

const CategoryList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="name" />
        <TextField source="slug" />
        <EditButton label="Edit" basePath="/categories" />
        <DeleteButton label="Delete" basePath="/categories" />
      </Datagrid>
    </List>
  );
};

export default CategoryList;
