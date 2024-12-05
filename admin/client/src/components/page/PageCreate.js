import React from "react";
import {
  Create,
  SimpleForm,
  SelectInput,
  ReferenceInput,
  useCreate,
} from "react-admin";
import dataProvider from "../../dataProvider.js";
import axios from "axios";

const PageCreate = (props) => {
  const [create] = useCreate();

  const fetchContent = async (data) => {
    const trendId = data.trend;
    let trend = await dataProvider.getOne("trends", { id: trendId });
    trend = trend.data;
    let page = await axios.post("/api/content", trend);
    create("pages", page);
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={fetchContent}>
        <ReferenceInput
          source="trend"
          reference="trends"
          filter={{ page: "if-exists" }}
        >
          <SelectInput required />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

export default PageCreate;
