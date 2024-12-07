import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
} from "react-admin";

const PageList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="title" />
        <EditButton label="Edit" basePath="/pages" />
        <DeleteButton label="Delete" basePath="/pages" />
      </Datagrid>
    </List>
  );
};

export default PageList;
