import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  NumberInput,
  DateInput,
  useCreate,
} from "react-admin";

const TrendCreate = (props) => {
  const [create] = useCreate();

  const formatData = (data) => {
    data.keywords = data.keywords.split("\n");
    create("trends", { data });
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={formatData}>
        <TextInput source="name" required />
        <ReferenceInput source="category" reference="categories">
          <SelectInput required />
        </ReferenceInput>
        <ReferenceInput source="region" reference="regions">
          <SelectInput required />
        </ReferenceInput>
        <DateInput source="date" defaultValue={new Date()} />
        <NumberInput
          source="search_volume"
          step={100}
          min={100}
          defaultValue={100}
        />
        <TextInput source="keywords" multiline required />
      </SimpleForm>
    </Create>
  );
};

export default TrendCreate;
