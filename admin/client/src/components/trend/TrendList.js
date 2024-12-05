import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  DateField,
  ReferenceField,
  ReferenceOneField,
} from "react-admin";

const TrendList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source="name" />
        {/* <ArrayField source="keywords" /> */}
        <DateField source="date" />
        <ReferenceOneField source="region" target="id" reference="regions" />
        <ReferenceOneField
          source="category"
          target="id"
          reference="categories"
        />
        {/* <NumberField source="search_volume" /> */}
        <ReferenceField source="page" reference="pages" />
        <EditButton label="Edit" basePath="/trends" />
        <DeleteButton label="Delete" basePath="/trends" />
      </Datagrid>
    </List>
  );
};

export default TrendList;
