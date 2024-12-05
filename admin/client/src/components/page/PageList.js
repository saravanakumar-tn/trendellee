import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  ReferenceField,
} from "react-admin";

const PageList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="title" />
        <ReferenceField source="trend" target="id" reference="trends" />
        <EditButton label="Edit" basePath="/pages" />
        <DeleteButton label="Delete" basePath="/pages" />
      </Datagrid>
    </List>
  );
};

export default PageList;
