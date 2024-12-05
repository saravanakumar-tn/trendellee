import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
} from "react-admin";

const RegionList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="code" />
        <TextField source="name" />
        <EditButton label="Edit" basePath="/regions" />
        <DeleteButton label="Delete" basePath="/regions" />
      </Datagrid>
    </List>
  );
};

export default RegionList;
