import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  NumberInput,
  DateInput,
} from "react-admin";

const TrendEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name" disabled required />
        <TextInput source="keywords" multiline required />
        <ReferenceInput source="category" reference="categories" required>
          <SelectInput required />
        </ReferenceInput>
        <ReferenceInput source="region" reference="regions" required>
          <SelectInput required />
        </ReferenceInput>
        <DateInput source="date" disabled />
        <ReferenceInput source="page" reference="pages" required>
          <SelectInput disabled required />
        </ReferenceInput>
        <NumberInput source="search_volume" step={100} min={100} />
      </SimpleForm>
    </Edit>
  );
};

export default TrendEdit;
